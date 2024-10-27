import { Link, Navigate } from "react-router-dom";
import "./login.scss";
import logo from "../../../assets/images/image.png";
import { useState } from "react";
import { login } from "../../../services/authService";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorEmail("");
    setErrorPassword("");
    if (!isValidEmail(formData.email)) {
      setErrorEmail("Please enter a valid email address.");
    }
    if (formData.password.length === 0) {
      setErrorPassword("Password is required.");
    } else if (formData.password.length < 6) {
      setErrorPassword("Password must be at least 6 characters long.");
    }
    console.log(formData);
    const response = await login(formData);
    message.success(response.message);
    //lưu token vào local storage
    localStorage.setItem("token", response.token);
    console.log("RESPONSE: ", response);
    localStorage.setItem("userId", response.hint);
    //chuyển hướng về trang chủ
    navigate("/");
  };

  return (
    <>
      <div className="login-container">
        <div className="background-circles">
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
          <div className="circle circle3"></div>
        </div>
        <div className="login">
          <img src={logo} alt="KoiCare Logo" className="logo" />

          <h2>
            Welcome back <span>KoiCare!</span>
          </h2>
          <h3>Login Here</h3>
          <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Your email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errorEmail ? "error" : ""}
            />
            {errorEmail && <p className="error-message-email">{errorEmail}</p>}

            <label>Password:</label>
            <input
              type="password"
              placeholder="Your password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errorPassword ? "error" : ""}
            />
            {errorPassword && (
              <p className="error-message-pw">{errorPassword}</p>
            )}

            <button type="submit">Login</button>
          </form>

          <p>-Or Sign in with-</p>
          <button className="google-signin">Sign in with Google</button>
          <p>
            Not a member? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
