import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Input, Form } from "antd";
import axios from "axios";

interface UserData {
  userId: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

const listData: UserData[] = [
  {
    userId: 2,
    name: "Staff1",
    email: "staff@example.com",
    password:
      "15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225",
    phone: "123456789",
    address: "KoiCareFacility",
  },
];

const User: React.FC = () => {
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]); // Set

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get<any>(
          "http://localhost:5247/api/users/staff?page=1&pageSize=1000"
        );
        setData(rs.data.data.listData);
      } catch (error) {
        console.error(error);
      }
    };
    get();
  }, []);

  // Check if the row is currently being edited
  const isEditing = (record: UserData) => record.userId === editingUserId;

  // Start editing by setting the current row's userId
  const handleEdit = (record: UserData) => {
    form.setFieldsValue(record);
    setEditingUserId(record.userId);
  };

  // Cancel the editing mode
  const cancelEdit = () => {
    setEditingUserId(null);
    form.resetFields();
  };

  // Save the edited values and update the data
  const saveEdit = async (userId: number) => {
    try {
      const updatedUser = await form.validateFields();
      const newData = data.map((item: any) =>
        item.userId === userId ? { ...item, ...updatedUser } : item
      );
      setData(newData);
      setEditingUserId(null);
      message.success("User updated successfully!");
    } catch (error) {
      message.error("Update failed. Please check your input.");
    }
  };

  // Delete user from the list
  const handleDelete = (userId: number) => {
    const newData = data.filter((user: any) => user.userId !== userId);
    setData(newData);
    message.success(`Deleted user with ID: ${userId}`);
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: UserData) => {
        return isEditing(record) ? (
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter user name!" }]}
            style={{ margin: 0 }}
          >
            <Input />
          </Form.Item>
        ) : (
          record.name
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_: any, record: UserData) => {
        return isEditing(record) ? (
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter user email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
            style={{ margin: 0 }}
          >
            <Input />
          </Form.Item>
        ) : (
          record.email
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (_: any, record: UserData) => {
        return isEditing(record) ? (
          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Please enter user phone!" }]}
            style={{ margin: 0 }}
          >
            <Input />
          </Form.Item>
        ) : (
          record.phone
        );
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (_: any, record: UserData) => {
        return isEditing(record) ? (
          <Form.Item
            name="address"
            rules={[{ required: true, message: "Please enter user address!" }]}
            style={{ margin: 0 }}
          >
            <Input />
          </Form.Item>
        ) : (
          record.address
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: UserData) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Button
              type="primary"
              onClick={() => saveEdit(record.userId)}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button onClick={cancelEdit}>Cancel</Button>
          </>
        ) : (
          <>
            <Button
              type="primary"
              onClick={() => handleEdit(record)}
              style={{ marginRight: 8 }}
              disabled={editingUserId !== null}
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDelete(record.userId)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="default" danger>
                Delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <h2>User List</h2>
      <Form form={form} component={false}>
        <Table
          dataSource={data}
          columns={columns}
          rowKey="userId"
          pagination={false} // Disable pagination for simplicity
        />
      </Form>
    </div>
  );
};

export default User;
