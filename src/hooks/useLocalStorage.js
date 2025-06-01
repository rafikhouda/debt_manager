import { useState, useEffect } from 'react';

    export function useLocalStorage(key, initialValue) {
      const getStoredValue = () => {
        if (typeof window === 'undefined') {
          return initialValue;
        }
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.error(`Error reading localStorage key "${key}":`, error);
          return initialValue;
        }
      };

      const [storedValue, setStoredValue] = useState(getStoredValue);

      const setValue = (value) => {
        if (typeof window === 'undefined') {
          console.warn(`Tried to set localStorage key “${key}” even though environment is not a browser.`);
          return;
        }
        try {
          const valueToStore = value instanceof Function ? value(storedValue) : value;
          setStoredValue(valueToStore);
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      };
      
      useEffect(() => {
        setStoredValue(getStoredValue());
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [key]);

      return [storedValue, setValue];
    }