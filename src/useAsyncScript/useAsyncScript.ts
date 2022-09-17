import { useState, useEffect } from 'react';

type UseAsyncScript = {
  loading: boolean;
  error: boolean;
  done: boolean;
};

export function useAsyncScript(url: string): UseAsyncScript {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    function onScriptLoad(): void {
      setLoading(false);
      setDone(true);
      setError(false);
    }

    function onScriptError(): void {
      setLoading(false);
      setDone(true);
      setError(true);
    }

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
    };
  }, [url]);

  return { loading, error, done };
}
