import { RefObject, useCallback, useEffect, useReducer, useRef } from 'react';

function capitalize(str: string = ''): string {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

type OnChangeHandlerKey<State = Record<string, unknown>> = `on${Capitalize<
  string & keyof State
>}Change`;

type OnChangeHandlerProps<State = Record<string, unknown>> = Record<
  OnChangeHandlerKey<State>,
  (arg: Partial<State> & { type: string }) => void
>;

export type ControlledReducerProps<State = Record<string, unknown>> = Partial<
  OnChangeHandlerProps<State>
> & {
  onStateChange?: (nextState: State) => void;
  stateReducer?: ReducerType<State>;
} & Partial<State>;

export type ControlledReducerAction<
  State = Record<string, unknown>,
  Props = ControlledReducerProps<State>
> = {
  [key: string]: any;
  type: string;
  props: Props;
  changes?: Partial<State>;
};

export type ReducerType<State = Record<string, unknown>> = (
  state: State,
  action: ControlledReducerAction<State, ControlledReducerProps<State>>
) => State;

export function useEnhancedReducer<
  State extends Record<string, any>,
  Props extends ControlledReducerProps<State>
>(
  reducer: ReducerType<State>,
  initialState: State = {} as State,
  props: Props
): [
  State,
  (
    action: ControlledReducerAction<State, ControlledReducerProps<State>>
  ) => void
] {
  const prevStateRef = useRef<State | undefined>();
  const actionRef = useRef<
    ControlledReducerAction<State, ControlledReducerProps<State>> | undefined
  >();

  const enhancedReducer = useCallback(
    (
      state: State,
      action: ControlledReducerAction<State, ControlledReducerProps<State>>
    ) => {
      // make sure references aren't stale
      actionRef.current = action;
      state = getState<
        State,
        ControlledReducerAction<State, ControlledReducerProps<State>>['props']
      >(state, action.props);

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
    (action: ControlledReducerAction<State, ControlledReducerProps<State>>) =>
      dispatch({ ...action, props: propsRef.current ?? {} }),
    [propsRef]
  );

  const action = actionRef.current;

  useEffect(() => {
    if (action && prevStateRef.current && prevStateRef.current !== state) {
      callOnChangeProps<State>(
        action,
        getState<
          State,
          ControlledReducerAction<State, ControlledReducerProps<State>>['props']
        >(prevStateRef.current, action.props),
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
  Props extends ControlledReducerProps<State>
>(state: State, props: Props): State {
  return Object.keys(state).reduce((prevState, key) => {
    return {
      ...prevState,
      [key]: isControlledProp<Props>(props, key)
        ? props[key as keyof Props]
        : state[key],
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

function callOnChangeProps<State extends Record<string, unknown>>(
  action: ControlledReducerAction<State, ControlledReducerProps<State>>,
  state: State,
  newState: State
): void {
  const { props, type } = action;
  const changes = {} as unknown as State;

  Object.keys(state).forEach((key: keyof State) => {
    invokeOnChangeHandler<
      State,
      ControlledReducerAction<State, ControlledReducerProps<State>>
    >(key, action, state, newState);

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
  ActionType extends ControlledReducerAction
>(key: keyof State, action: ActionType, state: State, newState: State): void {
  const { props, type } = action;
  const handler = `on${capitalize(
    key as string
  )}Change` as OnChangeHandlerKey<State>;
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
