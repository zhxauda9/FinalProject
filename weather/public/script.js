let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 8,
    });
}
document.getElementById('getWeatherBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    const response = await fetch(`/api/weather?city=${city}`);
    const data = await response.json();

    document.getElementById('weatherResult').innerHTML = `
        <h2>Weather in ${city}</h2>
        <p>Temperature: ${data.weather.temperature}°C</p>
        <p>Feels Like: ${data.weather.feels_like}°C</p>
        <p>Description: ${data.weather.description}</p>
        <p>Humidity: ${data.weather.humidity}%</p>
        <p>Pressure: ${data.weather.pressure} hPa</p>
        <p>Wind Speed: ${data.weather.wind_speed} m/s</p>
        <p>Country Code: ${data.weather.country_code}</p>
        <p>Coordinates: (${data.weather.coordinates.lat}, ${data.weather.coordinates.lon})</p>
        <p>Rain Volume (last 3 hours): ${data.weather.rain_volume} mm</p>
        <h3>News:</h3>
            <ul>
                ${data.news.map(article => `
                    <li>
                        ${article.urlToImage ? `<img src="${article.urlToImage}" alt="news image">` : ''}
                        <a href="${article.url}" target="_blank">${article.title}</a>
                    </li>
                `).join('')}
            </ul>
            <p>Currency 1 USD to KZT: ${data.currency.USD_to_KZT}</p>
    `;
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`;
    document.getElementById('weatherResult').innerHTML += `<img src="${iconUrl}" alt="weather icon">`;

    const temp = data.weather.temperature;
    if (temp < 0) {
        document.body.style.backgroundImage = 'url(cold-weather.jpg)';
    } else if (temp > 0) {
        document.body.style.backgroundImage = 'url("hot-weather.jpeg")';
    }
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    const { lat, lon } = data.weather.coordinates;
    const cityLocation = { lat: lat, lng: lon };
    map.setCenter(cityLocation);
    new google.maps.Marker({
        position: cityLocation,
        map: map,
        title: city,
    });
});
