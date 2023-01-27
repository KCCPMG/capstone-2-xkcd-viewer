import React, {useState, useEffect, useContext} from 'react';
import UserContext from '../helpers/UserContext';
import FlashContext from '../helpers/FlashContext';
import { Link } from 'react-router-dom';
import xkcdAPI from '../helpers/api.js';
import { Star, ArrowUpCircle } from 'react-bootstrap-icons';
import { Tooltip } from 'react-tooltip';
import {Col, Button, Row, Image} from 'react-bootstrap';



/** button wrapped in a link for nav controls under comic */
function NavButton({to, text, id, toolText}) {
  return (
    // reloadDocument 
    <>
      <Link to={to} id={id} data-tooltip-content={toolText} data-tooltip-place="bottom">
        <button className="btn btn-secondary m-1 nav-button">
          {text}
        </button>
      </Link>
      <Tooltip anchorId={id} />
    </>
  )
}

/** Upvote and favorite controls if logged in, display but disable if not */
function ResponseControls(props) {

  const {user, comic, addUpvote, removeUpvote, addFavorite, removeFavorite} = props;

  return (
    <>
      <Row className="justify-content-center response-control mt-1">
        <Col xs={6} sm={4} md={2} lg={2} xl={2} xxl={1}>
          <Row className="justify-content-center">
            <Col>
              <Row className="justify-content-center">
                <Button 
                  variant="light"
                  className={`response-control-button btn-outline-dark ${user.username ? "" : "disabled"} ${comic.upvoted ? "upvoted" : ""}`}
                  onClick={comic.upvoted ? removeUpvote : addUpvote}
                >
                  <ArrowUpCircle className="response-control-icon" />
                </Button>
              </Row>
              <Row>
                <span className="response-count">{comic.upvoteCount}</span>
              </Row>
            </Col>
            <Col>  
              <Row className="justify-content-center">
                <Button 
                  variant="light"
                  className={`response-control-button btn-outline-dark ${user.username ? "" : "disabled"} ${comic.favorited ? "favorited" : ""}`}
                  onClick={comic.favorited ? removeFavorite : addFavorite}
                >
                  <Star className="response-control-icon" />
                </Button>
              </Row>
              <Row>
                <span className="response-count">{comic.favoriteCount}</span>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}


/** Main Comic component
 * 
 * Takes the props of a comicNum (int) or random (boolean) or
 * current (boolean) to determine which API method should be
 * called. That method is returned as getComicPromise, which
 * is then called in the useEffect hook to load the comic data
 * from the request to the server.
 */
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
    if (random) return xkcdAPI.getRandomComic();
    else if (current) return xkcdAPI.getLastComic();
    else return xkcdAPI.getComic(comicNum);
  }

  const loadComic = () => {
    getComicPromise()
    .then((data) => {
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
        <Image fluid src={comic.img} />
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
              <NavButton
                id="first-button" 
                to="/comics/1" 
                text="|<" 
                toolText="Back to the beginning" 
              />
              <NavButton 
                id="back-button"
                to={`/comics/${comic.prev}`} 
                text="<" 
                toolText="Back"
              />
            </>
          }
          {random
          ?
            <>
              <Link id="random-button" data-tooltip-content="Random" data-tooltip-place="bottom">
                <button className="btn btn-secondary m-1 nav-button" onClick={loadComic}>
                  ?
                </button>
              </Link>
              <Tooltip anchorId="random-button" />
            </>
          :
            <NavButton id="random-button" to="/random" text="?" toolText="Random" />
          }
          
          {comic.subsequent &&
            <>
              <NavButton 
                to={`/comics/${comic.subsequent}`} 
                text=">" 
                id="forward-button"
                toolText="Forward"
              />
              <NavButton 
                to="/current" 
                text=">|" 
                id="current-button"
                toolText="Forward to current"
              />
            </>
          }
        </div>
      }
    </div>  
  )
}

export default Comic;