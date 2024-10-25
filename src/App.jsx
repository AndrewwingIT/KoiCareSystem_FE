import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import Header from "./components/HeaderFolder/Header";
import Homepage from "./pages/Customer/HomePage/HomePage";
import LoginForm from "./pages/shared/LoginAccount/login";
import RegisterForm from "./pages/shared/LoginAccount/register";
import FoodCalculator from "./pages/Customer/FoodCalculator/FoodCalculator";
import WaterParameter from "./pages/Customer/WaterParameter/WaterParameter";
import MyKoi from "./pages/Customer/MyKoi/MyKoi";
import MyKoiDetail from "./pages/Customer/MyKoiDetail/MyKoiDetail";
import MyPond from "./pages/Customer/MyPond/MyPond";
library.add(fas, fab);

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/my-koi" element={<MyKoi />} />
          <Route path="/koi-detail/:id" element={<MyKoiDetail />} />
          <Route path="/my-pond" element={<MyPond />} />
          <Route path="/food-calculator" element={<FoodCalculator />} />
          <Route path="/water-parameter" element={<WaterParameter />} />

          {/* Add other routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
