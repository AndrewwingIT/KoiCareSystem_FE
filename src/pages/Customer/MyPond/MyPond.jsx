import React, { useEffect, useState } from "react";
import "./MyPond.scss";
import { Form, Input, Modal, Button, InputNumber, message } from "antd";
import { FaPlus } from "react-icons/fa";
import {
  createPond,
  getAllPonds,
  updatePond,
} from "../../../services/pondService";

export default function MyPond() {
  const [ponds, setPonds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPond, setEditingPond] = useState(null);
  const [form] = Form.useForm();
  const fetchAllPonds = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log("userId: ", userId);
    const response = await getAllPonds(userId);
    //console.log("RESPONSE: ", response);
    setPonds(response.data);
  };
  useEffect(() => {
    fetchAllPonds();
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
    //form dc check qua validateFields(), nếu ổn mới chạy tiếp, lỗi thì bắn lỗi
    form.validateFields().then(async (values) => {
      const rawUserId = localStorage.getItem("userId");
      const userId = parseInt(rawUserId, 10);
      console.log(typeof userId);
      console.log("values: ", values);

      const dataFormat = {
        userId: userId,
        name: values.name,
        depth: values.depth,
        volume: values.volume,
        pumpCapacity: values.pumpCapacity,
        drainCount: values.drainCount,
        //"image": "string"
      };
      console.log("dataFormat: ", dataFormat);
      if (editingPond) {
        const updateDataFormat = { ...dataFormat, pondId: editingPond.pondId };
        //update
        console.log("update: ", updateDataFormat);

        const response = await updatePond(updateDataFormat);
        message.success(response.message);
        // setPonds(
        //   ponds.map((p) =>
        //     p.pond_id === editingPond.pond_id ? { ...p, ...values } : p
        //   )
        // );
      } else {
        // Create pond API call
        //gọi api tạo pond

        const response = await createPond(dataFormat);
        message.success(response.message);
        console.log("RESPONSE: ", response);
      }
      //lấy ra hết pond lại
      fetchAllPonds();
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
          {ponds.map((p, index) => (
            <div
              key={p.pond_id || index}
              className="pond-card"
              onClick={() => showModal(p)}
            >
              <p>{p.pond_id}</p>
              <h2>{p.name}</h2>
              <p>Volume: {p.volume} l</p>
              <p>Depth: {p.depth} m</p>
              <p>Drains: {p.drainCount}</p>
              <p>Pumping Capacity: {p.pumpCapacity} l/h</p>
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
            <Form.Item name="pond_id" label="Pond Id">
              <Input disabled />
            </Form.Item>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="volume" label="Volume">
              <InputNumber min={0} max={100} step={0.1} suffix="l" />
            </Form.Item>
            <Form.Item name="depth" label="Depth">
              <InputNumber min={0} max={100} step={0.1} suffix="m" />
            </Form.Item>
            <Form.Item name="drainCount" label="Drain count">
              <InputNumber min={0} max={100} />
            </Form.Item>
            <Form.Item name="pumpCapacity" label="Pumping capacity">
              <InputNumber min={0} max={100} step={0.1} suffix="l/h" />
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
