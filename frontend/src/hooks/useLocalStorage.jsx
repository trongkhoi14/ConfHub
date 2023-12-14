// localStorageUtils.js
import { useAppContext } from "../context/authContext";

export const useLocalStorage = () => {
  const { dispatch } = useAppContext();

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  const checkLocalStorageAndDispatch = () => {
    const userFromLocalStorage = getFromLocalStorage('user');

    if (userFromLocalStorage) {
      dispatch({ type: 'SET_USER_FROM_LOCAL_STORAGE', payload: userFromLocalStorage });
    }
  };

  return {
    saveToLocalStorage,
    getFromLocalStorage,
    checkLocalStorageAndDispatch,
  };
};
