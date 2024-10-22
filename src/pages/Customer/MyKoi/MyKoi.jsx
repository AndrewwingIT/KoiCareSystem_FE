// src/pages/Customer/MyKoi/MyKoi.jsx
import React, { useEffect, useState } from "react";
import "./MyKoi.scss";
import { Form, Input, Modal, Button } from "antd";
import { FaPlus } from "react-icons/fa";

export default function MyKoi() {
  const [koi, setKoi] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKoi, setEditingKoi] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fakeData = [
      {
        koi_id: 1,
        name: "Koi 1",
        age: 2,
        length: 30,
        weight: 500,
        pond: "Pond 1",
        physique: "Normal",
        sex: "Male",
        variety: "Kohaku",
        breeder: "Breeder A",
        inPondSince: "22.10.2024",
        purchasePrice: 100,
      },
    ];
    setKoi(fakeData);
  }, []);

  const calculateWeight = (length) => {
    return (Math.pow(length, 3) / 3333).toFixed(2); // Standard shape
  };

  const showModal = (koi = null) => {
    setEditingKoi(koi);
    setIsModalOpen(true);
    if (koi) {
      form.setFieldsValue(koi);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleLengthChange = (e) => {
    const length = e.target.value;
    const weight = calculateWeight(length);
    form.setFieldsValue({ weight });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingKoi) {
        setKoi(
          koi.map((k) =>
            k.koi_id === editingKoi.koi_id ? { ...k, ...values } : k
          )
        );
      } else {
        setKoi([...koi, { ...values, koi_id: Date.now() }]);
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    setKoi((prev) => prev.filter((k) => k.koi_id !== id));
    setIsModalOpen(false);
  };

  return (
    <div className="my-koi">
      <div className="background">
        <img
          src="https://storage.googleapis.com/a1aa/image/GLO73CG7qeTgNKNe8yTgOc8vbjH4TKaVexjtTx2q2RBii9LnA.jpg"
          alt="Beautiful koi pond"
          className="background-image"
        />
      </div>
      <div className="my-koi__content">
        <h1>My Koi</h1>
        <div className="koi-cards">
          {koi.map((k) => (
            <div
              key={k.koi_id}
              className="koi-card"
              onClick={() => showModal(k)}
            >
              <h2>{k.name}</h2>
              <p>Age: {k.age} years</p>
              <p>Length: {k.length} cm</p>
              <p>Weight: {k.weight} g</p>
              <p>Pond: {k.pond}</p>
            </div>
          ))}
        </div>
      </div>
      <button className="my-koi__add-btn" onClick={() => showModal()}>
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
            Add/Edit Koi
          </h2>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="age" label="Age">
              <Input suffix="years" />
            </Form.Item>
            <Form.Item
              name="length"
              label="Length"
              rules={[{ required: true }]}
            >
              <Input suffix="cm" onChange={handleLengthChange} />
            </Form.Item>
            <Form.Item name="weight" label="Weight">
              <Input suffix="g" />
            </Form.Item>
            <Form.Item name="pond" label="Pond">
              <Input />
            </Form.Item>
            <Form.Item name="physique" label="Physique">
              <Input />
            </Form.Item>
            <Form.Item name="sex" label="Sex">
              <Input />
            </Form.Item>
            <Form.Item name="variety" label="Variety">
              <Input />
            </Form.Item>
            <Form.Item name="breeder" label="Breeder">
              <Input />
            </Form.Item>
            <Form.Item name="inPondSince" label="In pond since">
              <Input />
            </Form.Item>
            <Form.Item name="purchasePrice" label="Purchase price">
              <Input prefix="$" />
            </Form.Item>
          </Form>
          {editingKoi && (
            <Button
              type="primary"
              danger
              style={{ marginTop: "10px", width: "100%" }}
              onClick={() => handleDelete(editingKoi.koi_id)}
            >
              Delete Koi
            </Button>
          )}
        </Modal>
      )}
    </div>
  );
}
