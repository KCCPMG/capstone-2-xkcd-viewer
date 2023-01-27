import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React, {useState, useEffect} from 'react';

import UserContext from './helpers/UserContext';
import FlashContext from './helpers/FlashContext';

import Router from './components/Router';
import xkcdAPI from './helpers/api';



function App() {

  // const sampleMessages = [
  //   {
  //     text: "sample success",
  //     type: "success", 
  //     cyclesLeft: 1,
  //     // displayNext: true,
  //     id: 100
  //   },
  //   {
  //     text: "sample warning",
  //     type: "warning", 
  //     cyclesLeft: 1,
  //     // displayNext: true,
  //     id: 101
  //   },
  //   {
  //     text: "sample danger",
  //     type: "danger", 
  //     cyclesLeft: 1,
  //     // displayNext: true,
  //     id: 102
  //   }
  // ]
  
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [nextMsgId, setNextMsgId] = useState(0);


  const login = (userObj, firstTime) => {
    const {id, username, email} = userObj;
    setUser({loggedIn: true, id, username, email})
    // console.log(user);
    addMessages([
      {
        text: `Welcome${firstTime ? '' : ' back'}, ${userObj.username}!`,
        type: "success",
        cyclesLeft: 1
      }
    ]);
  }

  const logout = () => {
    xkcdAPI.removeToken();
    
    addMessages([
      {
        text: "Successfully signed out. See you next time!",
        type: "success",
        cyclesLeft: 1
      }
    ]);
    setUser({loggedOut: false, id: null, username: null, email: null})
  }

  const addMessages = (newMessages=[]) => {
    // const origMessages = messages
    //   .filter(msg => msg.displayNext == true)
    // origMessages.forEach(msg => msg.displayNext = false);
    newMessages.forEach((msg, ind) => msg.id = nextMsgId+ind);
    setNextMsgId(nextMsgId+newMessages.length);
    const newMsgGroup = Object.assign([], messages, newMessages);
    setMessages(newMsgGroup);

  }


  const cycleMessages = () => {
    // console.log({messages});
    const msgCopy = messages.filter(msg => msg.cyclesLeft > 0);
    // console.log({msgCopy});
    msgCopy.forEach(msg => msg.cyclesLeft--);
    // console.log({msgCopy});
    setMessages(msgCopy);
    // console.log({messages});
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
      <UserContext.Provider value={{user, login, logout}}>
        <FlashContext.Provider value={{messages, addMessages, cycleMessages}}>
          <Router />
        </FlashContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
