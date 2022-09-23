import { DefaultAction, DefaultProps, ReducerType } from '../utils';

export type SelectState = {
  isOpen: boolean;
  selectedOption?: { value: string; label: string };
};

export type SelectProps = DefaultProps<SelectState> & {
  initialOpen?: boolean;
  selectedOption?: { value: string; label: string };
  options: Array<{ value: string; label: string }>;
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
  let changes: Partial<SelectState> = {};

  switch (action.type) {
    case selectActionTypes.toggle:
      changes = {
        isOpen: !state.isOpen,
      };

      break;

    case selectActionTypes.setSelectedOption:
      changes = {
        selectedOption: action.selectedOption,
      };

      break;
  }

  return {
    ...state,
    ...changes,
  };
};

export const commonReducer: ReducerType<
  SelectState,
  SelectProps,
  DefaultAction<SelectState, SelectProps>
> = (state, action) => {
  switch (action.type) {
    case selectActionTypes.toggle:
    case selectActionTypes.setSelectedOption:
    default:
      return selectReducer(state, action);
  }
};
