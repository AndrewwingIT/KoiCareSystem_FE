import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./MyKoiDetail.scss";
import { Button, Form, Input, Modal, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function MyKoiDetail() {
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [remarkForm] = Form.useForm();
  const [koi, setKoi] = useState({
    koi_id: id,
    name: "Koi 1",
    age: 1,
    length: 20,
    weight: 144,
    pond: "Hồ Koi 1",
    inPondSince: "22.10.2024",
    purchasePrice: 100,
  });
  const [remarks, setRemarks] = useState([]);

  const showEditModal = () => {
    setIsEditModalOpen(true);
    form.setFieldsValue(koi);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleRemarkCancel = () => {
    setIsRemarkModalOpen(false);
  };

  const handleEditSubmit = () => {
    form.validateFields().then((values) => {
      const calculatedWeight = (Math.pow(values.length, 3) / 3333).toFixed(2);
      const updatedKoi = { ...koi, ...values, weight: calculatedWeight };
      setKoi(updatedKoi);
      setIsEditModalOpen(false);
    });
  };

  const handleAddRemark = () => {
    remarkForm.validateFields().then((values) => {
      setRemarks([...remarks, values]);
      setIsRemarkModalOpen(false);
      remarkForm.resetFields();
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRemark(record.title)}
        />
      ),
    },
  ];

  const handleDeleteRemark = (title) => {
    setRemarks(remarks.filter((remark) => remark.title !== title));
  };

  return (
    <div className="my-koi-detail">
      <div className="background">
        <img
          src="https://storage.googleapis.com/a1aa/image/GLO73CG7qeTgNKNe8yTgOc8vbjH4TKaVexjtTx2q2RBii9LnA.jpg"
          alt="Beautiful koi pond"
          className="background-image"
        />
      </div>
      <Button className="back-button" onClick={() => window.history.back()}>
        BACK
      </Button>
      <h1>Koi Details</h1>
      <div className="koi-info">
        <h2>{koi.name}</h2>
        <p>Age: {koi.age} year</p>
        <p>Length: {koi.length} cm</p>
        <p>Weight: {koi.weight} g</p>
        <p>In pond since: {koi.inPondSince}</p>
        <p>Purchase price: ${koi.purchasePrice}</p>
      </div>
      <Button onClick={showEditModal}>Edit</Button>
      <Button onClick={() => setIsRemarkModalOpen(true)}>Add Remark</Button>

      <Modal
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={null}
        closable={false}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="length" label="Length">
            <Input suffix="cm" />
          </Form.Item>
          <Form.Item name="weight" label="Weight">
            <Input suffix="g" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Modal>

      <Modal
        open={isRemarkModalOpen}
        onCancel={handleRemarkCancel}
        footer={null}
        closable={false}
      >
        <Form form={remarkForm} layout="vertical" onFinish={handleAddRemark}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add Remark
          </Button>
        </Form>
      </Modal>

      <Table dataSource={remarks} columns={columns} rowKey="title" />
    </div>
  );
}
