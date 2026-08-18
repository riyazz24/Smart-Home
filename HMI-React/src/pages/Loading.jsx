import "./Loading.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import osLoading from "../assets/os-loading.svg";
import triangleDesign from "../assets/triangle design.svg";
import lightbulb from "../assets/Lightbulb.svg";
import { LoaderCircle } from "lucide-react";
function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/pairing");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-page">

      {/* Left Corner Design */}
      <svg
        className="loading-corner-left"
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
        alt="Triangle Design"
        className="loading-triangle-design"
      />

      {/* Loading Content */}
      <div className="loading-content">

        <LoaderCircle
          className="loading-icon"
          size={80}
        />

        <p className="loading-text">
          The OS is Loading........Please Wait For some time
        </p>

      </div>

      {/* Bottom Right */}
      <div className="loading-circle-one">

        <img
          src={lightbulb}
          alt="Lightbulb"
          className="loading-lightbulb"
        />

      </div>

      <div className="loading-bottom-right-design">

        <div className="loading-pink-circle"></div>

        <div className="loading-red-circle"></div>

      </div>

    </div>
  );
}

export default Loading;