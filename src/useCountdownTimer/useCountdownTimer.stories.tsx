import { useState } from 'react';

import { useCountdownTimer } from './useCountdownTimer';

function Story(): JSX.Element {
  const [skip, setSkip] = useState(false);
  const [isVisible, setVisible] = useState(false);

  const onExpire = (): void => {
    setVisible(true);
    setSkip(true);
  };

  const { reset } = useCountdownTimer({
    interval: 5000,
    skip,
    onExpire,
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div>{`Timer ${skip ? 'stopped' : 'running'}`}</div>
      <button onClick={() => setSkip(prev => !prev)}>{`${
        skip ? 'Start' : 'Stop'
      } Timer`}</button>
      <button onClick={reset}>Reset timer</button>

      {isVisible && (
        <div>
          Timer expired
          <button
            onClick={() => {
              setVisible(false);
              setSkip(false);
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}

const Meta = {
  title: 'useCountdownTimer',
  component: Story,
};

export const Basic = {
  ...Meta,
};

export default Meta;
