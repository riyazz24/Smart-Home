import "./Otp.css";

import HeaderRibbon from "../components/HeaderRibbon";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import triangleDesign from "../assets/triangle design.svg";

import { MdOutlineLockReset } from "react-icons/md";

function Otp() {
  const navigate = useNavigate();
  return (
    <div className="otp-page">
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

      <section className="otp-section">
        <div className="otp-card">
          <div className="otp-heading">
            <MdOutlineLockReset />

            <div className="otp-title">
              <h2>Enter 4 digit code sent to</h2>

              <h2>
                you at <span>abcd@gmail.com</span>
              </h2>
            </div>
          </div>

          <div className="otp-inputs">
            <input type="text" maxLength="1" />
            <input type="text" maxLength="1" />
            <input type="text" maxLength="1" />
            <input type="text" maxLength="1" />
          </div>

          <Button
            text="Recover Password"
            onClick={() => navigate("/resetpassword")}
          />

          <div className="otp-footer">
            <p>Didn't recieve a verification code?</p>

            <span>Resend Code | Change Number</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Otp;
