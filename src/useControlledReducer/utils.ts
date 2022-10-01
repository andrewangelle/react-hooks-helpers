import { RefObject, useCallback, useEffect, useReducer, useRef } from 'react';

function capitalize(str: string = ''): string {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export type DefaultProps<State = Record<string, unknown>> = {
  [Key: string]: unknown;
  onStateChange?: (nextState: State) => void;
  stateReducer?: ReducerType<State>;
};

export type DefaultAction<
  State = Record<string, any>,
  Props = DefaultProps<State>
> = {
  [key: string]: any;
  type: string;
  props: Props;
  changes?: Partial<State>;
};

export type ReducerType<
  State = Record<string, any>,
  Props = DefaultProps,
  ActionType = DefaultAction<State, Props>
> = (state: State, action: ActionType) => State;

export function useEnhancedReducer<
  State extends Record<string, any>,
  Props extends DefaultProps<State>,
  ActionType extends DefaultAction<State, DefaultProps<State>>
>(
  reducer: ReducerType<State, Props, ActionType>,
  initialState: State = {} as State,
  props: Props
): [State, (action: ActionType) => void] {
  const prevStateRef = useRef<State | undefined>();
  const actionRef = useRef<ActionType | undefined>();

  const enhancedReducer = useCallback(
    (state: State, action: ActionType) => {
      // make sure references aren't stale
      actionRef.current = action;
      state = getState<State, ActionType['props']>(state, action.props);

      // call the default reducer with proposed set of changes
      const changes = reducer(state, action);

      // call the consumer's optionally passed in reducer last with the proposed set of changes
      // this gives the consumer the ability to override and control state changes when/how they want
      // or do nothing and get the default state changes
      const consumersReducer = action.props.stateReducer ?? reducer;
      const newState = consumersReducer(state, {
        ...action,
        changes,
      });

      return newState;
    },
    [reducer]
  );

  const [state, dispatch] = useReducer(enhancedReducer, initialState);
  const propsRef = useLatestRef<Props>(props);

  const dispatchWithProps = useCallback(
    (action: ActionType) => dispatch({ ...action, props: propsRef.current }),
    [propsRef]
  );

  const action = actionRef.current;

  useEffect(() => {
    if (action && prevStateRef.current && prevStateRef.current !== state) {
      callOnChangeProps<State, ActionType>(
        action,
        getState<State, ActionType['props']>(
          prevStateRef.current,
          action.props
        ),
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
  value: DataType
): RefObject<DataType> {
  const ref = useRef<DataType>(value);
  ref.current = value;
  return ref;
}

function callOnChangeProps<
  State extends Record<string, unknown>,
  ActionType extends DefaultAction
>(action: ActionType, state: State, newState: State): void {
  const { props, type } = action;
  const changes = {} as unknown as State;

  Object.keys(state).forEach((key: keyof State) => {
    invokeOnChangeHandler<State, ActionType>(key, action, state, newState);

    if (newState[key] !== state[key]) {
      changes[key] = newState[key];
    }

    if (props.onStateChange && Object.keys(changes).length > 0) {
      props.onStateChange({ type, ...changes });
    }
  });
}

function invokeOnChangeHandler<
  State extends Record<keyof State, unknown>,
  ActionType extends DefaultAction
>(key: keyof State, action: ActionType, state: State, newState: State): void {
  const { props, type } = action;
  const handler = `on${capitalize(key as string)}Change`;
  const onChangeHandler = props[handler] as (
    action: { type: string } & State
  ) => void;

  if (
    props[handler] &&
    newState[key] !== undefined &&
    newState[key] !== state[key]
  ) {
    onChangeHandler({ type, ...newState });
  }
}
