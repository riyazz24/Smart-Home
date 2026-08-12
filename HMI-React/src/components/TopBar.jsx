import "./TopBar.css";

import { FaPen } from "react-icons/fa";
import triangleDesign from "../assets/triangle design.svg";

function TopBar({ userName, profileImage }) {
  return (
    <header className="topbar">
      {/* Left Corner */}
      <svg
        className="corner-left"
        xmlns="http://www.w3.org/2000/svg"
        width="300"
        height="190"
        viewBox="0 0 300 190"
        fill="none"
      >
        <path
          d="M -80 110 A 220 220 0 0 0 190 -80"
          stroke="black"
          strokeWidth="1.2"
          fill="none"
        />

        <path
          d="M -50 135 A 190 190 0 0 0 215 -50"
          stroke="black"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>

      {/* Right Corner */}

      <img
        src={triangleDesign}
        alt="Triangle Design"
        className="triangle-design"
      />

      <h1 className="welcome-text">Welcome {userName}!</h1>

      <div className="curve-divider">
        <div className="profile-arc"></div>
        <div className="profile-wrapper">
          <img src={profileImage} alt="profile" className="profile-image" />

          <button className="edit-profile-btn">
            <FaPen />
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
