import "./SignUp.css";
import { useNavigate, Link } from "react-router-dom";
import HeaderRibbon from "../components/HeaderRibbon";
import InputField from "../components/InputField";
import Button from "../components/Button";
import triangleDesign from "../assets/triangle design.svg";
import { useState } from "react";
import axiosInstance from "../util/AxiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const INITIAL_STATE = { fullName: '', email: '', contactNo: '', rawPassword: '', confirmPassword: '' };
const CONTACT_NO_PATTERN = /^[0-9]{5}\s[0-9]{5}$/; // e.g. "98765 43210"
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordIconStyle = { position: 'absolute', right: '15px', top: '65%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6c757d' };

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({ rawPassword: false, confirmPassword: false });
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

  const toggle = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field]});
  }

  const formFields = [
      { name: 'fullName', type: 'text', label: 'Name', autoComplete: 'name' },
      { name: 'email', type: 'email', label: 'Email', autoComplete: 'email' },
      { name: 'contactNo', type: 'tel', label: 'Contact No', autoComplete: 'tel', placeholder: 'e.g. 98765 43210' },
      { name: 'rawPassword', label: 'Password', autoComplete: 'new-password' },
      { name: 'confirmPassword', label: 'Confirm Password', autoComplete: 'new-password' },
  ];

  const resetForm = () => setFormData(INITIAL_STATE);
  const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.rawPassword !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!CONTACT_NO_PATTERN.test(formData.contactNo)) {
            setErrorError('Contact number must be 10 digits, formatted as "12345 67890"');
            return;
        } 

        if (!PASSWORD_PATTERN.test(formData.rawPassword)) {
            setError('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and one of @ $ ! % * ? &');
            return;
        }

        const { confirmPassword, ...payload } = formData;
        try {
            const { data, status } = await axiosInstance.post('/user/create', payload);
            if (status === 200) {
                navigate('/login')
                resetForm();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
        }
    };

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
          <form onSubmit={handleRegister}>
            {formFields.map((field) => (
              <div        
                key={field.name}
                className={field.name === "rawPassword" || field.name === "confirmPassword" ? "password-field-wrapper" : undefined}
              >
                <InputField
                  label={field.label}
                  type={(field.name === 'rawPassword' || field.name === 'confirmPassword') ? (showPassword[field.name] ? 'text' : 'password') : field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  autoComplete={field.autoComplete}
                  required
                />
                {(field.name === "rawPassword" || field.name === "confirmPassword") && (
                  <span onClick={() => toggle(field.name)} style={passwordIconStyle}>
                      {showPassword[field.name] ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
              </div>
            ))}

            {error && (
              <p style={{
                color: "#D32F2F",
                fontSize: "14px",
                textAlign: "center",
                margin: "8px 0 12px",
              }}>
                {error}
              </p>
            )}

            <p className="forgot-password">
              <Link className="a-link" to="/forgot-password">
                Forgot Password?
              </Link>
            </p>

            <Button
              type="submit"
              text={loading ? "Registering ..." : "Register"}
              disabled={loading}
            />

            <p onClick={() => navigate("/login")} className="login-text">
              Already have an account?
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
