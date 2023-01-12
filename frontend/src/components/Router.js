import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './Home';
import Navbar from './Navbar';
import Comic from './Comic';
import ComicView from './ComicView';
import Login from './Login';
import Logout from './Logout';
import Signup from './Signup';
import Favorites from './Favorites';
import Popular from './Popular';
import Flash from './Flash';
import NotFound from './NotFound';


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
        <Route path="/popular" element={<Popular />} />
        <Route path="/comics/:comicNum" element={<ComicView />} />
        <Route path="/random" element={<Comic navControls={true} random={true} />} />
        <Route path="/current" element={<Comic navControls={true} current={true} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )

}


export default Router;