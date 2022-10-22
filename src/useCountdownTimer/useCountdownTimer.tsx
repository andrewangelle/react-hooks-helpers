import { useState, useRef, useEffect } from 'react';

export type CountdownTimerOptions = {
  callback: () => void,
  interval?: number,
  skip?: boolean   
}

type UseCountdownTimer = {
  reset: () => void;
}

export function useCountdownTimer({
  callback,
  interval = 2000,
  skip = false
}: CountdownTimerOptions): UseCountdownTimer {
  const [count, setCount] = useState(interval / 1000);

  const callbackRef = useRef(callback);

  function reset(): void{
    setCount(interval / 1000) 
  }

  useEffect(() => {
    callbackRef.current = callback;
  })

  useEffect(() => {
    let id: NodeJS.Timeout;

    if(!skip){
      id = setInterval(() => {
        setCount(prev => prev - 1)
      }, 1000)


      if(count <= 0){
        callbackRef.current();
        setCount(interval / 1000)
      }
    }

    if(skip){
      // @ts-expect-error
      clearInterval(id)
    }

    return () => {
      clearInterval(id)
    }

  }, [skip, count, interval, setCount, callbackRef])

  return {
    reset
  }
}