import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Điều chỉnh dựa trên thư viện route bạn đang sử dụng
import PropTypes from "prop-types"; // Import PropTypes

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

ScrollToTop.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ScrollToTop;
