import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function filterCountries(countries) {
  if (countries.length > 2 && countries.length < 10) {
    renderCountriesList(countries);
  } else if (countries.length === 1) {
    renderCountriesInfo(countries);
  } else if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function renderCountriesList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li>
        <h2 class="post-title"><img src="${flags.svg}" alt="flag ${name}" width="30px"></img> ${name}</h2>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountriesInfo(countries) {
  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      const languagesArr = [];
      languages.map(language => {
        languagesArr.push(language.name);
      });
      const language = languagesArr.join(', ');

      return `
        <h2 class="post-title"><img src="${flags.svg}" alt="flag ${name}" width="30px"></img> ${name}</h2>
        <p><b>Capital</b>: ${capital}</p>
        <p><b>Population</b>: ${population}</p>
        <p><b>Languages</b>: ${language}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function onCountryInput() {
  const inputValue = countryInput.value.trim();
  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(countries => filterCountries(countries))
      .catch(() => Notify.failure('Oops, there is no country with that name'));
  }
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
