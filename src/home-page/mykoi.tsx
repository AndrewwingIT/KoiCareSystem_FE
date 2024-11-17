import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Select,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addKoi, API_SERVER, getAllPonds } from "./api";
import axios from "axios";
import dayjs from "dayjs";

const MyKoi: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [ponds, setPonds] = useState<any[]>([]);
  const [Load, isLoad] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const role = localStorage.getItem("Role");
    if (role !== "User" || role === null) {
      navigate("/");
    }
  }, []);

  const fetchAllPonds = async () => {
    const userId = localStorage.getItem("userId");
    const rs = getAllPonds(userId);
    rs.then((x) => {
      setPonds(x.data);
    }).catch((error) => {});
  };

  useEffect(() => {
    fetchAllPonds();
  }, []);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const stringData = JSON.stringify(values.image);
      values.image = stringData;

      isLoad(true); // Đặt trạng thái tải lên là true

      await addKoi(values);

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
    } finally {
      isLoad(false); // Đặt lại trạng thái tải lên
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get<any>(`${API_SERVER}api/kois/user/` + userId);
        setData(rs.data.data);
      } catch (error) {}
    };
    get();
    isLoad(false);
  }, [Load]);

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
                        src={(() => {
                          try {
                            const parsedImage = JSON.parse(koi.imageUrl);
                            return parsedImage[0]?.thumbUrl || "";
                          } catch (error) {
                            return "";
                          }
                        })()}
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
                      <p>Weight: {koi?.weight} g</p>
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
                label="Age"
                name="age"
                rules={[
                  { required: true, message: "Please enter koi age!" },
                  {
                    validator: (_, value) =>
                      value > 0
                        ? Promise.resolve()
                        : Promise.reject("Age must be greater than 0!"),
                  },
                ]}
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
                  {
                    validator: (_, value) =>
                      value > 0
                        ? Promise.resolve()
                        : Promise.reject("Length must be greater than 0!"),
                  },
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
                  {
                    validator: (_, value) =>
                      value > 0
                        ? Promise.resolve()
                        : Promise.reject("Weight must be greater than 0!"),
                  },
                ]}
              >
                <Input placeholder="Enter weight" type="number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Pond Id"
                name="pondId"
                rules={[
                  { required: true, message: "Please select a pond id!" },
                ]}
              >
                <Select placeholder="Select pond id">
                  {ponds?.map((x) => (
                    <Select.Option key={x?.pondId} value={x?.pondId}>
                      {x?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="In pond since"
                name="inPondSince"
                rules={[{ required: true, message: "Please select date!" }]}
              >
                <DatePicker
                  maxDate={dayjs()}
                  className="w-full"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Purchase price"
                name="purchasePrice"
                rules={[
                  { required: true, message: "Please enter koi price!" },
                  {
                    validator: (_, value) =>
                      value > 0
                        ? Promise.resolve()
                        : Promise.reject("Price must be greater than 0!"),
                  },
                ]}
              >
                <Input placeholder="Enter price" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Select placeholder="Select Sex">
                  <Select.Option value={"Male"}>{"Male"}</Select.Option>
                  <Select.Option value={"Female"}>{"Female"}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Variety"
                name="variety"
                rules={[{ required: true, message: "Please enter variety!" }]}
              >
                <Input placeholder="Enter variety" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Physiqueld"
                name="physiqueld"
                rules={[
                  { required: true, message: "Please select a pond id!" },
                ]}
              >
                <Select placeholder="Select physiqueld">
                  <Select.Option value={1}>{"Slim"}</Select.Option>
                  <Select.Option value={2}>{"Normal"}</Select.Option>
                  <Select.Option value={3}>{"Corpulent"}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="image"
                label="Upload Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
                rules={[{ required: true, message: "Please upload an image" }]}
              >
                <Upload
                  name="image"
                  listType="picture"
                  beforeUpload={() => false} // Prevent automatic upload
                >
                  <Button>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default MyKoi;
