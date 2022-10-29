import { useState } from 'react';
import {Story } from '@storybook/react';

import { CountdownTimerOptions, useCountdownTimer } from './useCountdownTimer';

const CountdownStory : Story<CountdownTimerOptions> = args => {
  const [skip, setSkip] = useState(args.skip);
  const [isVisible, setVisible] = useState(false);
  const options: CountdownTimerOptions = {
    ...args,
    onExpire: () => {
      setVisible(true);
      setSkip(true);
    }
  }
  const { reset } = useCountdownTimer(options);

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
  component: CountdownStory,
  args: {
    interval: 5000,
    skip: false,
    resetOnExpire: false,
  }
};

export const Basic = {
  ...Meta,
};

export default Meta;
