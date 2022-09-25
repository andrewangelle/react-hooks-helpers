import '@testing-library/jest-dom'
import { useState, useRef, forwardRef, PropsWithChildren } from 'react';
import { describe, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { useComposedRefs } from './useComposedRef';
import { useOutsideClick } from '../useOutsideClick/useOutsideClick'

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
        data-testid='button'
        ref={ref}
        tabIndex={0}
        onClick={focusOnClick}
      >
        {props.children}
      </div>
    );
  }
);
Button.displayName = 'Button';

function Example(): JSX.Element {
  const [isVisible, setVisible] = useState(false)
  const ref = useOutsideClick(() => setVisible(true));

  return (
    <div data-testid='container'>
      <Button ref={ref}>
        Click me to focus, click outside for alert
      </Button>
      {isVisible && <div>Visible when clicked outside</div>}
    </div>
  );
}

describe('useComposedRefs', () => {
  it('handles both uses of ref', () => {
    render(<Example />)

    fireEvent.click(screen.getByTestId('button'))
    expect(screen.getByTestId('button')).toHaveFocus()

    fireEvent.click(screen.getByTestId('container'))
    screen.getByText('Visible when clicked outside')
  })
})