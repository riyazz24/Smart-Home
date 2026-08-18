import "./DashboardMenu.css";

import { useNavigate } from "react-router-dom";

import triangleDesign from "../assets/triangle design.svg";
import bottomNavbar from "../assets/bottom bar 1.svg";
import lightbulb from "../assets/Lightbulb.svg";
import {
  ArrowLeft,
  Home,
  CalendarClock,
  User,
  Bot,
  DoorOpen,
  MonitorSmartphone,
  CalendarPlus,
  Settings,
} from "lucide-react";

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
        <ArrowLeft size={24} />
      </button>

      {/* Menu Buttons */}

      <div className="menu-grid">

        <button
          className="menu-card"
          onClick={() => navigate("/agent")}
        >
         <Bot size={32} />
  <span>Agent</span>
        </button>

        <button
          className="menu-card"
          onClick={() => navigate("/rooms")}
        >
          <DoorOpen size={32} />
  <span>Room</span>
        </button>

        <button
          className="menu-card"
          onClick={() => navigate("/all-devices")}
        >
            <MonitorSmartphone size={32} />
  <span>Devices</span>
        </button>

        <button
          className="menu-card"
          onClick={() => navigate("/scheduler")}
        >
           <CalendarPlus size={32} />
  <span>Schedule</span>
        </button>

        <button
          className="menu-card"
          onClick={() => navigate("/profile")}
        >
            <Settings size={32} />
  <span>Settings</span>
        </button>

      </div>

      {/* Bottom Decoration */}
      <div className="pairing-circle-one">
        <img
          src={lightbulb}
          alt="lightbulb"
          className="pairing-lightbulb"
        />
      </div>

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
          <Home size={30} />
          <span>Home</span>
        </button>

        {/* Scheduler */}

        <button
          className="menu-nav-btn menu-scheduler-btn"
          onClick={() => navigate("/scheduler")}
        >
          <CalendarClock size={30} />
          <span>Scheduler</span>
        </button>

        {/* Profile */}

        <button
          className="menu-nav-btn menu-profile-btn"
          onClick={() => navigate("/profile")}
        >
          <User size={30} />
          <span>Profile</span>
        </button>

      </div>

    </div>

  );
}

export default DashboardMenu;