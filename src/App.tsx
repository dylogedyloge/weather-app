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
  }, [latitude, longitude]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-blue-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">
          Weather in {weatherData.name}
        </h1>
        <p className="text-lg">Temperature: {weatherData.main.temp}°C</p>
        <p className="text-lg">
          Condition: {weatherData.weather[0].description}
        </p>
      </div>
    </div>
  );
};

export default App;
