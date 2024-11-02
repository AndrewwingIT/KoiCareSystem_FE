import { Card, Col, Row, Button, Modal, Form, Input, Table } from "antd";
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
  const koi: Koi = {
    name: "Koi 1",
    age: 1,
    length: 20,
    weight: 144,
    inPondSince: "22.10.2024",
    purchasePrice: 100,
    image:
      "https://cacanhthaihoa.com/wp-content/uploads/2015/03/ca-koi-hariwake-1.jpg", // Đường dẫn đến hình ảnh koi 1
  };

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddNoteModalVisible, setAddNoteModalVisible] = useState(false);
  const [formEdit] = Form.useForm();
  const [formNote] = Form.useForm();
  const [data, SetData] = useState<any>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [nextId, setNextId] = useState(1);
  const { id } = useParams();

  // Hàm xử lý sự kiện khi nhấn nút Edit
  const handleEdit = () => {
    setEditModalVisible(true);
  };

  // Hàm xử lý sự kiện khi nhấn nút Add Note
  const handleAddNote = () => {
    setAddNoteModalVisible(true);
  };

  const handleEditOk = () => {
    console.log("Edit Koi:", formEdit.getFieldsValue());
    setEditModalVisible(false);
  };

  const handleEditCancel = () => {
    formEdit.resetFields();
    setEditModalVisible(false);
  };

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get<any>(`${API_SERVER}api/kois/` + id);
        SetData(rs.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    get();
  }, []);

  const handleAddNoteOk = () => {
    const noteValues = formNote.getFieldsValue();
    const newNote: Note = {
      id: nextId,
      title: noteValues.title,
      content: noteValues.note,
    };
    setNotes([...notes, newNote]);
    setNextId(nextId + 1); // Tăng ID cho ghi chú tiếp theo
    setAddNoteModalVisible(false);
    formNote.resetFields();
  };

  const handleAddNoteCancel = () => {
    formNote.resetFields();
    setAddNoteModalVisible(false);
  };

  // Cấu hình cột cho bảng ghi chú
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Note",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Note) => (
        <Button
          danger
          onClick={() => {
            setNotes(notes.filter((note) => note.id !== record.id));
          }}
        >
          Delete
        </Button>
      ),
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
          style={{ width: 600, margin: "16px auto" }} // Giữ nguyên cách bố trí card
        >
          <Row gutter={16}>
            <Col span={12}>
              <h3>Name: {data?.name}</h3>
              <p>Age: {data?.age} year</p>
              <p>Length: {data?.length} cm</p>
              <p>Weight: {data?.weight} g</p>
              <p>In pond since: {data?.date}</p>
              <p>Purchase price: ${data?.price}</p>
            </Col>
            <Col span={12}>
              <img
                src={data?.image}
                alt={data?.name}
                style={{
                  width: "100%", // Đảm bảo hình ảnh chiếm toàn bộ chiều rộng của cột
                  height: "150px", // Thiết lập chiều cao cụ thể cho hình ảnh
                  objectFit: "contain", // Đảm bảo hình ảnh không bị méo
                  borderRadius: 8,
                }}
              />
            </Col>
          </Row>
        </Card>
      </Card>

      {/* Nút Edit và Add Note ở góc dưới bên phải màn hình */}
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
        <Button type="default" onClick={handleAddNote}>
          Add Note
        </Button>
      </div>

      {/* Modal cho Edit Koi */}
      <Modal
        title="Edit Koi"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        <Form layout="vertical" form={formEdit}>
          <Form.Item label="Name" name="name" initialValue={koi.name}>
            <Input />
          </Form.Item>
          <Form.Item label="Age" name="age" initialValue={koi.age}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Length" name="length" initialValue={koi.length}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Weight" name="weight" initialValue={koi.weight}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="In Pond Since"
            name="inPondSince"
            initialValue={koi.inPondSince}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Purchase Price"
            name="purchasePrice"
            initialValue={koi.purchasePrice}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal cho Add Note */}
      <Modal
        title="Add Note"
        visible={isAddNoteModalVisible}
        onOk={handleAddNoteOk}
        onCancel={handleAddNoteCancel}
      >
        <Form layout="vertical" form={formNote}>
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Note" name="note">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Bảng ghi chú */}
      <div style={{ margin: "16px auto", width: "80%" }}>
        <Table dataSource={notes} columns={columns} rowKey="id" />
      </div>
    </>
  );
};

export default KoiDetail;
