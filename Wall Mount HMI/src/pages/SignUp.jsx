import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import HeaderRibbon from "../components/HeaderRibbon";
import InputField from "../components/InputField";
import Button from "../components/Button";
import triangleDesign from "../assets/triangle design.svg";

function SignUp() {
  const navigate = useNavigate();
  return (
    <div className="signup-page">
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

      <section className="signup-section">
        <div className="signup-card">
          <InputField label="Name" placeholder="" />

          <InputField label="Phone Number" placeholder="" />

          <InputField label="Email" type="email" placeholder="" />

          <InputField label="Password" type="password" placeholder="" />

          <Button text="Sign Up" onClick={() => navigate("/login")} />

          <p onClick={() => navigate("/login")} className="login-text">
            Already have an account?
          </p>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
