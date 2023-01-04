import LoginContext from "../helpers/UserContext";
import { Link } from "react-router-dom";
import { useContext } from "react";

function Navbar() {

  const status = useContext(LoginContext);

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="navbar-brand mx-3">
        <h3>xkcd Viewer</h3>
      </div>
      {/* <div className="navbar-collapse">
        <ul className="nav mr-auto mt-2 mt-lg-0">
          <li>Log In</li>
        </ul>
      </div> */}
    </nav>
  )
}

export default Navbar;