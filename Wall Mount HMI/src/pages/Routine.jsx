import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Routine.css";

import triangleDesign from "../assets/triangle design.svg";

import BottomNavigation from "../components/BottomNavigation";

import {
  FaArrowLeft,
  FaCloudSun,
  FaClock,
  FaChevronRight,
  FaChevronDown,
  FaCalendarAlt,
  FaPlus,
  FaCloudRain,
  FaSun,
  FaCloud,
  FaBolt,
  FaCheck
} from "react-icons/fa";

import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Routine() {
  const navigate = useNavigate();
  const location = useLocation();

  const editMode = location.state?.edit || false;
  const editIndex = location.state?.index;

  const [page, setPage] = useState("home");

  const [device, setDevice] = useState("");

  const [weather, setWeather] = useState("");

  const [startTime, setStartTime] = useState("11:30");
  const [endTime, setEndTime] = useState("12:30");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showPopup, setShowPopup] = useState(false);

  /* =========================
     WEATHER OPTIONS
  ========================= */

  const weatherOptions = [
    {
      value: "Rain",
      label: "Rain",
      icon: <FaCloudRain />,
      className: "weather-rain"
    },
    {
      value: "Sunny",
      label: "Sunny",
      icon: <FaSun />,
      className: "weather-sunny"
    },
    {
      value: "Cloudy",
      label: "Cloudy",
      icon: <FaCloud />,
      className: "weather-cloudy"
    },
    {
      value: "Stormy",
      label: "Stormy",
      icon: <FaBolt />,
      className: "weather-storm"
    }
  ];

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

  /* =========================
     SAVE ROUTINE
  ========================= */

  const handleAdd = () => {
    if (device === "") {
      setPage("home");
      return;
    }

    if (weather === "" && page !== "weather") {
      setPage("weather");
      return;
    }

    const newScene = {
      device,
      weather,
      startDate: formatDate(startDate),
      startTime,
      endDate: formatDate(endDate),
      endTime
    };

    const oldScenes =
      JSON.parse(localStorage.getItem("scenes")) || [];

    if (editMode && editIndex !== undefined) {
      oldScenes[editIndex] = newScene;
    } else {
      oldScenes.push(newScene);
    }

    localStorage.setItem(
      "scenes",
      JSON.stringify(oldScenes)
    );

    setShowPopup(true);
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
        <option value="">Select Device</option>
        <option value="Light">Light</option>
        <option value="Fan">Fan</option>
        <option value="AC">Air Conditioner</option>
        <option value="TV">TV</option>
      </select>

      {/* WEATHER */}

      <div
        className={`routine-option ${
          weather ? "selected-option" : ""
        }`}
        onClick={() => setPage("weather")}
      >
        <div className="card-left">
          <FaCloudSun className="weather" />

          <span>
            {weather
              ? `Weather: ${weather}`
              : "Changes in weather"}
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
    </>
  );

  /* =========================
     WEATHER PAGE
  ========================= */

  const renderWeather = () => (
    <>
      <div className="sub-page-header">
        <button
          className="small-back-btn"
          onClick={() => setPage("home")}
        >
          <FaArrowLeft />
        </button>

        <h2>Select Weather</h2>
      </div>

      <div className="weather-options">

        {weatherOptions.map((item) => (
          <div
            key={item.value}
            className={`weather-option ${
              weather === item.value
                ? "weather-option-selected"
                : ""
            }`}
            onClick={() => {
              setWeather(item.value);
              setPage("home");
            }}
          >
            <div
              className={`weather-option-icon ${item.className}`}
            >
              {item.icon}
            </div>

            <span>{item.label}</span>

            {weather === item.value && (
              <FaCheck className="weather-check" />
            )}
          </div>
        ))}

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

      {/* END TIME */}

      <div className="time-section">

        <div className="time-section-title">
          End Time
        </div>

        <div className="time-input-box">
          <TimePicker
            onChange={setEndTime}
            value={endTime}
            disableClock={true}
            clearIcon={null}
            format="h:mm a"
          />
        </div>

      </div>

      {/* END DATE */}

      <div
        className="date-input-box"
        onClick={() => setPage("end-calendar")}
      >
        <span>{formatDate(endDate)}</span>

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

  /* =========================
     END CALENDAR
  ========================= */

  const renderEndCalendar = () => (
    <>
      <div className="sub-page-header">

        <button
          className="small-back-btn"
          onClick={() => setPage("time")}
        >
          <FaArrowLeft />
        </button>

        <h2>End Date</h2>

      </div>

      <div className="calendar-wrapper">

        <DatePicker
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);
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

        {/* WEATHER */}

        {page === "weather" && renderWeather()}

        {/* TIME */}

        {page === "time" && renderTime()}

        {/* START CALENDAR */}

        {page === "start-calendar" &&
          renderStartCalendar()}

        {/* END CALENDAR */}

        {page === "end-calendar" &&
          renderEndCalendar()}

      </div>

      {/* ADD BUTTON */}

      {page === "home" && (
        <button
          className="add-btn"
          onClick={handleAdd}
        >
          <FaPlus />
          Add
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
              {editMode
                ? "Routine Updated"
                : "Routine Added"}
            </h2>

            <p>
              {editMode
                ? "Your routine has been updated successfully."
                : "Your routine has been created successfully."}
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