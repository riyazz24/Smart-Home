import "./DashboardMenu.css";

import { useNavigate } from "react-router-dom";

import triangleDesign from "../assets/triangle design.svg";
import backIcon from "../assets/back.svg";
import lightbulb from "../assets/Lightbulb.svg";

import bottomNavbar from "../assets/bottom bar 1.svg";
import homeIcon from "../assets/home1.svg";
import schedulerIcon from "../assets/Smart.svg";
import userIcon from "../assets/User.svg";
import agentIcon from "../assets/Agent.svg";
import roomIcon from "../assets/Room.svg";
import devicesIcon from "../assets/Devices.svg";
import scheduleIcon from "../assets/Schedule.svg";
import settingsIcon from "../assets/Setting.svg";

function DashboardMenu() {

  const navigate = useNavigate();

  return (

    <div className="menu-page">

      {/* Left Corner */}
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

      {/* Right Corner */}
      <img
        src={triangleDesign}
        alt="triangle"
        className="menu-triangle"
      />

      {/* Back Button */}

      <button
        className="menu-back-btn"
        onClick={() => navigate("/dashboard")}
      >
        <img src={backIcon} alt="Back" />
      </button>

      {/* Menu Buttons */}

      <div className="menu-grid">

        <button
          className="menu-card"
          onClick={() => navigate("/agent")}
        >
         <img src={agentIcon} alt="Agent" />
  <span>Agent</span>
        </button>

        <button
          className="menu-card"
          onClick={() => navigate("/rooms")}
        >
          <img src={roomIcon} alt="Room" />
  <span>Room</span>
        </button>

        <button
          className="menu-card"
          onClick={() => navigate("/all-devices")}
        >
            <img src={devicesIcon} alt="Devices" />
  <span>Devices</span>
        </button>

        <button
          className="menu-card"
          onClick={() => navigate("/scheduler")}
        >
           <img src={scheduleIcon} alt="Schedule" />
  <span>Schedule</span>
        </button>

        <button
          className="menu-card"
          onClick={() => navigate("/profile")}
        >
            <img src={settingsIcon} alt="Settings" />
  <span>Settings</span>
        </button>

      </div>

      {/* Bottom Decoration */}

      <img
        src={lightbulb}
        alt="Bulb"
        className="menu-lightbulb"
      />

      <div className="menu-pink-circle"></div>
      <div className="menu-red-circle"></div>

      {/* Bottom Navbar */}

      <div className="menu-navbar-wrapper">

        <img
          src={bottomNavbar}
          alt="navbar"
          className="menu-navbar-bg"
        />

        {/* Home */}

        <button
  className="menu-nav-btn menu-home-btn menu-active"
  onClick={() => navigate("/dashboard")}
>
          <img src={homeIcon} alt="Home" />
          <span>Home</span>
        </button>

        {/* Scheduler */}

        <button
          className="menu-nav-btn menu-scheduler-btn"
          onClick={() => navigate("/scheduler")}
        >
          <img src={schedulerIcon} alt="Scheduler" />
          <span>Scheduler</span>
        </button>

        {/* Profile */}

        <button
          className="menu-nav-btn menu-profile-btn"
          onClick={() => navigate("/profile")}
        >
          <img src={userIcon} alt="Profile" />
          <span>Profile</span>
        </button>

      </div>

    </div>

  );
}

export default DashboardMenu;