import React, { useState, useEffect } from "react";
import axios from "axios";

interface WeatherData {
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
  }>;
  name: string;
}

const API_KEY = "25d5440f4658eeb3b677f8770eaf4392";

interface AppProps {
  latitude?: number;
  longitude?: number;
}

const App: React.FC<AppProps> = ({ latitude, longitude }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Use default coordinates if not provided (e.g., New York City)
        const lat = latitude ?? 40.7128;
        const lon = longitude ?? -74.006;

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        setWeatherData(response.data);
        console.log(weatherData);

        // Send weather data to parent window if it exists
        if (window.parent !== window) {
          window.parent.postMessage(
            {
              type: "WEATHER_UPDATE",
              temperature: response.data.main.temp,
              condition: response.data.weather[0].description,
            },
            "*"
          );
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to fetch weather data. Please try again later.");
      }
    };

    fetchWeatherData();
  }, [latitude, longitude, weatherData]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!weatherData) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4"></div>
          <p className="text-xl font-semibold animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen flex items-center justify-center p-4">
      <div className="bg-whit rounded-xl shadow-lg p-6 max-w-sm w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {weatherData.name}
        </h1>
        <p className="text-5xl font-semibold text-gray-700 mb-4">
          {Math.round(weatherData.main.temp)}°C
        </p>
        <p className="text-xl text-gray-600 capitalize">
          {weatherData.weather[0].description}
        </p>
        <div className="mt-6 text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default App;
