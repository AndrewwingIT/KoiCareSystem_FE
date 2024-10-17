import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import Header from "./components/HeaderFolder/Header";
import Homepage from "./pages/Customer/HomePage/HomePage";
import LoginForm from "./pages/shared/LoginAccount/login";
import RegisterForm from "./pages/shared/LoginAccount/register";

library.add(fas, fab);

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {/* Thêm các Route khác ở đây nếu cần */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
