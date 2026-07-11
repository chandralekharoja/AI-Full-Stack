import "./WeatherCard.css";

function WeatherCard(props) {
  return (
    <div className="card">
      <h2>{props.city}</h2>

      <div className="temp">{props.temp}°C</div>

      <div className="details">
        <p><strong>Time:</strong> {props.time}</p>
        <p><strong>Wind Speed:</strong> {props.windspeed} km/h</p>
        <p><strong>Wind Direction:</strong> {props.winddirection}</p>
      </div>
    </div>
  );
}

export default WeatherCard;