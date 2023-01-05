import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';

import UserContext from './helpers/UserContext';

import Router from './components/Router';
import xkcdAPI from './helpers/api';


function App() {
  
  const [user, setUser] = useState({});

  // console.log("hello");
  

  const login = (userObj) => {
    const {id, username, email} = userObj;
    setUser({loggedIn: true, id, username, email})
    // user.loggedIn = true;
    // user.id = userObj.id;
    // user.username = userObj.username;
    // user.email = userObj.email;
    console.log(user);
  }

  // check on page load for user
  useEffect(function() {
    xkcdAPI.loadToken().then(tokenBody => {
      console.log("tokenBody:", tokenBody);
      if (tokenBody) setUser(tokenBody);
    })
  }, [])


  return (
    <div className="App">
      <UserContext.Provider value={{user, login}}>
        <Router />
      </UserContext.Provider>
    </div>
  );
}

export default App;
