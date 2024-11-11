import { Button, Form, Modal, Input, Row, Col, Card, message } from "antd";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { createPond, deletePond, getAllPonds, updatePond } from "./api";
import './pond.css'
import { useNavigate } from "react-router-dom";
interface PondType {
  pondId: string;
  name: string;
  volume: number;
  depth: number;
  drainCount: number;
  pumpCapacity: number;
}

const Pond: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [ponds, setPonds] = useState<PondType[]>([]);
  const [editingPond, setEditingPond] = useState<PondType | null>(null);
  const [Load, isLoad] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
      const role = localStorage.getItem("Role");
      if (role !== "User" || role === null) {
          navigate("/");
      }
  }, []);

  const fetchAllPonds = async () => {
    try{
    const userId = localStorage.getItem("userId");
    const rs = await getAllPonds(userId);
    setPonds(rs.data);
    console.log(rs);
      message.success(rs.message)
    }catch(error) {
      console.error("Caught Error:", error);
      message.error("Failed to fetch ponds. Please try again later.");
    }

  };

  useEffect(() => {
    fetchAllPonds();
    isLoad(false);
  }, [Load]);

  const showModal = (pond?: PondType) => {
    setEditingPond(pond || null);
    if (pond) {
      form.setFieldsValue(pond); // Populate the form if editing
    } else {
      form.resetFields(); // Reset form if adding a new pond
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const rawUserId = localStorage.getItem("userId");
      const userId = rawUserId !== null ? parseInt(rawUserId, 10) : undefined;
      isLoad(true);
      console.log(typeof userId);
      console.log("values: ", values);

      const dataFormat = {
        userId: userId,
        name: values.name,
        depth: parseFloat(values.depth),
        volume: parseFloat(values.volume),
        pumpCapacity: parseFloat(values.pumpCapacity),
        drainCount: parseInt(values.drainCount),
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
        console.log(dataFormat);

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

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleDelete = async (pond: PondType) => {
    Modal.confirm({
      title: "Confirm delete",
      content: "Are you sure you want to delete this pond?",
      onOk() {
        const rs = deletePond(pond.pondId);
        message.success("Delete successfully");
        isLoad(true);
        fetchAllPonds();
      }
    })

  }

  return (
    <>
      <div
        className="bg-cover bg-center h-64 flex justify-center items-center"
        style={{
          backgroundImage:
            "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyhoXLO2j6Gw3QKFmiGV_qYIOHigk1gZoKfw&s)",
        }}
      >
        <span className="text-5xl font-bold text-white">My Pond</span>
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
        }}
        onClick={() => showModal()}
      />

      {/* Display Pond Cards */}
      <div className="p-4">
        <Row gutter={16}>
          {ponds.map((pond) => (
            <Col span={8} key={pond.pondId}>
              <Card
                className="shadow-xl"
                title={pond.name}
                extra={
                  <>
                    <Button className="mr-2" onClick={() => showModal(pond)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(pond)}>Delete</Button>
                  </>
                }
                style={{ width: 300 }}
              >
                <p>Volume: {pond.volume} liters</p>
                <p>Depth: {pond.depth} meters</p>
                <p>Drain Count: {pond.drainCount}</p>
                <p>Pumping Capacity: {pond.pumpCapacity}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Modal for Add/Edit Pond */}
      <Modal
        title={editingPond === null ? "Add New Pond" : "Edit Pond"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Pond Id"
                name="pondId"
              >
                <Input
                  placeholder="Enter pond id"
                  disabled // ở mode edit hoặc mode add thì làm mờ form --> auto disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter pond name!" }]}
              >
                <Input placeholder="Enter pond name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Volume (liters)"
                name="volume"
                rules={[
                  { required: true, message: "Please enter pond volume!" },
                ]}
              >
                <Input placeholder="Enter volume in liters" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Depth (meters)"
                name="depth"
                rules={[
                  { required: true, message: "Please enter pond depth!" },
                ]}
              >
                <Input placeholder="Enter depth in meters" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Drain Count"
                name="drainCount"
                rules={[
                  { required: true, message: "Please enter drain count!" },
                ]}
              >
                <Input placeholder="Enter drain count" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Pumping Capacity"
                name="pumpCapacity"
                rules={[
                  { required: true, message: "Please enter pumping capacity!" },
                ]}
              >
                <Input placeholder="Enter pumping capacity" type="number" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Pond;
