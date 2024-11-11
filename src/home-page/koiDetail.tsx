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
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_SERVER } from "./api";
import { useParams } from "react-router-dom";

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

  const handleEdit = () => {
    if (data) {
      formEdit.setFieldsValue({
        name: data.name,
        age: data.age,
        length: data.length,
        weight: data.weight,
        inPondSince: data.inPondSince,
        purchasePrice: data.purchasePrice,
        sex: data.sex,
        variety: data.variety,
        pond: data.pond,
        breeder: data.breeder,
      });
    }
    setEditModalVisible(true);
  };

  const handleEditOk = async () => {
    try {
      const values = formEdit.getFieldsValue();
      await axios.put(`${API_SERVER}api/kois/${id}`, values); // Update the Koi
      message.success("Koi updated successfully.");
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error updating koi:", error);
      message.error("Failed to update koi.");
    }
  };

  const handleEditCancel = () => {
    formEdit.resetFields();
    setEditModalVisible(false);
  };

  useEffect(() => {
    const getKoiData = async () => {
      try {
        const response = await axios.get<any>(`${API_SERVER}api/kois/${id}`);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getKoiData();
  }, [id]);

  const handleAddGrowth = () => {
    setAddGrowthModalVisible(true);
  };

  const handleAddGrowthOk = async () => {
    const growthValues = formGrowth.getFieldsValue();
    const newGrowth = {
      date: growthValues.date.format("YYYY-MM-DD"),
      length: growthValues.length,
      weight: growthValues.weight,
    };

    try {
      const response = await axios.post(
        `${API_SERVER}api/growth-histories`,
        newGrowth
      );
      console.log("API Response:", response.data);

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
      dataIndex: "date",
      key: "date",
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

  // Function to handle the delete action
  const handleDeleteKoi = async () => {
    try {
      await axios.delete(`${API_SERVER}api/kois/${id}`);
      message.success("Koi deleted successfully.");
      setEditModalVisible(false); // Close the modal after deletion
      // Optionally, redirect or refresh the list
    } catch (error) {
      console.error("Error deleting koi:", error);
      message.error("Failed to delete koi.");
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
              <p>In pond since: {data?.inPondSince}</p>
              <p>Purchase price: ${data?.purchasePrice}</p>
              <p>Sex: {data?.sex}</p>
              <p>Variety: {data?.variety}</p>
              <p>Pond: {data?.pond}</p>
              <p>Breeder: {data?.breeder}</p>
            </Col>
            <Col span={12}>
              <img
                src={data?.image}
                alt={data?.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
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
          <Form.Item label="Length" name="length">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Weight" name="weight">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="In Pond Since" name="inPondSince">
            <Input />
          </Form.Item>
          <Form.Item label="Purchase Price" name="purchasePrice">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Sex" name="sex">
            <Input />
          </Form.Item>
          <Form.Item label="Variety" name="variety">
            <Input />
          </Form.Item>
          <Form.Item label="Pond" name="pond">
            <Input />
          </Form.Item>
          <Form.Item label="Breeder" name="breeder">
            <Input />
          </Form.Item>
        </Form>
        <Button
          type="default"
          onClick={handleDeleteKoi}
          style={{ marginTop: "16px" }}
        >
          Delete Koi
        </Button>
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
          >
            <DatePicker format="YYYY-MM-DD" />
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
