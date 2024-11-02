import React, { useEffect, useState } from "react";
import "./waterparameter.css";
import { Form, Input, Modal, Button, message, notification } from "antd";
import { addWaterParameter } from "./api";


// Định nghĩa kiểu cho thông số nước
interface WaterParameter {
  parameter_id: number;
  pond_id: number;
  date_and_time: string;
  temperature: number;
  salt: number;
  pH: number;
  oxygen: number;
  nitrate: number;
  phosphate: number;
  hardness: number;
  nitrite: number;
  ammonium: number;
  co2: number;
  totalChlorines: number;
  outdoorTemp: number;
  amountFed: number;
  description?: string; // có thể không có
  valid?: boolean; // trạng thái hợp lệ
}

// Định nghĩa kiểu cho giới hạn thông số
interface Limits {
  min: number;
  max?: number; // có thể không có
}

export default function WaterParameter() {
  // Xác định giới hạn cho từng thông số
  const limits: Record<string, Limits> = {
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

  // Kiểm tra xem giá trị thông số có nằm trong giới hạn không
  const validateParameter = (value: number, limit: Limits) => {
    return value >= limit.min && (limit.max === undefined || value <= limit.max);
  };

  const [parameters, setParameters] = useState<WaterParameter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingParameter, setEditingParameter] = useState<WaterParameter | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Giả lập dữ liệu, sau này sẽ thay bằng API call thực tế
    const fakeData: WaterParameter[] = [
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
      // Thêm dữ liệu giả khác nếu cần
    ];
    setParameters(fakeData);
  }, []);

  const showModal = (parameter: WaterParameter | null = null) => {
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
      //update api 
      if (editingParameter) {
        console.log(updatedParameters);

        setParameters(
          updatedParameters.map((param) => {
            if (param.parameter_id === editingParameter.parameter_id) {
              return { ...param, ...values, valid: !hasError }; // Cập nhật thông số đang chỉnh sửa
            }
            return param;
          })
        );
      } else {//create api
        console.log(values);
        const rs = addWaterParameter(values);
        rs.then((x) => {
          console.log(x);
          message.success(x?.message);
        }).catch((error) => {
          console.error("Caught Error in login:", error);
        });
        // setParameters([
        //   ...parameters,
        //   { ...values, parameter_id: Date.now(), valid: !hasError },
        // ]); // Thêm thông số mới
      }
      setIsModalOpen(false); // Đóng modal
      form.resetFields(); // Xóa dữ liệu trong form
    });
  };

  const handleDelete = (id: number) => {
    setParameters((prev) => prev.filter((param) => param.parameter_id !== id));
    setIsModalOpen(false);
  };

  const getClassForParam = (param: string, value: number) => {
    const { min, max } = limits[param];
    if (value < min || (max !== undefined && value > max)) {
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
              className={`parameter-card ${getClassForParam("temperature", param.temperature)}`}
              onClick={() => showModal(param)}
            >
              <div className="parameter-header">
                <span className="date">{param.date_and_time}</span>
                <span className="pond-name">{param.pond_id}</span>
              </div>
              <div className="parameter-grid">
                <div className={`parameter-item ${getClassForParam("nitrite", param.nitrite)}`}>
                  <span className="label">Nitrite (NO₂):</span>
                  <span className="value">{param.nitrite}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("oxygen", param.oxygen)}`}>
                  <span className="label">Oxygen (O₂):</span>
                  <span className="value">{param.oxygen}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("nitrate", param.nitrate)}`}>
                  <span className="label">Nitrate (NO₃):</span>
                  <span className="value">{param.nitrate}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("temperature", param.temperature)}`}>
                  <span className="label">Temperature:</span>
                  <span className="value">{param.temperature}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("phosphate", param.phosphate)}`}>
                  <span className="label">Phosphate (PO₄):</span>
                  <span className="value">{param.phosphate}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("pH", param.pH)}`}>
                  <span className="label">pH-value:</span>
                  <span className="value">{param.pH}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("ammonium", param.ammonium)}`}>
                  <span className="label">Ammonium (NH₄):</span>
                  <span className="value">{param.ammonium}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("hardness", param.hardness)}`}>
                  <span className="label">Hardness (GH):</span>
                  <span className="value">{param.hardness}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("co2", param.co2)}`}>
                  <span className="label">CO₂:</span>
                  <span className="value">{param.co2}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("salt", param.salt)}`}>
                  <span className="label">Salt:</span>
                  <span className="value">{param.salt}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("totalChlorines", param.totalChlorines)}`}>
                  <span className="label">Total Chlorines:</span>
                  <span className="value">{param.totalChlorines}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("outdoorTemp", param.outdoorTemp)}`}>
                  <span className="label">Outdoor Temperature:</span>
                  <span className="value">{param.outdoorTemp}</span>
                </div>
                <div className={`parameter-item ${getClassForParam("amountFed", param.amountFed)}`}>
                  <span className="label">Amount Fed:</span>
                  <span className="value">{param.amountFed}</span>
                </div>
              </div>
            </div>
          ))}
          <Button
            type="primary"

            onClick={() => showModal(null)}
          >
            Add Parameter
          </Button>
        </div>
      </div>
      <Modal
        title={editingParameter ? "Edit Parameter" : "Add Parameter"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          {Object.keys(limits).map((key) => (
            <Form.Item
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              name={key}
              rules={[{ required: true, message: `Please input ${key}!` }]}
            >
              <Input type="number" />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
}
