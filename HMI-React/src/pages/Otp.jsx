import "./Otp.css";

import { useState, useRef } from "react";
import HeaderRibbon from "../components/HeaderRibbon";
import Button from "../components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import triangleDesign from "../assets/triangle design.svg";
import axiosInstance from "../util/AxiosInstance";

import { MdOutlineLockReset } from "react-icons/md";

const OTP_LENGTH = 4;

function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const inputs = useRef([]);

  const { email, securityCodeId: initialSecurityCodeId } = location.state || {};
  const [securityCodeId, setSecurityCodeId] = useState(initialSecurityCodeId);

  const [otpData, setOtpData] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otpData];
    next[index] = value;
    setOtpData(next);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpData[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResendMessage("");

    const otp = otpData.join("");
    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits`);
      return;
    }

    setLoading(true);
    try {
      const { status } = await axiosInstance.post(
        "/auth/otp/verify",
        { securityCode: otp },
        { headers: { "X-SecurityCodeId": securityCodeId } }
      );

      if (status === 200) {
        navigate("/resetpassword", { state: { email } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendMessage("");
    setResending(true);
    try {
      const { data, status } = await axiosInstance.post(
        "/auth/otp/retrigger",
        {},
        { headers: { "X-SecurityCodeId": securityCodeId } }
      );

      if (status === 200) {
        setSecurityCodeId(data.securityCodeId);
        setOtpData(Array(OTP_LENGTH).fill(""));
        setResendMessage("A new OTP has been sent to your email");
        inputs.current[0]?.focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="otp-page">
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="190" viewBox="0 0 300 190" fill="none">
        <path d="M -80 110 A 220 220 0 0 0 190 -80" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M -50 135 A 190 190 0 0 0 215 -50" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>

      <img src={triangleDesign} alt="Triangle Design" className="triangle-design" />

      <HeaderRibbon title={"Sign Up"} />

      <section className="otp-section">
        <div className="otp-card">
          <div className="otp-heading">
            <MdOutlineLockReset />
            <div className="otp-title">
              <h2>Enter {OTP_LENGTH} digit code sent to</h2>
              <h2>you at <span>{email || "your email"}</span></h2>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="otp-inputs">
              {otpData.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                />
              ))}
            </div>

            {error && <p className="otp-error">{error}</p>}
            {resendMessage && <p className="otp-success">{resendMessage}</p>}

            <Button type="submit" text={loading ? "Verifying..." : "Recover Password"} disabled={loading} />
          </form>

          <div className="otp-footer">
            <p>Didn't recieve a verification code?</p>
            <span>
              <button type="button" className="link-button" onClick={handleResend} disabled={resending}>
                {resending ? "Resending..." : "Resend Code"}
              </button>{" "}
              | <button type="button" className="link-button" onClick={() => navigate("/forgot-password")}>
                Change Number
              </button>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Otp;