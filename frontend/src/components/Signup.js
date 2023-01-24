import React, {useState, useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../helpers/UserContext';
import FlashContext from '../helpers/FlashContext';
import xkcdAPI from '../helpers/api';

function Signup() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [warning, setWarning] = useState("");

  const navigate = useNavigate();
  const {user, login} = useContext(UserContext);
  const {addMessages} = useContext(FlashContext)


  const submitForm = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      xkcdAPI.signup(email, username, password)
      .then(userObj => {
        login(userObj, true);
      })
      .catch((errors) => {
        addMessages(errors.map(err => {
          return {
            text: err,
            type: "danger"
          }
        }));
      })
    } else {
      addMessages([
        {
          text: "Please make sure your confirm password matches the password",
          type: "danger",
          cyclesLeft: 1
        }
      ])
    }
  }

  const clearForm = (e) => {
    e.preventDefault();
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }


  useEffect(function () {
    console.log("checking for user.id");
    if (user.id) {
      console.log("should navigate to '/'")
      navigate('/');
    }
  }, [user])

  return (
    <form className="container m-auto p-5">
      <div className="form-group row justify-content-around">
        <label className="col-6 col-form-label">Username</label>
        <div className="col-6">
          <input 
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group row justify-content-around">
        <label className="col-6 col-form-label">Email</label>
        <div className="col-6">
          <input 
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group row justify-content-around">
        <label className="col-6 col-form-label">Password</label>
        <div className="col-6">
          <input 
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group row justify-content-around">
        <label className="col-6 col-form-label">Confirm Password</label>
        <div className="col-6">
          <input 
            className="form-control"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group mt-3 row justify-content-around">
        <button 
          className="btn btn-primary btn-dark-outline col-4"
          onClick={submitForm}
        >
          Sign Up
        </button>
        <button 
          className="btn btn-primary btn-dark-outline col-4"
          onClick={clearForm}
        >
          Clear Form
        </button>
      </div>
    </form>
  )

}

export default Signup;