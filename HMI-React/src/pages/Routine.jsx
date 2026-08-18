import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Routine.css";

import triangleDesign from "../assets/triangle design.svg";

import BottomNavigation from "../components/BottomNavigation";

import {
  FaArrowLeft,
  FaClock,
  FaChevronRight,
  FaCalendarAlt,
  FaPlus,
  FaLightbulb,
  FaPowerOff
} from "react-icons/fa";

import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { listThings } from "../util/ThingApi";
import { createRule } from "../util/RuleApi";
import { buildCronExpressionsForDates } from "../util/CronUtil";

function Routine() {
  const navigate = useNavigate();

  const [page, setPage] = useState("home");

  const [deviceList, setDeviceList] = useState([]);
  const [device, setDevice] = useState(""); // holds the openHAB itemName

  const [command, setCommand] = useState("ON");

  const [startTime, setStartTime] = useState("11:30");

  const [startDate, setStartDate] = useState(new Date());

  const [showPopup, setShowPopup] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadingDevices, setLoadingDevices] = useState(true);

  const isLoggedIn = () => !!localStorage.getItem("sessionId");

  /* =========================
     FETCH DEVICES (GET /thing/list)
  ========================= */
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    const fetchDevices = async () => {
      setLoadingDevices(true);
      try {
        const { data, status } = await listThings();
        if (status === 200) {
          const mapped = (data.thingList || [])
            .map((thing) => ({
              itemName: thing.thingItemsListResponseList?.[0]?.itemName,
              label: thing.label,
            }))
            .filter((d) => d.itemName);
          setDeviceList(mapped);
          // A device can exist (from /thing/create) before its openHAB item
          // is actually linked on the agent side - it just won't have an
          // itemName yet, so it gets filtered out above. Tell the user
          // instead of silently showing an empty dropdown.
          if (mapped.length === 0 && (data.thingList || []).length > 0) {
            setError("Your device(s) aren't ready to be controlled yet - try again in a moment.");
          } else if (mapped.length === 0) {
            setError("You don't have any devices yet - add one from All Devices first.");
          } else {
            setError("");
          }
        }
      } catch (err) {
        setDeviceList([]);
        setError(err.response?.data?.message || "Failed to fetch devices");
      } finally {
        setLoadingDevices(false);
      }
    };
    fetchDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================
     DATE FORMAT
  ========================= */

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const toIsoDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  /* =========================
     SAVE ROUTINE (POST /rule/create)
  ========================= */

  const handleAdd = async () => {
    if (device === "") {
      setError("Please select a device first.");
      setPage("home");
      return;
    }

    // Build a Quartz cron expression for the single selected date/time -
    // same helper the CRA reference app uses for date-based (as opposed to
    // recurring-weekday) scenes.
    const cronExpressions = buildCronExpressionsForDates(startTime, [toIsoDate(startDate)]);
    if (cronExpressions.length === 0) {
      setError("Could not build a valid schedule from the selected date/time.");
      setPage("time");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const { data } = await createRule({
        ruleName: `${deviceList.find((d) => d.itemName === device)?.label || "Device"} ${command === "ON" ? "On" : "Off"} - ${formatDate(startDate)}`,
        triggerPayload: {
          type: "TIME",
          cronExpression: cronExpressions[0],
          itemName: null,
          state: null,
        },
        actionPayloadList: [
          { itemName: device, command },
        ],
      });
      console.log(data?.message);
      setShowPopup(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create scene. Please try again.");
      setPage("home");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     HOME PAGE
  ========================= */

  const renderHome = () => (
    <>
      <div className="routine-line"></div>

      {/* DEVICE */}

      <select
        className="device-select"
        value={device}
        onChange={(e) => {
          setDevice(e.target.value);
          e.target.blur();
        }}
      >
        <option value="">{loadingDevices ? "Loading devices..." : "Select Device"}</option>
        {deviceList.map((d) => (
          <option key={d.itemName} value={d.itemName}>{d.label}</option>
        ))}
      </select>

      {/* STATE (On/Off) - required by the backend's action payload;
          "changes in weather" had no backend trigger type to save to
          (RuleController only supports type:'TIME'), so this slot now
          holds the ON/OFF command a scene actually needs. */}

      <div
        className="routine-option selected-option"
        onClick={() => setPage("state")}
      >
        <div className="card-left">
          <FaPowerOff className="weather" />

          <span>
            State: {command === "ON" ? "Turn On" : "Turn Off"}
          </span>
        </div>

        <FaChevronRight />
      </div>

      {/* TIME */}

      <div
        className="routine-option"
        onClick={() => setPage("time")}
      >
        <div className="card-left">
          <FaClock className="clock" />

          <span>Time</span>
        </div>

        <FaChevronRight />
      </div>

      {error && (
        <p style={{ color: "#d10000", textAlign: "center", marginTop: "10px" }}>{error}</p>
      )}
    </>
  );

  /* =========================
     STATE PAGE (On/Off)
  ========================= */

  const renderState = () => (
    <>
      <div className="sub-page-header">
        <button
          className="small-back-btn"
          onClick={() => setPage("home")}
        >
          <FaArrowLeft />
        </button>

        <h2>Select State</h2>
      </div>

      <div className="weather-options">

        <div
          className={`weather-option ${command === "ON" ? "weather-option-selected" : ""}`}
          onClick={() => {
            setCommand("ON");
            setPage("home");
          }}
        >
          <div className="weather-option-icon weather-sunny">
            <FaLightbulb />
          </div>

          <span>Turn On</span>
        </div>

        <div
          className={`weather-option ${command === "OFF" ? "weather-option-selected" : ""}`}
          onClick={() => {
            setCommand("OFF");
            setPage("home");
          }}
        >
          <div className="weather-option-icon weather-cloudy">
            <FaPowerOff />
          </div>

          <span>Turn Off</span>
        </div>

      </div>
    </>
  );

  /* =========================
     TIME PAGE
  ========================= */

  const renderTime = () => (
    <>
      <div className="sub-page-header">
        <button
          className="small-back-btn"
          onClick={() => setPage("home")}
        >
          <FaArrowLeft />
        </button>

        <h2>Time</h2>
      </div>

      {/* START TIME */}

      <div className="time-section">

        <div className="time-section-title">
          Start Time
        </div>

        <div className="time-input-box">
          <TimePicker
            onChange={setStartTime}
            value={startTime}
            disableClock={true}
            clearIcon={null}
            format="h:mm a"
          />
        </div>

      </div>

      {/* START DATE */}

      <div
        className="date-input-box"
        onClick={() => setPage("start-calendar")}
      >
        <span>{formatDate(startDate)}</span>

        <FaCalendarAlt />
      </div>

      <button
        className="time-done-btn"
        onClick={() => setPage("home")}
      >
        Done
      </button>

    </>
  );

  /* =========================
     START CALENDAR
  ========================= */

  const renderStartCalendar = () => (
    <>
      <div className="sub-page-header">

        <button
          className="small-back-btn"
          onClick={() => setPage("time")}
        >
          <FaArrowLeft />
        </button>

        <h2>Start Date</h2>

      </div>

      <div className="calendar-wrapper">

        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            setPage("time");
          }}
          inline
        />

      </div>
    </>
  );

  return (
    <div className="routine-page">

      {/* LEFT CORNER */}

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


      {/* RIGHT DESIGN */}

      <img
        src={triangleDesign}
        alt="Ribbon"
        className="corner-right-ribbon"
      />

      {/* BACK BUTTON */}

      <button
        className="routine-back-btn"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
      </button>

      {/* MAIN */}

      <div className="routine-container">

        <h1>Set Up a Routine</h1>

        {/* HOME */}

        {page === "home" && renderHome()}

        {/* STATE */}

        {page === "state" && renderState()}

        {/* TIME */}

        {page === "time" && renderTime()}

        {/* START CALENDAR */}

        {page === "start-calendar" &&
          renderStartCalendar()}

      </div>

      {/* ADD BUTTON */}

      {page === "home" && (
        <button
          className="add-btn"
          onClick={handleAdd}
          disabled={saving}
        >
          <FaPlus />
          {saving ? "Adding..." : "Add"}
        </button>
      )}

      {/* SUCCESS POPUP */}

      {showPopup && (
        <div className="popup-overlay">

          <div className="popup">

            <div className="success-circle">
              ✓
            </div>

            <h2>
              Routine Added
            </h2>

            <p>
              Your routine has been created successfully.
            </p>

            <button
              className="popup-btn"
              onClick={() => {
                setShowPopup(false);
                navigate("/scenes");
              }}
            >
              OK
            </button>

          </div>

        </div>
      )}

      {/* BOTTOM NAVIGATION */}

      <BottomNavigation />

    </div>
  );
}

export default Routine;