import { useControlledReducer } from '../useControlledReducer';
import {
  SelectState,
  SelectProps,
  selectActionTypes,
  selectReducer,
  Option,
} from './reducers';

type UseSelect = SelectState & {
  toggle: () => void;
  setSelectedOption: (option: Option) => void;
};

export function useSelect(
  {
    stateReducer = selectReducer,
    ...props
  }: SelectProps | undefined = {} as SelectProps
): UseSelect {
  const controlledReducerProps: SelectProps = {
    stateReducer,
    ...props,
  };

  const initialState: SelectState = {
    isOpen: props.initialOpen ?? false,
    selectedOption: props.selectedOption ?? undefined,
  };

  const [state, dispatch] = useControlledReducer(
    selectReducer,
    initialState,
    controlledReducerProps
  );

  function toggle(): void {
    dispatch({
      type: selectActionTypes.toggle,
      props: controlledReducerProps,
    });
  }

  function setSelectedOption(option: Option): void {
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
