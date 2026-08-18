import "./AllDevices.css";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import Switch from "react-switch";
import triangleDesign from "../assets/triangle design.svg";
import {
  FaArrowLeft,
  FaSearch,
  FaTv,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { listThings, controlThing, updateThing, deleteThing } from "../util/ThingApi";
import { ensureAgentId } from "../util/AgentApi";

function AllDevices() {

  const navigate = useNavigate();

  /* -----------------------------
      CRUD STATES
  ------------------------------*/

  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  const [deviceName,setDeviceName]=useState("");

  const [selectedDevice,setSelectedDevice]=useState(null);

  const [showEdit,setShowEdit]=useState(false);
  const [showDelete,setShowDelete]=useState(false);
  const [showSuccess,setShowSuccess]=useState(false);
  const [successMessage,setSuccessMessage]=useState("Action Completed Successfully");

  const isLoggedIn = () => !!localStorage.getItem("sessionId");

  /* =========================================
      FETCH ALL DEVICES (GET /thing/list, no
      roomId -> every device across every room,
      same call CRA's AllDevicesContent.js makes)
  ========================================= */
  const fetchDevices = useCallback(async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    setLoadingDevices(true);
    try {
      // Devices are agent-scoped (X-AgentId header) - make sure we have one
      // resolved into localStorage before calling /thing/list.
      const hasAgent = await ensureAgentId();
      if (!hasAgent) {
        setDevices([]);
        return;
      }

      const { data, status } = await listThings();
      if (status === 200) {
        const mapped = (data.thingList || []).map((thing) => ({
          thingUid: thing.thingUID,
          label: thing.label,
          room: thing.roomName || "—",
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
  }, [navigate]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  /* =========================================
      TOGGLE (POST /thing/items/control)
  ========================================= */
  const toggleDevice = async (device) => {
    if (!device?.thingUid || !device?.channelId) {
      console.warn("Device control unavailable - missing thingUid/channelId:", device);
      return;
    }
    const newStatus = !device.status;

    // Optimistic update - flip immediately, revert if the request fails.
    setDevices((prev) =>
      prev.map((d) => (d.thingUid === device.thingUid ? { ...d, status: newStatus } : d))
    );

    try {
      await controlThing(device.thingUid, device.channelId, newStatus ? "ON" : "OFF");
    } catch (err) {
      setDevices((prev) =>
        prev.map((d) => (d.thingUid === device.thingUid ? { ...d, status: !newStatus } : d))
      );
      console.error(err.response?.data?.message || "Sending command failed");
    }
  };

  return(

<div className="devices-page">
          {/* =========================
            TOP DECORATION
      ========================== */}

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
      {/* =========================
            HEADER
      ========================== */}


      <div className="main-container">

        {/* Back Button */}

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard-menu")}
        >
          <FaArrowLeft />
        </button>

        {/* Sidebar */}

        <aside className="sidebar1">

          <div className="sidebar-item active-item">

            <FaTv />

            <span>All Devices</span>

          </div>

          <div
            className="sidebar-item"
            onClick={() => navigate("/scan-devices")}
          >

            <FaSearch />

            <span>Scan Devices</span>

          </div>

        </aside>

        {/* =========================
                CONTENT
        ========================== */}

        <section className="content">

          <div className="content-header">

            <h1>All Devices</h1>

            <button
              className="add-device-btn"
              onClick={() => navigate("/scan-devices")}
            >

              <FaPlus />

              Add Device

            </button>

          </div>

          {loadingDevices ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
              Loading devices...
            </div>
          ) : devices.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
              No Devices Found
            </div>
          ) : (
          <table className="device-table">

            <thead>

              <tr>

                <th>Device</th>

                <th>Room</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>
                {devices.map((device) => (

<tr key={device.thingUid}>

    <td className="device-column">

        <div className="device-info">

            <div className="device-icon">

                <FaTv />

            </div>

            <span>

                {device.label}

            </span>

        </div>

    </td>

    <td>

        {device.room}

    </td>

    <td>

        <Switch

            checked={device.status}

            onColor="#34C759"
            offColor="#D9D9D9"

            checkedIcon={false}
            uncheckedIcon={false}

            height={22}
            width={46}

            onChange={() => toggleDevice(device)}

        />

    </td>

    <td>

        <div className="action-buttons">

            <button

                className="edit-btn"

                onClick={() => {

                    setSelectedDevice(device);

                    setDeviceName(device.label);

                    setShowEdit(true);

                }}

            >

                <FaEdit />

            </button>

            <button

                className="delete-btn"

                onClick={() => {

                    setSelectedDevice(device);

                    setShowDelete(true);

                }}

            >

                <FaTrash />

            </button>

        </div>

    </td>

</tr>

))}
</tbody>

</table>
          )}
      {/* =========================
        EDIT DEVICE
========================= */}

{showEdit && (

<div className="popup-overlay">

<div className="popup">

<h2>Edit Device</h2>

<input
type="text"
placeholder="Device Name"
value={deviceName}
onChange={(e)=>setDeviceName(e.target.value)}
/>

<div className="popup-buttons">

<button
className="cancel-btn"
onClick={()=>setShowEdit(false)}
>

Cancel

</button>

<button
className="save-btn"
onClick={async ()=>{

  if (deviceName.trim() === "") {
    alert("Enter Device Name");
    return;
  }

  const device = selectedDevice;
  const trimmedName = deviceName.trim();

  try {
    await updateThing(device.thingUid, { label: trimmedName });
    setDevices(
      devices.map((d)=>
        d.thingUid===device.thingUid
        ? { ...d, label: trimmedName }
        : d
      )
    );
    setShowEdit(false);
    setSuccessMessage("Device Updated Successfully");
    setShowSuccess(true);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to update device");
  }

}}
>

Save

</button>

</div>

</div>

</div>

)}

{/* =========================
      DELETE POPUP
========================= */}

{showDelete && (

<div className="popup-overlay">

<div className="popup small-popup">

<h2>Delete Device?</h2>

<p>

Are you sure you want to delete

<b> {selectedDevice?.label}</b> ?

</p>

<div className="popup-buttons">

<button
className="cancel-btn"
onClick={()=>setShowDelete(false)}
>

Cancel

</button>

<button
className="delete-confirm-btn"
onClick={async ()=>{

  const device = selectedDevice;

  try {
    await deleteThing(device.thingUid);
    setDevices(
      devices.filter(
        (d)=>d.thingUid!==device.thingUid
      )
    );
    setShowDelete(false);
    setSuccessMessage("Device Deleted Successfully");
    setShowSuccess(true);
  } catch (err) {
    setShowDelete(false);
    alert(err.response?.data?.message || "Failed to delete device");
  }

}}
>

Delete

</button>

</div>

</div>

</div>

)}

{/* =========================
      SUCCESS POPUP
========================= */}

{showSuccess && (

<div className="popup-overlay">

<div className="popup success-popup">

<div className="success-circle">

✓

</div>

<h2>

Success

</h2>

<p>

{successMessage}

</p>

<button
className="save-btn"
onClick={()=>setShowSuccess(false)}
>

Done

</button>

</div>

</div>

)}

</section>

</div>
<BottomNavigation/>
</div>

);

}

export default AllDevices;