import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import path, {dirname} from "path";
import {fileURLToPath} from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const AIR_API_KEY = process.env.AIR_API_KEY;

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','weather.html'));
});

router.get('/weather', async (req, res) => {
    const { city } = req.query;
    const { country } = req.query;

    try {
        const [weatherResponse] = await Promise.all([
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`),
        ]);

        const weatherData = weatherResponse.data;

        let airQuality = 'No data';
        try {
            const airResponse = await axios.get(
                `https://api.waqi.info/feed/${city}/?token=${AIR_API_KEY}`
            );
            const airData = airResponse.data;
            if (airData.status === "ok" && airData.data?.aqi !== undefined) {
                airQuality = airData.data.aqi;
            } else {
                console.error('Invalid API response:', airData);
            }
        } catch (err) {
            console.error('Error fetching air quality data:', err);
        }

        let flagUrl = null;
        if (country) {
            flagUrl = await getFlag(country);
        }

        res.json({
            weather: {
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                icon: weatherData.weather[0].icon,
                coordinates: { lat: weatherData.coord.lat, lon: weatherData.coord.lon },
                feels_like: weatherData.main.feels_like,
                humidity: weatherData.main.humidity,
                pressure: weatherData.main.pressure,
                wind_speed: weatherData.wind.speed,
                country_code: weatherData.sys.country,
                rain_volume: weatherData.rain ? weatherData.rain['3h'] : 0,
            },
            air_quality: airQuality,
            flag: flagUrl,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

async function getFlag(country) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    const data = await response.json();
    let flagUrl = data[0].flags.png;
    return flagUrl
}

export default router;