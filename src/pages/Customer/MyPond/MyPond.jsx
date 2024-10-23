import React, { useEffect, useState } from "react";
import "./MyPond.scss";
import { Form, Input, Modal, Button } from "antd";
import { FaPlus } from "react-icons/fa";

export default function MyPond() {
  const [ponds, setPonds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPond, setEditingPond] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fakeData = [
      {
        pond_id: 1,
        name: "Hồ Koi 1",
        volume: 3000,
        depth: 1.5,
        drainCount: 2,
        skimmerCount: 1,
        pumpingCapacity: 5000,
      },
    ];
    setPonds(fakeData);
  }, []);

  const showModal = (pond = null) => {
    setEditingPond(pond);
    setIsModalOpen(true);
    if (pond) {
      form.setFieldsValue(pond);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingPond) {
        setPonds(
          ponds.map((p) =>
            p.pond_id === editingPond.pond_id ? { ...p, ...values } : p
          )
        );
      } else {
        setPonds([...ponds, { ...values, pond_id: Date.now() }]);
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    setPonds((prev) => prev.filter((p) => p.pond_id !== id));
    setIsModalOpen(false);
  };

  return (
    <div className="my-pond">
      <div className="background">
        <img
          src="https://storage.googleapis.com/a1aa/image/GLO73CG7qeTgNKNe8yTgOc8vbjH4TKaVexjtTx2q2RBii9LnA.jpg"
          alt="Beautiful koi pond"
          className="background-image"
        />
      </div>
      <div className="my-pond__content">
        <h1>My Pond</h1>
        <div className="pond-cards">
          {ponds.map((p) => (
            <div
              key={p.pond_id}
              className="pond-card"
              onClick={() => showModal(p)}
            >
              <h2>{p.name}</h2>
              <p>Volume: {p.volume} l</p>
              <p>Depth: {p.depth} m</p>
              <p>Drains: {p.drainCount}</p>
              <p>Skimmers: {p.skimmerCount}</p>
              <p>Pumping Capacity: {p.pumpingCapacity} l/h</p>
            </div>
          ))}
        </div>
      </div>
      <button className="my-pond__add-btn" onClick={() => showModal()}>
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
            Add/Edit Pond
          </h2>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="volume" label="Volume">
              <Input suffix="l" />
            </Form.Item>
            <Form.Item name="depth" label="Depth">
              <Input suffix="m" />
            </Form.Item>
            <Form.Item name="drainCount" label="Drain count">
              <Input />
            </Form.Item>
            <Form.Item name="skimmerCount" label="Skimmer count">
              <Input />
            </Form.Item>
            <Form.Item name="pumpingCapacity" label="Pumping capacity">
              <Input suffix="l/h" />
            </Form.Item>
          </Form>
          {editingPond && (
            <Button
              type="primary"
              danger
              style={{ marginTop: "10px", width: "100%" }}
              onClick={() => handleDelete(editingPond.pond_id)}
            >
              Delete Pond
            </Button>
          )}
        </Modal>
      )}
    </div>
  );
}
