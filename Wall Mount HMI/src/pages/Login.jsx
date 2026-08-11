import "./Login.css";

import HeaderRibbon from "../components/HeaderRibbon";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import triangleDesign from "../assets/triangle design.svg";

function Login() {
  const navigate = useNavigate();
  return (
    <div className="login-page">
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

      <HeaderRibbon title="Sign Up" />

      <section className="login-section">
        <div className="login-card">
          <InputField label="Email" type="email" />

          <InputField label="Password" type="password" />

          <p className="forgot-password">
            <a className="a-link" href="/forgot-password">
              Forgot Password?
            </a>
          </p>

          <Button onClick={() => navigate("/dashboard")} text="Login" />

          <p className="signup-text">
            Don't have an account?
            <a className="a-link" href="/signup">
              {" "}
              Sign Up
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
