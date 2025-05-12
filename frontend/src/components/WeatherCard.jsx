import React from 'react';

function WeatherCard({ weather, forecast }) {
  if (!weather || forecast.length === 0) {
    return <div className="bg-white p-6 rounded shadow text-center">Loading weather...</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">🌤️ Weather in {weather.city}</h2>

      {/* Current Weather */}
      <div className="text-center mb-4">
        <p className="text-lg font-medium text-gray-700">Now</p>
        <p className="text-gray-800 text-xl">{weather.temp}°C</p>
        <p className="text-gray-600">{weather.humidity}% humidity</p>
        <p className="italic text-gray-500 capitalize">{weather.description}</p>
      </div>

      {/* 5-Day Forecast */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-green-600 mb-2">Next 5 Days</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-sm">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="bg-green-50 border border-green-200 p-3 rounded shadow-sm hover:shadow-md"
            >
              <p className="font-semibold">{new Date(day.date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}</p>
              <p className="text-green-700 font-bold">{day.temp}°C</p>
              <p className="text-gray-600">{day.humidity}% humidity</p>
              <p className="italic text-gray-500 capitalize">{day.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
