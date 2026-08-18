import "./ScanDevices.css";
import BottomNavigation from "../components/BottomNavigation";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import triangleDesign from "../assets/triangle design.svg";
import {
  FaArrowLeft,
  FaSearch,
  FaTv,
  FaPlus,
  FaCheckCircle
} from "react-icons/fa";

import { scanThing, createThing } from "../util/ThingApi";
import { listRooms } from "../util/RoomApi";
import { ensureAgentId } from "../util/AgentApi";

// The backend only exposes:
//   - POST /thing/scan   -> fire-and-forget MQTT trigger, no result comes
//                            back over HTTP or any topic this app listens on
//   - POST /thing/create -> creates one specific, known device (only
//                            thingTypeUid "wiz:color-bulb" is accepted)
// There's no endpoint that returns "devices found nearby" to pick from, so
// unlike the original mock, this page can't show a live-discovered list.
// Instead: trigger the scan (in case the agent-side flow depends on it),
// then let the user add the WiZ bulb they want by its IP/MAC directly.
const SUPPORTED_THING_TYPE = "wiz:color-bulb";

function ScanDevices() {

  const navigate = useNavigate();
  const location = useLocation();

  /* --------------------------
        STATES
  -------------------------- */

  const [loading, setLoading] = useState(true);
  const [scanError, setScanError] = useState("");

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deviceName, setDeviceName] = useState("");
  const [roomId, setRoomId] = useState(location.state?.roomId || "");
  const [ipAddress, setIpAddress] = useState("");
  const [macAddress, setMacAddress] = useState("");

  const isLoggedIn = () => !!localStorage.getItem("sessionId");

  /* =========================================
      TRIGGER SCAN (POST /thing/scan)
  ========================================= */
  useEffect(() => {
    const runScan = async () => {
      if (!isLoggedIn()) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const hasAgent = await ensureAgentId();
        if (!hasAgent) {
          setScanError("No paired agent found - pair a device first.");
          return;
        }
        await scanThing(SUPPORTED_THING_TYPE.split(":")[0]);
      } catch (err) {
        setScanError(err.response?.data?.message || "Failed to trigger scan");
      } finally {
        // The scan trigger is fire-and-forget (no results come back to this
        // page), so this delay is purely cosmetic - it keeps the existing
        // "Scanning..." animation for a moment before showing the add-device
        // form, instead of jarringly skipping straight to it.
        setTimeout(() => setLoading(false), 1800);
      }
    };
    runScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================
      FETCH ROOMS (GET /room/list) - needed to
      pick which room the new device belongs to
  ========================================= */
  useEffect(() => {
    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const { data, status } = await listRooms();
        if (status === 200) {
          const roomList = data.roomList || [];
          setRooms(roomList);
          if (!roomId && roomList.length > 0) {
            setRoomId(roomList[0].roomId);
          }
        }
      } catch (err) {
        setRooms([]);
        console.error(err.response?.data?.message || "Failed to fetch rooms");
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================
      CREATE DEVICE (POST /thing/create)
  ========================================= */
  const addDevice = async () => {
    if (deviceName.trim() === "" || !roomId || ipAddress.trim() === "" || macAddress.trim() === "") {
      setFormError("Please fill all fields");
      return;
    }

    setFormError("");
    setSaving(true);

    try {
      await createThing({
        roomId,
        thingTypeUid: SUPPORTED_THING_TYPE,
        label: deviceName.trim(),
        ipAddress: ipAddress.trim(),
        macAddress: macAddress.trim(),
      });

      setShowAdd(false);
      setShowSuccess(true);

      setDeviceName("");
      setIpAddress("");
      setMacAddress("");
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data?.error || "Failed to add device");
    } finally {
      setSaving(false);
    }
  };

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
  <div className="device-list">

    <div className="device-card">

      <div className="device-left">

        <div className="device-icon">

          <FaTv />

        </div>

        <div>

          <h3>WiZ Full Color Bulb</h3>

          <span>Enter its IP and MAC address to add it</span>

        </div>

      </div>

      <button
        className="add-btn"
        disabled={loadingRooms || rooms.length === 0}
        onClick={() => {

          setDeviceName("");
          setIpAddress("");
          setMacAddress("");
          setFormError("");
          if (!roomId && rooms.length > 0) setRoomId(rooms[0].roomId);

          setShowAdd(true);

        }}
      >

        <FaPlus />

        Add

      </button>

    </div>

    {scanError && (
      <p style={{ color: "#d10000", marginTop: "20px" }}>{scanError}</p>
    )}

    {!loadingRooms && rooms.length === 0 && (
      <p style={{ color: "#7A7A7A", marginTop: "20px" }}>
        You don't have any rooms yet - add a room first so a new device has somewhere to go.
      </p>
    )}

  </div>

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

        <select
          value={roomId}
          onChange={(e)=>setRoomId(e.target.value)}
          style={{
            width: "100%",
            height: "50px",
            border: "1px solid #DADADA",
            borderRadius: "10px",
            padding: "12px 15px",
            marginBottom: "18px",
            fontSize: "16px",
            outline: "none",
          }}
        >
          {rooms.map((room) => (
            <option key={room.roomId} value={room.roomId}>{room.roomName}</option>
          ))}
        </select>

        <input
          type="text"
          value={ipAddress}
          onChange={(e)=>setIpAddress(e.target.value)}
          placeholder="IP Address (e.g. 192.168.0.56)"
        />

        <input
          type="text"
          value={macAddress}
          onChange={(e)=>setMacAddress(e.target.value)}
          placeholder="MAC Address"
        />

        {formError && (
          <p style={{ color: "#d10000", marginTop: "-10px", marginBottom: "18px" }}>{formError}</p>
        )}

        <div className="popup-buttons">

          <button
            className="cancel-btn"
            onClick={()=>setShowAdd(false)}
          >

            Cancel

          </button>

          <button
            className="save-btn"
            disabled={saving}
            onClick={addDevice}
          >

            {saving ? "Adding..." : "Add Device"}

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