import React, { useState } from "react";
import "./FoodCalculator.scss";
import { Form, Input, Modal, Button, Checkbox } from "antd";
import { FaPlus } from "react-icons/fa";

export default function FoodCalculator() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // State to manage selected growth and temperature
  const [selectedGrowth, setSelectedGrowth] = useState("medium");
  const [selectedTemperature, setSelectedTemperature] = useState("13-16°");
  const [isExpertMode, setIsExpertMode] = useState(false); // New state for expert mode
  const [percentage, setPercentage] = useState(0.5); // New state for percentage

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("Submitted values:", values);
      setIsModalOpen(false);
    });
  };

  return (
    <div className="food-calculator">
      <div className="background">
        <img
          src="https://storage.googleapis.com/a1aa/image/GLO73CG7qeTgNKNe8yTgOc8vbjH4TKaVexjtTx2q2RBii9LnA.jpg"
          alt="Beautiful koi pond"
          className="background-image"
        />
      </div>
      <div className="food-calculator__content">
        <h1>Food Calculator</h1>
        <h2>Hồ Koi 1</h2>
        <p>
          Total weight of kois in pond: <strong>31 g</strong>
        </p>

        <div className="expert-mode">
          <Checkbox
            checked={isExpertMode}
            onChange={(e) => setIsExpertMode(e.target.checked)}
          >
            Expert mode
          </Checkbox>
        </div>

        {isExpertMode ? (
          <div className="expert-mode-content">
            <p>
              Current percentage: <strong>{percentage}%</strong>
            </p>
            <input
              type="range"
              min="0.1"
              max="2.5"
              step="0.1"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="percentage-slider"
            />
            <div className="info">
              <div className="info-header">
                <i className="fas fa-exclamation-triangle"></i>
                <span>Info about the expert mode</span>
              </div>
              <p>
                We still recommend using the preset food calculator! Use the
                expert mode only if you already have a lot of experience with
                koi and know what you are doing! The expert mode offers you
                customized setting options to determine what proportion of the
                total fish weight you want to feed. The total fish weight is the
                sum of the weights for each individual koi in the selected pond.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="section">
              <h3>Desired growth</h3>
              <div className="options">
                <div
                  className={selectedGrowth === "low" ? "selected" : ""}
                  onClick={() => setSelectedGrowth("low")}
                >
                  low
                </div>
                <div
                  className={selectedGrowth === "medium" ? "selected" : ""}
                  onClick={() => setSelectedGrowth("medium")}
                >
                  medium
                </div>
                <div
                  className={selectedGrowth === "high" ? "selected" : ""}
                  onClick={() => setSelectedGrowth("high")}
                >
                  high
                </div>
              </div>
            </div>

            <div className="section">
              <h3>Water temperature</h3>
              <div className="options">
                <div
                  className={selectedTemperature === "6-8°" ? "selected" : ""}
                  onClick={() => setSelectedTemperature("6-8°")}
                >
                  6-8°
                </div>
                <div
                  className={selectedTemperature === "9-12°" ? "selected" : ""}
                  onClick={() => setSelectedTemperature("9-12°")}
                >
                  9-12°
                </div>
                <div
                  className={selectedTemperature === "13-16°" ? "selected" : ""}
                  onClick={() => setSelectedTemperature("13-16°")}
                >
                  13-16°
                </div>
                <div
                  className={selectedTemperature === "17-20°" ? "selected" : ""}
                  onClick={() => setSelectedTemperature("17-20°")}
                >
                  17-20°
                </div>
                <div
                  className={selectedTemperature === "21-28°" ? "selected" : ""}
                  onClick={() => setSelectedTemperature("21-28°")}
                >
                  21-28°
                </div>
              </div>
            </div>

            <div className="feeding-info">
              <strong>Feeding information</strong>
              <br />
              The recommended amount of food should be split evenly into{" "}
              <strong>3-5 feedings per day</strong>. This way the koi will
              ingest the food better.
            </div>
          </>
        )}

        <div className="footer">
          Recommended amount <strong>0g</strong> per day
        </div>

        <button className="food-calculator__add-btn" onClick={showModal}>
          <FaPlus size={24} />
        </button>
      </div>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          closable={false}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="primary" danger onClick={handleCancel}>
              ✗
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: "green", borderColor: "green" }}
              onClick={handleSubmit}
            >
              ✓
            </Button>
          </div>
          <h2 style={{ textAlign: "center", marginTop: "10px" }}>
            Add Feeding Schedule
          </h2>
          <Form form={form} layout="vertical">
            <Form.Item name="pond_id" label="Pond">
              <Input />
            </Form.Item>
            <Form.Item name="feeding_time" label="Feeding Time">
              <Input />
            </Form.Item>
            <Form.Item name="amount" label="Amount">
              <Input suffix="g" />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
