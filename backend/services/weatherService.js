const axios = require('axios');

const fetchWeatherData = async (location = 'Dhaka') => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const { data } = await axios.get(url);
    return {
      location: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      precipitation: data.rain?.['1h'] || 0,
      windSpeed: data.wind.speed,
      timestamp: new Date()
    };
  } catch (err) {
    console.error('Weather fetch error:', err.message);
    return null;
  }
};

module.exports = { fetchWeatherData };
