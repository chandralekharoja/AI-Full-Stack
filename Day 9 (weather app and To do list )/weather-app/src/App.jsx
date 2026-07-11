import { useState } from "react";
import SearchBar from "./components/Search/Search";
import WeatherCard from "./components/weathercard/weathercard";
import Loading from "./components/loading/loading";
import Error from "./components/error/erro";
import { fetchgcs, fetchWeather } from "./api/api";
import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(city) {
    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // Get latitude and longitude
      const location = await fetchgcs(city);

      if (location.length === 0) {
        throw new Error("City not found.");
      }

      const { lat, lon, display_name } = location[0];

      // Get weather details
      const data = await fetchWeather(lat, lon);

      setWeather({
        city: display_name,
        temp: data.current_weather.temperature,
        time: data.current_weather.time,
        windspeed: `${data.current_weather.windspeed} km/h`,
        winddirection: `${data.current_weather.winddirection}°`,
      });
    } catch (err) {
  setError(err.message || "Something went wrong.");

  setTimeout(() => {
    setError("");
  }, 3000);
}
 finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <SearchBar onSearch={search} />

      {loading && <Loading />}

      {error && <Error message={error} />}

      {!loading && weather && <WeatherCard {...weather} />}
    </div>
  );
}

export default App;