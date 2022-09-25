import { expect, describe, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useSelect } from './story/useSelect';
import { Option, selectActionTypes } from './story/reducers';

const options: Option[] = [
  { value: '1', label: 'option 1' },
  { value: '2', label: 'option 2' },
  { value: '3', label: 'option 3' },
];

describe('useControlledReducer', () => {
  it('toggles', () => {
    const { result } = renderHook(() => useSelect({ options }));

    expect(result.current.isOpen).toBeFalsy();

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBeTruthy();
  });

  it('sets selected option, isOpen remains true', () => {
    const { result } = renderHook(() => useSelect({ options }));

    expect(result.current.selectedOption).toBeUndefined();

    act(() => {
      result.current.toggle();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.current.setSelectedOption(options[1]!);
    });

    expect(result.current.selectedOption).toBe(options[1]);
    expect(result.current.isOpen).toBeTruthy();
  });

  it('respects prop values', () => {
    const { result } = renderHook(() =>
      useSelect({
        options,
        isOpen: true,
        selectedOption: options[2],
      })
    );
    expect(result.current.isOpen).toBeTruthy();
    expect(result.current.selectedOption).toBe(options[2]);
  });

  it('respects stateReducer prop', () => {
    const { result } = renderHook(() =>
      useSelect({
        options,
        stateReducer(state, action) {
          switch (action.type) {
            case selectActionTypes.setSelectedOption:
              return {
                ...state,
                ...action.changes,
                isOpen: false,
              };
            default:
              return {
                ...state,
                ...action.changes,
              };
          }
        },
      })
    );

    expect(result.current.selectedOption).toBeUndefined();

    act(() => {
      result.current.toggle();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.current.setSelectedOption(options[1]!);
    });

    expect(result.current.selectedOption).toBe(options[1]);
    expect(result.current.isOpen).toBeFalsy();
  });
});
