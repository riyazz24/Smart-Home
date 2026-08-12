import "./AllDevices.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import Switch from "react-switch";
import triangleDesign from "../assets/triangle design.svg";
import {
  FaArrowLeft,
  FaSearch,
  FaTv,
  FaLightbulb,
  FaFan,
  FaLock,
  FaEdit,
  FaTrash,
  FaPlus,
  FaHome,
  FaUser
} from "react-icons/fa";

function AllDevices() {

  const navigate = useNavigate();

  /* -----------------------------
      CRUD STATES
  ------------------------------*/

  const [devices, setDevices] = useState([
    {
      id:1,
      icon:<FaTv />,
      name:"Android TV",
      room:"Living Room",
      status:true
    },
    {
      id:2,
      icon:<FaLightbulb />,
      name:"Smart Bulb",
      room:"Bedroom",
      status:false
    },
    {
      id:3,
      icon:<FaFan />,
      name:"Smart Fan",
      room:"Kitchen",
      status:true
    },
    {
      id:4,
      icon:<FaLock />,
      name:"Smart Lock",
      room:"Main Door",
      status:false
    }
  ]);

  const [deviceName,setDeviceName]=useState("");
  const [roomName,setRoomName]=useState("");

  const [selectedDevice,setSelectedDevice]=useState(null);

  const [showAdd,setShowAdd]=useState(false);
  const [showEdit,setShowEdit]=useState(false);
  const [showDelete,setShowDelete]=useState(false);
  const [showSuccess,setShowSuccess]=useState(false);

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
              onClick={() => {

                setDeviceName("");
                setRoomName("");

                setShowAdd(true);

              }}
            >

              <FaPlus />

              Add Device

            </button>

          </div>

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

<tr key={device.id}>

    <td className="device-column">

        <div className="device-info">

            <div className="device-icon">

                {device.icon}

            </div>

            <span>

                {device.name}

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

            onChange={() => {

                setDevices(

                    devices.map((d)=>

                        d.id===device.id

                        ?{

                            ...d,

                            status:!d.status

                        }

                        :d

                    )

                );

            }}

        />

    </td>

    <td>

        <div className="action-buttons">

            <button

                className="edit-btn"

                onClick={() => {

                    setSelectedDevice(device);

                    setDeviceName(device.name);

                    setRoomName(device.room);

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
      {/* =========================
              ADD DEVICE POPUP
      ========================== */}

      {showAdd && (

        <div className="popup-overlay">

          <div className="popup">

            <h2>Add Device</h2>

            <input
              type="text"
              placeholder="Device Name"
              value={deviceName}
              onChange={(e)=>setDeviceName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e)=>setRoomName(e.target.value)}
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

                  if(deviceName.trim()==="" || roomName.trim()===""){
                    alert("Please fill all fields");
                    return;
                  }

                  setDevices([
                    ...devices,
                    {
                      id:Date.now(),
                      icon:<FaTv />,
                      name:deviceName,
                      room:roomName,
                      status:false
                    }
                  ]);

                  setShowAdd(false);
                  setShowSuccess(true);

                  setDeviceName("");
                  setRoomName("");

                }}
              >
                Add Device
              </button>

            </div>

          </div>

        </div>

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

<input
type="text"
placeholder="Room Name"
value={roomName}
onChange={(e)=>setRoomName(e.target.value)}
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
onClick={()=>{

setDevices(

devices.map((d)=>

d.id===selectedDevice.id

?{

...d,

name:deviceName,

room:roomName

}

:d

)

);

setShowEdit(false);

setShowSuccess(true);

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

<b> {selectedDevice?.name}</b> ?

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
onClick={()=>{

setDevices(

devices.filter(

(d)=>d.id!==selectedDevice.id

)

);

setShowDelete(false);

setShowSuccess(true);

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

Action Completed Successfully

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