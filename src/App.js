// Install Bootstrap using: npm install bootstrap
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Create App.css file for custom styles

import Home from './pages/Home'
import TrackSearch from './pages/TrackSearch'; // Import your page component
import ArtistSearch from './pages/ArtistSearch'; // Import your page component
import AlbumSearch from './pages/AlbumSearch'; // Import your page component
import PlaylistSearch from './pages/PlaylistSearch'; // Import your page component
import Sidebar from './Sidebar';


const App = () => {
  return (
    <Router>
      <div className="wrapper">
        <Sidebar />
        <div id="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracksearch" element={<TrackSearch />} />
            <Route path="/artistsearch" element={<ArtistSearch />} />
            <Route path="/albumsearch" element={<AlbumSearch />} />
            <Route path="/playlistsearch" element={<PlaylistSearch />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
