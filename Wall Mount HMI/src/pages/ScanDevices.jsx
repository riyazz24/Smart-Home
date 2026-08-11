import "./ScanDevices.css";
import BottomNavigation from "../components/BottomNavigation";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import triangleDesign from "../assets/triangle design.svg";
import {
  FaArrowLeft,
  FaSearch,
  FaTv,
  FaPlus,
  FaCheckCircle
} from "react-icons/fa";

import noDevicesImage from "../assets/no devices.svg";

function ScanDevices() {

  const navigate = useNavigate();

  /* --------------------------
        STATES
  -------------------------- */

  const [loading, setLoading] = useState(true);

  const [devicesFound, setDevicesFound] = useState(true);

  const [showAdd, setShowAdd] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [deviceName, setDeviceName] = useState("");

  const [roomName, setRoomName] = useState("");

  const [devices] = useState([

    {
      id: 1,
      name: "Android TV",
      room: "Living Room"
    },

    {
      id: 2,
      name: "LG Smart TV",
      room: "Bedroom"
    },

    {
      id: 3,
      name: "Smart Bulb",
      room: "Dining Room"
    }

  ]);

  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 3500);

    return () => clearTimeout(timer);

  }, []);

  return (

    <div className="scan-page">
              {/* =========================
            TOP DECORATION
      ========================= */}

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
  className="triangle-design"
  alt=""
/>
      {/* Status */}

      

      <div className="main-container">

        {/* Back Button */}

        <button
          className="back-btn"
          onClick={() => navigate("/all-devices")}
        >
          <FaArrowLeft />
        </button>

        {/* Sidebar */}

        <aside className="sidebar">

          <div
            className="sidebar-item"
            onClick={() => navigate("/all-devices")}
          >
            <FaTv />
            <span>All Devices</span>
          </div>

          <div className="sidebar-item active-item">
            <FaSearch />
            <span>Scan Devices</span>
          </div>

        </aside>

        {/* =========================
                CONTENT
        ========================= */}

        <section className="content">

          <div className="content-header">

            <h1>Scan Devices</h1>

          </div>

          {loading ? (

            <div className="loading-container">

              <div className="scanner-circle">

                <div className="scanner-wave wave1"></div>
                <div className="scanner-wave wave2"></div>
                <div className="scanner-wave wave3"></div>

                <FaSearch className="scanner-icon" />

              </div>

              <h2>Scanning Devices...</h2>

              <p>
                Please wait while searching for nearby devices.
              </p>

              <div className="loading-bar">

                <div className="loading-progress"></div>

              </div>

            </div>

          ) : (
            <>
  {devicesFound ? (

    <div className="device-list">

      {devices.map((device) => (

        <div
          className="device-card"
          key={device.id}
        >

          <div className="device-left">

            <div className="device-icon">

              <FaTv />

            </div>

            <div>

              <h3>{device.name}</h3>

              <span>{device.room}</span>

            </div>

          </div>

          <button
            className="add-btn"
            onClick={() => {

              setDeviceName(device.name);
              setRoomName(device.room);

              setShowAdd(true);

            }}
          >

            <FaPlus />

            Add

          </button>

        </div>

      ))}

    </div>

  ) : (

    <div className="no-device-container">

      <img
        src={noDevicesImage}
        alt="No Devices"
        className="no-device-image"
      />

      <h2>No Devices Found</h2>

      <p>

        We couldn't find any nearby smart devices.

      </p>

      <button
        className="scan-again-btn"
        onClick={() => {

          setLoading(true);

          setTimeout(() => {

            setLoading(false);

            setDevicesFound(true);

          },3000);

        }}
      >

        Scan Again

      </button>

    </div>

  )}

  {/* ======================
        ADD POPUP
  ======================= */}

  {showAdd && (

    <div className="popup-overlay">

      <div className="popup">

        <h2>Add Device</h2>

        <input
          type="text"
          value={deviceName}
          onChange={(e)=>setDeviceName(e.target.value)}
          placeholder="Device Name"
        />

        <input
          type="text"
          value={roomName}
          onChange={(e)=>setRoomName(e.target.value)}
          placeholder="Room Name"
        />

        <div className="popup-buttons">

          <button
            className="cancel-btn"
            onClick={()=>setShowAdd(false)}
          >

            Cancel

          </button>

          <button
            className="save-btn"
            onClick={()=>{

              setShowAdd(false);

              setShowSuccess(true);

            }}
          >

            Add Device

          </button>

        </div>

      </div>

    </div>

  )}

  {/* ======================
      SUCCESS POPUP
  ======================= */}

  {showSuccess && (

    <div className="popup-overlay">

      <div className="popup success-popup">

        <div className="success-circle">

          <FaCheckCircle />

        </div>

        <h2>Success</h2>

        <p>

          Device Added Successfully

        </p>

        <button
          className="save-btn"
          onClick={() => {

            setShowSuccess(false);

            navigate("/all-devices");

          }}
        >

          Done

        </button>

      </div>

    </div>

  )}

</>

)}

        </section>

      </div>
<BottomNavigation />
    </div>

  );

}

export default ScanDevices;