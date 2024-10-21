import React, { useEffect, useState } from "react";
import "./WaterParameter.scss";
import { Form, Input, Modal, Button } from "antd";
import { FaPlus } from "react-icons/fa";

export default function WaterParameter() {
  const [parameters, setParameters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParameter, setEditingParameter] = useState(null);
  const [form] = Form.useForm();

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
        co2: 10,
        totalChlorines: 10,
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

  const showModal = (parameter = null) => {
    setEditingParameter(parameter);
    setIsModalOpen(true);
    if (parameter) {
      form.setFieldsValue(parameter);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingParameter) {
        setParameters((prev) =>
          prev.map((param) =>
            param.parameter_id === editingParameter.parameter_id
              ? { ...param, ...values }
              : param
          )
        );
      } else {
        setParameters((prev) => [
          ...prev,
          { ...values, parameter_id: Date.now() },
        ]);
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    setParameters((prev) => prev.filter((param) => param.parameter_id !== id));
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
              className="parameter-card"
              onClick={() => showModal(param)}
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
                  <span className="value">{param.pH}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Ammonium (NH₄):</span>
                  <span className="value">{param.ammonium}</span>
                </div>
                <div className="parameter-item">
                  <span className="label">Hardness (GH):</span>
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
      <button className="water-parameter__add-btn" onClick={() => showModal()}>
        <FaPlus size={24} />
      </button>
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
            Change this measurement
          </h2>
          <Form form={form} layout="vertical">
            <div className="parameter-grid">
              <Form.Item name="pond_id" label="Pond">
                <Input />
              </Form.Item>
              <Form.Item name="date_and_time" label="Date & time">
                <Input />
              </Form.Item>
              <Form.Item name="nitrite" label="Nitrite (NO₂)">
                <Input suffix="mg/l" />
              </Form.Item>
              <Form.Item name="oxygen" label="Oxygen (O₂)">
                <Input suffix="mg/l" />
              </Form.Item>
              <Form.Item name="nitrate" label="Nitrate (NO₃)">
                <Input suffix="mg/l" />
              </Form.Item>
              <Form.Item name="temperature" label="Temperature">
                <Input suffix="°C" />
              </Form.Item>
              <Form.Item name="phosphate" label="Phosphate (PO₄)">
                <Input suffix="mg/l" />
              </Form.Item>
              <Form.Item name="pH" label="pH-Value">
                <Input />
              </Form.Item>
              <Form.Item name="ammonium" label="Ammonium (NH₄)">
                <Input suffix="mg/l" />
              </Form.Item>
              <Form.Item name="hardness" label="Hardness (GH)">
                <Input suffix="°dH" />
              </Form.Item>
              <Form.Item name="co2" label="CO₂">
                <Input suffix="mg/l" />
              </Form.Item>
              <Form.Item name="salt" label="Salt">
                <Input suffix="%" />
              </Form.Item>
              <Form.Item name="totalChlorines" label="Total chlorines">
                <Input suffix="mg/l" />
              </Form.Item>
              <Form.Item name="outdoorTemp" label="Outdoor temp.">
                <Input suffix="°C" />
              </Form.Item>
              <Form.Item name="amountFed" label="Amount fed">
                <Input suffix="g" />
              </Form.Item>
            </div>
            <Form.Item name="description" label="Note">
              <Input.TextArea />
            </Form.Item>
          </Form>
          {editingParameter && (
            <Button
              type="primary"
              danger
              style={{ marginTop: "10px", width: "100%" }}
              onClick={() => handleDelete(editingParameter.parameter_id)}
            >
              Delete measurement
            </Button>
          )}
        </Modal>
      )}
    </div>
  );
}
