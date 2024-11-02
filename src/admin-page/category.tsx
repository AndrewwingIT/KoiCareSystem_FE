import React, { useEffect, useState } from "react";
import { Table, Button, Input, Form, message, Popconfirm } from "antd";
import axios from "axios";

interface CategoryData {
  categoryId: number;
  name: string;
  description: string;
}

const initialData: CategoryData[] = [
  {
    categoryId: 1,
    name: "Category 1",
    description: "Description of Category 1",
  },
  {
    categoryId: 2,
    name: "Category 2",
    description: "Description of Category 2",
  },
];

const Category: React.FC = () => {
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]); // Set

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get<any>(
          "http://localhost:5247/api/Categorys/GetAll"
        );
        setData(rs.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    get();
  }, []);

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
      const newData = [...data];
      const index = newData.findIndex((item) => item.categoryId === categoryId);

      if (index > -1) {
        newData[index] = { ...newData[index], ...row };
        setData(newData);
        setEditingKey(null);
        message.success("Category updated successfully!");
      }
    } catch (errInfo) {
      message.error("Update failed. Please check your inputs.");
    }
  };

  const deleteCategory = (categoryId: number) => {
    const newData = data.filter((item: any) => item.categoryId !== categoryId);
    setData(newData);
    message.success("Category deleted successfully!");
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
              type="primary"
              onClick={() => edit(record)}
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
      <Form form={form} component={false}>
        <Table
          dataSource={data}
          columns={columns}
          rowKey="categoryId"
          pagination={false}
        />
      </Form>
    </div>
  );
};

export default Category;
