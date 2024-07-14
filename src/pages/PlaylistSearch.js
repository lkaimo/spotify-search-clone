import React from 'react';
import './PlaylistSearch.css';

const PlaylistSearch = () => {
  // Add this function to handle Enter key press
  function handleKeyUp(event) {
    if (event.key === "Enter") {
      searchPlaylist();
    }
  }

  function searchPlaylist() {
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

        // Set the limit and offset parameters to get more results
        const limit = 25; // You can adjust this number based on your needs
        const offset = 0; // You can adjust this number based on your needs

        fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=playlist&limit=${limit}&offset=${offset}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
          .then(response => response.json())
          .then(data => {
            displayResults(data.playlists.items);
          })
          .catch(error => console.error('Error:', error));
      })
      .catch(error => console.error('Error:', error));
  }

  function displayResults(playlists) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (playlists.length === 0) {
      resultDiv.innerHTML = '<p>No results found.</p>';
      return;
    }

    playlists.forEach(playlist => {
      const playlistDiv = document.createElement('div');
      playlistDiv.classList.add('playlist');

      playlistDiv.innerHTML = `
                  <h3>${playlist.name}</h3>
                  <p>By: ${playlist.owner.display_name}</p>
                  <p>Total Tracks: ${playlist.tracks ? playlist.tracks.total : 'N/A'}</p>
                  <img src="${playlist.images[0].url}" alt="Playlist Cover">
                  <p>
                      <iframe src="https://open.spotify.com/embed/playlist/${playlist.id}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                  </p>
              `;
      resultDiv.appendChild(playlistDiv);
    });
  }
  return (
    <div id="content">
      <h1>Spotify Playlist Search</h1>
      <input type="text" id="searchInput" placeholder="Enter playlist name..." onKeyUp={handleKeyUp} />

      <div id="result"></div>
    </div>
  );
};

export default PlaylistSearch;
