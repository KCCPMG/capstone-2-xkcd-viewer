import React, {useContext, useEffect} from 'react';
import FlashContext from '../helpers/FlashContext';

function Home() {

  const {addMessages} = useContext(FlashContext);

  useEffect(function() {
    // comment this out, try to get login flash messages working
    // addMessages([
    //   {
    //     text: "hello",
    //     type: "success"
    //   },
    //   {
    //     text: "you've entered",
    //     type: "success"
    //   },
    //   {
    //     text: "THE DANGA ZONE",
    //     type: "danger"
    //   }
    // ]);
  }, [])

  return(
    <>
      <h1>I'm the home page look at that</h1>
    </>
  )
}

export default Home;