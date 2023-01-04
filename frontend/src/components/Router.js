import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './Home';
import Navbar from './Navbar';
import Comic from './Comic';
import Login from './Login';
import Signup from './Signup';


function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes >
        <Route path="/" element={<Home />}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/comics/:comicNum" element={<Comic />} />
      </Routes>
    </BrowserRouter>
  )

}


export default Router;