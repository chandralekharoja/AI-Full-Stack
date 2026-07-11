import WeatherCard from "./WeatherCard";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Weather App</h1>
      <div className="card-container">
      <WeatherCard 
      city="Rajapalayam" 
      temp={28.4}
      time ="2026-07-09T06:30"
      windspeed ={11.14}
      winddirection ={245} />
      
      <WeatherCard 
      city="Chennai" 
      temp={28.4}
      time ="2026-07-09T06:30"
      windspeed ={11.14}
      winddirection ={245}
       />
      <WeatherCard 
      city="Madurai" 
      temp={29.8}
      temp={28.4}
      time ="2026-07-09T06:30"
      windspeed ={11.14}
      winddirection ={245}
       />

       <WeatherCard 
      city="Coimbatore" 
      temp={29.8}
      temp={28.4}
      time ="2026-07-09T06:30"
      windspeed ={11.14}
      winddirection ={245}
       />


       <WeatherCard 
      city="Salem" 
      temp={29.8}
      temp={28.4}
      time ="2026-07-09T06:30"
      windspeed ={11.14}
      winddirection ={245}
       />

      <WeatherCard 
      city="Thiruvarur" 
      temp={29.8}
      temp={28.4}
      time ="2026-07-09T06:30"
      windspeed ={11.14}
      winddirection ={245}
       />

       <WeatherCard 
      city="Nagapatinam" 
      temp={29.8}
      temp={28.4}
      time ="2026-07-09T06:30"
      windspeed ={11.14}
      winddirection ={245}
       />


       <WeatherCard 
      city="kochi" 
      temp={29.8}
      temp={28.4}
      time ="2026-07-09T06:30"
      windspeed ={11.14}
      winddirection ={245}
       />


       <WeatherCard 
      city="Palakkad" 
      temp={29.8}
      temp={28.4}
      time ="2026-07-09T06:30"
      windspeed ={11.14}
      winddirection ={245}
       />


       <WeatherCard 
      city="Thrissur" 
      temp={29.8}
      temp={28.4}
      time ="2026-07-09T06:30"
      windspeed ={11.14}
      winddirection ={245}
       />


</div>
    </div>
  );
}

export default App;