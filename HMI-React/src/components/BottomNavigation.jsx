import "./BottomNavigation.css";
import { useNavigate } from "react-router-dom";

import bottomNavbar from "../assets/bottom bar 1.svg";

import homeIcon from "../assets/home1.svg";
import schedulerIcon from "../assets/Smart.svg";
import userIcon from "../assets/User.svg";

function BottomNavigation({ active = "" }) {

  const navigate = useNavigate();

  return (

    <div className="dashboard-navbar-wrapper">

      {/* Navbar Background */}

      <img
        src={bottomNavbar}
        alt="Bottom Navbar"
        className="dashboard-navbar-bg"
      />

      {/* Home */}

      <button
        className={`dashboard-nav-btn dashboard-home-btn ${
          active === "home" ? "dashboard-active" : ""
        }`}
        onClick={() => navigate("/dashboard")}
      >
        <img
          src={homeIcon}
          alt="Home"
        />

        <span>
          Home
        </span>
      </button>


      {/* Scheduler */}

      <button
        className={`dashboard-nav-btn dashboard-scheduler-btn ${
          active === "scheduler" ? "dashboard-active" : ""
        }`}
        onClick={() => navigate("/scheduler")}
      >
        <img
          src={schedulerIcon}
          alt="Scheduler"
        />

        <span>
          Scheduler
        </span>
      </button>


      {/* Profile */}

      <button
        className={`dashboard-nav-btn dashboard-profile-btn ${
          active === "profile" ? "dashboard-active" : ""
        }`}
        onClick={() => navigate("/profile")}
      >
        <img
          src={userIcon}
          alt="Profile"
        />

        <span>
          Profile
        </span>
      </button>

    </div>

  );
}

export default BottomNavigation;