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
  message,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addKoi, API_SERVER, getAllPonds } from "./api";
import axios from "axios";

const MyKoi: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [ponds, setPonds] = useState<any[]>([]);
  const [load, setLoad] = useState(false);
  const [file, setFile] = useState<File | null>(null); // State to store file
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const fetchAllPonds = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log("userId: ", userId);
    const rs = getAllPonds(userId);
    rs.then((x) => {
      setPonds(x.data);
      console.log(x);
    }).catch((error) => {
      console.error("Caught Error:", error);
    });
  };

  useEffect(() => {
    fetchAllPonds();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = form.getFieldsValue();

      // Custom validation to ensure an image file is uploaded
      if (!file) {
        message.error("Please upload an image!");
        return;
      }

      // Proceed to create a FormData instance and make the API call
      const formData = new FormData();
      formData.append("pondId", String(values.pondId));
      formData.append("physiqueId", String(values.physiqueld));
      formData.append("name", values.name);
      formData.append("age", values.age ? String(values.age) : "");
      formData.append("length", String(values.length));
      formData.append("weight", String(values.weight));
      formData.append("gender", values.gender || "");
      formData.append("variety", values.variety || "");
      formData.append(
        "date",
        values.inPondSince ? values.inPondSince.toISOString().split("T")[0] : ""
      );
      formData.append(
        "price",
        values.purchasePrice ? String(values.purchasePrice) : ""
      );
      formData.append("image", file); // Ensure file is appended

      // Log FormData entries to verify
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(key, value, typeof value);
      });

      // Make API call
      await addKoi(formData);
      message.success("Koi added successfully!");
      setIsModalOpen(false);
      form.resetFields();
      setFile(null); // Reset file after submission
    } catch (error) {
      console.error("Error uploading image or adding koi:", error);
      message.error("Failed to add koi.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setFile(null);
  };

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get<any>(`${API_SERVER}api/kois/user/` + userId);
        setData(rs.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    get();
    setLoad(false);
  }, []);

  const handleCardClick = (id: number) => {
    navigate("/my-koi/" + id);
  };

  // Handle file change event
  const handleFileChange = (info: any) => {
    if (info.file.status === "uploading") return;

    // Ensure the file is set when the status changes to "done"
    if (info.file.status === "done") {
      setFile(info.file.originFileObj); // Save file to state
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
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
                  onClick={() => handleCardClick(koi.koiId)}
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
                name="name"
                rules={[{ required: true, message: "Please enter koi name!" }]}
              >
                <Input placeholder="Enter koi name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Image (URL)"
                name="image"
                //rules={[{ required: true, message: "Please upload an image!" }]}
              >
                <Upload
                  onChange={handleFileChange}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
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
                <Select placeholder="Select Sex">
                  <Select.Option value={1}>{"Male"}</Select.Option>
                  <Select.Option value={2}>{"Female"}</Select.Option>
                </Select>
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
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default MyKoi;
