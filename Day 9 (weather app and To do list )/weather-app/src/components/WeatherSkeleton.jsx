import "../App.css";

function WeatherSkeleton() {
  return (
    <div className="weather-card skeleton">
      <div className="skeleton-title"></div>
      <div className="skeleton-temp"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  );
}

export default WeatherSkeleton;