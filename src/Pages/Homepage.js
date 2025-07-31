import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";

// Weather backgrounds based on main weather condition
const weatherVideos = {
    Clear: "/Clear.mp4",
    Clouds: "/Clouds.mp4",
    Rain: "/Rain.mp4",
    Drizzle: "/Drizzle.mp4",
    Thunderstorm: "/Thunderstorm.mp4",
    Snow: "/Snow.mp4",
    Mist: "/Mist.mp4",
    Smoke: "/Smoke.mp4",
    Haze: "/Clear.mp4",
    Dust: "Dust.mp4",
    Fog: "/Fog.mp4",
    Sand: "/Sand.mp4",
    Ash: "/Clear.mp4",
    Squall: "/Clear.mp4",
    Tornado: "/Tornado.mp4",
    Default: "/Clear.mp4",
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
  position: relative;
  font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
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
  padding: 12px 20px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.18); // Match MainCard
  box-shadow: 0 8px 32px rgba(102,166,255,0.15); // Match MainCard
  backdrop-filter: blur(18px) saturate(180%); // Match MainCard
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border: 1.5px solid rgba(255,255,255,0.28); // Match MainCard
  color: #222;
  font-size: 16px;
  outline: none;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 2rem 0 0 2rem;
  font-size: 1.1rem;
  outline: none;
  background: transparent;
  color: #333;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    opacity: 1;
  }
`;

const Button = styled.button`
  padding: 0 1.5rem;
  border: none;
  border-radius: 0 2rem 2rem 0;
  background: transparent;
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

const ProfileCard = styled.div`
  background: rgba(255,255,255,0.92);
  border-radius: 1.2rem;
  box-shadow: 0 4px 16px 0 rgba(31,38,135,0.10);
  padding: 1.2rem 2rem;
  min-width: 260px;
  max-width: 90vw;
  margin: 2rem 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  animation: ${fadeIn} 0.7s cubic-bezier(0.4,0,0.2,1);
`;

const Avatar = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #66a6ff 0%, #89f7fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #fff;
  font-weight: bold;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProfileAvatar = styled.div`
  position: fixed;
  top: 24px;
  right: 32px;
  z-index: 20;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #66a6ff 0%, #89f7fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  color: #fff;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(102,166,255,0.18);
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(102,166,255,0.28);
  }
`;

const ProfilePopup = styled.div`
  position: fixed;
  top: 24px;
  right: 32px;
  z-index: 30;
  background: rgba(255,255,255,0.97);
  border-radius: 1.2rem;
  box-shadow: 0 4px 16px 0 rgba(31,38,135,0.13);
  padding: 1.2rem 2rem;
  min-width: 260px;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  animation: ${fadeIn} 0.3s cubic-bezier(0.4,0,0.2,1);
`;

const AvatarLarge = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #66a6ff 0%, #89f7fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #fff;
  font-weight: bold;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
  &:hover {
    color: #222;
  }
`;

const MainCard = styled.div`
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(102,166,255,0.15);
  width: 100%;
  max-width: ${({ expanded }) => (expanded ? "650px" : "420px")};
  min-width: 320px;
  min-height: ${({ expanded }) => (expanded ? "520px" : "340px")};
  padding: ${({ expanded }) => (expanded ? "3rem 3rem 2.5rem 3rem" : "2.5rem 2.5rem 2rem 2.5rem")};
  text-align: center;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition:
    max-width 0.5s cubic-bezier(0.4,0,0.2,1),
    min-height 0.5s cubic-bezier(0.4,0,0.2,1),
    padding 0.5s cubic-bezier(0.4,0,0.2,1),
    box-shadow 0.3s;
  animation: ${fadeIn} 0.7s cubic-bezier(0.4,0,0.2,1);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border: 1.5px solid rgba(255,255,255,0.28);
`;

// Main App Component
const API_KEY = "34029740e3a93e4242fe798d577849ce"; // <-- OpenWeatherMap API key


const GEMINI_API_KEY = "AIzaSyDrr5c91H_95CtQ4XukUiJFWGb9SluCCBE";  // <-- Gemini API key

// Add this function to call Gemini API
async function getGeminiTip(weatherMain, city) {
    const prompt = `Give a short, friendly travel tip for a traveler in ${city} experiencing ${weatherMain} weather.`;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        console.log("Gemini API response:", data); // <-- See the actual response

        // Try to extract the tip from different possible locations
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }
        if (data?.candidates?.[0]?.content?.text) {
            return data.candidates[0].content.text;
        }
        if (data?.candidates?.[0]?.output) {
            return data.candidates[0].output;
        }
        return "Could not fetch travel tip.";
    } catch (err) {
        console.error("Gemini API error:", err);
        return "Could not fetch travel tip.";
    }
}


const Homepage = () => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [aiTip, setAiTip] = useState(""); // <-- new state for AI tip

    useEffect(() => {
        // Instead of localStorage, fetch user from backend
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/profile", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => setUser(data));
        }
    }, []);

    const fetchWeather = async (cityName) => {
        setLoading(true);
        setError("");
        setWeather(null);
        setAiTip(""); // reset tip
        try {
            const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
                    cityName
                )}&appid=${API_KEY}&units=metric`
            );
            setWeather(res.data);

            // Fetch AI tip after weather is loaded
            const weatherMain = res.data.weather[0].main;
            const tip = await getGeminiTip(weatherMain, cityName);
            setAiTip(tip);
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

    // Card expands when weather is shown
    const cardExpanded = Boolean(weather && weather.weather && weather.weather[0]);

    return (

        <>
            <AppContainer>
                {user && !showProfile && (
                    <ProfileAvatar
                        title={user.name || "User"}
                        onClick={() => setShowProfile(true)}
                    >
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </ProfileAvatar>
                )}
                {user && showProfile && (
                    <ProfilePopup>
                        <AvatarLarge>
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </AvatarLarge>
                        <ProfileInfo>
                            <div style={{ fontWeight: 600, fontSize: "1.1rem", color: "#304352" }}>
                                {user.name}
                            </div>
                            <div style={{ color: "#666", fontSize: "0.98rem" }}>
                                {user.email}
                            </div>
                        </ProfileInfo>
                        <CloseBtn onClick={() => setShowProfile(false)} title="Close">&times;</CloseBtn>
                    </ProfilePopup>
                )}
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
                <MainCard expanded={cardExpanded}>
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
                                {loading && !aiTip
                                    ? "Fetching travel tip..."
                                    : aiTip}
                            </Tips>
                        </WeatherCard>
                    )}
                </MainCard>
            </AppContainer>

            <Footer>
                &copy; {new Date().getFullYear()} Travel Weather Buddy &mdash; Powered by OpenWeatherMap
            </Footer>
        </>
    );
};

export default Homepage;

