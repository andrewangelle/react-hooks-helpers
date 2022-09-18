import { RefObject, useCallback, useEffect, useReducer, useRef } from 'react';

function capitalize(str: string = ''): string {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

type DefaultProps<State = Record<string, unknown>> = {
  [Key: string]: unknown;
  onStateChange?: (nextState: State) => void;
  stateReducer: ReducerType;
};

type DefaultAction<
  State = Record<string, any>,
  Props = Record<string, any> & DefaultProps<State>
> = {
  type: string;
  props: Props;
};

export type ReducerType<
  State = Record<string, any>,
  Props = DefaultProps,
  ActionType = DefaultAction<State, Props>
> = (s: State, a: ActionType) => State;

export function useEnhancedReducer<
  State extends Record<string, any>,
  ActionType extends DefaultAction<State, DefaultProps>,
  Props = DefaultProps<State>
>(
  reducer: ReducerType<State, ActionType>,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  initialState: State = {} as State,
  props: Props
): [State, (action: ActionType) => void] {
  const prevStateRef = useRef<State | undefined>();
  const actionRef = useRef<ActionType | undefined>();

  const enhancedReducer = useCallback(
    (state: State, action: ActionType) => {
      actionRef.current = action;
      state = getState(state, action.props);

      // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore
      const changes = reducer(state, action);
      const newState = action.props.stateReducer(state, { ...action, changes });

      return newState;
    },
    [reducer]
  );

  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore
  const [state, dispatch] = useReducer(enhancedReducer, initialState);
  const propsRef = useLatestRef<Props>(props);

  const dispatchWithProps = useCallback(
    ({ props, ...action }: ActionType) =>
      // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore
      dispatch({ props: propsRef.current, ...action }),
    [propsRef]
  );
  const action = actionRef.current;

  useEffect(() => {
    if (action && prevStateRef.current && prevStateRef.current !== state) {
      callOnChangeProps<State, ActionType>(
        action,
        getState(prevStateRef.current, action.props),
        state
      );
    }

    prevStateRef.current = state;
  }, [state, props, action]);

  return [state, dispatchWithProps];
}

function isControlledProp<Props extends Record<string, unknown>>(
  props: Props,
  key: string
): boolean {
  return props[key] !== undefined;
}

export function getState<
  State extends Record<string, unknown>,
  Props extends DefaultProps<State>
>(state: State, props: Props): State {
  return Object.keys(state).reduce((prevState, key) => {
    return {
      ...prevState,
      [key]: isControlledProp<Props>(props, key) ? props[key] : state[key],
    };
  }, {}) as State;
}

function useLatestRef<DataType extends unknown>(
  val: DataType
): RefObject<DataType> {
  const ref = useRef<DataType>(val);
  ref.current = val;
  return ref;
}

function callOnChangeProps<
  State extends Record<string, unknown>,
  ActionType extends DefaultAction
>(action: ActionType, state: State, newState: State): void {
  const { props, type } = action;
  const changes = {} as unknown as State;

  Object.keys(state).forEach(key => {
    invokeOnChangeHandler(key, action, state, newState);

    if (newState[key] !== state[key]) {
      // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore
      changes[key] = newState[key];
    }

    if (props.onStateChange && Object.keys(changes).length > 0) {
      props.onStateChange({ type, ...changes });
    }
  });
}

function invokeOnChangeHandler<
  State extends Record<string, unknown>,
  ActionType extends DefaultAction
>(key: string, action: ActionType, state: State, newState: State): void {
  const { props, type } = action;
  const handler = `on${capitalize(key)}Change`;

  if (
    props[handler] &&
    newState[key] !== undefined &&
    newState[key] !== state[key]
  ) {
    props[handler]({ type, ...newState });
  }
}
