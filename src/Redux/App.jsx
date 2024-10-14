import React from "react";
// Import the Header component
import Header from "../components/HeaderFolder/Header";
import LoginForm from "../pages/shared/LoginAccount/LoginAccount";
function App() {
  return (
    <div className="App">
      {/* Render the Header component */}
      <Header />

      {/* Other content or components can go here */}
      <main>
        <h1>Welcome to KoiCare</h1>
        {/* Add your page content here */}
      </main>
    </div>
  );
}

export default App;
