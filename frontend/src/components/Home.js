import React, {useContext, useEffect} from 'react';
import Comic from './Comic';
import FlashContext from '../helpers/FlashContext';

function Home() {

  const {addMessages} = useContext(FlashContext);

  return(
    <>
      <Comic navControls={true} current={true} />
    </>
  )
}

export default Home;