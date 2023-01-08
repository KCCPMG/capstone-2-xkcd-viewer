import FlashContext from '../helpers/FlashContext';
import React, {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import xkcdAPI from '../helpers/api';
import UserContext from '../helpers/UserContext';


function Logout() {

  const {addMessages} = useContext(FlashContext);
  const {logout} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(function() {
    navigate('/');
    logout();
    
  });

  return (
    <></>
  )

} 

export default Logout