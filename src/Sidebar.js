import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);

    // Update #content styles based on the collapsed state
    //content.style.margin = '15px auto';
    const content = document.getElementById('content');
    if (collapsed) {
          //content.style.margin = '15px auto';
    } else {
      content.style.margin = '15px auto';
    }
  };

  return (
    <>
      <div className="toggle-btn" onClick={toggleSidebar}>
        <span>&#9776;</span>
      </div>
      <nav className={`sidebar${collapsed ? ' collapsed' : ''}`}>
        <ul className="list-unstyled">
          <img
            style={{
              borderRadius: '50%',
              height: '150px',
              width: '150px',
              display: 'block',
              margin: '0 auto',
            }}
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXZtc3FxZ3R5aXhqMHAzejF0MnhlMnFxZDQzZTRxZTM1dGd1OWVhaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/E0yTpDqB3AI8fv8WsB/giphy.gif"
            alt="Profile"
          />
          <p
            style={{
              textAlign: 'center',
              marginBottom: '50px',
            }}
          >
            kaimosalalima@gmail.com
          </p>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/tracksearch">Track Search</Link>
          </li>
          <li>
            <Link to="/artistsearch">Artist Seach</Link>
          </li>
          <li>
            <Link to="/albumsearch">Album Search</Link>
          </li>
          <li>
            <Link to="/playlistsearch">Playlist Search</Link>
          </li>
          <a
            style={{ marginTop: '50px'}}
            href="https://www.spotify.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            © Spotify
          </a>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;