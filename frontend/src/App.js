import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';

import UserContext from './helpers/UserContext';
import FlashContext from './helpers/FlashContext';

import Router from './components/Router';
import xkcdAPI from './helpers/api';



function App() {
  
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([
    {
      text: "sample success",
      type: "success", 
      display: true
    },
    {
      text: "sample warning",
      type: "warning", 
      display: true
    },
    {
      text: "sample danger",
      type: "danger", 
      display: true
    }
  ]);


  const login = (userObj) => {
    const {id, username, email} = userObj;
    setUser({loggedIn: true, id, username, email})
    // console.log(user);
  }

  // check on page load for user
  useEffect(function() {
    // console.log("hello");
    xkcdAPI.loadToken().then(tokenBody => {
      // console.log("tokenBody:", tokenBody);
      if (tokenBody) setUser(tokenBody);
    })
  }, [])


  return (
    <div className="App">
      <UserContext.Provider value={{user, login}}>
        <FlashContext.Provider value={{messages, setMessages}}>
          <Router />
        </FlashContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
