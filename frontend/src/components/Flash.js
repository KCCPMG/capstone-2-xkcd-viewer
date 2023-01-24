import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import FlashContext from '../helpers/FlashContext';


function Message(props) {
  return (
    <div className={`alert alert-${props.type}`}>
      <h4>{props.text}</h4>
    </div>
  )
}

function Flash() {

  const location = useLocation();
  const {messages, cycleMessages} = useContext(FlashContext);
  // console.log(location);
  // console.log(`Load Flash - ${location.pathname}`)
  // console.log('messages - ', messages)

  useEffect(function() {
    // console.log(`useEffect Flash - ${location.pathname}`)
    // let msgCopy = messages.filter(m => m.display);
    // msgCopy.forEach(msg => msg.display=false);
    // setMessages(msgCopy);
    
    // addMessages();

    cycleMessages();
  }, [location.pathname])

  return (
    <div className="container pt-1">
      {messages.map(msg => <Message 
          text={msg.text} type={msg.type} key={msg.id}
        />
      )}
    </div>
  )

}

export default Flash;
