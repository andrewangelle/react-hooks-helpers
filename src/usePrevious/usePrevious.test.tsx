/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState } from 'react';
import { describe, it } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';

import { usePrevious } from './usePrevious';

export function Test(): JSX.Element {
  const [count, setCount] = useState(0);
  const previousState = usePrevious(count);

  function increaseCount(): void {
    setCount(prevState => prevState + 1);
  }

  function decreaseCount(): void {
    setCount(prevState => {
      const nextState = prevState - 1;
      return nextState < 0 ? 0 : nextState;
    });
  }

  return (
    <div>
      <button data-testid="increase" onClick={increaseCount}>
        Increase
      </button>
      <button data-testid="decrease" onClick={decreaseCount}>
        Decrease
      </button>

      <div style={{ margin: '10px' }}>
        <div>{`Counter: ${count}`}</div>
        <div>{`Previous count: ${previousState}`}</div>
      </div>
    </div>
  );
}

describe('usePrevious', () => {
  it('renders current and previous state', () => {
    render(<Test />);

    screen.getByText('Counter: 0');
    screen.getByText('Previous count: undefined');

    const buttons = screen.getAllByRole('button');
    const [increase, decrease] = buttons;

    fireEvent.click(increase!);
    screen.getByText('Counter: 1');
    screen.getByText('Previous count: 0');

    fireEvent.click(increase!);
    screen.getByText('Counter: 2');
    screen.getByText('Previous count: 1');

    fireEvent.click(increase!);
    screen.getByText('Counter: 3');
    screen.getByText('Previous count: 2');

    fireEvent.click(decrease!);
    screen.getByText('Counter: 2');
    screen.getByText('Previous count: 3');

    fireEvent.click(decrease!);
    screen.getByText('Counter: 1');
    screen.getByText('Previous count: 2');

    fireEvent.click(decrease!);
    screen.getByText('Counter: 0');
    screen.getByText('Previous count: 1');
  });
});
