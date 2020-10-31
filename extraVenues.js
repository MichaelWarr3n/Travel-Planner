const moreVenuesDivArray = [
    document.getElementById('moreVenue1'),
    document.getElementById('moreVenue2'),
    document.getElementById('moreVenue3'),
    document.getElementById('moreVenue4'),
    document.getElementById('moreVenue5'),
    document.getElementById('moreVenue6'),
    document.getElementById('moreVenue7'),
    document.getElementById('moreVenue8'),
    document.getElementById('moreVenue9'),
    document.getElementById('moreVenue10')
]

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
<h2>Address</h2>`;
        x.location.formattedAddress.forEach(y => {
            htmlForm += `<p>${y}</p>`;
        })
        formattedVenues.push(htmlForm);
    });
    return formattedVenues;
}

const displayMoreVenues = venues => {
    let formattedVenues = renderVenues(venues);
    formattedVenues.forEach((vens, index) => {
        moreVenuesDivArray[index].innerHTML = vens;
    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    let data = JSON.parse(window.sessionStorage.getItem('venueArray'));
    displayMoreVenues(data);
})