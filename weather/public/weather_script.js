let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 8,
    });
}
document.getElementById('getWeatherBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    const country = document.getElementById('countryInput').value;
    const response = await fetch(`/api/weather?city=${city}&country=${country}`);
    const data = await response.json();
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`;

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
        <img src="${iconUrl}" alt="weather icon">
        <h3>Air Quality</h3>
        <p>Air Quality: ${data.air_quality}</p>
        <h3>Country</h3>
        <img src="${data.flag}" alt="flag icon">
        <br>
    `;

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
