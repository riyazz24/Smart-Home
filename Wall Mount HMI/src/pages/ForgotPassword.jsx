import "./ForgotPassword.css";

import HeaderRibbon from "../components/HeaderRibbon";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import triangleDesign from "../assets/triangle design.svg";

import { MdOutlineLockReset } from "react-icons/md";

function ForgotPassword() {
  const navigate = useNavigate();
  return (
    <div className="forgot-page">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="300"
        height="190"
        viewBox="0 0 300 190"
        fill="none"
      >
        <path
          d="M -80 110
           A 220 220 0 0 0 190 -80"
          stroke="#000"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        <path
          d="M -50 135
           A 190 190 0 0 0 215 -50"
          stroke="#000"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <img
        src={triangleDesign}
        alt="Triangle Design"
        className="triangle-design"
      />

      <HeaderRibbon title={"Sign Up"} />

      <section className="forgot-section">
        <div className="forgot-card">
          <div className="forgot-title">
            <MdOutlineLockReset />

            <h1>Forgot Password</h1>
          </div>

          <p className="forgot-text">
            Please enter your registered Email or
            <br />
            mobile to reset your password
          </p>

          <InputField label="Email / Mobile Number" />

          <button onClick={() => navigate("/otp")} className="recover-button">
            {" "}
            Recover Password
          </button>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
