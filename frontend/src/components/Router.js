import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './Home';
import Navbar from './Navbar';
import Comic from './Comic';


function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes >
        <Route path="/" element={<Home />}/>
        <Route path="/comics/:comicNum" element={<Comic />} />
      </Routes>
    </BrowserRouter>
  )

}


export default Router;