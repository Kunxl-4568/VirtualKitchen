import {createContext, useContext, useState, useEffect} from "react";

const StateContext = createContext({
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {}, //w'll define later
  setToken: () => {}, //w'll define later
  setNotification: () => {} //w'll define later
})

export const ContextProvider = ({children}) => {
  const [user, _setUser] = useState(JSON.parse(localStorage.getItem('USER')) || {}); // yh empty object se initialize hoya h
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));// yh token fetch krega localstorage se
  const [notification, _setNotification] = useState(''); // yh empty string se initialize hoya h

  useEffect(() => {
    const storedToken = localStorage.getItem('ACCESS_TOKEN');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const setUser = (userData) => {
    _setUser(userData);
    if (userData?.id) {
      localStorage.setItem('USER', JSON.stringify(userData));
    } else {
      localStorage.removeItem('USER');
    }
  };

  const setToken = (newToken) => {
    _setToken(newToken);
    if (newToken) {
      localStorage.setItem('ACCESS_TOKEN', newToken);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  }

  const setNotification = message => {
    _setNotification(message); // Updates React state

    setTimeout(() => {
      _setNotification('')
    }, 5000)
  }

  return (
    <StateContext.Provider value={{
      user,
      setUser,
      token,
      setToken,
      notification,
      setNotification
    }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);
