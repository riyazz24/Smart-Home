import "./Profile.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import rightRibbon from "../assets/triangle design.svg";

import {
  FaArrowLeft,
  FaUser,
  FaSignOutAlt,
  FaEdit,
  FaHome,
  FaClock,
  FaUserCircle
} from "react-icons/fa";
function Profile() {

  const navigate = useNavigate();

 const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [error, setError] = useState("");
 
const [showPopup, setShowPopup] = useState(false);
  return (

    <div className="profile-page">

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

      {/* RIGHT RIBBON */}

      <img
        src={rightRibbon}
        alt="Ribbon"
        className="corner-right-ribbon"
      />

      {/* BACK BUTTON */}

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
      </button>

      <div className="profile-wrapper">
              {/* TOP HEADER */}

      <div className="profile-header">

        <span className="breadcrumb">

          Settings

          <span className="arrow"> &gt; </span>

        </span>

        <span className="current-page">

          Profile

        </span>

      </div>

      {/* MAIN CONTENT */}

      <div className="profile-container">

        {/* LEFT MENU */}

        <aside className="profile-sidebar">

          <div className="profile-menu active-menu">

            <FaUser />

            <span>Profile</span>

          </div>

          <div
            className="profile-menu"
            onClick={() => navigate("/login")}
          >

            <FaSignOutAlt />

            <span>Logout</span>

          </div>

        </aside>

        {/* RIGHT FORM */}

        <section className="profile-content">

          <h2>Profile</h2>
          {/* NAME */}

<div className="input-group">

  <label>Name</label>

  <div className="input-box">

    <input
      type="text"
      value={name}
      disabled={false}
      onChange={(e) => setName(e.target.value)}
    />

    

  </div>

</div>

{/* PHONE */}

<div className="input-group">

  <label>Phone Number</label>

  <div className="input-box">

    <input
      type="text"
      value={phone}
      disabled={false}
      onChange={(e) => setPhone(e.target.value)}
    />

    
  </div>

</div>

{/* EMAIL */}

<div className="input-group">

  <label>Email</label>

  <div className="input-box">

    <input
      type="email"
      value={email}
      disabled={false}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
type="email"
placeholder="Enter email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

  </div>

</div>

<div
  className="change-password"
  onClick={() => navigate("/forgot-password")}
>

  Want to Change Your Password ?

</div>
{error && (
  <div className="profile-error">
    {error}
  </div>
)}
<button
  className="submit-btn"
  onClick={() => {

    if (name.trim() === "" || phone.trim() === "" || email.trim() === "") {
      setError("Please fill all fields");
      return;
    }

    setError("");
    setShowPopup(true);

  }}
>
  SUBMIT
</button>
{showPopup && (

<div className="popup-overlay">

<div className="popup">

<div className="success-circle">

✓

</div>

<h2>

Profile Updated

</h2>

<p>

Your profile has been updated successfully.

</p>

<button

className="save-btn"

onClick={()=>setShowPopup(false)}

>

OK

</button>

</div>

</div>

)}
                </section>

      </div>

    </div>
<BottomNavigation active="profile" />
  </div>
  

  );

}

export default Profile;