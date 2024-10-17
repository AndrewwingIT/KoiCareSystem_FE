import { Link } from "react-router-dom";
import "./register.scss";
import logo from "../../../assets/images/image.png";

const Register = () => {
  return (
    <>
      <div className="background-circles">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>
      <div className="register">
        <img src={logo} alt="KoiCare Logo" className="logo" />
        <h2>Create Account</h2>
        <form>
          <input type="text" placeholder="Your name" />
          <input type="email" placeholder="Your email" />
          <input type="password" placeholder="Your password" />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Do you have an Account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </>
  );
};

export default Register;
