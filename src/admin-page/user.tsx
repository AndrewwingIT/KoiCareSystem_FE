import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Input, Form } from "antd";
import axios from "axios";
import { API_SERVER } from "../home-page/api";
import { useNavigate } from "react-router-dom";

interface UserData {
  userId: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

const User: React.FC = () => {
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]); // Set
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("Role");
    if (role !== "Admin" || role === null) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get<any>(
          API_SERVER + "api/users?page=1&pageSize=1000"
        );
        setData(rs.data.data.listData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoad(false);
      }
    };
    get();
  }, [load]);

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
      try {
        const rs = await axios.put<any>(
          API_SERVER + "api/users/" + userId, updatedUser
        );
        setData(rs.data.data.listData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoad(false);
      }
      setData(newData);
      setEditingUserId(null);
      message.success("User updated successfully!");
    } catch (error) {
      message.error("Update failed. Please check your input.");
    } finally {
      setLoad(true);
    }
  };

  // Delete user from the list
  const handleDelete = async (userId: number) => {
    try {
      const rs = await axios.delete<any>(API_SERVER + "api/users/" + userId);
      message.success("User inactive successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(true);
    }
  };
  const handleActive = async (userId: number) => {
    try {
      const rs = await axios.put<any>(
        API_SERVER + "api/users/active/" + userId
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(true);
    }
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
      title: "Role Name",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: any) => <>{value === 1 ? "Active" : "InActive"}</>,
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
            <Button
              className="mr-2"
              type="primary"
              style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
              onClick={() => handleActive(record.userId)}
            >
              Active
            </Button>
            <Popconfirm
              title="Are you sure to inactive this user?"
              onConfirm={() => handleDelete(record.userId)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="default" className="!bg-yellow-500 text-white">
                Inactive
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <p className="text-2xl font-bold">User List</p>
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
