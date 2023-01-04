import UserContext from "../helpers/UserContext";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const {user, login} = useContext(UserContext);


  const handleLogin = (e) => {
    e.preventDefault();
    
  }

  // if there is a user, redirect home
  useEffect(function() {
    if(user.username) {
      navigate("/");
    }
  }, [user])

  return (
    <form className="container m-auto p-5">
      <div className="form-group row justify-content-around">
        <label className="col-6 col-form-label">Username</label>
        <div className="col-6">
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
      </div>
      <div className="form-group row mt-1">
        <label className="col-6 col-form-label">Password</label>
        <div className="col-6">
          <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      <div className="form-group row mt-3 justify-content-center">
        <button className="col-3 btn btn-primary" onClick={handleLogin}>
          Login
        </button>
      </div>
    </form>
  )
}

export default Login;