import "./Login.css";
import { useState } from "react";
import HeaderRibbon from "../components/HeaderRibbon";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import triangleDesign from "../assets/triangle design.svg";
import axiosInstance from "../util/AxiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const INITIAL_STATE = {
  email: "",
  rawPassword: "",
};

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email;
    const rawPassword = formData.rawPassword;

    if (email.trim() === "" || rawPassword.trim() === "") {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const { data, status } = await axiosInstance.post("/auth/login", {
        email,
        rawPassword,
      });

      if (status === 200) {
        localStorage.setItem("role", data.role ?? "");
        localStorage.setItem("sessionId", data.sessionId ?? "");

        try {
          const profile = await axiosInstance.get("/user/profile");
          localStorage.setItem("userId", profile.data.userId ?? "");
          localStorage.setItem("name", profile.data.fullName ?? "");
        } catch (profileErr) {
          console.error("Could not load profile after login:", profileErr);
        }

        setFormData(INITIAL_STATE);

        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { name: "email", type: "email", label: "Email", autoComplete: "email" },
    {
      name: "rawPassword",
      type: showPassword ? "text" : "password",
      label: "Password",
      autoComplete: "current-password",
    },
  ];

  return (
    <div className="login-page">
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="190" viewBox="0 0 300 190" fill="none">
        <path d="M -80 110 A 220 220 0 0 0 190 -80" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M -50 135 A 190 190 0 0 0 215 -50" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>

      <img src={triangleDesign} alt="Triangle Design" className="triangle-design" />

      <HeaderRibbon title="Login" />

      <section className="login-section">
        <div className="login-card">
          <form onSubmit={handleLogin}>
            {formFields.map((field) => (
              <div
                key={field.name}
                className={field.name === "rawPassword" ? "password-field-wrapper" : undefined}
              >
                <InputField
                  label={field.label}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  autoComplete={field.autoComplete}
                  required
                />
                {field.name === "rawPassword" && (
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
              </div>
            ))}

            {error && (
              <p style={{ color: "#D32F2F", fontSize: "14px", textAlign: "center", margin: "8px 0 12px" }}>
                {error}
              </p>
            )}

            <p className="forgot-password">
              <Link className="a-link" to="/forgot-password">Forgot Password?</Link>
            </p>

            <Button type="submit" text={loading ? "Logging in..." : "Login"} disabled={loading} />

            <p className="signup-text">
              Don't have an account? <Link className="a-link" to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;