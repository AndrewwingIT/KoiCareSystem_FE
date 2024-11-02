import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Modal, Input, Form } from "antd";
import axios from "axios";

interface ProductData {
  productId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

const initialData: ProductData[] = [
  {
    productId: 1,
    categoryId: 1,
    name: "Sample Product",
    description: "A sample product description",
    price: 100,
    quantity: 10,
    image: "image-url.jpg",
  },
];

const Product: React.FC = () => {
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]); // Set

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get<any>(
          "http://localhost:5247/api/Products/GetAll"
        );
        setData(rs.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    get();
  }, []);

  // Open edit modal and populate form
  const handleEdit = (product: ProductData) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  // Handle delete action
  const handleDelete = (productId: number) => {
    const newData = data.filter(
      (product: any) => product.productId !== productId
    );
    setData(newData);
    message.success(`Deleted product with ID: ${productId}`);
  };

  // Save edited product details
  const saveEdit = async () => {
    try {
      const updatedProduct = await form.validateFields();
      const newData = data.map((item: any) =>
        item.productId === editingProduct?.productId
          ? { ...item, ...updatedProduct }
          : item
      );
      setData(newData);
      setIsModalOpen(false);
      setEditingProduct(null);
      message.success("Product updated successfully!");
    } catch (error) {
      message.error("Update failed. Please check your input.");
    }
  };

  // Close modal without saving
  const cancelEdit = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Category ID",
      dataIndex: "categoryId",
      key: "categoryId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
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
      <Table
        dataSource={data}
        columns={columns}
        rowKey="productId"
        pagination={false}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Product"
        visible={isModalOpen}
        onOk={saveEdit}
        onCancel={cancelEdit}
      >
        <Form form={form} layout="vertical">
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
