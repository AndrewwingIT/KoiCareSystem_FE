import React, { useEffect, useState } from "react";
import { Table, Button, Input, Form, message, Popconfirm, Modal } from "antd";
import axios from "axios";
import { API_SERVER } from "../home-page/api";
import { useNavigate } from "react-router-dom";

interface CategoryData {
  categoryId: number;
  name: string;
  description: string;
}

const Category: React.FC = () => {
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [data, setData] = useState<CategoryData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryForm] = Form.useForm();
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("Role");
    if (role !== "Admin" || role === null) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    const getCategories = async () => {
      try {
        const rs = await axios.get(API_SERVER + "api/Categorys/GetAll");
        setData(rs.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getCategories();
    setLoad(false);
  }, [load]);

  const isEditing = (record: CategoryData) => record.categoryId === editingKey;

  const edit = (record: CategoryData) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.categoryId);
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const save = async (categoryId: number) => {
    try {
      const row = (await form.validateFields()) as CategoryData;
      try {
        const rs = await axios.put<any>(API_SERVER + "api/Categorys", {
          ...row,
          categoryId,
        });
      } catch (error) {
        console.error(error);
      }
      setEditingKey(null);
      setLoad(true);
      message.success("Category updated successfully!");
    } catch (errInfo) {
      message.error("Update failed. Please check your inputs.");
    }
  };

  const deleteCategory = (categoryId: number) => {
    const newData = data.filter(
      (item: CategoryData) => item.categoryId !== categoryId
    );
    setData(newData);
    message.success("Category deleted successfully!");
  };

  const openAddCategoryModal = () => {
    newCategoryForm.resetFields();
    setIsModalOpen(true);
  };

  const handleAddCategory = async () => {
    try {
      const newCategory = await newCategoryForm.validateFields();

      try {
        const rs = await axios.post<any>(API_SERVER + "api/Categorys", {
          ...newCategory,
          categoryId: 0,
        });
      } catch (error) {
        console.error(error);
      }
      setLoad(true);
      setIsModalOpen(false);
    } catch (errInfo) {
      message.error("Failed to add category. Please check your input.");
    }
  };

  const columns = [
    {
      title: "Category ID",
      dataIndex: "categoryId",
      key: "categoryId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: CategoryData) => {
        return isEditing(record) ? (
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter category name!" }]}
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_: any, record: CategoryData) => {
        return isEditing(record) ? (
          <Form.Item
            name="description"
            rules={[
              { required: true, message: "Please enter category description!" },
            ]}
            style={{ margin: 0 }}
          >
            <Input />
          </Form.Item>
        ) : (
          record.description
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: CategoryData) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Button
              onClick={() => save(record.categoryId)}
              type="primary"
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button onClick={cancel}>Cancel</Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => edit(record)}
              type="primary"
              style={{ marginRight: 8 }}
              disabled={editingKey !== null}
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this category?"
              onConfirm={() => deleteCategory(record.categoryId)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger>
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
      <h2>Category List</h2>
      <Button
        type="primary"
        onClick={openAddCategoryModal}
        style={{ marginBottom: 16 }}
      >
        Add Category
      </Button>
      <Form form={form} component={false}>
        <Table
          dataSource={data}
          columns={columns}
          rowKey="categoryId"
          pagination={false}
        />
      </Form>

      {/* Add Category Modal */}
      <Modal
        title="Add New Category"
        visible={isModalOpen}
        onOk={handleAddCategory}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={newCategoryForm} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter category description" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Category;
