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
  const {messages, setMessages} = useContext(FlashContext);
  console.log(location);
  console.log(`Load Flash - ${location.pathname}`)

  useEffect(function() {
    console.log(`useEffect Flash - ${location.pathname}`)
    let msgCopy = messages.filter(m => m.display);
    msgCopy.forEach(msg => msg.display=false);
    setMessages(msgCopy);
  }, [useLocation().pathname])

  return (
    <>
      {messages.map(msg => <Message 
          text={msg.text} type={msg.type }
        />
      )}
    </>
  )

}

export default Flash;
