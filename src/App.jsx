import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(""); 
  const [bgImage, setBgImage] = useState("");

  const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const IMAGE_KEY = import.meta.env.VITE_IMAGE_API_KEY;

  const getWeather = async () => {
    if (!city) return;
    setError("");
    fetchCityImage(city);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "City not found");
      }

      setWeather(data);
    } 
    
    catch (err) {
      setError(err.message);
      setWeather(null);
      setBgImage(null)
    }
  };

  const fetchCityImage = async (city) => {
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${city}&client_id=${IMAGE_KEY}`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      setBgImage(data.results[0].urls.regular);
    }
  } 
  
  catch (error) {
    console.error("Image Error:", error);
  }
};
  return (
    <div className="container" style={{backgroundImage: `url(${bgImage})`}}>
    <center><u><h1 id="h1">Welcome To My Website</h1></u></center>
    <div className="app">
    <div className="weather-container">
        <u><h1>Weather App</h1></u>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={getWeather}>Search</button>
        </div>


        {error && <p className="error-message" style={{color: "red"}}>oops! {error} <br/>Check your internet</p>}

        {weather && weather.main && (
          <div className="weather-info">
            <h2>{weather.name}</h2>
            <h3>{Math.round(weather.main.temp)}°C</h3>
            <p>{weather.weather[0].main}</p>

            <div className="details">
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind Speed: {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}
    </div>
    </div>
    </div>
  );
}

export default App;
