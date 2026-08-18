import "./Profile.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import rightRibbon from "../assets/triangle design.svg";
import axiosInstance from "../util/AxiosInstance";

import { FaArrowLeft, FaUser, FaSignOutAlt } from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, status } = await axiosInstance.get("/user/profile");
        if (status === 200) {
          setName(data.fullName || "");
          setPhone(data.contactNo || "");
          setEmail(data.email || "");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Could not load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (name.trim() === "" || phone.trim() === "" || email.trim() === "") {
      setError("Please fill all fields");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const { status } = await axiosInstance.patch("/user/profile/update", {
        email,
        contactNo: phone,
      });

      if (status === 200) {
        setShowPopup(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <svg className="menu-corner-left" xmlns="http://www.w3.org/2000/svg" width="180" height="190" viewBox="0 0 400 190" fill="none">
        <path d="M -80 110 A 220 220 0 0 0 190 -80" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M -50 135 A 190 190 0 0 0 215 -50" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>

      <img src={rightRibbon} alt="Ribbon" className="corner-right-ribbon" />

      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      <div className="profile-wrapper">
        <div className="profile-header">
          <span className="breadcrumb">
            Settings<span className="arrow"> &gt; </span>
          </span>
          <span className="current-page">Profile</span>
        </div>

        <div className="profile-container">
          <aside className="profile-sidebar">
            <div className="profile-menu active-menu">
              <FaUser />
              <span>Profile</span>
            </div>
            <div className="profile-menu" onClick={() => navigate("/login")}>
              <FaSignOutAlt />
              <span>Logout</span>
            </div>
          </aside>

          <section className="profile-content">
            <h2>Profile</h2>

            {loading ? (
              <p>Loading profile...</p>
            ) : (
              <>
                <div className="input-group">
                  <label>Name</label>
                  <div className="input-box">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>
                         
                <div className="input-group">
                  <label>Phone Number</label>
                  <div className="input-box">
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <div className="input-box">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="change-password" onClick={() => navigate("/forgot-password")}>
                  Want to Change Your Password ?
                </div>

                {error && <div className="profile-error">{error}</div>}

                <button className="submit-btn" onClick={handleSubmit} disabled={saving}>
                  {saving ? "SAVING..." : "SUBMIT"}
                </button>
              </>
            )}

            {showPopup && (
              <div className="popup-overlay">
                <div className="popup">
                  <div className="success-circle">✓</div>
                  <h2>Profile Updated</h2>
                  <p>Your profile has been updated successfully.</p>
                  <button className="save-btn" onClick={() => setShowPopup(false)}>OK</button>
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