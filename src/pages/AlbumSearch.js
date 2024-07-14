import React, { useState } from 'react';
import './AlbumSearch.css';

const AlbumSearch = () => {

        // Add this function to handle Enter key press
        function handleKeyUp(event) {
          if (event.key === "Enter") {
              searchAlbum();
          }
      }        

      function searchAlbum() {
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

              fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=album`, {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${accessToken}`
                  }
              })
              .then(response => response.json())
              .then(data => {
                  displayResults(data.albums.items);
              })
              .catch(error => console.error('Error:', error));
          })
          .catch(error => console.error('Error:', error));
      }

      function displayResults(albums) {
          const resultDiv = document.getElementById('result');
          resultDiv.innerHTML = '';

          if (albums.length === 0) {
              resultDiv.innerHTML = '<p>No results found.</p>';
              return;
          }

          albums.forEach(album => {
              const albumDiv = document.createElement('div');
              albumDiv.classList.add('albumfromsearch');
              albumDiv.innerHTML = `
                  <h3>${album.name}</h3>
                  <p>Artist: ${album.artists[0].name}</p>
                  <img src="${album.images[0].url}" alt="Album Cover">
                  <p>
                      <iframe src="https://open.spotify.com/embed/album/${album.id}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                  </p>
                  `;
              resultDiv.appendChild(albumDiv);
          });
      }
  return (
    <div id="content">
      <h1>Spotify Album Search</h1>
      <input type="text" id="searchInput" placeholder="Enter album name..." onKeyUp={handleKeyUp} />

      <div id="result"></div>
    </div>
  );
};

export default AlbumSearch;