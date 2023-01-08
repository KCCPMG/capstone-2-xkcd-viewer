import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../helpers/UserContext";

function Navbar() {

  const {user} = useContext(UserContext);
  // console.log(user);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between">
      <Link className="navbar-brand mx-3" to="/">
        <h3>xkcd Viewer</h3>
      </Link>
      {/* <div className="navbar-collapse">
        <ul className="nav mr-auto mt-2 mt-lg-0">
          <li>Log In</li>
        </ul>
      </div> */}
      {/* <nav className="nav mr-auto mt-2 mt-lg-0">
        <ul>
          <li>1</li>
          <li>2</li>
        </ul>
      </nav> */}
      <div className="navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link active" to="/">Home</Link>
          </li>
          {/* for logged in */}
          {user.username 
            ? 
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/favorites">Favorites</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">{user.username}</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/logout">Logout</Link>
              </li>
            </>
            :
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Sign In</Link>
              </li>
            </>
          }
        </ul>
      </div>
    </nav>
  )
}

export default Navbar;