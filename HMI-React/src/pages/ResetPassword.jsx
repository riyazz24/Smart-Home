import "./ForgotPassword.css";

import { useState } from "react";
import HeaderRibbon from "../components/HeaderRibbon";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import { MdOutlineLockReset } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import triangleDesign from "../assets/triangle design.svg";
import axiosInstance from "../util/AxiosInstance";

const INITIAL_STATE = { newPassword: "", confirmPassword: "" };
const passwordIconStyle = {
  position: "absolute", right: "15px", top: "65%",
  transform: "translateY(-50%)", cursor: "pointer", color: "#6c757d",
};

const formField = [
  { name: "newPassword", label: "New Password", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm New Password", autoComplete: "new-password" },
];

function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showPassword, setShowPassword] = useState({ newPassword: false, confirmPassword: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggle = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword.trim() === "" || formData.confirmPassword.trim() === "") {
      setError("Please fill in both fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { status } = await axiosInstance.post("/user/update/password", {
        rawPassword: formData.newPassword,
      });

      if (status === 200) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Reset Password failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="190" viewBox="0 0 300 190" fill="none">
        <path d="M -80 110 A 220 220 0 0 0 190 -80" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M -50 135 A 190 190 0 0 0 215 -50" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>

      <img src={triangleDesign} alt="Triangle Design" className="triangle-design" />

      <HeaderRibbon title={"Sign Up"} />

      <section className="forgot-section">
        <div className="forgot-card">
          <div className="forgot-title">
            <MdOutlineLockReset />
            <h1>Reset Password</h1>
          </div>

          <p className="forgot-text">
            Please enter and Confirm The<br />Password
          </p>

          <form onSubmit={handleSubmit}>
            {formField.map((field) => (
              <div key={field.name} style={{ position: "relative" }}>
                <InputField
                  label={field.label}
                  type={showPassword[field.name] ? "text" : "password"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  autoComplete={field.autoComplete}
                  required
                />
                <span onClick={() => toggle(field.name)} style={passwordIconStyle}>
                  {showPassword[field.name] ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            ))}

            {error && <p className="forgot-error">{error}</p>}

            <button type="submit" className="recover-button" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ResetPassword;