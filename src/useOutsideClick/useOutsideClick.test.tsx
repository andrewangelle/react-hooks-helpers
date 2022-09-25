import '@testing-library/jest-dom';
import { useState } from 'react';
import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';

import { useOutsideClick } from './useOutsideClick';

function Test(): JSX.Element {
  const [isVisible, setVisible] = useState(false);
  const ref = useOutsideClick(() => setVisible(true));

  return (
    <div data-testid="container">
      <button ref={ref}>
        {isVisible && <div>Visible if clicked outside</div>}
      </button>
    </div>
  );
}

describe('useOutsideClick', () => {
  it('renders text when clicked outside', () => {
    render(<Test />);

    // click on the button, conditional text shouldn't be visible
    fireEvent.click(screen.getByRole('button'));
    expect(
      screen.queryByText('Visible if clicked outside')
    ).not.toBeInTheDocument();

    // click outside the button, conditional should be visible
    fireEvent.click(screen.getByTestId('container'));
    screen.getByText('Visible if clicked outside');
  });
});
