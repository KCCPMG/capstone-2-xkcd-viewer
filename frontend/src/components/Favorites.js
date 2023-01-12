import React, {useState, useEffect, useContext} from "react";
import xkcdAPI from "../helpers/api";
import FlashContext from "../helpers/FlashContext";
import Comic from "./Comic";


function Favorites() {

  // an array of comic_nums
  const [favorites, setFavorites] = useState([]);
  const { addMessages } = useContext(FlashContext);

  useEffect(function() {
    xkcdAPI.getFavorites()
    .then((comics) => {
      setFavorites(comics);
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
      {favorites.map(fav => 
        <Comic comicNum={fav} navControls={false} key={fav} />
      )}
    </>
  )
}

export default Favorites;