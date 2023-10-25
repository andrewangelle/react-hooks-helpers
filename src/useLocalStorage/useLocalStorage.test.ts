import { expect, describe, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useLocalStorage } from './useLocalStorage';

const testKey = 'lsTest';
const testInitialValue = 'test initial value';
const testUpdatedValue = 'test updated value';

describe('useLocalStorage', () => {
  it('sets initial value from args', () => {
    const { result } = renderHook(() =>
      useLocalStorage(testKey, testInitialValue)
    );
    const [value] = result.current;
    expect(value).toBe(testInitialValue);
  });

  it('updates value', () => {
    const { result } = renderHook(() => useLocalStorage(testKey));

    act(() => {
      result.current[1](testUpdatedValue);
    });

    expect(result.current[0]).toBe(testUpdatedValue);
  });
});
