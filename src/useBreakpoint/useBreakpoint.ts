import { useEffect, useMemo, useRef, useState } from 'react';

import { useSubscription } from '../useSubscription';
import { useWindowWidth } from '../useWindowWidth';

export type Breakpoint = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

function useRawBreakpoint(): Breakpoint {
  const width = useWindowWidth();
  const [mode, setMode] = useState<Breakpoint>('' as Breakpoint);

  useEffect(() => {
    let widthName = '' as Breakpoint;

    if (width <= 639) {
      widthName = 'small';
    }

    if (width > 639 && width <= 1023) {
      widthName = 'medium';
    }

    if (width > 1023 && width <= 1199) {
      widthName = 'large';
    }

    if (width > 1199 && width <= 1339) {
      widthName = 'xlarge';
    }

    if (width > 1339) {
      widthName = 'xxlarge';
    }

    setMode(widthName);
  }, [width, setMode]);

  return mode;
}

export function useBreakpoint(): Breakpoint {
  const breakpoint = useRawBreakpoint();
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
