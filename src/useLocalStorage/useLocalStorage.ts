import { useState } from 'react';

export function useLocalStorage<DataType = unknown>(
  key: string,
  initialValue: string = ''
): [
  DataType | typeof initialValue,
  (value: DataType | typeof initialValue | Function) => void
] {
  const [storedValue, setStoredValue] = useState<
    DataType | typeof initialValue
  >(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from LocalStorage`, error);
      return initialValue;
    }
  });

  function setValue(value: DataType | typeof initialValue | Function): void {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        globalThis.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting ${key} to LocalStorage`, error);
    }
  }

  return [storedValue, setValue];
}
