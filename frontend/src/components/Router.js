import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './Home';
import Navbar from './Navbar';
import Comic from './Comic';
import Login from './Login';
import Logout from './Logout';
import Signup from './Signup';
import Favorites from './Favorites';
import Flash from './Flash';


function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <Flash />
      <Routes >
        <Route path="/" element={<Home />}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/comics/:comicNum" element={<Comic />} />
      </Routes>
    </BrowserRouter>
  )

}


export default Router;