import React, {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import xkcdAPI from '../helpers/api';


function Logout() {

  const navigate = useNavigate();

  useEffect(function() {
    xkcdAPI.removeToken();
    navigate('/');
  });

  return (
    <></>
  )

} 

export default Logout