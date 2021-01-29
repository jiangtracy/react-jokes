import { useState, useEffect } from 'react';
/* custom hook to set, store and update values in localStorage
  TODO: docstring args, returns, example use for other users
*/
function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key);
  const initial = stored ? JSON.parse(stored) : defaultValue;
  const [value, setValue] = useState(initial);

  useEffect( function updateLocalStorage() {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;