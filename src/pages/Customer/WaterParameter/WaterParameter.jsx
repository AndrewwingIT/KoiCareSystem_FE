import React, { useEffect, useState } from "react";
import "./WaterParameter.scss";
import { Form, Input, Modal, Button } from "antd";
import { FaPlus } from "react-icons/fa";

export default function WaterParameter() {
  //xác định giới hạn cho từng thông số
  const limits = {
    temperature: { min: 6.5 },
    salt: { min: 0, max: 0.1 },
    pH: { min: 6.9, max: 8 },
    oxygen: { min: 6.5 },
    nitrate: { min: 0, max: 20 },
    phosphate: { min: 0, max: 0.035 },
    hardness: { min: 8, max: 21 },
    nitrite: { min: 0, max: 0.1 },
    ammonium: { min: 0, max: 0.1 },
    co2: { min: 5, max: 35 },
    totalChlorines: { min: 0, max: 0.001 },
    outdoorTemp: { min: -40, max: 40 },
    amountFed: { min: 0, max: 99999 },
  };

  //kiểm tra xem giá trị thông số có nằm trong giới hạn không
  const validateParameter = (value, limit) => {
    return value >= limit.min && value <= limit.max;
  };

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
      let hasError = false; // Tạo biến để kiểm tra xem có thông số nào sai không

      // Kiểm tra từng thông số và cập nhật trạng thái valid
      const updatedParameters = parameters.map((param) => {
        let valid = true; // Giả định thông số hợp lệ
        Object.keys(limits).forEach((key) => {
          if (!validateParameter(values[key], limits[key])) {
            valid = false; // Nếu thông số nằm ngoài giới hạn, gán valid = false
            hasError = true; // Đánh dấu có lỗi
          }
        });
        return { ...param, valid }; // Cập nhật thuộc tính valid
      });

      if (editingParameter) {
        setParameters(
          updatedParameters.map((param) => {
            if (param.parameter_id === editingParameter.parameter_id) {
              return { ...param, ...values, valid: !hasError }; // Cập nhật thông số đang chỉnh sửa
            }
            return param;
          })
        );
      } else {
        setParameters([
          ...parameters,
          { ...values, parameter_id: Date.now(), valid: !hasError },
        ]); // Thêm thông số mới
      }
      setIsModalOpen(false); // Đóng modal
      form.resetFields(); // Xóa dữ liệu trong form
    });
  };

  const handleDelete = (id) => {
    setParameters((prev) => prev.filter((param) => param.parameter_id !== id));
    setIsModalOpen(false);
  };

  const getClassForParam = (param, value) => {
    const { min, max } = limits[param];
    if (value < min || value > max) {
      return "invalid"; // Value out of range
    }
    return "valid"; // Value in range
  };

  return (
    <div className="water-parameter">
      <div className="background">
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
              className={`parameter-card ${getClassForParam(
                "temperature",
                param.temperature
              )}`}
              onClick={() => showModal(param)}
            >
              <div className="parameter-header">
                <span className="date">{param.date_and_time}</span>
                <span className="pond-name">{param.pondName}</span>
              </div>
              <div className="parameter-grid">
                <div
                  className={`parameter-item ${getClassForParam(
                    "nitrite",
                    param.nitrite
                  )}`}
                >
                  <span className="label">Nitrite (NO₂):</span>
                  <span className="value">{param.nitrite}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "oxygen",
                    param.oxygen
                  )}`}
                >
                  <span className="label">Oxygen (O₂):</span>
                  <span className="value">{param.oxygen}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "nitrate",
                    param.nitrate
                  )}`}
                >
                  <span className="label">Nitrate (NO₃):</span>
                  <span className="value">{param.nitrate}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "temperature",
                    param.temperature
                  )}`}
                >
                  <span className="label">Temperature:</span>
                  <span className="value">{param.temperature}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "phosphate",
                    param.phosphate
                  )}`}
                >
                  <span className="label">Phosphate (PO₄):</span>
                  <span className="value">{param.phosphate}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "pH",
                    param.pH
                  )}`}
                >
                  <span className="label">pH-value:</span>
                  <span className="value">{param.pH}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "ammonium",
                    param.ammonium
                  )}`}
                >
                  <span className="label">Ammonium (NH₄):</span>
                  <span className="value">{param.ammonium}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "hardness",
                    param.hardness
                  )}`}
                >
                  <span className="label">Hardness (GH):</span>
                  <span className="value">{param.hardness}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "co2",
                    param.co2
                  )}`}
                >
                  <span className="label">CO₂:</span>
                  <span className="value">{param.co2}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "salt",
                    param.salt
                  )}`}
                >
                  <span className="label">Salt:</span>
                  <span className="value">{param.salt}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "totalChlorines",
                    param.totalChlorines
                  )}`}
                >
                  <span className="label">Total chlorines:</span>
                  <span className="value">{param.totalChlorines}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "outdoorTemp",
                    param.outdoorTemp
                  )}`}
                >
                  <span className="label">Outdoor temp.:</span>
                  <span className="value">{param.outdoorTemp}</span>
                </div>
                <div
                  className={`parameter-item ${getClassForParam(
                    "amountFed",
                    param.amountFed
                  )}`}
                >
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
