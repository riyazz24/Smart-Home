import "./Scheduler.css";
import { FaArrowRight } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import livingRoom from "../assets/livingroom.svg";
import triangleDesign from "../assets/triangle design.svg";
import BottomNavigation from "../components/BottomNavigation";
import { ArrowLeft } from "lucide-react";

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
      <img
        src={triangleDesign}
        alt="Triangle Design"
        className="triangle-design"
        />
        
      <button className="back-btn" onClick={() => navigate("/dashboard-menu")}>
        <ArrowLeft size={24} />
      </button>

        </div>

      {/* Title */}
      <h1 className="scheduler-title" style={{}}>Scheduler</h1>

      {/* Centre Image */}
      <div className="image-container">
        {/* Uncomment when you have the image */}

        {<img src={livingRoom} alt="Living Room" className="living-room-img" />}
      </div>

      {/* Description */}
      <div className="description">
        <div className="settings-icon">
          <FaGears size={24} className="settings-icon" />
        </div>

        <div className="description-text">
          <h3>Easily create helpful automations.</h3>

          <p>
            Get the devices to work together and help to make your home safer,
            more convenient and more efficient.
          </p>
        </div>
      </div>

      {/* Next Button */}
      <button className="next-btn" onClick={() => navigate("/scenes")}>
        Next <FaArrowRight />
      </button>

      <BottomNavigation active="scheduler" />
    </div>
  );
}

export default Scheduler;
