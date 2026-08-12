import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

import triangleDesign from "../assets/triangle design.svg";
import lightbulb from "../assets/Lightbulb.svg";
import dashboardImage from "../assets/dp.svg";
import bottomNavbar from "../assets/bottom bar 1.svg";

import homeIcon from "../assets/home1.svg";
import schedulerIcon from "../assets/Smart.svg";
import userIcon from "../assets/User.svg";

function Dashboard() {
  const username = "Jai Guru";
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">

      {/* Left Corner */}
      <svg
        className="dashboard-corner-left"
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

      {/* Right Corner */}
      <img
        src={triangleDesign}
        alt="triangle"
        className="dashboard-triangle-design"
      />

      {/* Main Card */}
      <div className="dashboard-card">

        <div className="dashboard-content">

          <div className="dashboard-welcome-text">

            <h2>Hello, {username}!</h2>

            <p>
              Welcome home, air quality is good and Fresh.
              Take a walk and have coffee.
            </p>

          </div>

          <img
            src={dashboardImage}
            alt="dashboard"
            className="dashboard-image"
          />

        </div>

      </div>

      {/* Dashboard Button */}

      <button
        className="dashboard-btn"
        onClick={() => navigate("/dashboard-menu")}
      >
        Dashboard
      </button>

      {/* Bottom Right Decoration */}

      <img
        src={lightbulb}
        alt="lightbulb"
        className="dashboard-lightbulb"
      />

      <div className="dashboard-pink-circle"></div>
      <div className="dashboard-red-circle"></div>

      {/* Bottom Navigation */}

      <div className="dashboard-navbar-wrapper">

        {/* Navbar Background */}

        <img
          src={bottomNavbar}
          alt="Bottom Navbar"
          className="dashboard-navbar-bg"
        />

        {/* Home */}

        <button
          className="dashboard-nav-btn dashboard-home-btn dashboard-active"
          onClick={() => navigate("/dashboard")}
        >
          <img src={homeIcon} alt="Home" />
          <span>Home</span>
        </button>

        {/* Scheduler */}

        <button
          className="dashboard-nav-btn dashboard-scheduler-btn"
          onClick={() => navigate("/scheduler")}
        >
          <img src={schedulerIcon} alt="Scheduler" />
          <span>Scheduler</span>
        </button>

        {/* Profile */}

        <button
          className="dashboard-nav-btn dashboard-profile-btn"
          onClick={() => navigate("/profile")}
        >
          <img src={userIcon} alt="Profile" />
          <span>Profile</span>
        </button>

      </div>

    </div>
  );
}

export default Dashboard;