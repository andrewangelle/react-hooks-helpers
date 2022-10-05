import { SelectState, selectActionTypes } from './reducers';
import { useSelect } from './useSelect';
import './story.css';

const Meta = {
  title: 'useControlledReducer',
  component: () => null,
};

const selectOptions = [
  { value: '1', label: 'option 1' },
  { value: '2', label: 'option 2' },
  { value: '3', label: 'option 3' },
];

export function Basic() {
  const { isOpen, selectedOption, toggle, setSelectedOption } = useSelect({
    options: selectOptions,
  });

  return (
    <div className="dropdown-container">
      <div className="dropdown-button" onClick={toggle}>
        {selectedOption?.label || 'placeholder'}
        <i className={`arrow ${isOpen ? 'up' : 'down'}`} />
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          {selectOptions.map(option => {
            const selectedClass =
              selectedOption?.value === option.value ? 'selected' : '';
            return (
              <div
                key={option.value}
                className={`dropdown-menu-item ${selectedClass}`}
                onClick={() => setSelectedOption(option)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function WithPropOverrides() {
  const { isOpen, selectedOption, toggle, setSelectedOption } = useSelect({
    options: selectOptions,
    onIsOpenChange: nextStateAndActionType =>
      console.log('onIsOpenChange', nextStateAndActionType),
    onSelectedOptionChange: nextStateAndActionType =>
      console.log('onSelectedOptionChange', nextStateAndActionType),
    onStateChange: state => console.log('onStateChange', state),
    stateReducer(state, action) {
      let changes: Partial<SelectState> = { ...(action.changes || {}) };

      switch (action.type) {
        case selectActionTypes.setSelectedOption:
          changes = {
            ...changes,
            isOpen: false,
          };
          break;
      }

      return {
        ...state,
        ...changes,
      };
    },
  });

  return (
    <div className="dropdown-container">
      <div className="dropdown-button" onClick={toggle}>
        {selectedOption?.label || 'placeholder'}
        <i className={`arrow ${isOpen ? 'up' : 'down'}`} />
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          {selectOptions.map(option => {
            const selectedClass =
              selectedOption?.value === option.value ? 'selected' : '';
            return (
              <div
                key={option.value}
                className={`dropdown-menu-item ${selectedClass}`}
                onClick={() => setSelectedOption(option)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Meta;
