import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import ScrapHistory from './ScrapHistory';
import Account from './Account';
import Scrapper from './Scrapper';




function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route  path="/scrapper" element={<Scrapper/>} />
          <Route path="/scraphistory" element={<ScrapHistory/>} />
          <Route path="/account" element={<Account/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
