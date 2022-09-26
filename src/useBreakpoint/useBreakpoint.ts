/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useMemo, useRef, useState } from 'react';

import { useSubscription } from '../useSubscription/useSubscription';
import { useWindowWidth } from '../useWindowWidth/useWindowWidth';

export type Breakpoint =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge';

export type UseBreakpointConfig = {
  [Property in Breakpoint]?: {
    start?: number;
    end?: number;
  };
};

const defaultConfig: UseBreakpointConfig = {
  small: {
    end: 639,
  },
  medium: {
    start: 639,
    end: 1023,
  },
  large: {
    start: 1023,
    end: 1199,
  },
  xlarge: {
    start: 1199,
    end: 1339,
  },
  xxlarge: {
    start: 1339,
  },
};

function useRawBreakpoint(config: UseBreakpointConfig): Breakpoint {
  const width = useWindowWidth();
  const [mode, setMode] = useState<Breakpoint>('' as Breakpoint);

  useEffect(() => {
    let widthName = '' as Breakpoint;

    Object.entries(config).forEach(
      ([name, { start, end }], index, dataSource) => {
        const isSmallest = index === 0 || !start;
        const isLargest = index === dataSource.length - 1 || !end;

        // prettier-ignore
        const match = isSmallest ? (width <= end!) 
          // prettier-ignore
          : isLargest ? (width > start) 
          // prettier-ignore
          : (width > start && width <= end)

        if (match) {
          widthName = name as Breakpoint;
        }
      }
    );

    setMode(widthName);
  }, [width, setMode, config]);

  return mode;
}

export function useBreakpoint(
  config: UseBreakpointConfig = defaultConfig
): Breakpoint {
  const breakpoint = useRawBreakpoint(config);
  const ref = useRef<Breakpoint>(breakpoint);

  const subscription = useMemo(
    () => ({
      getCurrentValue: () => ref.current,
      subscribe: (_callback: any) => {
        ref.current = breakpoint;
        return () => '';
      },
    }),
    [breakpoint]
  );

  return useSubscription(subscription);
}
