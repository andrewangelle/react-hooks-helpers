import { useControlledReducer } from '../useControlledReducer';
import { DefaultAction } from '../utils';
import {
  SelectState,
  SelectProps,
  selectActionTypes,
  commonReducer,
  selectReducer,
} from './reducers';

type UseSelect = SelectState & {
  toggle: () => void;
  setSelectedOption: (option: { value: string; label: string }) => void;
};

export function useSelect(
  {
    stateReducer = commonReducer,
    ...props
  }: SelectProps | undefined = {} as SelectProps
): UseSelect {
  const controlledReducerProps = {
    stateReducer,
    ...props,
  };

  const initialState: SelectState = {
    isOpen: props.initialOpen ?? false,
    selectedOption: props.selectedOption ?? undefined,
  };

  const [state, dispatch] = useControlledReducer<
    SelectState,
    SelectProps,
    DefaultAction<SelectState, SelectProps>
  >(selectReducer, initialState, controlledReducerProps);

  function toggle(): void {
    dispatch({
      type: selectActionTypes.toggle,
      props: controlledReducerProps,
    });
  }

  function setSelectedOption(option: { value: string; label: string }): void {
    dispatch({
      type: selectActionTypes.setSelectedOption,
      selectedOption: option,
      props: controlledReducerProps,
    });
  }

  return {
    ...state,
    toggle,
    setSelectedOption,
  };
}
