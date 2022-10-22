import '@testing-library/jest-dom';
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';

import { useCountdownTimer } from './useCountdownTimer';
import { act } from 'react-dom/test-utils';

function Test(): JSX.Element {
  const [skip, setSkip] = useState(false);
  const [isVisible, setVisible] = useState(false);

  const callback = (): void => {
    setVisible(true);
  };

  const { reset } = useCountdownTimer({
    callback,
    interval: 5000,
    skip,
  });

  return (
    <div>
      <div>{`Timer ${skip ? 'stopped' : 'running'}`}</div>
      <button onClick={() => setSkip(prev => !prev)}>{`${
        skip ? 'Start' : 'Stop'
      } Timer`}</button>
      <button onClick={reset}>Reset timer</button>

      {isVisible && (
        <div>
          Timer expired
          <button onClick={() => setVisible(false)}>OK</button>
        </div>
      )}
    </div>
  );
}

describe('useCountdownTimer', async () => {
  it('fires callback at end of timer', () => {
    vi.useFakeTimers({
      toFake: ['setInterval', 'clearInterval'],
    });

    function tick(): void {
      vi.advanceTimersByTime(6000);
    }

    function tickHalfway(): void {
      vi.advanceTimersByTime(3000);
    }

    render(<Test />);

    expect(screen.queryByText('Timer expired')).not.toBeInTheDocument();

    act(tick);
    screen.getByText('Timer expired');

    fireEvent.click(screen.getByText('OK'));

    expect(screen.queryByText('Timer expired')).not.toBeInTheDocument();

    act(tick);

    screen.getByText('Timer expired');
    fireEvent.click(screen.getByText('OK'));
    expect(screen.queryByText('Timer expired')).not.toBeInTheDocument();

    act(tickHalfway);

    fireEvent.click(screen.getByText('Reset timer'));

    act(tickHalfway);

    expect(screen.queryByText('Timer expired')).not.toBeInTheDocument();

    act(tickHalfway);

    screen.getByText('Timer expired');
  });
});
