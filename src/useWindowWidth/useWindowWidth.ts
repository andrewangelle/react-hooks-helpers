import { useMemo } from 'react';
import debounce from 'lodash.debounce';

import { useSubscription } from '../useSubscription';

export function useWindowWidth(): number {
  const source = window;
  const subscription = useMemo(
    () => ({
      getCurrentValue: () => source.innerWidth,
      subscribe: (callback: any) => {
        source.addEventListener('resize', debounce(callback, 300));
        return () => source.removeEventListener('resize', callback);
      },
    }),
    [source.innerWidth]
  );
  return useSubscription(subscription);
}
