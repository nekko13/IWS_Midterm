const API_KEY = "8b6ffea28bfb1989e70e18bdda255488";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchCurrentWeather = async (location) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${location}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      city: data.name,
      date: new Date().toISOString(),
      currentTemp: data.main.temp,
      feelsLike: data.main.feels_like,
      condition: data.weather[0].description,
      sunrise: formatTime(data.sys.sunrise * 1000),
      sunset: formatTime(data.sys.sunset * 1000),
      humidity: `${data.main.humidity}%`,
      pressure: `${data.main.pressure} hPa`,
      windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`,
      visibility: `${Math.round(data.visibility / 1000)} km`,
    };
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
};

export const fetchForecast = async (location) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${location}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }

    const data = await response.json();
    const dailyForecasts = [];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const processedDates = new Set();

    for (const item of data.list) {
      const forecastDate = new Date(item.dt * 1000);
      const forecastDay = forecastDate.toDateString();

      if (forecastDate < tomorrow) continue;

      if (processedDates.has(forecastDay)) continue;

      processedDates.add(forecastDay);

      dailyForecasts.push({
        day: forecastDate.toLocaleDateString("en-US", { weekday: "short" }),
        temp: item.main.temp,
        condition: item.weather[0].description,
        maxTemp: item.main.temp_max,
        minTemp: item.main.temp_min,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6),
      });

      if (dailyForecasts.length === 10) break;
    }

    while (dailyForecasts.length < 10) {
      const lastIndex = dailyForecasts.length - 1;
      const lastDate = new Date(tomorrow);
      lastDate.setDate(lastDate.getDate() + dailyForecasts.length);

      dailyForecasts.push({
        day: lastDate.toLocaleDateString("en-US", { weekday: "short" }),
        temp: lastIndex >= 0 ? dailyForecasts[lastIndex].temp : 0,
        condition: "no data",
        maxTemp: lastIndex >= 0 ? dailyForecasts[lastIndex].maxTemp : 0,
        minTemp: lastIndex >= 0 ? dailyForecasts[lastIndex].minTemp : 0,
        humidity: 0,
        windSpeed: 0,
      });
    }

    return dailyForecasts;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

export const fetchHourlyForecast = async (location) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${location}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Hourly forecast API error: ${response.status}`);
    }

    const data = await response.json();

    const hourlyForecasts = data.list.slice(0, 8).map((item) => {
      const forecastDate = new Date(item.dt * 1000);
      return {
        time: formatTime(forecastDate),
        temp: item.main.temp,
        condition: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6),
      };
    });

    return hourlyForecasts;
  } catch (error) {
    console.error("Error fetching hourly forecast:", error);
    throw error;
  }
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes} ${ampm}`;
};
