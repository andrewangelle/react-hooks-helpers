import {
  ReducerType,
  getState,
  useEnhancedReducer,
  DefaultProps,
  DefaultAction,
} from './utils';

/**
 * Wraps the useEnhancedReducer and applies the controlled prop values before
 * returning the new state.
 */
export function useControlledReducer<
  State extends Record<string, unknown>,
  Props extends DefaultProps<State>,
  ActionType extends DefaultAction<State, Props>
>(
  reducer: ReducerType<State, Props, ActionType>,
  initialState: State = {} as State,
  props: Partial<Props>
): [State, (action: ActionType) => void] {
  const [state, dispatch] = useEnhancedReducer<
    State,
    Partial<Props>,
    ActionType
  >(reducer, initialState, props);

  const currentState = getState<State, Partial<Props>>(state, props);

  return [currentState, dispatch];
}
