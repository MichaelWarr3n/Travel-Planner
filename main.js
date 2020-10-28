const searchButton = document.getElementById('searchButton');
const weatherDiv = document.getElementById('Weather');
const venueDivArray = [
    document.getElementById('Venue1'),
    document.getElementById('Venue2'),
    document.getElementById('Venue3')
];
const venueDivContainer = document.getElementById('venueContainer');
const covidDiv = document.getElementById('Covid');
let covidCountry = '';
let covidCountryLC = '';


/*--- Weather API ---*/

const openWeatherKey = 'f72d9611fcced5a7d6f0d0b552e4e5b3';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';


const getWeather = async () => {
    const city = document.getElementById('city').value;
    const urlToFetch = weatherUrl + '?q=' + city + '&appid=' + openWeatherKey
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            throw new Error('Request Failed!');
        }
    } catch (error) {
        console.log(error);
    }
}

const kelvinToCelsius = kelv => {
    return kelv - 273.15;
}

const convertUnixTo24Hr = unix => {
    let seconds = unix % 86400;
    let time = new Date(seconds * 1000).toISOString().substr(11, 8);
    return time;
}

const dateToday = () => {
    let d = new Date();
    d = String(d);
    d = d.substr(0, 15);
    return d;
}

const dateTodayISO = () => {
    let d = new Date();
    d = d.toISOString();
    d = d.substr(0, 10);
    return d;
}

const lastWeekISO = () => {
    let d = new Date();
    d.setDate(d.getDate() - 7);
    d = d.toISOString();
    d = d.substr(0, 10);
    return d;
}

const renderWeather = weather => {
    const htmlForm = `<h1>${weather.name}, ${weather.sys.country}</h1>
<h2>${dateToday()}</h2>
<h2>Temperature: ${Math.round(kelvinToCelsius(weather.main.temp))}&deg;C</h2>
<h2>Condition: ${weather.weather[0].description}</h2>
<h2>Sunrise: ${convertUnixTo24Hr(weather.sys.sunrise + weather.timezone)}</h2>
<h2>Sunset: ${convertUnixTo24Hr(weather.sys.sunset + weather.timezone)}</h2>
<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">`;
    return htmlForm;
}

const displayWeather = weather => {
    let formattedWeather = renderWeather(weather);
    weatherDiv.style.display = 'block';
    weatherDiv.innerHTML = formattedWeather;
}

/*--- Venues API ---*/

const clientId = 'C2BNJQAEV5MB3FG4JT1JFXH45Z3ISK1BQ50GLAVTJ5IFOIGC';
const clientSecret = 'AVBAW1EIH3HVGFYGBPGYBNMR0SEQB4LEL3KAE5JH5GVNLYUU';
const url = 'https://api.foursquare.com/v2/venues/explore';
const parameter1 = '?near=';

const getVenues = async () => {
    const city = document.getElementById('city').value;
    const urlToFetch = url + parameter1 + city + '&limit=3&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20201020';
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const venues = jsonResponse.response.groups[0].items.map(x => x.venue);
            return venues;
        } else {
            throw new Error('Request Failed!');
        }
    } catch (error) {
        console.log(error);
    }
}

const renderVenues = venues => {
    let formattedVenues = [];
    covidCountry = venues[0].location.country
    covidCountryLC = covidCountry.replace(/\s+/g, '-').toLowerCase();
    venues.forEach(x => {
        let venueImgSrc = x.categories[0].icon.prefix + 'bg_64' + x.categories[0].icon.suffix;
        let venueLocType = x.categories[0].name;
        let htmlForm = `<h1>${x.name}</h1>
<p>${venueLocType}</p>
<img src="${venueImgSrc}">
<h2>Address:</h2>
<p>${x.location.address}</p>
<p>${x.location.city}</p>
<p>${x.location.country}</p>`;
        formattedVenues.push(htmlForm);
    });
    return formattedVenues;
}

const displayVenues = venues => {
    let formattedVenues = renderVenues(venues);
    venueDivContainer.style.display = 'flex';
    formattedVenues.forEach((vens, index) => {
        venueDivArray[index].innerHTML = vens;
    });
}

/*--- Covid API ---*/

const getCovid = async () => {
    const city = document.getElementById('city').value;
    const urlToFetch = 'https://api.covid19api.com/total/country/' + covidCountryLC + '/status/confirmed?from=' + lastWeekISO() + 'T00:00:00Z&to=' + dateTodayISO() + 'T00:00:00Z';
    try {
        const response = await fetch(urlToFetch, {
            method: 'GET',
            redirect: 'follow'
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            return jsonResponse;
        } else {
            throw new Error('Request Failed!');
        }
    } catch (error) {
        console.log(error);
    }
}

const sevenDayAverage = (dayOne, daySeven) => {
    return Math.round((daySeven - dayOne)/7);
}

const renderCovid = covid => {
    const htmlFormat = `<h1>New cases daily average in ${covidCountry}:</h1>
<h1>${sevenDayAverage(covid[0].Cases, covid[6].Cases)}</h1>
<p>(based off the last 7 days)</p>`;
    return htmlFormat;
}

const displayCovid = cases => {
    let formattedCases = renderCovid(cases);
    covidDiv.style.display = 'block';
    covidDiv.innerHTML = formattedCases;
}

/*-- Execute Search --*/

const executeSearch = () => {
    getWeather().then(weather => displayWeather(weather));
    getVenues().then(venues => displayVenues(venues)).then(() => getCovid()).then(covid => displayCovid(covid));
}


searchButton.addEventListener('click', executeSearch);
