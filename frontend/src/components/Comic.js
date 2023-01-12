import React, {useState, useEffect, useContext} from 'react';
import UserContext from '../helpers/UserContext';
import FlashContext from '../helpers/FlashContext';
import { useParams, Link } from 'react-router-dom';
import xkcdAPI from '../helpers/api.js';
import { Star, ArrowUpCircle } from 'react-bootstrap-icons';


function NavButton({to, text}) {
  return (
    // reloadDocument 
    <Link to={to}>
      <button className="btn btn-secondary m-1">
        {text}
      </button>
    </Link>
  )
}


function ResponseControls(props) {

  const {user, comic, addUpvote, removeUpvote, addFavorite, removeFavorite} = props;

  return (
    <div>
      <div className="row justify-content-center response-control mt-1">
        <div className="col-1 mx-2">
          <div className="row justify-content-center">
            <button 
              className={`response-control-button btn btn-outline-dark ${user.username ? "" : "disabled"} ${comic.upvoted ? "upvoted" : ""}`}
              onClick={comic.upvoted ? removeUpvote : addUpvote}
            >
              <ArrowUpCircle className="response-control-icon" />
            </button>
          </div>
          <div className="row">
            <span className="response-count">{comic.upvoteCount}</span>
          </div>
        </div>
        <div className="col-1 mx-2">
          <div className="row justify-content-center">
            <button 
              className={`response-control-button btn btn-outline-dark ${user.username ? "" : "disabled"} ${comic.favorited ? "favorited" : ""}`}
              onClick={comic.favorited ? removeFavorite : addFavorite}
            >
              <Star className="response-control-icon" />
            </button>
          </div>
          <div className="row">
            <span className="response-count">{comic.favoriteCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


function Comic({comicNum, navControls, random, current}) {

  const {user} = useContext(UserContext);
  const {addMessages} = useContext(FlashContext);

  const [comic, setComic] = useState({})


  const addUpvote = () => {
    xkcdAPI.addUpvote(comic.num)
    .then((comicObj) => {
      setComic(comicObj);
      console.log(comicObj);
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
  }

  const removeUpvote = () => {
    xkcdAPI.removeUpvote(comic.num)
    .then((comicObj) => {
      setComic(comicObj);
      console.log(comicObj);
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
  }

  const addFavorite = () => {
    xkcdAPI.addFavorite(comic.num)
    .then((comicObj) => {
      setComic(comicObj);
      console.log(comicObj);
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
  }

  const removeFavorite = () => {
    xkcdAPI.removeFavorite(comic.num)
    .then((comicObj) => {
      setComic(comicObj);
      console.log(comicObj);
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
  }

  /** Return the correct promise from the api to use 
  * 
  * Based on the component that renders the comic,
  * the comic may be calling upon the first comic,
  * the last comic, a random comic, or a specific 
  * comic given by its number
  */
  const getComicPromise = () => {

    if (random) console.log("xkcdAPI.getRandomComic();");
    else if (current) console.log("xkcdAPI.getLastComic();");
    else console.log("xkcdAPI.getComic(comicNum);");

    if (random) return xkcdAPI.getRandomComic();
    else if (current) return xkcdAPI.getLastComic();
    else return xkcdAPI.getComic(comicNum);
  }

  const loadComic = () => {
    getComicPromise()
    .then((data) => {
      // console.log(data);
      setComic(data);
    })
    .catch((errors) => {
      addMessages(errors.map(err => {
        return {
          text: err,
          type: "danger",
          cyclesLeft: 1
        }
      }));  
    })

    // getComic();
    // console.log(status);
  }


  // run only on load
  useEffect(function() {
    loadComic();
  }, [comicNum, random, current])

  return (
    <div className="comic mt-5">
      <h3 style={{fontWeight: 700}}>#{comic.num}: {comic.title}</h3>
      <div className="image-container">
        <img src={comic.img} />
      </div>
      {(comic.img) &&
        <ResponseControls 
          user={user} 
          comic={comic} 
          addUpvote={addUpvote} 
          removeUpvote={removeUpvote}
          addFavorite={addFavorite}
          removeFavorite={removeFavorite} 
        />
      }
      {navControls  &&
        <div className="btn-group">
          {comic.prev &&
            <>
              <NavButton to="/comics/1" text="|<" />
              <NavButton to={`/comics/${comic.prev}`} text="<" />
            </>
          }
          {random
          ?
            <Link>
              <button className="btn btn-secondary m-1" onClick={loadComic}>
                ?
              </button>
            </Link>
          :
            <NavButton to="/random" text="?" />
          }
          
          {comic.subsequent &&
            <>
              <NavButton to={`/comics/${comic.subsequent}`} text=">" />
              <NavButton to="/current" text=">|" />
            </>
          }
        </div>
      }
    </div>  
  )
}

export default Comic;