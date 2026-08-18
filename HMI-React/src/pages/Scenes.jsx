import "./Scenes.css";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Pencil } from "lucide-react";
import horizontalLine from "../assets/horizontal-line.svg";
import pinkBackground from "../assets/no devices.svg";
import triangleDesign from "../assets/triangle design.svg";
import BottomNavigation from "../components/BottomNavigation";
import { listRules, enableRule, deleteRule } from "../util/RuleApi";
import { listThings } from "../util/ThingApi";
import { ensureAgentId } from "../util/AgentApi";
import {
    parseCronExpression,
    parseDatesFromCronExpression,
    getWeekdaysForDates,
    formatDateForDisplay,
} from "../util/CronUtil";

const parseScene = (scenesObj) => {
    let trigger = {};
    try {
        trigger = scenesObj?.triggerJson ? JSON.parse(scenesObj.triggerJson) : {};
    } catch {
        trigger = {};
    }
    let actions = [];
    try {
        actions = scenesObj?.actionsJson ? JSON.parse(scenesObj.actionsJson) : [];
    } catch {
        actions = [];
    }

    const dates = parseDatesFromCronExpression(trigger.cronExpression);
    const { time, days: recurringDays } = parseCronExpression(trigger.cronExpression);
    const days = dates.length > 0 ? getWeekdaysForDates(dates) : recurringDays;
    const firstAction = actions[0] || {};
    return { time, days, dates, itemName: firstAction.itemName, command: firstAction.command };
};


function Scenes() {

    const navigate = useNavigate();
    const isLoggedIn = () => !!localStorage.getItem("sessionId");
    const [scenes, setScenes] = useState([]);
    const [deviceList, setDeviceList] = useState([]);
    const [loadingScenes, setLoadingScenes] = useState(true);

    const fetchScenes = useCallback(async () => {
        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }
        setLoadingScenes(true);
        try {
            const hasAgent = await ensureAgentId();
            if (!hasAgent) {
                setScenes([]);
                return;
            }
            const { data, status } = await listRules();
            if (status === 200) {
                setScenes(data.ruleList || []);
            }
        } catch (err) {
            setScenes([]);
            console.error(err.response?.data?.message || "Failed to fetch scenes");
        } finally {
            setLoadingScenes(false);
        }
    }, [navigate]);

    const fetchDevices = useCallback(async () => {
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
            }
        } catch (err) {
            setDeviceList([]);
            console.error(err.response?.data?.message || "Failed to fetch devices");
        }
    }, []);

    useEffect(() => {
        fetchScenes();
        fetchDevices();
    }, [fetchScenes, fetchDevices]);

    const handleToggleScene = async (scenesObj) => {
        const newStatus = scenesObj.status === "ENABLED" ? "DISABLED" : "ENABLED";
        setScenes((prev) =>
            prev.map((s) => (s.ruleUid === scenesObj.ruleUid ? { ...s, status: newStatus } : s))
        );
        try {
            await enableRule(scenesObj.ruleUid, newStatus);
        } catch (err) {
            setScenes((prev) =>
                prev.map((s) => (s.ruleUid === scenesObj.ruleUid ? { ...s, status: scenesObj.status } : s))
            );
            console.error(err.response?.data?.message || "Failed to update scene");
        }
    };

    const handleDelete = async (scenesObj) => {
        try {
            await deleteRule(scenesObj.ruleUid);
            setScenes((prev) => prev.filter((s) => s.ruleUid !== scenesObj.ruleUid));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete scene");
        }
    };

    const handleEdit = () => {
        alert("Editing a scene isn't supported by the backend yet. You can delete and recreate it instead.");
    };

    const handleAdd = () => {

        navigate("/routine", {
            state: {
                edit: false,
            },
        });

    };

    return (

        <div className="scenes-container">


            {/* =========================================
                LEFT CORNER DESIGN
            ========================================= */}

            <div className="corner-design">

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

            </div>


            {/* =========================================
                TOP RIGHT DESIGN
            ========================================= */}

            <img
                src={triangleDesign}
                alt="Triangle"
                className="triangle-design"
            />


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="scenes-header">

                <h1 className="scenes-title">
                    Your Scenes
                </h1>

            </div>


            {/* =========================================
                HORIZONTAL LINE
            ========================================= */}

            <img
                src={horizontalLine}
                alt=""
                className="horizontal-line"
            />


            {/* =========================================
                EMPTY STATE / TABLE
            ========================================= */}

            {loadingScenes ? (

                <div className="empty-state">
                    <p style={{ color: "#888" }}>Loading scenes...</p>
                </div>

            ) : scenes.length === 0 ? (

                /* -------------------------------------
                   NO SCENES
                ------------------------------------- */

                <div className="empty-state">

                    <img
                        src={pinkBackground}
                        alt="No Scenes"
                        className="background-svg"
                    />

                </div>

            ) : (

                /* -------------------------------------
                   SCENES TABLE
                ------------------------------------- */

                <div className="table-wrapper">

                    <table className="scene-table">

                        <thead>

                            <tr>

                                <th>
                                    Devices
                                </th>

                                <th>
                                    Date(s)
                                </th>

                                <th>
                                    Time
                                </th>

                                <th>
                                    Days
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {scenes.map((scenesObj) => {

                                const { time, days, dates, itemName, command } = parseScene(scenesObj);
                                const deviceLabel = deviceList.find((d) => d.itemName === itemName)?.label || itemName || "Unknown device";

                                return (

                                <tr key={scenesObj.ruleUid}>

                                    {/* DEVICE */}

                                    <td>
                                        {deviceLabel} <span style={{ color: "#888" }}>({command === "ON" ? "On" : "Off"})</span>
                                    </td>


                                    {/* DATE(S) */}

                                    <td>
                                        {dates.length > 0 ? dates.map(formatDateForDisplay).join(", ") : "—"}
                                    </td>


                                    {/* TIME */}

                                    <td>
                                        {time || "—"}
                                    </td>


                                    {/* DAYS */}

                                    <td>
                                        {days && days.length > 0 ? days.map((d) => d.slice(0, 3)).join(", ") : "—"}
                                    </td>


                                    {/* STATUS TOGGLE */}

                                    <td>
                                        <label className="status-switch">
                                            <input
                                                type="checkbox"
                                                checked={scenesObj.status === "ENABLED"}
                                                onChange={() => handleToggleScene(scenesObj)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>


                                    {/* =================================
                                        ACTIONS
                                    ================================= */}

                                    <td className="actions-cell">

                                        <div className="action-buttons">

                                            {/* EDIT */}

                                            <Pencil
                                                size={20}
                                                className="action-svg"
                                                onClick={() =>
                                                    handleEdit()
                                                }
                                            />

                                            {/* DELETE */}

                                            <FaTrash
                                                className="delete-icon"
                                                onClick={() =>
                                                    handleDelete(scenesObj)
                                                }
                                            />


                                        </div>

                                    </td>

                                </tr>

                            );})}

                        </tbody>

                    </table>

                </div>

            )}


            {/* =========================================
                ADD BUTTON
            ========================================= */}

            <button
                className="add-btn"
                onClick={handleAdd}
            >

                <span>
                    Add
                </span>

                <FaPlus />

            </button>


            {/* =========================================
                BOTTOM NAVIGATION
            ========================================= */}

            <BottomNavigation />


        </div>

    );
}


export default Scenes;