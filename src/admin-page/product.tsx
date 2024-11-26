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
  InputNumber,
  Upload,
} from "antd";
import axios from "axios";
import { API_SERVER } from "../home-page/api";
import { Option } from "antd/es/mentions";
import { useNavigate } from "react-router-dom";
import { render } from "@testing-library/react";

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
  const [imageUrl, setImageUrl] = useState("");


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

  const handleFileChange = (e: any) => {
    setImageUrl(e.target.files[0]);
  };

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

    setEditingProduct({ ...product, image: "" });
    form.setFieldsValue({
      ...product,
      image: "",
    });
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
  const handleDelete = async (productId: number) => {
    try {
      const rs = await axios.delete(API_SERVER + "api/Products/" + productId);
      setLoad(true);
      message.success(`Deleted product successfully`);
    } catch (error) {
      console.error(error);
    }

  };

  // Save new or edited product
  const saveProduct = async () => {
    try {
      const values = await form.validateFields();

      if (editingProduct !== null) {
        // Update existing product
        try {
          const formData = new FormData();

          // Append each field in `values` to the FormData object
          Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
          });

          // Append the productId separately
          formData.append("productId", editingProduct.productId.toString());

          formData.append("image", imageUrl);

          const rs = await axios.put(API_SERVER + "api/Products", formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Ensure correct header for FormData
            },
          });

          message.success("Product updated successfully!");
        } catch (error) {
          console.error("Error updating product:", error);
        }
      } else {
        try {
          const formData = new FormData();

          // Append each field in `values` to the FormData object
          Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
          });

          // Append the productId separately
          formData.append("productId", "0");

          // If you have a file (e.g., `imageFile`), append it as well
          formData.append("image", imageUrl);

          const rs = await axios.post(API_SERVER + "api/Products", formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Ensure correct header for FormData
            },
          });
        } catch (error) {
          console.error(error);
        }
        message.success("Product added successfully!");
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setLoad(true);
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
    {
      title: "Category Name",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (value: any) => (
        <>{category?.find((x) => x?.categoryId === value)?.name}</>
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: any) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (imageUrl: string) => {
        if (imageUrl) {
          return (
            <img
              src={imageUrl}
              alt="Product"
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          );
        }
        return <span>No image</span>;
      }
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
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
      <p className="text-2xl mb-5">Product List</p>
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
            label="Category"
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
            rules={[
              { required: true, message: "Please enter the price" },
              {
                type: "number",
                min: 1000,
                message: "Price must be greater than or equal to 1000",
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              { required: true, message: "Please enter the quantity" },
              {
                type: "number",
                min: 1,
                message: "Price must be greater than or equal to 1",
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Upload Image"
          >
            <input type="file" name="imageURl" onChange={handleFileChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
