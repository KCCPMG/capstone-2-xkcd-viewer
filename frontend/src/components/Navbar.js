import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../helpers/UserContext";

function Navbar() {

  const {user} = useContext(UserContext);
  // console.log(user);

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark justify-content-between px-2">
      <Link className="navbar-brand mx-3" to="/">
        <h3>xkcd View</h3>
      </Link>
      <button 
        className="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/popular">
              Popular
            </Link>
          </li>
          {/* for logged in */}
          {user.username 
            ? 
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/favorites">
                  My Favorites
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/logout">Logout {user.username}</Link>
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