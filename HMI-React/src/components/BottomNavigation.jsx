import "./BottomNavigation.css";
import { useNavigate } from "react-router-dom";

import bottomNavbar from "../assets/bottom bar 1.svg";

import { Home, CalendarClock, User } from "lucide-react";

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
        <Home size={30} />

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
        <CalendarClock size={30} />

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
        <User size={30} />

        <span>
          Profile
        </span>
      </button>

    </div>

  );
}

export default BottomNavigation;