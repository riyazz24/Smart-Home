import { useState } from "react";
import "./CreateScene.css";

import { FaChevronDown, FaChevronUp, FaEdit, FaTrash } from "react-icons/fa";
import horizontalLine from "../assets/horizontal-line.svg";
import timeIcon from "../assets/time.svg";
import weatherIcon from "../assets/weather.svg";
import { FaSnowflake, FaFan } from "react-icons/fa";
// import cornerDesign from "../assets/corner-design.svg";
import triangleDesign from "../assets/triangle design.svg";

const CreateScene = () => {
  const [showConditions, setShowConditions] = useState(false);
  const [showTask, setShowTask] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [weather, setWeather] = useState("");

  const [editTime, setEditTime] = useState(false);
  const [editWeather, setEditWeather] = useState(false);

  const [fridgeOn, setFridgeOn] = useState(true);
  const [fanOn, setFanOn] = useState(true);

  return (
    <div className="create-scene-container">
      {/* Corner Designs */}
      <div className="corner-design">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="190"
          viewBox="0 0 300 190"
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
      </div>
      {/* Right Corner Design */}
      <img
        src={triangleDesign}
        alt="Triangle Design"
        className="triangle-design"
      />
      {/* Horizontal Line */}

      <img
        src={horizontalLine}
        alt="horizontal line"
        className="horizontal-line"
      />

      {/* Create Scene Button */}

      <div className="top-button">
        <button className="create-btn">Create Scene</button>
      </div>

      {/* CONDITIONS */}

      <div
        className="dropdown-header"
        onClick={() => setShowConditions(!showConditions)}
      >
        <h2>Conditions</h2>

        {showConditions ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {showConditions && (
        <div className="dropdown-content">
          {/* TIME */}

          <div className="condition-card">
            <div className="left-section">
              <img src={timeIcon} alt="time" />

              <div>
                <h3>Time</h3>

                <p>
                  {selectedDate} {selectedTime}
                </p>
              </div>
            </div>

            <FaEdit
              className="icon-button"
              onClick={() => setEditTime(!editTime)}
            />
          </div>

          {editTime && (
            <div className="edit-box">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          )}

          {/* WEATHER */}

          <div className="condition-card">
            <div className="left-section">
              <img src={weatherIcon} alt="weather" />

              <div>
                <h3>Weather</h3>

                <p>{weather ? `Above ${weather}°C` : ""}</p>
              </div>
            </div>

            <FaEdit
              className="icon-button"
              onClick={() => setEditWeather(!editWeather)}
            />
          </div>

          {editWeather && (
            <div className="edit-box">
              <input
                type="number"
                placeholder="Temperature"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* TASK */}

      <div className="dropdown-header" onClick={() => setShowTask(!showTask)}>
        <h2>Task</h2>

        {showTask ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {showTask && (
        <div className="dropdown-content">
          {/* Refrigerator */}

          <div className="task-card">
            <div className="left-section">
              <FaSnowflake className="device-icon" />
              <div>
                <h3>Refrigerator_1</h3>
                <p>Large Home Appliance</p>
              </div>
            </div>

            <div className="task-actions">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={fridgeOn}
                  onChange={() => setFridgeOn(!fridgeOn)}
                />

                <span className="slider"></span>
              </label>

              <FaTrash className="delete-icon" />
            </div>
          </div>

          {/* Fan */}

          <div className="task-card">
            <div className="left-section">
              <FaFan className="device-icon" />

              <div>
                <h3>Ceiling Fan_3</h3>
                <p>Lighting</p>
              </div>
            </div>

            <div className="task-actions">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={fanOn}
                  onChange={() => setFanOn(!fanOn)}
                />

                <span className="slider"></span>
              </label>

              <FaTrash className="delete-icon" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateScene;
