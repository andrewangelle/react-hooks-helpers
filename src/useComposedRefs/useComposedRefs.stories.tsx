import { useRef, forwardRef, PropsWithChildren } from 'react';

import { useComposedRefs } from './useComposedRef';
import { useOutsideClick } from '../useOutsideClick/useOutsideClick';

import './story.css';

const Meta = {
  title: 'useComposedRefs',
  component: () => null,
};

const Button = forwardRef<HTMLDivElement, PropsWithChildren<{}>>(
  (props, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement | null>(null);

    const ref = useComposedRefs(internalRef, forwardedRef);

    function focusOnClick(): void {
      if (internalRef !== null) {
        internalRef.current?.focus();
      }
    }

    return (
      <div
        ref={ref}
        className="fancy-button"
        tabIndex={0}
        onClick={focusOnClick}
      >
        {props.children}
      </div>
    );
  }
);

Button.displayName = 'Button';

export function Basic(): JSX.Element {
  function onOutsideClick(): void {
    alert('Clicked outside of the button');
  }

  const ref = useOutsideClick(onOutsideClick);

  return (
    <Button ref={ref}>
      Click me to focus, click outside for alert
    </Button>
  );
}

export default Meta;
