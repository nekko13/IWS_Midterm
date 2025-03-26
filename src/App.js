import React, { useState, useEffect } from "react";
import "./App.css";
import WeatherDisplay from "./Component/WeatherDisplay";
import SearchBar from "./Component/SearchBar";
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchHourlyForecast,
} from "./Component/WeatherService";

function App() {
  const [location, setLocation] = useState("Hanoi");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadWeatherData = async (searchLocation) => {
    try {
      setLoading(true);
      setError(null);
      const currentWeatherData = await fetchCurrentWeather(searchLocation);
      const forecastData = await fetchForecast(searchLocation);
      const hourlyData = await fetchHourlyForecast(searchLocation);
      setWeatherData({
        ...currentWeatherData,
        forecast: forecastData,
        hourlyForecast: hourlyData,
      });
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error("Weather data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(location);
  }, [location]);

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() !== "") {
      setLocation(searchTerm);
    }
  };

  return (
    <div className="weather-app">
      <h1>Weather Forecast</h1>

      <SearchBar onSearch={handleSearch} initialValue={location} />

      {loading && <div className="status-message">Loading weather data...</div>}
      {error && <div className="status-message error">{error}</div>}

      {!loading && !error && weatherData && (
        <WeatherDisplay weatherData={weatherData} />
      )}
    </div>
  );
}

export default App;
