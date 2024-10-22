import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./register.scss";
import logo from "../../../assets/images/image.png";
import { register } from "../../../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  // State to capture form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  // State to handle response message from backend
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous message
    setSuccess(false); // Reset success state
    console.log("FORMDATA", formData);
    try {
      const response = await register(formData);
      console.log("RRR", response);
      navigate("/login");
      //message.success(response.message);
    } catch (error) {
      setSuccess(false);
      setMessage("An error occurred while registering. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="background-circles">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>
      <div className="register">
        <img src={logo} alt="KoiCare Logo" className="logo" />
        <h2>
          Welcome to <span>KoiCare!</span>
        </h2>
        <h3>Register Here</h3>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <label>Phone (Optional):</label>
          <input
            type="text"
            name="phone"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <label>Address (Optional):</label>
          <input
            type="text"
            name="address"
            placeholder="Your address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <button type="submit">Register</button>
        </form>

        {/* Display the message from the backend response */}
        {message && (
          <p className={success ? "success-message" : "error-message"}>
            {message}
          </p>
        )}

        <p>
          Already a member? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
