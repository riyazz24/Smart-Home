import "./Agent.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import triangleDesign from "../assets/triangle design.svg";
import lightbulb from "../assets/Lightbulb.svg";
import bottomNavbar from "../assets/bottom bar 1.svg";
import { Home, CalendarClock, User, ArrowLeft, Lightbulb } from "lucide-react";
import agentOnline from "../assets/AgentOnline.svg";
import agentOffline from "../assets/AgentOffline.svg";
import { ensureAgentId } from "../util/AgentApi";
import BottomNavigation from "../components/BottomNavigation";

function Agent() {

  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(false);
  const [checking, setChecking] = useState(true);

  const isLoggedIn = () => !!localStorage.getItem("sessionId");

  const checkAgentStatus = useCallback(async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    setChecking(true);
    try {
      const hasAgent = await ensureAgentId();
      setIsOnline(hasAgent);
    } finally {
      setChecking(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkAgentStatus();
  }, [checkAgentStatus]);

  return (

    <div className="agent-page">

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

      {/* Triangle */}
      <img
        src={triangleDesign}
        className="triangle-design"
        alt=""
      />

      {/* Back */}
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard-menu")}
      >
        <ArrowLeft size={24} />
      </button>

      {/* Whole Card SVG */}
      {checking ? (
        <div style={{ textAlign: "center", marginTop: "160px", color: "#888" }}>
          Checking agent status...
        </div>
      ) : (
        <img
          src={isOnline ? agentOnline : agentOffline}
          className="agent-card"
          alt="Agent Status"
          onClick={() => { if (!isOnline) navigate("/pairing"); }}
          style={!isOnline ? { cursor: "pointer" } : undefined}
        />
      )}

      {/* Bottom Decorations */}
      <img
        src={lightbulb}
        className="lightbulb"
        alt=""
      />

      <div className="pink-circle"></div>
      <div className="red-circle"></div>

      {/* Bottom Navbar */}
      <div className="bottom-navbar">

        <img
          src={bottomNavbar}
          className="bottom-navbar-bg"
          alt=""
        />

        <button
          className="nav-item nav-home"
          onClick={() => navigate("/dashboard")}
        >
          <Home size={30} />
          <span>Home</span>
        </button>

        <button
          className="nav-item nav-scheduler"
          onClick={() => navigate("/scheduler")}
        >
          <CalendarClock size={30} />
          <span>Scheduler</span>
        </button>

        <button
          className="nav-item nav-profile"
          onClick={() => navigate("/profile")}
        >
          <User size={30} />
          <span>Profile</span>
        </button>

      </div>

    </div>

  );
}

export default Agent;