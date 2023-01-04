import logo from './logo.svg';
import './App.css';

import UserContext from './helpers/UserContext';

import Router from './components/Router';


function App() {
  return (
    <div className="App">
      <UserContext.Provider value={{
        loggedIn: false,
        token: null,
        id: null,
        username: null,
        email: null
      }}>
        <Router />
      </UserContext.Provider>
    </div>
  );
}

export default App;
