import "./Footer.css";
import { FaHeart } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <h3>Recipe Finder</h3>

      <p>
        Made with <FaHeart className="footer-heart" /> using React
      </p>

      <small>© 2025 Recipe Finder. All Rights Reserved.</small>
    </footer>
  );
}

export default Footer;
