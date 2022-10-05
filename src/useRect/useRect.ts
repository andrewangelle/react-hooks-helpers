import { useLayoutEffect, useState, useRef, RefObject } from 'react';

import { observeRect, PartialRect } from './observeRect';

export type UseRectOptions = {
  observe?: boolean;
  onChange?: (rect: PartialRect) => void;
};

export function useRect<ElementType extends Element = HTMLElement>(
  nodeRef: RefObject<ElementType | undefined | null>,
  options?: UseRectOptions
): null | DOMRect {
  let observe: boolean;
  let onChange: UseRectOptions['onChange'];

  if (options?.observe) {
    observe = options.observe;
  } else {
    observe = true;
    onChange = options?.onChange;
  }

  const [element, setElement] = useState(nodeRef.current);
  const initialRectIsSet = useRef<boolean>(false);
  const initialRefIsSet = useRef<boolean>(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const onChangeRef = useRef<UseRectOptions['onChange']>(onChange);

  useLayoutEffect(() => {
    onChangeRef.current = onChange;

    if (nodeRef.current !== element) {
      setElement(nodeRef.current);
    }
  });

  useLayoutEffect(() => {
    if (
      element !== null &&
      element !== undefined &&
      !initialRectIsSet.current
    ) {
      initialRectIsSet.current = true;
      setRect(element.getBoundingClientRect());
    }
  }, [element]);

  useLayoutEffect(() => {
    if (!observe) {
      return;
    }

    let elem = element;

    if (!initialRefIsSet.current) {
      initialRefIsSet.current = true;
      elem = nodeRef.current;
    }

    if (elem === null || elem === undefined) {
      return;
    }

    const observer = observeRect(elem, rect => {
      onChangeRef.current?.(rect);
      setRect(rect);
    });

    observer.observe();

    return () => {
      observer.unobserve();
    };
  }, [observe, element, nodeRef]);

  return rect;
}
