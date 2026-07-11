import "./Error.css";

function Error({ message }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Error;