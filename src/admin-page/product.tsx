import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Input,
  Form,
  Select,
} from "antd";
import axios from "axios";
import { API_SERVER } from "../home-page/api";
import { Option } from "antd/es/mentions";
import { useNavigate } from "react-router-dom";

interface ProductData {
  productId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

const Product: React.FC = () => {
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<ProductData[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const [load, setLoad] = useState<boolean>(false);

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
        const rs = await axios.get<any>(API_SERVER + "api/Categorys/GetAll");
        setCategory(rs.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    get();
  }, []);

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get(API_SERVER + "api/Products/GetAll");
        setData(rs.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    get();
    setLoad(false);
  }, [load]);

  // Open modal for editing
  const handleEdit = (product: ProductData) => {
    setIsEditing(true);
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  // Open modal for adding a new product
  const handleAdd = () => {
    setIsEditing(false);
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Handle delete action
  const handleDelete = (productId: number) => {
    const newData = data.filter((product) => product.productId !== productId);
    setData(newData);
    message.success(`Deleted product with ID: ${productId}`);
  };

  // Save new or edited product
  const saveProduct = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing && editingProduct) {
        // Update existing product
        try {
          const rs = await axios.put(API_SERVER + "api/Products", {
            ...values,
            productId: editingProduct.productId,
          });
        } catch (error) {
          console.error(error);
        }
        message.success("Product updated successfully!");
      } else {
        // Add new product
        const newProduct = { ...values, productId: 0 }; // Mock ID for new product
        try {
          const rs = await axios.post(API_SERVER + "api/Products", newProduct);
        } catch (error) {
          console.error(error);
        }
        message.success("Product added successfully!");
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setLoad(true)
    } catch (error) {
      message.error("Please check your input.");
    }
  };

  // Close modal without saving
  const cancelEdit = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const columns = [
    { title: "Product ID", dataIndex: "productId", key: "productId" },
    { title: "Category ID", dataIndex: "categoryId", key: "categoryId" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (imageUrl: string) => (
        <img
          src={imageUrl}
          alt="Product"
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: ProductData) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.productId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="default" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <h2>Product List</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add New Product
      </Button>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="productId"
        pagination={false}
      />

      {/* Modal for Add/Edit Product */}
      <Modal
        title={isEditing ? "Edit Product" : "Add Product"}
        visible={isModalOpen}
        onOk={saveProduct}
        onCancel={cancelEdit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryId"
            label="Category ID"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select a category">
              {category.map((category) => (
                <Option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter the product name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter the price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true, message: "Please enter the image URL" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
