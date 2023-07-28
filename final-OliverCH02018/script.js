const apiKey = 'ZfF4a3UwBsUpXpHZsM04UtS0xAXSBqKcBX6trn4w';
const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
const container = document.querySelector('.container');
const form = document.querySelector('form');
const dateInput = document.getElementById('date-input');
const submitBtn = document.getElementById('submit-btn');
const apodContainer = document.getElementById('apod-container');
const favoritesContainer = document.getElementById('favorites-container');
const favoritesList = document.getElementById('favorites-list');

let favorites = [];

if (localStorage.getItem('favorites')) {
  favorites = JSON.parse(localStorage.getItem('favorites'));
  renderFavorites();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const date = dateInput.value;

  try {
    const response = await fetch(`${apodUrl}&date=${date}`);
    const data = await response.json();
    apodContainer.innerHTML = `
      <h2>${data.title}</h2>
      <p>Date: ${data.date}</p>
      <p>${data.explanation}</p>
      <img src="${data.url}" alt="${data.title}">
      <button id="add-to-favorites-btn">Add to favorites</button>
    `;

    const img = apodContainer.querySelector('img');
    const hdUrl = data.hdurl || data.url;

    img.addEventListener('click', () => {
      window.open(hdUrl, data.title);
    });

    const addToFavoritesBtn = apodContainer.querySelector('#add-to-favorites-btn');
    addToFavoritesBtn.addEventListener('click', () => {
      const apodData = {
        date,
        title: data.title,
        url: data.url,
        hdurl: data.hdurl
      };
      favorites.push(apodData);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      renderFavorites();
    });
  } catch (error) {
    console.error('Error fetching APOD data:', error);
    apodContainer.innerHTML = '<p>Error retrieving Astronomy Picture of the Day data</p>';
  }
});

favoritesContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-favorite-btn')) {
    const index = event.target.getAttribute('data-index');
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
  }
});

function renderFavorites() {
  favoritesList.innerHTML = '';

  favorites.forEach((favorite, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${favorite.title}</h3>
      <p>Date: ${favorite.date}</p>
      <img src="${favorite.url}" alt="${favorite.title}">
      <button class="remove-favorite-btn" data-index="${index}">Remove from Favorites</button>
    `;
    favoritesList.appendChild(li);
  });
}







