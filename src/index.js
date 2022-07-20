import './css/styles.css';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener('input', onCountryInput);
// countryInput.addEventListener('input', debounce(consoleLog, DEBOUNCE_DELAY));

// function consoleLog() {
//   return console.log('hahah');
// }
function fetchCountries(name) {
  return fetch(`https://restcountries.com/v2/name/${name}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
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

function restMarkup() {
  countryInfo.innerHTML = '';
}

function onCountryInput(e) {
  const inputValue = e.currentTarget.value;
  if (inputValue === '') {
    restMarkup();
  }
  fetchCountries(inputValue)
    // .then(countries => renderCountriesList(countries))
    // потым ifom якщо ксть букв недостатня для пошуку тоды виводимо список коли стаэ достаттня - ынфу
    .then(countries => renderCountriesInfo(countries))
    .catch(error => console.log(error));
}
