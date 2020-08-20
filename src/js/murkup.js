import debounce from 'lodash.debounce';
import { alert } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import fetchCountries from './fetchCountries';
import country from '../templates/country.hbs';
import countries from '../templates/countries.hbs';

const refs = {
  input: document.querySelector('#country'),
  list: document.querySelector('.js-countries'),
};

function searchHandler(e) {
  e.preventDefault();
  let searchQuery = e.target.value;
  if (searchQuery == 0) {
    refs.list.innerHTML = '';
    return;
  }
  murkup(searchQuery);
}

function murkup(searchQuery) {
  fetchCountries(searchQuery)
    .then(data => {
      refs.list.innerHTML = '';
      if (data.length === 1) {
        refs.list.insertAdjacentHTML('beforeend', country(data));
      }
      if (data.length > 1 && data.length <= 10) {
        refs.list.insertAdjacentHTML('beforeend', countries(data));
      }
      if (data.length > 10) {
        alert({
          text: 'Too many matches found. Please enter a more specific guery!',
          type: 'info',
          styling: 'brighttheme',
          icons: 'brighttheme',
          hide: true,
          delay: 5000,
        });
      }
    })
    .catch(error => console.error(error));
}

refs.input.addEventListener('input', debounce(searchHandler, 500));
