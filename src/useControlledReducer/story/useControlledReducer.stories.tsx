import { SelectState, selectActionTypes } from './reducers';
import { useSelect } from './useSelect';

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
    <div>
      <div style={{ cursor: 'pointer' }} onClick={toggle}>
        {selectedOption?.label || 'placeholder'}
      </div>

      {isOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid black',
            cursor: 'pointer',
          }}
        >
          {selectOptions.map(option => (
            <div key={option.value} onClick={() => setSelectedOption(option)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function WithPropOverrides() {
  const overriddenDisplayedValue = {
    label: 'overriden displayed value',
    value: '0',
  };

  const { isOpen, selectedOption, toggle, setSelectedOption } = useSelect({
    options: selectOptions,
    selectedOption: overriddenDisplayedValue,
    stateReducer(state, action) {
      let changes: Partial<SelectState> = action.changes;

      switch (action.type) {
        case selectActionTypes.setSelectedOption:
          changes = {
            ...action.changes,
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
    <div>
      <div style={{ cursor: 'pointer' }} onClick={toggle}>
        {selectedOption?.label || 'placeholder'}
      </div>

      {isOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid black',
            cursor: 'pointer',
          }}
        >
          {selectOptions.map(option => (
            <div key={option.value} onClick={() => setSelectedOption(option)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Meta;
