import React, { useState } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";

// Weather backgrounds based on main weather condition
const weatherVideos = {
  Clear: "/public/clear.mp4",
  Clouds: "/public/Clouds.mp4",
  Rain: "/public/Rain.mp4",
  Drizzle: "/public/Drizzle.mp4",
  Thunderstorm: "/public/Thunderstorm.mp4",
  Snow: "/public/Snow.mp4",
  Mist: "/public/Mist.mp4",
  Smoke: "/public/Smoke.mp4",
  Haze: "/public/bg-clear.jpg", 
  Dust: "/public/bg-clear.jpg",
  Fog: "/bg-clear.jpg",
  Sand: "/bg-clear.jpg",
  Ash: "/bg-clear.jpg",
  Squall: "/bg-clear.jpg",
  Tornado: "/bg-clear.jpg",
  Default: "/public/clear.mp4",
};

// Packing tips based on weather
const travelTips = {
  Clear: "Sunglasses recommended! Don't forget sunscreen.",
  Clouds: "A light jacket might be handy.",
  Rain: "Take an umbrella and waterproof shoes.",
  Drizzle: "Carry a light raincoat or umbrella.",
  Thunderstorm: "Stay indoors if possible. Avoid open areas.",
  Snow: "Wear warm clothes and boots.",
  Mist: "Drive carefully and wear visible clothing.",
  Smoke: "Consider a mask if air quality is poor.",
  Haze: "Wear sunglasses and stay hydrated.",
  Dust: "Protect your eyes and mouth.",
  Fog: "Drive slowly and use fog lights.",
  Sand: "Protect your eyes and mouth.",
  Ash: "Stay indoors and keep windows closed.",
  Squall: "Be cautious of strong winds.",
  Tornado: "Seek shelter immediately.",
  Default: "Have a great trip!",
};

// Weather icon animation
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95);}
  to { opacity: 1; transform: scale(1);}
`;

// Permanent floating animation for WeatherIcon
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0); }
`;

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  /* Remove: background: ${({ bg }) => bg}; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: background 0.8s cubic-bezier(0.4,0,0.2,1);
  font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  padding: 0;
`;

const Title = styled.h1`
  margin-top: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: #222;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(255,255,255,0.2);
`;

const SearchBar = styled.form`
  margin: 2rem 0 1.5rem 0;
  display: flex;
  width: 90vw;
  max-width: 400px;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 2rem 0 0 2rem;
  font-size: 1.1rem;
  outline: none;
  background: rgba(255,255,255,0.8);
  color: #333;
`;

const Button = styled.button`
  padding: 0 1.5rem;
  border: none;
  border-radius: 0 2rem 2rem 0;
  background: #f8b500;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #fceabb;
    color: #f8b500;
  }
`;

const WeatherCard = styled.div`
  background: rgba(255,255,255,0.85);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31,38,135,0.15);
  padding: 2rem 2.5rem;
  min-width: 300px;
  max-width: 90vw;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.7s cubic-bezier(0.4,0,0.2,1);
  transition: box-shadow 0.3s;
`;

const WeatherIcon = styled.img`
  width: 90px;
  height: 90px;
  margin-bottom: 0.5rem;
  animation: ${fadeIn} 0.8s cubic-bezier(0.4,0,0.2,1),
  ${float} 2.5s ease-in-out infinite;
`;

const WeatherInfo = styled.div`
  font-size: 1.2rem;
  color: #222;
  margin: 0.5rem 0;
  text-align: center;
`;

const Temp = styled.div`
  font-size: 2.8rem;
  font-weight: 700;
  color: #f8b500;
  margin-bottom: 0.2rem;
`;

const Condition = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Tips = styled.div`
  margin-top: 1.2rem;
  font-size: 1.1rem;
  color: #304352;
  background: rgba(248,181,0,0.08);
  border-radius: 1rem;
  padding: 0.7rem 1.2rem;
  text-align: center;
  animation: ${fadeIn} 1.2s cubic-bezier(0.4,0,0.2,1);
`;

const ErrorMsg = styled.div`
  color: #e74c3c;
  background: rgba(255,255,255,0.7);
  border-radius: 1rem;
  padding: 0.7rem 1.2rem;
  margin-top: 1rem;
  font-size: 1.1rem;
  text-align: center;
`;

const Footer = styled.footer`
  margin-top: auto;
  padding: 1.5rem 0 0.7rem 0;
  font-size: 1rem;
  color: #888;
  text-align: center;
  opacity: 0.7;
`;

// Main App Component
const API_KEY = "34029740e3a93e4242fe798d577849ce"; // <-- OpenWeatherMap API key

function getTip(weatherMain) {
  return travelTips[weatherMain] || travelTips["Default"];
}

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
    } catch (err) {
      setError(
        err.response && err.response.status === 404
          ? "City not found. Please try another city."
          : "Failed to fetch weather. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  // Determine background based on weather
  const bgVideo =
  weather && weather.weather && weather.weather[0]
    ? weatherVideos[weather.weather[0].main] || weatherVideos["Default"]
    : weatherVideos["Default"];

  return (
    <AppContainer>
      <video
      autoPlay
      loop
      muted
      playsInline
      key={bgVideo}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        zIndex: -1,
        pointerEvents: "none",
        background: "#000"
      }}
    >
      <source src={bgVideo} type="video/mp4" />
    </video>
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(8px)",
        background: "rgba(255,255,255,0.08)"
      }}
    />
      <Title>Travel Weather Buddy</Title>
      <SearchBar onSubmit={handleSubmit} autoComplete="off">
        <Input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="City name"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </Button>
      </SearchBar>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {weather && weather.weather && weather.weather[0] && (
        <WeatherCard>
          <WeatherIcon
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt={weather.weather[0].description}
            style={{
              filter:
                weather.weather[0].main === "Clear"
                  ? "drop-shadow(0 0 16px #f8b50088)"
                  : "drop-shadow(0 0 12px #30435288)",
            }}
          />
          <Temp>
            {Math.round(weather.main.temp)}°C
          </Temp>
          <Condition>
            {weather.weather[0].main}{" "}
            <span style={{ fontWeight: 400, color: "#666" }}>
              ({weather.weather[0].description})
            </span>
          </Condition>
          <WeatherInfo>
            <span role="img" aria-label="humidity">💧</span> Humidity:{" "}
            <b>{weather.main.humidity}%</b>
          </WeatherInfo>
          <WeatherInfo>
            <span role="img" aria-label="wind">💨</span> Wind:{" "}
            <b>{Math.round(weather.wind.speed)} m/s</b>
          </WeatherInfo>
          <Tips>
            {getTip(weather.weather[0].main)}
          </Tips>
        </WeatherCard>
      )}
      <Footer>
        &copy; {new Date().getFullYear()} Travel Weather Buddy &mdash; Powered by OpenWeatherMap
      </Footer>
    </AppContainer>
  );
};

export default App;

