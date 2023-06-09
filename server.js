const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const https = require('https');
// const server = http.createServer(app);
const server = https.createServer({
    key: fs.readFileSync('weatherpro.top-ssl-bundle/private.key.pem'),
    cert: fs.readFileSync('weatherpro.top-ssl-bundle/domain.cert.pem')
}, app);

const PORT = 4000;

const globals = require('./globals.js');
const getWeatherData = require('./WeatherData/getWeatherData.js');
const getCity = require('./WeatherData/getCity.js');
// const getDailyWeather = require('./WeatherData/getDailyWeatherData.js');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.post('/', async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log(latitude, longitude);

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Missing latitude or longitude' });
    }

    globals.setGlobal('longitude', longitude);
    globals.setGlobal('latitude', latitude);

    const city = await getCity(latitude, longitude);
    const weatherData = await getWeatherData();
    // const weatherData = await getDailyWeather();

    res.json({
        city,
        weatherData
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});app.options('*', cors());
