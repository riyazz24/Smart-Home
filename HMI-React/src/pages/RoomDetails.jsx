import "./RoomDetails.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import triangleDesign from "../assets/triangle design.svg";
import lightbulb from "../assets/Lightbulb.svg";
import bottomNavbar from "../assets/bottom bar 1.svg";
import { ArrowLeft, Home, CalendarClock, User } from "lucide-react";
import livingRoomIcon from "../assets/LivingRoom.svg";
import { listRooms, createRoom, updateRoom, deleteRoom } from "../util/RoomApi";
import { listThings, controlThing, updateThing, deleteThing } from "../util/ThingApi";
import { ensureAgentId } from "../util/AgentApi";

// Room objects from the backend use { roomId, roomName } (see GET /room/list).
// Devices from GET /thing/list use { thingUID, label, thingItemsListResponseList }.
// Everything below is normalized to { roomId, roomName } / { thingUid, label,
// status, channelId } right after the API call so the JSX only ever deals
// with one consistent shape.

function RoomDetails() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [showRoomEditPopup, setShowRoomEditPopup] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editingRoomName, setEditingRoomName] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [loadingDevices, setLoadingDevices] = useState(false);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deviceName, setDeviceName] = useState("");

  // Rooms.jsx (the "Add Room" landing page) redirects here as soon as any
  // room exists, so this page needs its own way to add more rooms too -
  // same popup pattern as Rooms.jsx, just reachable from this header instead.
  const [showAddRoomPopup, setShowAddRoomPopup] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [addRoomError, setAddRoomError] = useState("");
  const [addingRoom, setAddingRoom] = useState(false);

  const isLoggedIn = () => !!localStorage.getItem("sessionId");

  /* =========================================
      FETCH DEVICES FOR A ROOM (GET /thing/list)
  ========================================= */
  const fetchDevices = useCallback(async (roomId, roomName) => {
    if (!roomId) {
      setDevices([]);
      return;
    }
    setLoadingDevices(true);
    try {
      const { data, status } = await listThings(roomId);
      if (status === 200) {
        const mapped = (data.thingList || []).map((thing) => ({
          thingUid: thing.thingUID,
          label: thing.label,
          roomName: thing.roomName || roomName,
          status: false,
          channelId: thing.thingItemsListResponseList?.[0]?.channelId,
        }));
        setDevices(mapped);
      }
    } catch (err) {
      setDevices([]);
      console.error(err.response?.data?.message || "Failed to fetch devices");
    } finally {
      setLoadingDevices(false);
    }
  }, []);

  /* =========================================
      FETCH ROOM LIST (GET /room/list)
  ========================================= */
  const fetchRoomList = useCallback(async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      // /room/* and /thing/* are agent-scoped (X-AgentId header) - make sure
      // we have one resolved into localStorage before calling them.
      const hasAgent = await ensureAgentId();
      if (!hasAgent) {
        setRooms([]);
        setSelectedRoomId(null);
        setSelectedRoom("");
        setDevices([]);
        setLoadingRoom(false);
        console.warn('No paired agent found - room list requires a paired agent.');
        return;
      }

      const { data, status } = await listRooms();
      if (status === 200) {
        const roomList = data.roomList || [];
        setRooms(roomList);

        // Keep whichever room was already selected if it still exists,
        // otherwise fall back to the first room in the list.
        const stillExists = roomList.find((r) => r.roomId === selectedRoomId);
        const nextRoom = stillExists || roomList[0] || null;

        if (nextRoom) {
          setSelectedRoomId(nextRoom.roomId);
          setSelectedRoom(nextRoom.roomName);
          fetchDevices(nextRoom.roomId, nextRoom.roomName);
        } else {
          setSelectedRoomId(null);
          setSelectedRoom("");
          setDevices([]);
        }
      }
    } catch (err) {
      setRooms([]);
      const errorMessage = err.response?.data?.message || "Failed to fetch room";
      console.error(errorMessage);
    } finally {
      setLoadingRoom(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    fetchRoomList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectRoom = (room) => {
    setSelectedRoomId(room.roomId);
    setSelectedRoom(room.roomName);
    fetchDevices(room.roomId, room.roomName);
  };

  /* =========================================
      ROOM EDIT (PATCH /room/update)
  ========================================= */
  const openRoomEdit = (room) => {
    setEditingRoomId(room.roomId);
    setEditingRoomName(room.roomName);
    setShowRoomEditPopup(true);
  };

  const saveRoomEdit = async () => {
    if (editingRoomName.trim() === "") {
      alert("Enter Room Name");
      return;
    }

    try {
      const { status } = await updateRoom(editingRoomId, editingRoomName.trim());
      if (status === 200) {
        setShowRoomEditPopup(false);
        setEditingRoomId(null);
        setEditingRoomName("");
        await fetchRoomList();
      }
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || "Failed to update room");
    }
  };

  /* =========================================
      ADD ROOM (POST /room/create)
  ========================================= */
  const capitalize = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const addRoom = async () => {
    if (newRoomName.trim() === "") {
      setAddRoomError("Enter Room Name");
      return;
    }

    setAddRoomError("");
    setAddingRoom(true);

    try {
      const { status } = await createRoom(capitalize(newRoomName));
      if (status === 200) {
        setNewRoomName("");
        setShowAddRoomPopup(false);
        await fetchRoomList();
      }
    } catch (err) {
      setAddRoomError(
        err.response?.data?.error || err.response?.data?.message || "Failed to add room"
      );
    } finally {
      setAddingRoom(false);
    }
  };

  /* =========================================
      DELETE ROOM (DELETE /room/delete)
  ========================================= */
  const openDeletePopup = (room) => {
    setRoomToDelete(room);
    setShowDeletePopup(true);
  };

  const confirmDeleteRoom = async () => {
    if (!roomToDelete) return;

    try {
      const { status } = await deleteRoom(roomToDelete.roomId);
      if (status === 200) {
        setShowDeletePopup(false);
        setRoomToDelete(null);
        await fetchRoomList();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete room");
      setShowDeletePopup(false);
      setRoomToDelete(null);
    }
  };

  const cancelDeleteRoom = () => {
    setShowDeletePopup(false);
    setRoomToDelete(null);
  };

  /* =========================================
      DEVICE ON / OFF (POST /thing/items/control)
  ========================================= */
  const toggleDevice = async (device) => {
    if (!device?.thingUid || !device?.channelId) {
      console.warn("Device control unavailable - missing thingUid/channelId:", device);
      return;
    }
    const newStatus = !device.status;
    try {
      await controlThing(device.thingUid, device.channelId, newStatus ? "ON" : "OFF");
      setDevices((prev) =>
        prev.map((d) => (d.thingUid === device.thingUid ? { ...d, status: newStatus } : d))
      );
    } catch (err) {
      console.error(err.response?.data?.error || "Failed to send command");
    }
  };

  /* =========================================
      DELETE DEVICE (DELETE /thing/{thingId})
  ========================================= */
  const deleteDevice = async (device) => {
    try {
      await deleteThing(device.thingUid);
      setDevices((prev) => prev.filter((d) => d.thingUid !== device.thingUid));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete device");
    }
  };

  /* =========================================
      EDIT DEVICE (PATCH /thing/{thingId})
  ========================================= */
  const openEdit = (device) => {
    setEditingId(device.thingUid);
    setDeviceName(device.label);
    setShowEditPopup(true);
  };

  const saveDevice = async () => {
    if (deviceName.trim() === "") {
      alert("Enter Device Name");
      return;
    }

    try {
      await updateThing(editingId, { label: deviceName.trim() });
      setDevices((prev) =>
        prev.map((d) => (d.thingUid === editingId ? { ...d, label: deviceName.trim() } : d))
      );
      setShowEditPopup(false);
      setEditingId(null);
      setDeviceName("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update device");
    }
  };

  /* =========================================
      SCAN DEVICES - hands off to the dedicated
      Scan Devices page (POST /thing/scan lives there),
      passing along which room to attach found devices to.
  ========================================= */
  const scanDevices = () => {
    navigate("/scan-devices", { state: { roomId: selectedRoomId, roomName: selectedRoom } });
  };

  return (
    <div className="room-details-page">
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

      {/* TRIANGLE DESIGN */}
      <img src={triangleDesign} className="triangle-design" alt="" />

      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate("/rooms")}>
        <ArrowLeft size={24} />
      </button>

      {/* MAIN CARD */}
      <div className="room-details-card">
        {/* HEADER */}
        <div className="room-header">
          <h2>
            <span>All Rooms</span>
            {selectedRoom && <> &nbsp; &gt; &nbsp; {selectedRoom}</>}
          </h2>
          <div className="header-actions">
            <button className="scan-btn" onClick={() => setShowAddRoomPopup(true)}>
              + Add Room
            </button>
            <button className="scan-btn" onClick={scanDevices}>
              Scan Devices
            </button>
          </div>
        </div>

        {/* ROOM BODY */}
        <div className="room-body">
          {/* SIDEBAR */}
          <div className="room-sidebar">
            {rooms.length === 0 ? (
              <p>No Rooms Added</p>
            ) : (
              rooms.map((room) => (
                <div
                  key={room.roomId}
                  className={
                    selectedRoomId === room.roomId
                      ? "room-item-wrapper active-room-wrapper"
                      : "room-item-wrapper"
                  }
                >
                  <button
                    className={
                      selectedRoomId === room.roomId
                        ? "room-item active-room"
                        : "room-item"
                    }
                    onClick={() => selectRoom(room)}
                  >
                    <img src={livingRoomIcon} alt="" />
                    <span>{room.roomName}</span>
                  </button>

                  <div className="room-actions">
                    <button
                      className="room-edit-btn"
                      onClick={() => openRoomEdit(room)}
                      title="Edit Room"
                    >
                      ✎
                    </button>
                    <button
                      className="room-delete-btn"
                      onClick={() => openDeletePopup(room)}
                      title="Delete Room"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DEVICE TABLE */}
          <div className="device-table">
            <div className="table-head">
              <div>Devices</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {loadingDevices ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#888",
                }}
              >
                Loading devices...
              </div>
            ) : devices.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#888",
                }}
              >
                No Devices Found
              </div>
            ) : (
              devices.map((device) => (
                <div key={device.thingUid} className="table-row">
                  <div>{device.label}</div>
                  <div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={device.status}
                        onChange={() => toggleDevice(device)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="device-actions">
                    <button
                      className="edit-btn"
                      onClick={() => openEdit(device)}
                      title="Edit Device"
                    >
                      ✎
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteDevice(device)}
                      title="Delete Device"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* EDIT DEVICE POPUP */}
      {showEditPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button
              className="popup-close"
              onClick={() => setShowEditPopup(false)}
            >
              ×
            </button>
            <h3>EDIT DEVICE</h3>
            <input
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="Device Name"
            />
            <div className="popup-buttons">
              <button className="popup-add" onClick={saveDevice}>
                Save
              </button>
              <button
                className="popup-cancel"
                onClick={() => setShowEditPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ROOM POPUP */}
      {showAddRoomPopup && (
        <div className="popup-overlay">
          <div className="popup room-edit-popup">
            <button
              className="popup-close"
              onClick={() => {
                setShowAddRoomPopup(false);
                setNewRoomName("");
                setAddRoomError("");
              }}
            >
              ×
            </button>
            <h3>ADD ROOM</h3>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room Name"
            />
            {addRoomError && <p style={{ color: "#d10000", margin: "8px 0 0" }}>{addRoomError}</p>}
            <div className="popup-buttons">
              <button className="popup-add" onClick={addRoom} disabled={addingRoom}>
                {addingRoom ? "Adding..." : "Add"}
              </button>
              <button
                className="popup-cancel"
                onClick={() => {
                  setShowAddRoomPopup(false);
                  setNewRoomName("");
                  setAddRoomError("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ROOM POPUP */}
      {showRoomEditPopup && (
        <div className="popup-overlay">
          <div className="popup room-edit-popup">
            <button
              className="popup-close"
              onClick={() => setShowRoomEditPopup(false)}
            >
              ×
            </button>
            <h3>EDIT ROOM</h3>
            <input
              type="text"
              value={editingRoomName}
              onChange={(e) => setEditingRoomName(e.target.value)}
              placeholder="Room Name"
            />
            <div className="popup-buttons">
              <button className="popup-add" onClick={saveRoomEdit}>
                Save
              </button>
              <button
                className="popup-cancel"
                onClick={() => setShowRoomEditPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ROOM POPUP */}
      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <div className="delete-icon">🗑</div>
            <h2>Delete Room?</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>"{roomToDelete?.roomName}"</strong>?
            </p>
            <p className="delete-warning">This action cannot be undone.</p>
            <div className="delete-popup-buttons">
              <button className="delete-confirm-btn" onClick={confirmDeleteRoom}>
                Delete
              </button>
              <button className="delete-cancel-btn" onClick={cancelDeleteRoom}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM LIGHTBULB */}
      <img src={lightbulb} className="dashboard-lightbulb" alt="" />
      <div className="dashboard-pink-circle"></div>
      <div className="dashboard-red-circle"></div>

      {/* BOTTOM NAVBAR */}
      <div className="dashboard-navbar-wrapper">
        <img src={bottomNavbar} className="dashboard-navbar-bg" alt="" />
        <button
          className="dashboard-nav-btn dashboard-home-btn"
          onClick={() => navigate("/dashboard")}
        >
          <Home size={30} />
          <span>Home</span>
        </button>
        <button
          className="dashboard-nav-btn dashboard-scheduler-btn"
          onClick={() => navigate("/scheduler")}
        >
          <CalendarClock size={30} />
          <span>Scheduler</span>
        </button>
        <button
          className="dashboard-nav-btn dashboard-profile-btn"
          onClick={() => navigate("/profile")}
        >
          <User size={30} />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
}

export default RoomDetails;