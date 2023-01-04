import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import LoginContext from '../helpers/UserContext';
import { useParams } from 'react-router-dom';







function Comic() {

  const status = useContext(LoginContext);
  const {comicNum} = useParams();



  const [loading, setLoading] = useState(false);
  const [num, setNum] = useState(null);
  const [month, setMonth] = useState("");
  const [link, setLink] = useState("");
  const [year, setYear] = useState("");
  const [news, setNews] = useState("");
  const [safeTitle, setSafeTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [alt, setAlt] = useState("");
  const [img, setImg] = useState("");
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("");
  const [upvoteCount, setUpvoteCount] = useState("");
  const [favoriteCount, setFavoriteCount] = useState("");
  const [upvoted, setUpvoted] = useState("");
  const [favorited, setFavorited] = useState("");

  const getComic = () => {
    console.log(comicNum);
    setLoading(true);
    axios.get(`${SERVER_URL}/comics/${comicNum}`)
    .then(res => {
      console.log(res.data);
      setImg(res.data.img);
      setLoading(false);
    })
  }

  // run only on load
  useEffect(function() {
    getComic();
    console.log(status);
  })

  return (
    <React.Fragment>
      <h1>Test</h1>
      <h3>{title}</h3>
      <img src={img} />
    </React.Fragment>
  )
}

export default Comic;