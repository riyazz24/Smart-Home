import "./Onboarding.css";
import { useState } from "react";
import OnboardingCard from "../components/OnbordingCard";
import { useNavigate } from "react-router-dom";
import house from "../assets/home.png";
import wifi from "../assets/wifi.png";
import lightbulb from "../assets/Lightbulb.svg";
import triangleDesign from "../assets/triangle design.svg";

function Onboarding() {
  const navigate = useNavigate();
  const pages = [
    {
      image: house,
      title: "Manage your devices anywhere",
      description: "Experience the benefits of intelligent home management.",
    },

    {
      image: wifi,
      title: "Power in your hands",
      description: "You can control your devices from anywhere, anytime.",
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);

  function nextPage() {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate("/login");
    }
  }

  return (
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

      <OnboardingCard
        image={pages[currentPage].image}
        title={pages[currentPage].title}
        description={pages[currentPage].description}
        currentPage={currentPage}
        totalPages={pages.length}
        nextPage={nextPage}
      />

      {/* Decorative icons */}

      <div className="circle one">
        <img src={lightbulb} alt="" className="lightbulb" />
      </div>
      <div className="circle two"></div>
    </div>
  );
}

export default Onboarding;
