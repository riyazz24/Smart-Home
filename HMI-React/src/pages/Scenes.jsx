import "./Scenes.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaPlus, FaTrash } from "react-icons/fa";

import wrapIcon from "../assets/wrap.svg";
import editIcon from "../assets/Vector-4.svg";

import horizontalLine from "../assets/horizontal-line.svg";
import pinkBackground from "../assets/no devices.svg";
import triangleDesign from "../assets/triangle design.svg";

import BottomNavigation from "../components/BottomNavigation";


function Scenes() {

    const navigate = useNavigate();


    /* =========================================
       LOAD SCENES FROM LOCAL STORAGE
    ========================================= */

    const [scenes, setScenes] = useState(() => {
        return JSON.parse(localStorage.getItem("scenes")) || [];
    });


    /* =========================================
       DELETE SCENE
    ========================================= */

    const handleDelete = (index) => {

        const updated = scenes.filter((_, i) => i !== index);

        setScenes(updated);

        localStorage.setItem(
            "scenes",
            JSON.stringify(updated)
        );
    };


    /* =========================================
       EDIT SCENE
    ========================================= */

    const handleEdit = (index) => {

        navigate("/routine", {
            state: {
                edit: true,
                index: index,
                scene: scenes[index],
            },
        });
    };


    /* =========================================
       SETTINGS
    ========================================= */

    const handleSettings = (index) => {

        console.log("Settings", index);

    };


    /* =========================================
       ADD NEW SCENE
    ========================================= */

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

            {scenes.length === 0 ? (

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
                                    Start Date
                                </th>

                                <th>
                                    Start Time
                                </th>

                                <th>
                                    End Date
                                </th>

                                <th>
                                    End Time
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {scenes.map((scene, index) => (

                                <tr key={index}>

                                    {/* DEVICE */}

                                    <td>
                                        {scene.device}
                                    </td>


                                    {/* START DATE */}

                                    <td>
                                        {scene.startDate}
                                    </td>


                                    {/* START TIME */}

                                    <td>
                                        {scene.startTime}
                                    </td>


                                    {/* END DATE */}

                                    <td>
                                        {scene.endDate}
                                    </td>


                                    {/* END TIME */}

                                    <td>
                                        {scene.endTime}
                                    </td>


                                    {/* =================================
                                        ACTIONS
                                    ================================= */}

                                    <td className="actions-cell">

                                        <div className="action-buttons">


                                            {/* SETTINGS */}

                                            <img
                                                src={wrapIcon}
                                                alt="settings"
                                                className="action-svg"
                                                onClick={() =>
                                                    handleSettings(index)
                                                }
                                            />


                                            {/* EDIT */}

                                            <img
                                                src={editIcon}
                                                alt="edit"
                                                className="action-svg"
                                                onClick={() =>
                                                    handleEdit(index)
                                                }
                                            />


                                            {/* DELETE */}

                                            <FaTrash
                                                className="delete-icon"
                                                onClick={() =>
                                                    handleDelete(index)
                                                }
                                            />


                                        </div>

                                    </td>

                                </tr>

                            ))}

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