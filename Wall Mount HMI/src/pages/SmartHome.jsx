import "./Onboarding.css";

import { useNavigate } from "react-router-dom";

import triangleDesign from "../assets/triangle design.svg";
import { LiaWindowClose } from "react-icons/lia";

function SmartHome() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="onboarding-page">
        {/* Top corner lines */}

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

        <div onClick={() => navigate("/Loading")} className="start-center">
          <LiaWindowClose size={36} />
          <p className="start-center-text">Home Automation App</p>
        </div>
      </div>
    </div>
  );
}

export default SmartHome;
