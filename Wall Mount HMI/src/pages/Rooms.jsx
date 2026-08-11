import "./Rooms.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

    const addRoom = () => {

        if (roomName.trim() === "") {
            alert("Enter Room Name");
            return;
        }

        const existingRooms =
            JSON.parse(localStorage.getItem("rooms")) || [];

        existingRooms.push({
            id: Date.now(),
            name: roomName,
            devices: []
        });

        localStorage.setItem(
            "rooms",
            JSON.stringify(existingRooms)
        );

        setRoomName("");
        setShowPopup(false);

        navigate("/room-details");
    };

    return (

        <div className="room-page">

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
                <img src={backIcon} alt="" />
            </button>

            {/* Card */}

            <div className="room-card">

                <button
                    className="add-room-btn"
                    onClick={() => setShowPopup(true)}
                >
                    + Add Room
                </button>

                <img
                    src={roomEmpty}
                    className="room-svg"
                    alt=""
                />

            </div>

            {/* Popup */}

            {showPopup && (

                <div className="popup-overlay">

                    <div className="popup">

                        <button
                            className="popup-close"
                            onClick={() => setShowPopup(false)}
                        >
                            ×
                        </button>

                        <h3>ADD ROOM</h3>

                        <input
                            type="text"
                            placeholder="Room Name"
                            value={roomName}
                            onChange={(e) =>
                                setRoomName(e.target.value)
                            }
                        />

                        <div className="popup-buttons">

                            <button
                                className="popup-add"
                                onClick={addRoom}
                            >
                                Add
                            </button>

                            <button
                                className="popup-cancel"
                                onClick={() => {
                                    setShowPopup(false);
                                    setRoomName("");
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* Bottom Right */}

            <img
                src={lightbulb}
                className="dashboard-lightbulb"
                alt=""
            />

            <div className="dashboard-pink-circle"></div>
            <div className="dashboard-red-circle"></div>

            {/* Bottom Navbar */}

            <div className="dashboard-navbar-wrapper">

                <img
                    src={bottomNavbar}
                    className="dashboard-navbar-bg"
                    alt=""
                />

                <button
                    className="dashboard-nav-btn dashboard-home-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    <img src={homeIcon} alt="" />
                    <span>Home</span>
                </button>

                <button
                    className="dashboard-nav-btn dashboard-scheduler-btn"
                    onClick={() => navigate("/scheduler")}
                >
                    <img src={schedulerIcon} alt="" />
                    <span>Scheduler</span>
                </button>

                <button
                    className="dashboard-nav-btn dashboard-profile-btn"
                    onClick={() => navigate("/profile")}
                >
                    <img src={userIcon} alt="" />
                    <span>Profile</span>
                </button>

            </div>

        </div>

    );
}

export default Rooms;