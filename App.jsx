import { useState } from "react";

const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Drizzle: Light",
  53: "Drizzle: Moderate",
  55: "Drizzle: Dense",
  56: "Freezing Drizzle: Light",
  57: "Freezing Drizzle: Dense",
  61: "Rain: Slight",
  63: "Rain: Moderate",
  65: "Rain: Heavy",
  66: "Freezing Rain: Light",
  67: "Freezing Rain: Heavy",
  71: "Snow fall: Slight",
  73: "Snow fall: Moderate",
  75: "Snow fall: Heavy",
  77: "Snow grains",
  80: "Rain showers: Slight",
  81: "Rain showers: Moderate",
  82: "Rain showers: Violent",
  85: "Snow showers: Slight",
  86: "Snow showers: Heavy",
  95: "Thunderstorm: Slight or moderate",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

const getWeatherBackground = (code) => {
  if ([0, 1].includes(code)) return "#FFD700"; // Sunny yellow
  if ([2, 3].includes(code)) return "#B0C4DE"; // Light blue
  if ([45, 48].includes(code)) return "#D3D3D3"; // Gray
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "#87CEEB"; // Rainy sky blue
  if ([56, 57, 66, 67].includes(code)) return "#4682B4"; // Freezing rain dark blue
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "#ADD8E6"; // Snow light blue
  if ([95, 96, 99].includes(code)) return "#800080"; // Thunderstorm purple
  return "#FFFFFF"; // Default white
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoRes.json();
    if (!geoData.results) return alert("City not found!");
    const { latitude, longitude, name } = geoData.results[0];
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherRes.json();
    setWeather({
      name,
      temperature: weatherData.current_weather.temperature,
      windspeed: weatherData.current_weather.windspeed,
      code: weatherData.current_weather.weathercode,
    });
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: weather ? getWeatherBackground(weather.code) : "#f0f0f0",
        minHeight: "100vh",
        transition: "background-color 0.5s ease",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Weather Now 🌤️</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "1rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "200px",
          marginRight: "10px",
        }}
      />
      <button
        onClick={fetchWeather}
        style={{
          padding: "10px 15px",
          fontSize: "1rem",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#4CAF50",
          color: "white",
          cursor: "pointer",
        }}
      >
        Get Weather
      </button>

      {weather && (
        <div style={{ marginTop: "30px", fontSize: "1.2rem" }}>
          <p>
            <strong>{weather.name}</strong>
          </p>
          <p>🌡 Temperature: {weather.temperature}°C</p>
          <p>💨 Wind Speed: {weather.windspeed} km/h</p>
          <p>☁ Condition: {weatherCodes[weather.code]}</p>
        </div>
      )}
    </div>
  );
}

export default App;
