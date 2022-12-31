import logo from './logo.svg';
import './App.css';

import LoginContext from './helpers/LoginContext';

import Router from './components/Router';


function App() {
  return (
    <div className="App">
      <LoginContext.Provider value={{
        loggedIn: false,
        token: null,
        username: null,
        email: null
      }}>
        <Router />
      </LoginContext.Provider>
    </div>
  );
}

export default App;
