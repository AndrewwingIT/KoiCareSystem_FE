import React, { useEffect, useState } from "react";
import "./WaterParameter.scss";
import { FaPlus } from "react-icons/fa";
import { Form, Input, Modal } from "antd";
import { getAllPonds } from "../../../services/pondService";

export default function WaterParameter() {
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    // Giả lập dữ liệu, sau này sẽ thay bằng API call thực tế
    const fakeData = [
      {
        parameter_id: 1,
        pond_id: 1,
        date_and_time: "19.10.2024 - 20:11",
        temperature: 25,
        salt: 10,
        pH: 7,
        oxygen: 10,
        nitrate: 10,
        phosphate: 10,
        hardness: 10,
        nitrite: 10,
        ammonium: 10,
        outdoorTemp: 10,
        amountFed: 10,
        description: "test",
      },
      {
        parameter_id: 2,
        pond_id: 1,
        date_and_time: "19.10.2024 - 19:13",
        temperature: 25,
        phosphate: 10,
        pH: 7,
        oxygen: 10,
        kH: 10,
        hardness: 10,
        co2: 10,
        salt: 10,
        totalChlorines: 10,
        outdoorTemp: 10,
        amountFed: 10,
      },
      {
        parameter_id: 3,
        pond_id: 1,
        date_and_time: "19.10.2024 - 19:12",
        temperature: 25,
        phosphate: 10,
        pH: 7,
        oxygen: 10,
        kH: 10,
        hardness: 10,
        co2: 10,
        salt: 10,
        totalChlorines: 10,
        outdoorTemp: 10,
        amountFed: 10,
      },
    ];
    setParameters(fakeData);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    showModal();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="water-parameter">
      <div className="water-parameter__background">
        <img
          src="https://storage.googleapis.com/a1aa/image/GLO73CG7qeTgNKNe8yTgOc8vbjH4TKaVexjtTx2q2RBii9LnA.jpg"
          alt="Beautiful koi pond"
          className="background-image"
        />
      </div>
      <div className="water-parameter__content">
        <h1>Water Parameters</h1>
        <div className="parameter-cards">
          {parameters.map((param) => (
            <div
              key={param.parameter_id}
              className={`parameter-card ${
                param.nitrite !== "-" ? "alert" : ""
              }`}
            >
              <div className="parameter-header">
                <span className="date">{param.date_and_time}</span>
                <span className="pond-name">{param.pondName}</span>
              </div>
              <div className="parameter-grid">
                <div className="parameter-item">
                  <span className="label">Nitrite (NO₂):</span>
                  <span className="value">{param.nitrite}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Oxygen (O₂):</span>
                  <span className="value">{param.oxygen}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Nitrate (NO₃):</span>
                  <span className="value">{param.nitrate}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Temperature:</span>
                  <span className="value">{param.temperature}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Phosphate (PO₄):</span>
                  <span className="value">{param.phosphate}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">pH-value:</span>
                  <span className="value">{param.pHValue}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Ammonium (NH₄):</span>
                  <span className="value">{param.ammonium}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">KH:</span>
                  <span className="value">{param.kH}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Hardness:</span>
                  <span className="value">{param.hardness}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">CO₂:</span>
                  <span className="value">{param.co2}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Salt:</span>
                  <span className="value">{param.salt}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Total chlorines:</span>
                  <span className="value">{param.totalChlorines}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Outdoor temp.:</span>
                  <span className="value">{param.outdoorTemp}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Amount fed:</span>
                  <span className="value">{param.amountFed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="water-parameter__add-btn" onClick={handleAdd}>
        <FaPlus size={24} />
      </button>
      {isModalOpen && (
        <Modal
          title="Add Water Parameter"
          open={isModalOpen}
          onCancel={handleCancel}
        >
          {/* parameter_id int [pk] // Primary Key
          pond_id int [ref: > Pond.pond_id] // Foreign Key to Pond
          date_and_time datetime
          temperature float
          salt float
          pH float
          oxygen float
          nitrate float
          phosphate float
          hardness float
          nitrite float
          ammonium float
          description nvarchar */}

          <Form>
            <Form.Item name="pond_id" label="Pond ID">
              <Input />
            </Form.Item>
          </Form>
          <Form.Item name="date_and_time" label="Date and Time">
            <Input />
          </Form.Item>
          <Form.Item name="temperature" label="Temperature">
            <Input />
          </Form.Item>
          <Form.Item name="salt" label="Salt">
            <Input />
          </Form.Item>
          <Form.Item name="pH" label="pH">
            <Input />
          </Form.Item>
          <Form.Item name="oxygen" label="Oxygen">
            <Input />
          </Form.Item>
          <Form.Item name="nitrate" label="Nitrate">
            <Input />
          </Form.Item>
          <Form.Item name="phosphate" label="Phosphate">
            <Input />
          </Form.Item>
          <Form.Item name="hardness" label="Hardness">
            <Input />
          </Form.Item>
          <Form.Item name="nitrite" label="Nitrite">
            <Input />
          </Form.Item>
          <Form.Item name="ammonium" label="Ammonium">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Modal>
      )}
    </div>
  );
}
