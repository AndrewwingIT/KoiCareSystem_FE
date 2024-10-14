import { Link } from "react-router-dom";
import "./RegisterAccount.scss";

const Register = () => {
  return (
    <div className="register">
      <h2>Register</h2>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
};

export default Register;
