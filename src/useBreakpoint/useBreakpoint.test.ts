import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useBreakpoint } from './useBreakpoint';

function fireResize(width: number): void {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
}

describe('useBreakpoint', () => {
  it('returns current breakpoint', () => {
    const { result, rerender } = renderHook(() => useBreakpoint());

    fireResize(1400);
    rerender();
    expect(result.current).toBe('xxlarge');

    fireResize(1200);
    rerender();
    expect(result.current).toBe('xlarge');

    fireResize(1050);
    rerender();
    expect(result.current).toBe('large');

    fireResize(750);
    rerender();
    expect(result.current).toBe('medium');

    fireResize(600);
    rerender();
    expect(result.current).toBe('small');
  });

  it('supports custom config', () => {
    const config = {
      xsmall: { end: 300 },
      small: { start: 300, end: 500 },
      large: { start: 500 },
    };
    const { result, rerender } = renderHook(() => useBreakpoint(config));

    fireResize(1400);
    rerender();
    expect(result.current).toBe('large');

    fireResize(1200);
    rerender();
    expect(result.current).toBe('large');

    fireResize(1050);
    rerender();
    expect(result.current).toBe('large');

    fireResize(450);
    rerender();
    expect(result.current).toBe('small');

    fireResize(200);
    rerender();
    expect(result.current).toBe('xsmall');
  });
});
