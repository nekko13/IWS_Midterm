import React, { useState, useRef } from "react";

function WeatherDisplay({ weatherData }) {
  const [forecastType, setForecastType] = useState("daily"); // daily or hourly
  const [tempUnit, setTempUnit] = useState("celsius"); // celsius or fahrenheit
  const sliderRef = useRef(null);

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes("sun") || conditionLower.includes("clear")) {
      return "☀️";
    } else if (conditionLower.includes("partly cloudy")) {
      return "⛅";
    } else if (conditionLower.includes("cloud")) {
      return "☁️";
    } else if (
      conditionLower.includes("rain") ||
      conditionLower.includes("shower")
    ) {
      return "🌧️";
    } else if (conditionLower.includes("snow")) {
      return "❄️";
    } else if (
      conditionLower.includes("thunder") ||
      conditionLower.includes("storm")
    ) {
      return "⛈️";
    } else if (
      conditionLower.includes("drizzle") ||
      conditionLower.includes("light rain")
    ) {
      return "🌦️";
    } else if (
      conditionLower.includes("fog") ||
      conditionLower.includes("mist")
    ) {
      return "🌫️";
    } else {
      return "⛅";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  const getTemperature = (celsius) => {
    const tempC = Math.round(celsius);
    const tempF = Math.round(celsiusToFahrenheit(celsius));
    
    if (tempUnit === "celsius") {
      return tempC;
    } else {
      return tempF;
    }
  };

  return (
    <div className="wbox">
      <div className="locbar">
        <div className="mycity">
          <span className="pinicon">📍</span>
          <span className="citytext">{weatherData.city}</span>
        </div>
        <div className="mydate">{formatDate(weatherData.date)}</div>
      </div>

      <div className="nowcard">
        <div className="tempbox">
          <div className="maintemp">
            {getTemperature(weatherData.currentTemp)}°
            <div className="temp-unit">
              <span 
                className={`temp-celsius ${tempUnit === "celsius" ? "active" : ""}`}
                onClick={() => setTempUnit("celsius")}
              >
                °C
              </span>
              <span className="temp-unit-divider">|</span>
              <span 
                className={`temp-fahrenheit ${tempUnit === "fahrenheit" ? "active" : ""}`}
                onClick={() => setTempUnit("fahrenheit")}
              >
                °F
              </span>
            </div>
          </div>
          <div className="feelsval">
            Feels like {getTemperature(weatherData.feelsLike)}°
          </div>
        </div>

        <div className="mainicon">{getWeatherIcon(weatherData.condition)}</div>

        <div className="extrainfo">
          <div className="inforow">
            <span className="infoico">🌅</span>
            <span>{weatherData.sunrise}</span>
          </div>
          <div className="inforow">
            <span className="infoico">🌇</span>
            <span> {weatherData.sunset}</span>
          </div>
          <div className="inforow">
            <span className="infoico">💧</span>
            <span>{weatherData.humidity}</span>
          </div>
          <div className="inforow">
            <span className="infoico">🔼</span>
            <span>{weatherData.pressure}</span>
          </div>
          <div className="inforow">
            <span className="infoico">💨</span>
            <span>{weatherData.windSpeed}</span>
          </div>
          <div className="inforow">
            <span className="infoico">👁️</span>
            <span>{weatherData.visibility}</span>
          </div>
        </div>
      </div>

      <div className="condtext">{weatherData.condition}</div>

      <div className="btns">
        <button
          className={`mybtn ${forecastType === "daily" ? "on" : ""}`}
          onClick={() => setForecastType("daily")}
        >
          Daily Forecast
        </button>
        <button
          className={`mybtn ${forecastType === "hourly" ? "on" : ""}`}
          onClick={() => setForecastType("hourly")}
        >
          Hourly Forecast
        </button>
      </div>

      {forecastType === "daily" ? (
        <div className="future" ref={sliderRef}>
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="daybox">
              <div className="dayico">{getWeatherIcon(day.condition)}</div>
              <div className="daytemp">{getTemperature(day.temp)}°</div>
              <div className="dayname">{day.day}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="byhour">
          {weatherData.hourlyForecast.map((hour, index) => (
            <div key={index} className="hourbox">
              <div className="hourtime">{hour.time}</div>
              <div className="hourico">{getWeatherIcon(hour.condition)}</div>
              <div className="hourtemp">{getTemperature(hour.temp)}°</div>
              <div className="hourstats">
                <div className="statrow">
                  <span className="staticon">💧</span>
                  <span>{hour.humidity}%</span>
                </div>
                <div className="statrow">
                  <span className="staticon">💨</span>
                  <span>{hour.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherDisplay;
