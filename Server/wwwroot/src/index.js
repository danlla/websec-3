import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStorage from "./storage/UserStorage";


export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value = {{
    user: new UserStorage()
  }}>
    <App />
  </Context.Provider>
);