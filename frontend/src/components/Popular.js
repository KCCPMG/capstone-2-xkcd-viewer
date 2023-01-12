import React, {useEffect, useContext, useState} from 'react';
import xkcdAPI from '../helpers/api';
import FlashContext from '../helpers/FlashContext';
import Comic from './Comic';

function Popular() {

  const [upvoted, setUpvoted] = useState([]);
  const { addMessages } = useContext(FlashContext);

  useEffect(function() {
    xkcdAPI.getPopular()
    .then((comics) => {
      setUpvoted(comics);
    })
    .catch((errors) => {
      addMessages(errors.map(err => {
        return {
          text: err,
          type: "danger",
          cyclesLeft: 1
        }
      }))
    })
  }, [])

  return (
    <>
      {upvoted.map(fav => 
        <Comic comicNum={fav} navControls={false} />
      )}
    </>
  )
}

export default Popular;