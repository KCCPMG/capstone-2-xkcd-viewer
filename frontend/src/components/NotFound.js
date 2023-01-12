import { Navigate } from "react-router-dom";
import { useContext, useEffect} from 'react';
import FlashContext from "../helpers/FlashContext";

function NotFound() {

  const { addMessages } = useContext(FlashContext);

  useEffect(function() {
    addMessages([
      {
        text: "Page does not exist!",
        type: "danger",
        cyclesLeft: 1
      }
    ])
  }, []);

  return (
    <Navigate to="/" />
  )
}

export default NotFound;