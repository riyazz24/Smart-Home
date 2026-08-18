import "./Rooms.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from 'react';
import { listRooms, createRoom } from "../util/RoomApi";
import { ensureAgentId } from "../util/AgentApi";
import triangleDesign from "../assets/triangle design.svg";
import backIcon from "../assets/back.svg";
import lightbulb from "../assets/Lightbulb.svg";
import bottomNavbar from "../assets/bottom bar 1.svg";
import homeIcon from "../assets/home1.svg";
import schedulerIcon from "../assets/Smart.svg";
import userIcon from "../assets/User.svg";
import roomEmpty from "../assets/RoomEmpty.svg";

function Rooms() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const [loadingRoom, setLoadingRoom] = useState(true);

  const isLoggedIn = () => !!localStorage.getItem("sessionId");

  const capitalize = (str) => {
    if (!str) return '';
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
  };

  // This page's UI only has an "empty / add room" state (see room-card
  // below). When rooms already exist, hand off straight to /room-details,
  // which already has the sidebar + device table needed to display them.
  const fetchRoomList = useCallback(async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      // /room/* is agent-scoped (X-AgentId header) - make sure we have one
      // resolved into localStorage before calling it.
      const hasAgent = await ensureAgentId();
      if (!hasAgent) {
        setRoomList([]);
        setLoadingRoom(false);
        console.warn('No paired agent found - room list requires a paired agent.');
        return;
      }

      const { data, status } = await listRooms();
      if (status === 200) {
        setRoomList(data.roomList || []);
        if ((data.roomList || []).length > 0) {
          navigate("/room-details");
          return;
        }
      }
    } catch (err) {
      setRoomList([]);
      console.error(err.response?.data?.message || "Failed to fetch room list");
    } finally {
      setLoadingRoom(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRoomList();
  }, [fetchRoomList]);

  const addRoom = async () => {
    if (roomName.trim() === "") {
      setError("Enter Room Name");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const normalizedRoomName = capitalize(roomName);
      const { status } = await createRoom(normalizedRoomName);

      if (status === 200) {
        setRoomName("");
        setShowPopup(false);
        navigate("/room-details");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to add room"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="room-page">
      <svg className="menu-corner-left" xmlns="http://www.w3.org/2000/svg" width="180" height="190" viewBox="0 0 400 190" fill="none">
        <path d="M -80 110 A 220 220 0 0 0 190 -80" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M -50 135 A 190 190 0 0 0 215 -50" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>

      <img src={triangleDesign} className="triangle-design" alt="" />

      <button className="back-btn" onClick={() => navigate("/dashboard-menu")}>
        <img src={backIcon} alt="" />
      </button>

      <div className="room-card">
        <button className="add-room-btn" onClick={() => setShowPopup(true)}>
          + Add Room
        </button>
        <img src={roomEmpty} className="room-svg" alt="" />
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button
              className="popup-close"
              onClick={() => {
                setShowPopup(false);
                setError("");
              }}
            >
              ×
            </button>

            <h3>ADD ROOM</h3>

            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            {error && <p className="room-error">{error}</p>}

            <div className="popup-buttons">
              <button className="popup-add" onClick={addRoom} disabled={saving}>
                {saving ? "Adding..." : "Add"}
              </button>
              <button
                className="popup-cancel"
                onClick={() => {
                  setShowPopup(false);
                  setRoomName("");
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <img src={lightbulb} className="dashboard-lightbulb" alt="" />
      <div className="dashboard-pink-circle"></div>
      <div className="dashboard-red-circle"></div>

      <div className="dashboard-navbar-wrapper">
        <img src={bottomNavbar} className="dashboard-navbar-bg" alt="" />

        <button className="dashboard-nav-btn dashboard-home-btn" onClick={() => navigate("/dashboard")}>
          <img src={homeIcon} alt="" />
          <span>Home</span>
        </button>

        <button className="dashboard-nav-btn dashboard-scheduler-btn" onClick={() => navigate("/scheduler")}>
          <img src={schedulerIcon} alt="" />
          <span>Scheduler</span>
        </button>

        <button className="dashboard-nav-btn dashboard-profile-btn" onClick={() => navigate("/profile")}>
          <img src={userIcon} alt="" />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
}

export default Rooms;