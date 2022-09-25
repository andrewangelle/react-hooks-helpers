import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useWindowWidth } from './useWindowWidth';

function fireResize(width: number): void {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
}

describe('useWindowWidth', () => {
  it('returns current window width', () => {
    const { result, rerender } = renderHook(() => useWindowWidth());

    fireResize(1406);
    rerender();
    expect(result.current).toBe(1406);

    fireResize(1204);
    rerender();
    expect(result.current).toBe(1204);

    fireResize(1052);
    rerender();
    expect(result.current).toBe(1052);

    fireResize(758);
    rerender();
    expect(result.current).toBe(758);

    fireResize(636);
    rerender();
    expect(result.current).toBe(636);
  });
});
