import React, { useState } from 'react';
import './ArtistSearch.css';

const ArtistSearch = () => {


  // Add this function to handle Enter key press
  function handleKeyUp(event) {
    if (event.key === "Enter") {
      searchArtist();
    }
  }

  let accessToken;

  function searchArtist() {
    const searchInput = document.getElementById('searchInput').value;
    const clientId = '942ba0dda713421986a698a3a3aee095';
    const clientSecret = 'b47aa8cc84d2459fb882a9c9bdfa3963';
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
        accessToken = data.access_token; // Remove const keyword

        fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
          .then(response => response.json())
          .then(data => {
            displayResults(data.artists.items);
          })
          .catch(error => console.error('Error:', error));
      })
      .catch(error => console.error('Error:', error));
  }

  function displayResults(artists) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (artists.length === 0) {
      resultDiv.innerHTML = '<p>No results found.</p>';
      return;
    }

    artists.forEach(artist => {
      const artistDiv = document.createElement('div');
      artistDiv.classList.add('artist');
      artistDiv.addEventListener('click', () => openModal(artist));
      artistDiv.innerHTML = `
                    <h3>${artist.name}</h3>
                    <img src="${artist.images.length > 0 ? artist.images[0].url : 'img/nopic.png'}" alt="Artist Image">
                    <p>Monthly Listeners: ${artist.followers.total.toLocaleString()}</p>
                    `;
      resultDiv.appendChild(artistDiv);
    });
  }

  function openModal(artist) {
    const modal = document.getElementById('artistModal');
    const modalArtistName = document.getElementById('modalArtistName');
    const modalImage = document.getElementById('modalImage');
    const modalListeners = document.getElementById('modalListeners');
    const modalTopSongs = document.getElementById('modalTopSongs');
    const modalDiscography = document.getElementById('modalDiscography');
    const modalRelatedArtists = document.getElementById('modalRelatedArtists');
    const modalIframeContainer = document.getElementById('modalIframeContainer');

    modalArtistName.textContent = artist.name;
    modalImage.src = artist.images.length > 0 ? artist.images[0].url : 'img/nopic.png';
    modalListeners.textContent = `Monthly Listeners: ${artist.followers.total.toLocaleString()}`;

    // Fetch artist's top tracks
    fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?country=US`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const topSongs = data.tracks;
        modalTopSongs.innerHTML = ''; // Clear the list before adding iframes
        topSongs.forEach(song => {
          const iframe = document.createElement('iframe');
          iframe.src = `https://open.spotify.com/embed/track/${song.id}`;
          iframe.width = '100%';
          iframe.height = '80';
          iframe.frameBorder = '0';
          iframe.allowtransparency = 'true';
          iframe.allow = 'encrypted-media';

          // Set margin and padding to zero
          iframe.style.margin = '0';
          iframe.style.padding = '0';

          modalTopSongs.appendChild(iframe);
        });
      })
      .catch(error => console.error('Error fetching top tracks:', error));

    // Fetch artist's albums (discography)
    fetch(`https://api.spotify.com/v1/artists/${artist.id}/albums`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const albums = data.items;
        modalDiscography.innerHTML = ''; // Clear the list before adding albums

        albums.forEach(album => {
          const albumItem = document.createElement('div');
          const albumType = album.album_type === 'album' ? 'Album' : (album.album_type === 'single' ? (album.total_tracks > 1 ? 'EP' : 'Single') : 'EP');

          albumItem.innerHTML = `
            <p class="album-title">
                ${album.name} · ${albumType}
            </p>
            <iframe class="album-iframe" src="https://open.spotify.com/embed/album/${album.id}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `;
          modalDiscography.appendChild(albumItem);
        });
      })
      .catch(error => console.error('Error fetching discography:', error));


    // Fetch related artists
    fetch(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const relatedArtists = data.artists;
        modalRelatedArtists.innerHTML = ''; // Clear the list before adding related artists

        relatedArtists.forEach(relatedArtist => {
          const relatedArtistItem = document.createElement('div');
          relatedArtistItem.classList.add('related-artist');
          relatedArtistItem.innerHTML = `
                <img src="${relatedArtist.images.length > 0 ? relatedArtist.images[0].url : 'placeholder-url'}" alt="Related Artist Image">
                <p>${relatedArtist.name}</p>
            `;

          // Add click event listener to each related artist item
          relatedArtistItem.addEventListener('click', () => {
            // Close the modal
            closeModal();

            // Fetch details for the clicked related artist
            fetch(`https://api.spotify.com/v1/artists/${relatedArtist.id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            })
              .then(response => response.json())
              .then(clickedArtist => {
                // Open a new modal with details of the clicked related artist
                openModal(clickedArtist);
              })
              .catch(error => console.error('Error fetching clicked artist details:', error));
          });

          modalRelatedArtists.appendChild(relatedArtistItem);
        });
      })
      .catch(error => console.error('Error fetching related artists:', error));

    modal.style.display = 'flex';
  }


  function closeModal() {
    const modal = document.getElementById('artistModal');
    modal.style.display = 'none';
  }

  // Close the modal if the user clicks outside of it
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('artistModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  return (
    <div>
      <div id="content">
        <h1>Spotify Artist Search</h1>
        <input type="text" id="searchInput" placeholder="Enter artist name..." onKeyUp={handleKeyUp} />
        <div id="result"></div>
      </div>

      <div id="artistModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <h2 id="modalArtistName"></h2>
          <img id="modalImage" alt="Artist Image" />
          <p id="modalListeners"></p>
          <h3>Top Songs on Spotify</h3>
          <div id="modalTopSongs"></div>
          <h3 style={{ marginTop: '20px' }}>Discography</h3>
          <div id="modalDiscography" className="discography-container"></div>
          <div id="modalIframeContainer"></div>
          <h3>Related Artists</h3>
          <div id="modalRelatedArtists" className="related-artists-container"></div>
        </div>
      </div>
    </div>
  );

};
export default ArtistSearch;