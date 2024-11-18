import React, { useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  message,
  Row,
  Col,
  Tooltip,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import "./waterparameter.css"; // Ensure to import the CSS file
import {
  addWaterParameter,
  getAllPonds,
  getAllWaterParametersByUserId,
  deleteWaterParameter,
  API_SERVER,
} from "./api";
import { get } from "http";
import { useNavigate } from "react-router-dom";

const WaterParameter: React.FC = () => {
  const [parameters, setParameters] = useState<any[]>([]);
  const [listPond, setListPond] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(0);
  const [form] = Form.useForm();

  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("Role");
    if (role !== "User" || role === null) {
      navigate("/");
    }
  }, []);

  const fetchAllPondsByUserId = async () => {
    try {
      const response = await getAllPonds(userId); // Adjust the API endpoint
      // Assuming response.data is an array of objects with pondId as a number
      const pondArray: number[] = response.data;
      console.log("pondIdArray: ", pondArray);
      setListPond(pondArray);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchParameters = async () => {
    try {
      const response = await getAllWaterParametersByUserId(userId);
      const parametersWithPondNames = await Promise.all(
        response.data.map(async (param: any) => {
          const pondResponse = await getAllPonds(userId); // Fetch ponds to get names
          const pond = pondResponse.data.find(
            (pond: any) => pond.pondId === param.pondId
          );
          return { ...param, pondName: pond ? pond.name : "Unknown" }; // Add pond name
        })
      );
      setParameters(parametersWithPondNames);
    } catch (error) {
      console.error("Error fetching parameters:", error);
    }
  };
  useEffect(() => {
    fetchAllPondsByUserId();
    fetchParameters();
  }, []);

  const showModal = (param?: any) => {
    //param.parameterId===true=>edit, false=>add
    if (param.parameterId) {
      console.log("param: ", param);
      setIsEditing(true);
      setId(param.parameterId);
      console.log("", param.parameterId);
      form.setFieldsValue(param);
      console.log(form.getFieldsValue());
    } else {
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    // Handle form submission
    values.dateAndTime = new Date();
    if (!isEditing) {
      const response = await addWaterParameter(values);
    } else {
      try {
        const rs = await axios.put<any>(
          `${API_SERVER}api/water-parameters/${id}`,
          values
        );
      } catch (error) {
        console.error("Error in get waterparam:", error);
        throw error; // Rethrow the error to be handled in onFinish
      }
    }
    setId(0);
    setIsEditing(false);
    form.resetFields();
    fetchParameters();
    setIsModalOpen(false);
  };

  const handleDelete = async (paramId: number) => {
    Modal.confirm({
      title: "Confirm delete",
      content: "Are you sure you want to delete this water parameter?",
      onOk: async () => {
        try {
          await deleteWaterParameter(paramId); // Implement this API call
          message.success("Deleted successfully");
          fetchParameters(); // Refresh the parameters list
        } catch (error) {
          message.error("Failed to delete water parameter.");
        }
      },
    });
  };

  const getCardStyle = (param: any) => {
    const isOutOfRange =
      param.nitrite < 0 ||
      param.nitrite > 0.1 ||
      param.nitrate < 0 ||
      param.nitrate > 20 ||
      param.oxygen < 6.5 ||
      param.oxygen > 50 ||
      param.temperature < 5 ||
      param.temperature > 26 ||
      param.pH < 6.9 ||
      param.pH > 8 ||
      param.ammonium < 0 ||
      param.ammonium > 0.1 ||
      param.hardness < 0 ||
      param.hardness > 21 ||
      param.salt < 0 ||
      param.salt > 0.1 ||
      param.phosphate < 0 ||
      param.phosphate > 0.035;

    return {
      borderColor: isOutOfRange === true ? "orange" : "green",
    };
  };

  const getParameterStyle = function (param: any, key: string) {
    let isOutOfRange = false;

    switch (key) {
      case "nitrite":
        isOutOfRange = param.nitrite < 0 || param.nitrite > 0.1;
        break;
      case "nitrate":
        isOutOfRange = param.nitrate < 0 || param.nitrate > 20;
        break;
      case "oxygen":
        isOutOfRange = param.oxygen < 6.5 || param.oxygen > 50;
        break;
      case "temperature":
        isOutOfRange = param.temperature < 5 || param.temperature > 26;
        break;
      case "pH":
        isOutOfRange = param.pH < 6.9 || param.pH > 8;
        break;
      case "ammonium":
        isOutOfRange = param.ammonium < 0 || param.ammonium > 0.1;
        break;
      case "hardness":
        isOutOfRange = param.hardness < 0 || param.hardness > 21;
        break;
      case "salt":
        isOutOfRange = param.salt < 0 || param.salt > 0.1;
        break;
      case "phosphate":
        isOutOfRange = param.phosphate < 0 || param.phosphate > 0.035;
        break;
      default:
        break;
    }

    return {
      color: isOutOfRange ? "orange" : "green",
    };
  };

  return (
    <div className="water-parameter">
      <div className="background-image">
        <h1 className="title">Water Parameters</h1>
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        className="add-button"
        onClick={showModal}
      />
      <div className="p-4">
        <Row gutter={16}>
          {parameters.map((param) => (
            <Col
              span={8}
              //key={param.id}
            >
              <Card
                className="parameter-card"
                style={getCardStyle(param)}
                // title={`Pond Id: ${param.pondId}`}
                title={`Pond Name: ${param.pondName}`}
                extra={
                  <>
                    <Button className="mr-2" onClick={() => showModal(param)}>
                      Edit
                    </Button>
                    <Button
                      danger
                      onClick={() => handleDelete(param.parameterId)}
                    >
                      Delete
                    </Button>
                  </>
                }
              >
                <p style={getParameterStyle(param, "date")}>
                  Date:{" "}
                  <span>
                    {new Date(param.dateAndTime)
                      .toLocaleDateString("vi-VN")
                      .replace(/\//g, "-")}
                  </span>
                </p>
                <p style={getParameterStyle(param, "nitrite")}>
                  Nitrite (NO₂): <span>{param.nitrite}</span>
                </p>
                <p style={getParameterStyle(param, "nitrate")}>
                  Nitrate (NO₃): <span>{param.nitrate}</span>
                </p>
                <p style={getParameterStyle(param, "oxygen")}>
                  Oxygen (O₂): <span>{param.oxygen}</span>
                </p>
                <p style={getParameterStyle(param, "temperature")}>
                  Temperature: <span>{param.temperature}</span>
                </p>
                <p style={getParameterStyle(param, "pH")}>
                  pH-value: <span>{param.pH}</span>
                </p>
                <p style={getParameterStyle(param, "ammonium")}>
                  Ammonium (NH₄): <span>{param.ammonium}</span>
                </p>
                <p style={getParameterStyle(param, "hardness")}>
                  Hardness: <span>{param.hardness}</span>
                </p>
                <p style={getParameterStyle(param, "salt")}>
                  Salt: <span>{param.salt}</span>
                </p>
                <p style={getParameterStyle(param, "phosphate")}>
                  Phosphate (PO₃): <span>{param.phosphate}</span>
                </p>
                <p>
                  Description: <span>{param.description}</span>
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Modal
        title={isEditing ? "Edit Water Parameter" : "Add Water Parameter"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Pond Name
                    {/* <Tooltip title="Select the pond where the koi is located">
                      <ExclamationCircleOutlined
                        style={{ marginLeft: 8, color: "red" }}
                      />
                    </Tooltip> */}
                  </span>
                }
                name="pondId"
                rules={[{ required: true, message: "Please select a Pond ID" }]}
              >
                <Select placeholder="Select Pond Name">
                  {listPond.map((pond) => (
                    <Select.Option key={pond.pondId} value={pond.pondId}>
                      {pond.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Temperature
                    <Tooltip title="Optimal range: 5 - 26 ℃">
                      <ExclamationCircleOutlined
                        style={{ marginLeft: 8, color: "red" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="temperature"
                rules={[
                  {
                    required: true,
                    message: "Please enter a Temperature value",
                  },
                  {
                    type: "number",
                    min: -40,
                    max: 40,
                    message: "Temperature value must be between -40 and 40 C",
                  },
                ]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Salt
                    <Tooltip title="Optimal range: 0 - 0.1 %">
                      <ExclamationCircleOutlined
                        style={{ marginLeft: 8, color: "red" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="salt"
                rules={[
                  { required: true, message: "Please enter a Salt value" },
                  {
                    type: "number",
                    min: 0,
                    max: 1.5,
                    message: "Salt value must be between 0% and 1.5%",
                  },
                ]}
              >
                <InputNumber className="w-full" step={0.01} />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Oxygen (O₂)
                    <Tooltip title="Optimal range: > 6.5 mg/L">
                      <ExclamationCircleOutlined
                        style={{ marginLeft: 8, color: "red" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="oxygen"
                rules={[
                  { required: true, message: "Please enter a oxygen value" },
                  {
                    type: "number",
                    min: 0,
                    max: 60,
                    message: "Oxygen value must be between 0 to 50 mg/L",
                  },
                ]}
              >
                <InputNumber className="w-full" step={0.1} />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    pH-value
                    <Tooltip title="Optimal range: 6.9 - 8">
                      <ExclamationCircleOutlined
                        style={{ marginLeft: 8, color: "red" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="ph"
                rules={[
                  { required: true, message: "Please enter a pH value" },
                  {
                    type: "number",
                    min: 0,
                    max: 14,
                    message: "pH value must be between 0 and 14",
                  },
                ]}
              >
                <InputNumber className="w-full" step={0.1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Nitrite (NO₂)
                    <Tooltip title="Optimal range: 0 - 0.1 mg/L">
                      <ExclamationCircleOutlined
                        style={{ marginLeft: 8, color: "red" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="nitrite"
                rules={[
                  { required: true, message: "Please enter a nitrite value" },
                  {
                    type: "number",
                    min: 0,
                    max: 50,
                    message: "Nitrite value must be between 0 and 50 mg/l",
                  },
                ]}
              >
                <InputNumber className="w-full" step={0.01} />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Nitrate (NO₃)
                    <Tooltip title="Optimal range: 0 - 20 mg/L">
                      <ExclamationCircleOutlined
                        style={{ marginLeft: 8, color: "red" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="nitrate"
                rules={[
                  { required: true, message: "Please enter a nitrate value" },
                  {
                    type: "number",
                    min: 0,
                    max: 500,
                    message: "Nitrate value must be between 0 and 500 mg/L",
                  },
                ]}
              >
                <InputNumber className="w-full" step={1} />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Phosphate (PO₃)
                    <Tooltip title="Optimal range: 0 - 0.035 mg/L">
                      <ExclamationCircleOutlined
                        style={{ marginLeft: 8, color: "red" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="phosphate"
                rules={[
                  { required: true, message: "Please enter a phosphate value" },
                  {
                    type: "number",
                    min: 0,
                    max: 50,
                    message: "Phosphate value must be between 0 and 50 mg/l",
                  },
                ]}
              >
                <InputNumber className="w-full" step={0.01} />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Hardness
                    <Tooltip title="Optimal range: 0 - 21 °dH">
                      <ExclamationCircleOutlined
                        style={{ marginLeft: 8, color: "red" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="hardness"
                rules={[
                  { required: true, message: "Please enter a hardness value" },
                  {
                    type: "number",
                    min: 0,
                    max: 50,
                    message: "Hardness value must be between 0 and 50 dH",
                  },
                ]}
              >
                <InputNumber className="w-full" step={1} />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Ammonium (NH₄)
                    <Tooltip title="Optimal range: 0 - 0.1 mg/L">
                      <ExclamationCircleOutlined
                        style={{ marginLeft: 8, color: "red" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="ammonium"
                rules={[
                  { required: true, message: "Please enter a ammonium value" },
                  {
                    type: "number",
                    min: 0,
                    max: 50,
                    message: "Ammonium value must be between 0 and 50 mg/l",
                  },
                ]}
              >
                <InputNumber className="w-full" step={0.01} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WaterParameter;
