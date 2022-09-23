import { DefaultAction, DefaultProps, ReducerType } from '../utils';

export type Option = { value: string; label: string };

export type SelectState = {
  isOpen: boolean;
  selectedOption?: Option;
};

export type SelectProps = DefaultProps<SelectState> & {
  initialOpen?: boolean;
  selectedOption?: Option;
  options: Option[];
};

export const selectActionTypes = {
  toggle: 'SELECT_TOGGLE',
  setSelectedOption: 'SELECT_SET_SELECTED_OPTION',
};

export const selectReducer: ReducerType<
  SelectState,
  SelectProps,
  DefaultAction<SelectState, SelectProps>
> = (state, action) => {
  switch (action.type) {
    case selectActionTypes.toggle:
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case selectActionTypes.setSelectedOption:
      return {
        ...state,
        selectedOption: action.selectedOption,
      };
    default:
      return state;
  }
};