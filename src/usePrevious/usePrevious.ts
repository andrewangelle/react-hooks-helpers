import { useRef, useEffect } from 'react';

export function usePrevious<DataType extends unknown>(
  value: DataType
): DataType {
  const ref = useRef<DataType>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current as DataType;
}
