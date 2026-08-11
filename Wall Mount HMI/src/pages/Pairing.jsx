import "./Pairing.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import triangleDesign from "../assets/triangle design.svg";
import lightbulb from "../assets/Lightbulb.svg";

function Pairing() {
  const navigate = useNavigate();

  const [pairCode] = useState(
    Math.floor(100000 + Math.random() * 900000)
  );

  return (
    <div className="pairing-page">

      {/* Left Corner */}
      <svg
        className="pairing-corner-left"
        xmlns="http://www.w3.org/2000/svg"
        width="300"
        height="190"
        viewBox="0 0 300 190"
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

      {/* Right Corner */}
      <img
        src={triangleDesign}
        alt="triangle"
        className="pairing-triangle-design"
      />

      {/* Pair Card */}
      <div className="pairing-card">

        <h3>Below is the Pair code</h3>

        <p>
          Please enter the pair code in the mobile/website
          and finish the setup.
        </p>

        <input
          type="text"
          value={pairCode}
          readOnly
        />

        <button
          className="pairing-next-btn"
          onClick={() => navigate("/onboarding")}
        >
          Next
        </button>

      </div>

      {/* Bottom Design */}

      <div className="pairing-circle-one">
        <img
          src={lightbulb}
          alt="lightbulb"
          className="pairing-lightbulb"
        />
      </div>

      <div className="pairing-bottom-right-design">

        <div className="pairing-pink-circle"></div>

        <div className="pairing-red-circle"></div>

      </div>

    </div>
  );
}

export default Pairing;