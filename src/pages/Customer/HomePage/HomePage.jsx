// KoiCareSystem_FE-master/src/pages/Customer/HomePage/HomePage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalculator,
  faFish,
  faFlask,
  faSearch,
  faShoppingCart,
  faThumbsUp,
  faTint,
  faUser,
  faWater,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <header className="header">
        <div className="header-content">
          <div className="social-icons">
            <span>Follow us via</span>
            <FontAwesomeIcon icon={["fab", "facebook-f"]} />
            <FontAwesomeIcon icon={["fab", "twitter"]} />
            <FontAwesomeIcon icon={["fab", "instagram"]} />
            <FontAwesomeIcon icon={["fab", "whatsapp"]} />
            <FontAwesomeIcon icon={["fab", "line"]} />
          </div>
          <div
            style={{
              display: "flex",
              verticalAlign: "baseline",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {" "}
            <img
              src="https://storage.googleapis.com/a1aa/image/LcUxCJJ7Y2ahCNl58MScfvgBAO6EIuuus0rN5QtsxfpUxeLnA.jpg"
              alt="Koi fish logo"
              className="logo"
              style={{ width: "50%", marginRight: "5px" }}
            />
            <Button
              icon={<LogoutOutlined />}
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                message.success("Log out!! Please login again!!");
                navigate("/login");
              }}
            ></Button>
          </div>
        </div>
      </header>

      <nav className="navbar">
        <div className="navbar-brand">KOICARE</div>
      </nav>

      <div className="main-content">
        <aside className="sidebar">
          <h2>Overview</h2>
          <ul>
            <li>
              <Link to="/my-koi">
                <FontAwesomeIcon icon={faFish} /> My Koi
              </Link>
            </li>
            <li>
              <Link to="/my-pond">
                <FontAwesomeIcon icon={faWater} /> My Pond
              </Link>
            </li>
            <li>
              <Link to="/water-parameter">
                <FontAwesomeIcon icon={faTint} /> Water Parameter
              </Link>
            </li>
            <li>
              <Link to="/food-calculator">
                <FontAwesomeIcon icon={faCalculator} /> Food Calculator
              </Link>
            </li>
            <li>
              <Link to="/salt-calculator">
                <FontAwesomeIcon icon={faFlask} /> Salt Calculator
              </Link>
            </li>
            <li>
              <Link to="/statistics">
                <FontAwesomeIcon icon={faChartLine} /> Statistics
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/news">News</Link>
            </li>
            <li>
              <Link to="/customer-care">Customer Care</Link>
            </li>
          </ul>
        </aside>

        <section className="main-section">
          <img
            src="https://storage.googleapis.com/a1aa/image/GLO73CG7qeTgNKNe8yTgOc8vbjH4TKaVexjtTx2q2RBii9LnA.jpg"
            alt="Beautiful koi pond"
            className="main-image"
          />
          <div className="info-box">
            <div className="info-content">
              <img
                src="https://storage.googleapis.com/a1aa/image/y16lcVCJIPZNJlFOpk4pDyvMwGqPPjYH6QYGYjE2CJBUsfyJA.jpg"
                alt="Koi fish"
                className="info-image"
              />
              <div className="info-text">
                <h3>KOICARE</h3>
                <p>
                  KOICARE focuses on maintaining optimal pond conditions for koi
                  fish, ensuring proper water quality, feeding, and disease
                  prevention.
                </p>
                <button>Watch More</button>
              </div>
            </div>
          </div>

          <div className="explore-box">
            <h3>Special to explore this website</h3>
            <p>Explore something in KoiCare</p>
            <button>Explore now</button>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-info">
          <div>
            <p>21 Revolution Street</p>
            <p>Paris, France</p>
            <p>+1 555 123456</p>
            <p>support@company.com</p>
          </div>
          <div>
            <h3>About the company</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
        <div className="social-media">
          <FontAwesomeIcon icon={["fab", "facebook-f"]} />
          <FontAwesomeIcon icon={["fab", "twitter"]} />
          <FontAwesomeIcon icon={["fab", "instagram"]} />
          <FontAwesomeIcon icon={["fab", "linkedin"]} />
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
