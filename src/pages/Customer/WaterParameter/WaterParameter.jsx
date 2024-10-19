import React from "react";
import "./WaterParameter.scss";
import { FaPlus } from "react-icons/fa"; // For the plus icon button

const WaterParameter = () => {
  return (
    <div className="water-parameter">
      <div className="water-parameter__background">
        <img
          src="https://storage.googleapis.com/a1aa/image/GLO73CG7qeTgNKNe8yTgOc8vbjH4TKaVexjtTx2q2RBii9LnA.jpg"
          alt="Beautiful koi pond"
          className="background-image"
        />
      </div>
      <div className="water-parameter__overlay">
        <header className="water-parameter__header">
          <h1>Water Parameters</h1>
        </header>
        <div className="water-parameter__content">
          <p>
            You didn&apos;t enter any water parameters yet. Add a new entry by
            tapping on the plus-symbol in the bottom right corner.
          </p>
        </div>
      </div>
      <button className="water-parameter__add-btn">
        <FaPlus size={24} />
      </button>
    </div>
  );
};

export default WaterParameter;
