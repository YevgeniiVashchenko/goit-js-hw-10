import './css/styles.css';
import API from './fetchCountries';
import getRefs from './get-refs';
import countryCardTpl from './templates/country-card.hbs';
import countriesCardsTpl from './templates/countries-cards.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = getRefs();

refs.searchCountry.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function clearSearchResult() {
  refs.countriesCards.innerHTML = '';
  refs.countryCard.innerHTML = '';
}

function onSearch(e) {
  e.preventDefault();
  const searchQuery = e.target.value.trim();
  clearSearchResult();
  if (searchQuery === '') {
    return;
  }

  API.fetchCountries(searchQuery)
    .then(renderCountryCard)
    .catch(error => {
      console.log(error);
    });
}

function renderCountryCard(country) {
  if (country.status === 404) {
    return Notify.failure(`"Oops, there is no country with that name"`);
  } else if (country.length === 1) {
    country.map(({ name, flags, capital, population, languages }) => {
      refs.countriesCards.innerHTML = '';
      refs.countryCard.insertAdjacentHTML(
        'beforeend',
        countryCardTpl({ name, flags, capital, population, languages }),
      );
    });
  } else if (country.length <= 10) {
    country.map(({ name, flags, capital, population, languages }) => {
      refs.countryCard.innerHTML = '';
      refs.countriesCards.insertAdjacentHTML(
        'beforeend',
        countriesCardsTpl({ name, flags, capital, population, languages }),
      );
    });
  } else if (country.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}
