import { useEffect, useRef, useCallback, useState } from 'react';

export function useOutsideClick<ElementType = HTMLDivElement>(
  handler: (event: React.MouseEvent<ElementType>) => void,
  when: boolean = true
): (ref: HTMLElement | null) => void {
  const savedHandler = useRef(handler);

  const [node, setNode] = useState<Element | null>(null);

  const memoizedCallback = useCallback(
    (event: React.MouseEvent<ElementType> & MouseEvent) => {
      if (node !== null && !node.contains(event.target as Element)) {
        savedHandler.current(event);
      }
    },
    [node]
  );

  useEffect(() => {
    savedHandler.current = handler;
  });

  const ref = useCallback((node: HTMLElement | null) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (when) {
      document.addEventListener('click', memoizedCallback);
    }
    return () => {
      document.removeEventListener('click', memoizedCallback);
    };
  }, [when, memoizedCallback]);

  return ref;
}
