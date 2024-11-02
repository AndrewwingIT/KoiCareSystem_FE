import { Card, Button, Modal, Form, Input, DatePicker, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addKoi, API_SERVER } from "./api";
import axios from "axios";

const MyKoi: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const values = form.getFieldsValue();
    addKoi(values);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get<any>(`${API_SERVER}api/kois/user/3`);
        setData(rs.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    get();
  }, []);

  // Dữ liệu cá Koi bao gồm ID

  const handleCardClick = (id: number) => {
    navigate("/my-koi/" + id);
  };

  return (
    <>
      <div
        className="bg-cover bg-center h-64 flex justify-center items-center"
        style={{
          backgroundImage:
            "url(https://www.shutterstock.com/image-photo/koi-crystal-waters-showcases-enchanting-600nw-2500920849.jpg)",
        }}
      >
        <span className="text-5xl font-bold text-white">My Koi</span>
      </div>
      <Card className="!shadow-inner w-full" bordered={true}>
        <div style={{ padding: "20px" }}>
          <Row gutter={16}>
            {data?.map((koi) => (
              <Col span={8} key={koi?.id}>
                <Card
                  className="!shadow-lg"
                  bordered={true}
                  style={{ width: 300, margin: "16px" }}
                  onClick={() => handleCardClick(koi.koiId)} // Gọi hàm chuyển trang khi nhấn
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <img
                        src={koi?.image}
                        alt={koi?.name}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <h3>{koi?.name}</h3>
                      <p>Age: {koi?.age} years</p>
                      <p>Length: {koi?.length} cm</p>
                      <p>Weight: {koi?.variety} g</p>
                      <p>Pond: {koi?.pondName}</p>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Card>

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
        onClick={showModal}
      />

      <Modal
        title="Add New Koi"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
        cancelText="Cancel"
      >
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Koi Name"
                name="Name"
                rules={[{ required: true, message: "Please enter koi name!" }]}
              >
                <Input placeholder="Enter koi name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Image (url)"
                name="image"
                // rules={[{ required: true, message: "Please enter koi image!" }]}
              >
                <Input placeholder="Enter koi image URL" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Age"
                name="age"
                rules={[{ required: true, message: "Please enter koi age!" }]}
              >
                <Input placeholder="Enter age in years" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Length"
                name="length"
                rules={[
                  { required: true, message: "Please enter koi length!" },
                ]}
              >
                <Input placeholder="Enter length" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Weight"
                name="weight"
                rules={[
                  { required: true, message: "Please enter koi weight!" },
                ]}
              >
                <Input placeholder="Enter weight" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="PondId"
                name="pondId"
                rules={[{ required: true, message: "Please enter pond!" }]}
              >
                <Input placeholder="Enter pond" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="In pond since" name="inPondSince">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select date"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Purchase price"
                name="purchasePrice"
                rules={[{ required: true, message: "Please enter koi price!" }]}
              >
                <Input placeholder="Enter price" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Gender" name="gender">
                <Input placeholder="Enter gender" type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Variety" name="variety">
                <Input placeholder="Enter variety" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Physiqueld"
                name="physiqueld"
                rules={[{ required: true, message: "Please enter koi price!" }]}
              >
                <Input placeholder="Enter physiqueld" type="number" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default MyKoi;
