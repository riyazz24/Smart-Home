import "./RoomDetails.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import triangleDesign from "../assets/triangle design.svg";
import backIcon from "../assets/back.svg";

import lightbulb from "../assets/Lightbulb.svg";
import bottomNavbar from "../assets/bottom bar 1.svg";

import homeIcon from "../assets/home1.svg";
import schedulerIcon from "../assets/Smart.svg";
import userIcon from "../assets/User.svg";

import livingRoomIcon from "../assets/LivingRoom.svg";

function RoomDetails() {

    const navigate = useNavigate();

    /* =========================================
       ROOMS
    ========================================= */

    const [rooms, setRooms] = useState([]);

    const [selectedRoom, setSelectedRoom] = useState("");

    /* =========================================
       EDIT ROOM
    ========================================= */

    const [showRoomEditPopup, setShowRoomEditPopup] =
        useState(false);

    const [editingRoomId, setEditingRoomId] =
        useState(null);

    const [editingRoomName, setEditingRoomName] =
        useState("");

    /* =========================================
       DELETE ROOM
    ========================================= */

    const [showDeletePopup, setShowDeletePopup] =
        useState(false);

    const [roomToDelete, setRoomToDelete] =
        useState(null);

    /* =========================================
       DEVICES
    ========================================= */

    const [devices, setDevices] = useState([]);

    /* =========================================
       LOAD ROOMS
    ========================================= */

    useEffect(() => {

        const savedRooms =
            JSON.parse(localStorage.getItem("rooms")) || [];

        setRooms(savedRooms);

        if (savedRooms.length > 0) {

            setSelectedRoom(savedRooms[0].name);

        }

    }, []);

    /* =========================================
       ROOM EDIT
    ========================================= */

    const openRoomEdit = (room) => {

        setEditingRoomId(room.id);

        setEditingRoomName(room.name);

        setShowRoomEditPopup(true);

    };

    const saveRoomEdit = () => {

        if (editingRoomName.trim() === "") {

            alert("Enter Room Name");

            return;

        }

        const updatedRooms = rooms.map(room =>

            room.id === editingRoomId

                ? {
                    ...room,
                    name: editingRoomName.trim()
                }

                : room

        );

        setRooms(updatedRooms);

        localStorage.setItem(
            "rooms",
            JSON.stringify(updatedRooms)
        );

        /*
         * If the edited room was selected,
         * update the selected room name.
         */

        const oldRoom =
            rooms.find(room => room.id === editingRoomId);

        if (
            oldRoom &&
            selectedRoom === oldRoom.name
        ) {

            setSelectedRoom(
                editingRoomName.trim()
            );

        }

        setShowRoomEditPopup(false);

        setEditingRoomId(null);

        setEditingRoomName("");

    };

    /* =========================================
       DELETE ROOM
    ========================================= */

    const openDeletePopup = (room) => {

        setRoomToDelete(room);

        setShowDeletePopup(true);

    };

    const confirmDeleteRoom = () => {

        if (!roomToDelete) return;

        const updatedRooms =
            rooms.filter(
                room =>
                    room.id !== roomToDelete.id
            );

        setRooms(updatedRooms);

        localStorage.setItem(
            "rooms",
            JSON.stringify(updatedRooms)
        );

        /*
         * If deleted room was selected,
         * select another room.
         */

        if (
            selectedRoom === roomToDelete.name
        ) {

            if (updatedRooms.length > 0) {

                setSelectedRoom(
                    updatedRooms[0].name
                );

            } else {

                setSelectedRoom("");

            }

        }

        setShowDeletePopup(false);

        setRoomToDelete(null);

    };

    const cancelDeleteRoom = () => {

        setShowDeletePopup(false);

        setRoomToDelete(null);

    };

    /* =========================================
       DEVICE ON / OFF
    ========================================= */

    const toggleDevice = (id) => {

        setDevices(

            devices.map(device =>

                device.id === id

                    ? {
                        ...device,
                        status: !device.status
                    }

                    : device

            )

        );

    };

    /* =========================================
       DELETE DEVICE
    ========================================= */

    const deleteDevice = (id) => {

        setDevices(

            devices.filter(
                device => device.id !== id
            )

        );

    };

    /* =========================================
       EDIT DEVICE
    ========================================= */

    const [showEditPopup, setShowEditPopup] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [deviceName, setDeviceName] =
        useState("");

    const openEdit = (device) => {

        setEditingId(device.id);

        setDeviceName(device.name);

        setShowEditPopup(true);

    };

    const saveDevice = () => {

        if (deviceName.trim() === "") {

            alert("Enter Device Name");

            return;

        }

        setDevices(

            devices.map(device =>

                device.id === editingId

                    ? {
                        ...device,
                        name: deviceName.trim()
                    }

                    : device

            )

        );

        setShowEditPopup(false);

        setEditingId(null);

        setDeviceName("");

    };

    /* =========================================
       SCAN DEVICES
    ========================================= */

    const scanDevices = () => {

        const newDevice = {

            id: Date.now(),

            name:
                `Smart Device ${devices.length + 1}`,

            status: false

        };

        setDevices([

            ...devices,

            newDevice

        ]);

    };

    return (

        <div className="room-details-page">

            {/* =====================================
                LEFT CORNER
            ===================================== */}

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


            {/* =====================================
                TRIANGLE DESIGN
            ===================================== */}

            <img
                src={triangleDesign}
                className="triangle-design"
                alt=""
            />


            {/* =====================================
                BACK BUTTON
            ===================================== */}

            <button
                className="back-btn"
                onClick={() =>
                    navigate("/rooms")
                }
            >

                <img
                    src={backIcon}
                    alt=""
                />

            </button>


            {/* =====================================
                MAIN CARD
            ===================================== */}

            <div className="room-details-card">


                {/* HEADER */}

                <div className="room-header">

                    <h2>

                        <span>
                            All Rooms
                        </span>

                        {selectedRoom && (

                            <>
                                &nbsp; &gt; &nbsp;

                                {selectedRoom}

                            </>

                        )}

                    </h2>


                    <button
                        className="scan-btn"
                        onClick={scanDevices}
                    >

                        Scan Devices

                    </button>

                </div>


                {/* =================================
                    ROOM BODY
                ================================= */}

                <div className="room-body">


                    {/* =================================
                        SIDEBAR
                    ================================= */}

                    <div className="room-sidebar">

                        {rooms.length === 0 ? (

                            <p>
                                No Rooms Added
                            </p>

                        ) : (

                            rooms.map(room => (

                                <div
                                    key={room.id}
                                    className={

                                        selectedRoom === room.name

                                            ? "room-item-wrapper active-room-wrapper"

                                            : "room-item-wrapper"

                                    }
                                >


                                    {/* ROOM */}

                                    <button

                                        className={

                                            selectedRoom === room.name

                                                ? "room-item active-room"

                                                : "room-item"

                                        }

                                        onClick={() =>
                                            setSelectedRoom(
                                                room.name
                                            )
                                        }

                                    >

                                        <img
                                            src={livingRoomIcon}
                                            alt=""
                                        />

                                        <span>
                                            {room.name}
                                        </span>

                                    </button>


                                    {/* ROOM ACTIONS */}

                                    <div className="room-actions">


                                        {/* EDIT */}

                                        <button

                                            className="room-edit-btn"

                                            onClick={() =>
                                                openRoomEdit(room)
                                            }

                                            title="Edit Room"

                                        >

                                            ✎

                                        </button>


                                        {/* DELETE */}

                                        <button

                                            className="room-delete-btn"

                                            onClick={() =>
                                                openDeletePopup(room)
                                            }

                                            title="Delete Room"

                                        >

                                            🗑

                                        </button>


                                    </div>

                                </div>

                            ))

                        )}

                    </div>


                    {/* =================================
                        DEVICE TABLE
                    ================================= */}

                    <div className="device-table">


                        {/* TABLE HEADER */}

                        <div className="table-head">

                            <div>
                                Devices
                            </div>

                            <div>
                                Status
                            </div>

                            <div>
                                Action
                            </div>

                        </div>


                        {/* DEVICES */}

                        {devices.length === 0 ? (

                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px",
                                    color: "#888"
                                }}
                            >

                                No Devices Found

                            </div>

                        ) : (

                            devices.map(device => (

                                <div
                                    key={device.id}
                                    className="table-row"
                                >


                                    {/* DEVICE NAME */}

                                    <div>
                                        {device.name}
                                    </div>


                                    {/* STATUS */}

                                    <div>

                                        <label
                                            className="switch"
                                        >

                                            <input

                                                type="checkbox"

                                                checked={
                                                    device.status
                                                }

                                                onChange={() =>
                                                    toggleDevice(
                                                        device.id
                                                    )
                                                }

                                            />

                                            <span
                                                className="slider"
                                            ></span>

                                        </label>

                                    </div>


                                    {/* DEVICE ACTIONS */}

                                    <div>


                                        <button

                                            className="edit-btn"

                                            onClick={() =>
                                                openEdit(device)
                                            }

                                        >

                                            Edit

                                        </button>


                                        <button

                                            className="delete-btn"

                                            onClick={() =>
                                                deleteDevice(
                                                    device.id
                                                )
                                            }

                                        >

                                            Delete

                                        </button>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            </div>


            {/* =====================================
                EDIT DEVICE POPUP
            ===================================== */}

            {showEditPopup && (

                <div className="popup-overlay">

                    <div className="popup">

                        <button
                            className="popup-close"
                            onClick={() =>
                                setShowEditPopup(false)
                            }
                        >
                            ×
                        </button>

                        <h3>
                            EDIT DEVICE
                        </h3>

                        <input
                            value={deviceName}
                            onChange={(e) =>
                                setDeviceName(
                                    e.target.value
                                )
                            }
                            placeholder="Device Name"
                        />

                        <div className="popup-buttons">

                            <button
                                className="popup-add"
                                onClick={saveDevice}
                            >
                                Save
                            </button>

                            <button
                                className="popup-cancel"
                                onClick={() =>
                                    setShowEditPopup(false)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================
                EDIT ROOM POPUP
            ===================================== */}

            {showRoomEditPopup && (

                <div className="popup-overlay">

                    <div className="popup room-edit-popup">

                        <button
                            className="popup-close"
                            onClick={() =>
                                setShowRoomEditPopup(false)
                            }
                        >
                            ×
                        </button>

                        <h3>
                            EDIT ROOM
                        </h3>

                        <input
                            type="text"
                            value={editingRoomName}
                            onChange={(e) =>
                                setEditingRoomName(
                                    e.target.value
                                )
                            }
                            placeholder="Room Name"
                        />

                        <div className="popup-buttons">

                            <button
                                className="popup-add"
                                onClick={saveRoomEdit}
                            >
                                Save
                            </button>

                            <button
                                className="popup-cancel"
                                onClick={() =>
                                    setShowRoomEditPopup(false)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================
                DELETE ROOM POPUP
            ===================================== */}

            {showDeletePopup && (

                <div className="delete-popup-overlay">

                    <div className="delete-popup">


                        {/* DELETE ICON */}

                        <div className="delete-icon">

                            🗑

                        </div>


                        <h2>
                            Delete Room?
                        </h2>


                        <p>

                            Are you sure you want to
                            delete

                            <strong>
                                {" "}
                                "{roomToDelete?.name}"
                            </strong>
                            ?

                        </p>


                        <p className="delete-warning">

                            This action cannot be undone.

                        </p>


                        <div
                            className="delete-popup-buttons"
                        >


                            <button

                                className="delete-confirm-btn"

                                onClick={
                                    confirmDeleteRoom
                                }

                            >

                                Delete

                            </button>


                            <button

                                className="delete-cancel-btn"

                                onClick={
                                    cancelDeleteRoom
                                }

                            >

                                Cancel

                            </button>


                        </div>

                    </div>

                </div>

            )}


            {/* =====================================
                BOTTOM LIGHTBULB
            ===================================== */}

            <img
                src={lightbulb}
                className="dashboard-lightbulb"
                alt=""
            />


            <div
                className="dashboard-pink-circle"
            ></div>

            <div
                className="dashboard-red-circle"
            ></div>


            {/* =====================================
                BOTTOM NAVBAR
            ===================================== */}

            <div
                className="dashboard-navbar-wrapper"
            >

                <img
                    src={bottomNavbar}
                    className="dashboard-navbar-bg"
                    alt=""
                />


                {/* HOME */}

                <button

                    className="dashboard-nav-btn dashboard-home-btn"

                    onClick={() =>
                        navigate("/dashboard")
                    }

                >

                    <img
                        src={homeIcon}
                        alt=""
                    />

                    <span>
                        Home
                    </span>

                </button>


                {/* SCHEDULER */}

                <button

                    className="dashboard-nav-btn dashboard-scheduler-btn"

                    onClick={() =>
                        navigate("/scheduler")
                    }

                >

                    <img
                        src={schedulerIcon}
                        alt=""
                    />

                    <span>
                        Scheduler
                    </span>

                </button>


                {/* PROFILE */}

                <button

                    className="dashboard-nav-btn dashboard-profile-btn"

                    onClick={() =>
                        navigate("/profile")
                    }

                >

                    <img
                        src={userIcon}
                        alt=""
                    />

                    <span>
                        Profile
                    </span>

                </button>

            </div>

        </div>

    );

}

export default RoomDetails;