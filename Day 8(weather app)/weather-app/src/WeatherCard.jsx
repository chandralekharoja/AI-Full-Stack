function WeatherCard(props) {
  return (
    <div className="card">
      <h2>{props.city}</h2>
      <p>{props.temp}°C</p>
      <p>{props.time}</p>
      <p>{props.windspeed}</p>
      <p>🧭 {props.winddirection}°</p>
      
    </div>
  );
}

export default WeatherCard;