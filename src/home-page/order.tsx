import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Typography, Modal } from "antd";
import axios from "axios";
import { API_SERVER } from "../home-page/api";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Title } = Typography;

const OrderTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]); // Dữ liệu đơn hàng
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái tải dữ liệu
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Trạng thái Modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // Đơn hàng được chọn
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("Role");
    if (role !== "User" || role === null) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_SERVER}api/Orders/getByUserId/` + userId
        ); // Thay API_SERVER bằng URL thực tế
        setData(response.data.data); // Cập nhật dữ liệu vào state Cập nhật dữ liệu vào state
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  // Cấu trúc cột cho Table
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: any) => <span>{moment(text).format("DD.MM.yyyy")}</span>,
    },
    {
      title: "Total Price (VND)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text: any) => <span>{text.toLocaleString()}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color =
          status === "Pending"
            ? "orange"
            : status === "To Pay"
              ? "green"
              : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Details",
      key: "details",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => viewOrderDetails(record)}>
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  const columnsDetail = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product Image",
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
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price (VND)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString(), // Định dạng số thành chuỗi
    },
  ];
  // Hàm xem chi tiết đơn hàng
  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order); // Lưu thông tin đơn hàng được chọn
    setIsModalVisible(true); // Hiển thị Modal
  };

  // Đóng Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null); // Reset thông tin đơn hàng khi đóng Modal
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Order List</Title>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey="orderId"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal hiển thị chi tiết đơn hàng */}
      <Modal
        title={`Order Details - ${selectedOrder?.orderId}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedOrder ? (
          <Table
            dataSource={selectedOrder.orderDetails}
            columns={columnsDetail}
            rowKey="orderDetailId"
            pagination={false} // Không hiển thị phân trang
          />
        ) : (
          <p>No details available</p>
        )}
      </Modal>
    </div>
  );
};

export default OrderTable;
