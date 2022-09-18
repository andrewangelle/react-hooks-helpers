import { useState } from 'react';

import { usePrevious } from './usePrevious';

const Meta = {
  title: 'usePrevious',
  components: () => null,
};

export function Basic(): JSX.Element {
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
      <button onClick={increaseCount}>Increase</button>
      <button onClick={decreaseCount}>Decrease</button>

      <div style={{ margin: '10px' }}>
        {`Counter: ${count}`}
        <div>{`Previous count: ${previousState}`}</div>
      </div>
    </div>
  );
}

export default Meta;
