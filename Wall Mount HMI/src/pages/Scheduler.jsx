import "./Scheduler.css";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import livingRoom from "../assets/livingroom.svg";
import settingsIcon from "../assets/settings.svg";
import triangleDesign from "../assets/triangle design.svg";
import BottomNavigation from "../components/BottomNavigation";
function Scheduler() {
  const navigate = useNavigate();

  return (
    <div className="scheduler-container">
      {/* Top Left Corner Design */}
      <div className="corner-design">
        <svg
        className="menu-corner-left"
        xmlns="http://www.w3.org/2000/svg"
        width="180"
        height="190"
        viewBox="0 0 400 190"
        fill="none"
      >
        <path
          d="M -80 110 A 220 220 0 0 0 190 -80"
          stroke="#000"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        <path
          d="M -50 135 A 190 190 0 0 0 215 -50"
          stroke="#000"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      </div>
      <img
        src={triangleDesign}
        alt="Triangle Design"
        className="triangle-design"
      />

      {/* Title */}
      <h1 className="scheduler-title">Scheduler</h1>

      {/* Centre Image */}
      <div className="image-container">
        {/* Uncomment when you have the image */}

        {<img src={livingRoom} alt="Living Room" className="living-room-img" />}
      </div>

      {/* Description */}
      <div className="description">
        <div className="settings-icon">
          <img src={settingsIcon} alt="Settings" className="settings-icon" />
        </div>

        <div className="description-text">
          <h3>Easily create helpful automations.</h3>

          <p>
            Get the devices to work together and help to make your home safer,
            more convenient and more efficient.
          </p>
        </div>
        <BottomNavigation active="scheduler" />
      </div>

      {/* Next Button */}
      <button className="next-btn" onClick={() => navigate("/scenes")}>
        Next <FaArrowRight />
      </button>
    </div>
  );
}

export default Scheduler;
