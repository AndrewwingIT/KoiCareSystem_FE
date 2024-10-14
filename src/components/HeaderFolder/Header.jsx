import React from "react";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="header__top">
        <div className="header__logo">
          <img src="/path-to-your-logo.png" alt="KoiCare" />
        </div>
        <div className="header__icons">
          <a href="#" className="header__icon">
            <img src="/path-to-facebook-icon.png" alt="Facebook" />
          </a>
          <a href="#" className="header__icon">
            <img src="/path-to-instagram-icon.png" alt="Instagram" />
          </a>
          <a href="#" className="header__icon">
            <img src="/path-to-youtube-icon.png" alt="YouTube" />
          </a>
          <a href="#" className="header__icon">
            <img src="/path-to-search-icon.png" alt="Search" />
          </a>
          <a href="#" className="header__icon">
            <img src="/path-to-account-icon.png" alt="Account" />
          </a>
        </div>
      </div>

      <nav className="header__nav">
        <ul className="header__menu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About Us</a>
          </li>
          <li>
            <a href="/services">Services</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
        <div className="header__lang">
          <span className="header__lang-flag">
            <img src="/path-to-vietnamese-flag.png" alt="Vietnamese" />
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
