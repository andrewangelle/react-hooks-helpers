import { ReducerType, getState, useEnhancedReducer } from './utils';

/**
 * Wraps the useEnhancedReducer and applies the controlled prop values before
 * returning the new state.
 */
export function useControlledReducer<
  State extends Record<string, unknown>,
  ActionType = Record<string, unknown>,
  Props = Record<string, unknown>
>(
  reducer: ReducerType<State, ActionType>,
  initialState: State = {} as State,
  props: Partial<Props> & { stateReducer?: ReducerType<State, ActionType> }
): [State, (action: ActionType) => void] {
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore
  const [state, dispatch] = useEnhancedReducer<State, ActionType, Props>(
    reducer,
    initialState,
    props
  );

  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore
  return [getState<State, Props>(state, props), dispatch];
}
