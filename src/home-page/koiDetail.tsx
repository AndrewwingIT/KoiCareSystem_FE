import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  Table,
  DatePicker,
  message,
  Select,
  Popconfirm,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_SERVER, getAllPonds } from "./api";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import dayjs from "dayjs";

interface Koi {
  name: string;
  age: number;
  length: number;
  weight: number;
  inPondSince: string;
  purchasePrice: number;
  image: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
}

const KoiDetail: React.FC = () => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddGrowthModalVisible, setAddGrowthModalVisible] = useState(false);
  const [formEdit] = Form.useForm();
  const [formGrowth] = Form.useForm();
  const [data, setData] = useState<any>();
  const [growthHistory, setGrowthHistory] = useState<any[]>([]);
  const { id } = useParams();
  const [load, setLoad] = useState(false);
  const [ponds, setPonds] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("Role");
    if (role !== "User" || role === null) {
      navigate("/");
    }
  }, []);

  const handleEdit = () => {
    if (data) {
      formEdit.setFieldsValue({
        name: data.name,
        age: data.age,
        length: data.length,
        weight: data.weight,
        date: moment(data.date),
        price: data.price,
        gender: data.gender,
        variety: data.variety,
        pondId: data.pondId,
      });
    }
    setEditModalVisible(true);
  };

  const handleEditOk = async () => {
    try {
      const fieldsValid = await formEdit.validateFields();

      if (fieldsValid) {
        const values = formEdit.getFieldsValue();
        values.imageUrl = imageUrl;
        console.log(values);
        await axios.put(`${API_SERVER}api/kois/${id}`, {
          ...values,
          date: values.date.toISOString().split("T")[0], // Format date as string (YYYY-MM-DD)
        });
        message.success("Koi updated successfully.");
        setLoad(true);
        setEditModalVisible(false);
      }
    } catch (error) {
      message.error("Failed to update koi.");
    }
  };

  const deleteKoi = async (id: number) => {
    try {
      const response = await axios.delete<any>(`${API_SERVER}api/kois/${id}`);
      setData(response.data.data);
      navigate("../my-koi");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditCancel = () => {
    formEdit.resetFields();
    setEditModalVisible(false);
  };

  const fetchAllPonds = async () => {
    const userId = localStorage.getItem("userId");
    const rs = getAllPonds(userId);
    rs.then((x) => {
      setPonds(x.data);
      console.log(x);
    }).catch((error) => {
      console.error("Caught Error:", error);
    });
  };

  useEffect(() => {
    const getKoiData = async () => {
      try {
        const response = await axios.get<any>(`${API_SERVER}api/kois/${id}`);
        setData(response.data.data);
        setImageUrl(response.data.data.imageUrl);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getKoiData();
    setLoad(false);
    fetchAllPonds();
  }, [load]);

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get<any>(
          API_SERVER + "api/growth-histories/koi/" + id
        );
        setGrowthHistory(rs.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    get();
  }, []);

  const handleAddGrowth = () => {
    setAddGrowthModalVisible(true);
  };

  const handleAddGrowthOk = async () => {
    try {
      await formGrowth.validateFields();
      const growthValues = formGrowth.getFieldsValue();
      const newGrowth = {
        measurementDate: growthValues?.date?.format("YYYY-MM-DD"),
        length: growthValues.length,
        weight: growthValues.weight,
        physique: 1,
        koiId: 0,
      };

      const response = await axios.post(`${API_SERVER}api/growth-histories`, {
        koiId: id,
        physique: "1",
        length: growthValues.length,
        weight: growthValues.weight,
        measurementDate: growthValues.date.format("YYYY-MM-DD"),
      });
      setGrowthHistory([...growthHistory, newGrowth]);
      setAddGrowthModalVisible(false);
      formGrowth.resetFields();
    } catch (error) {
      console.error("Error adding growth:", error);
      message.error("Failed to add growth entry.");
    }
  };

  const handleAddGrowthCancel = () => {
    formGrowth.resetFields();
    setAddGrowthModalVisible(false);
  };

  const growthColumns = [
    {
      title: "Date",
      dataIndex: "measurementDate",
      key: "measurementDate",
      render: (text: any) => <span>{moment(text).format("DD.MM.yyyy")}</span>,
    },
    {
      title: "Length (cm)",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "Weight (g)",
      dataIndex: "weight",
      key: "weight",
    },
  ];

  return (
    <>
      <div
        className="bg-cover bg-center h-64 flex justify-center items-center"
        style={{
          backgroundImage:
            "url(https://www.shutterstock.com/image-photo/koi-crystal-waters-showcases-enchanting-600nw-2500920849.jpg)",
        }}
      >
        <span className="text-5xl font-bold text-white">Koi Details</span>
      </div>
      <Card className="!shadow-inner w-full" bordered={true}>
        <Card
          className="!shadow-lg"
          bordered={true}
          style={{ width: 600, margin: "16px auto" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <h3>Name: {data?.name}</h3>
              <p>Age: {data?.age} year</p>
              <p>Length: {data?.length} cm</p>
              <p>Weight: {data?.weight} g</p>
              <p>In pond since: {moment(data?.date).format("DD.MM.yyyy")}</p>
              <p>
                Purchase price:{" "}
                {data?.price
                  ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(data.price)
                  : "N/A"}
              </p>
              <p>Sex: {data?.gender}</p>
              <p>Variety: {data?.variety}</p>
              <p>Pond: {data?.pondName}</p>
            </Col>
            <Col span={12}>
              <img
                src={data?.imageUrl}
                alt={data?.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <div className="flex justify-end">
                <Popconfirm
                  title="Are you sure you want to delete this koi?"
                  onConfirm={() => deleteKoi(data.koiId)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button className="mt-5" type="primary" danger>
                    Delete
                  </Button>
                </Popconfirm>
                <Button
                  className="mt-5 ml-2"
                  type="primary"
                  onClick={() => {
                    navigate("../my-koi");
                  }}
                >
                  Back to my koi
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      </Card>

      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
        }}
      >
        <Button
          type="primary"
          onClick={handleEdit}
          style={{ marginRight: "8px" }}
        >
          Edit
        </Button>
        <Button type="default" onClick={handleAddGrowth}>
          Add Growth
        </Button>
      </div>

      <Modal
        title="Edit Koi"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        <Form layout="vertical" form={formEdit}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Age" name="age">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="In Pond Since" name="date">
            <DatePicker
              maxDate={dayjs()}
              className="w-full"
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item
            label="Purchase Price"
            name="price"
            rules={[
              { required: true, message: "Please input the purchase price!" },
              {
                validator: (_, value) => {
                  if (!value || value <= 0) {
                    return Promise.reject(
                      "The purchase price must be greater than 0!"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

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
          <Form.Item label="Variety" name="variety">
            <Input />
          </Form.Item>
          <Form.Item
            label="Pond Id"
            name="pondId"
            rules={[{ required: true, message: "Please select a pond id!" }]}
          >
            <Select placeholder="Select pond id">
              {ponds?.map((x) => (
                <Select.Option key={x?.pondId} value={x?.pondId}>
                  {x?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Growth Entry"
        visible={isAddGrowthModalVisible}
        onOk={handleAddGrowthOk}
        onCancel={handleAddGrowthCancel}
      >
        <Form layout="vertical" form={formGrowth}>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select a date!" }]}
            validateTrigger="onBlur"
          >
            <DatePicker
              maxDate={dayjs()}
              className="w-full"
              format="YYYY-MM-DD"
              required
            />
          </Form.Item>
          <Form.Item label="Length (cm)" name="length">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Weight (g)" name="weight">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ margin: "16px auto", width: "80%" }}>
        <Table
          dataSource={growthHistory}
          columns={growthColumns}
          rowKey="date"
        />
      </div>
    </>
  );
};

export default KoiDetail;
