import {
  ReducerType,
  getState,
  useEnhancedReducer,
  ControlledReducerProps,
  ControlledReducerAction,
} from './utils';

/**
 * Wraps the useEnhancedReducer and applies the controlled prop values before
 * returning the new state.
 */
export function useControlledReducer<
  State extends Record<string, unknown>,
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
  const [state, dispatch] = useEnhancedReducer<State, Props>(
    reducer,
    initialState,
    props
  );

  const currentState = getState<State, Props>(state, props);

  return [currentState, dispatch];
}
