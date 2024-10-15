import { Link } from "react-router-dom";
import "./login.scss";

const Login = () => {
  return (
    <>
      <div className="background-circles">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>
      <div className="login">
        <img src="/assets/images/image.png" alt="KoiCare Logo" className="logo" />
        <h2>Welcome back <span>KoiCare!</span></h2>
        <h3>Login Here</h3>
        <form>
          <label>Email:</label>
          <input type="email" placeholder="Your email" />
          <label>Password:</label>
          <input type="password" placeholder="Your password" />
          <button type="submit">Login</button>
        </form>
        <p>-Or Sign in with-</p>
        <button className="google-signin">Sign in with Google</button>
        <p>Not a member? <Link to="./register">Register</Link></p>
      </div>
    </>
  );
};

export default Login;
