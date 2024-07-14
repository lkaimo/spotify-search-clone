import React, { useState } from 'react';
import './Home.module.css';

const Home = () => {

  const [trackName, setTrackName] = useState('');

  // Add this function to handle Enter key press
  function handleKeyUp(event) {
    if (event.key === "Enter") {
      searchTrack();
    }
  }

  function searchTrack() {
    const searchInput = document.getElementById('searchInput').value;
    const clientId = '942ba0dda713421986a698a3a3aee095'; // Replace with your Spotify API client ID
    const clientSecret = 'b47aa8cc84d2459fb882a9c9bdfa3963'; // Replace with your Spotify API client secret
    const base64Credentials = btoa(`${clientId}:${clientSecret}`);

    fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${base64Credentials}`
      },
      body: 'grant_type=client_credentials'
    })
      .then(response => response.json())
      .then(data => {
        const accessToken = data.access_token;

        fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=track`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
          .then(response => response.json())
          .then(data => {
            displayResults(data.tracks.items);
          })
          .catch(error => console.error('Error:', error));
      })
      .catch(error => console.error('Error:', error));
  }

  function displayResults(tracks) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (tracks.length === 0) {
      resultDiv.innerHTML = '<p>No results found.</p>';
      return;
    }

    tracks.forEach(track => {
      const trackDiv = document.createElement('div');
      trackDiv.classList.add('track');
      trackDiv.innerHTML = `
                    <h3>${track.name}</h3>
                    <p>Artist: ${track.artists[0].name}</p>
                    <p>Album: ${track.album.name}</p>
                    <img src="${track.album.images[0].url}" alt="Album Cover">
                    <p>
                    <iframe src="https://open.spotify.com/embed/track/${track.id}" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                    </p>
                    `;
      resultDiv.appendChild(trackDiv);
    });
  }

  return (
    <div id="content">
      <h1>Spotify Track Search</h1>

      <label htmlFor="searchInput">Enter track name:</label>
      <input
        type="text"
        id="searchInput"
        placeholder="Enter track name..."
        value={trackName}
        onChange={(event) => setTrackName(event.target.value)} // Update trackName on input change
        onKeyUp={handleKeyUp} // Attach keyup event handler
      />
      <button onClick={searchTrack}>Search</button> {/* Attach click event handler */}

      <div id="result"></div>
    </div>
  );
};

export default Home;