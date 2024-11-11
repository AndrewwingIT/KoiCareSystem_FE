import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Typography, Modal } from 'antd';
import axios from 'axios';
import { API_SERVER } from '../home-page/api';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Order: React.FC = () => {
    const [data, setData] = useState<any[]>([]); // Dữ liệu đơn hàng
    const [loading, setLoading] = useState<boolean>(true); // Trạng thái tải dữ liệu
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Trạng thái Modal
    const [selectedOrder, setSelectedOrder] = useState<any>(null); // Đơn hàng được chọn

    const navigate = useNavigate();
    useEffect(() => {
      const role = localStorage.getItem("Role");
      if (role !== "Admin" || role === null) {
        navigate("/");
      }
    }, []);

    useEffect(() => {
        const fetchOrderData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_SERVER}api/Orders/getAll`); // Thay API_SERVER bằng URL thực tế
                setData(response.data.data); // Cập nhật dữ liệu vào state Cập nhật dữ liệu vào state
            } catch (error) {
                console.error('Error fetching order data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, []);

    // Cấu trúc cột cho Table
    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Total Price (VND)',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (text: any) => <span>{text.toLocaleString()}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = status === 'Pending' ? 'orange' : 'green';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Details',
            key: 'details',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <Button type="link" onClick={() => viewOrderDetails(record)}>
                        View Details
                    </Button>
                </Space>
            ),
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
        <div style={{ padding: '20px' }}>
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
                    <div>
                        <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                        <p><strong>User ID:</strong> {selectedOrder.userId}</p>
                        <p><strong>Date:</strong> {selectedOrder.date}</p>
                        <p><strong>Total Price:</strong> {selectedOrder.totalPrice.toLocaleString()} VND</p>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                        <h3>Order Details:</h3>
                        <ul>
                            {selectedOrder.orderDetails.map((detail: any) => (
                                <li key={detail.orderDetailId}>
                                    Product ID: {detail.productId}, Quantity: {detail.quantity}, Price: {detail.price.toLocaleString()} VND
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No details available</p>
                )}
            </Modal>
        </div>
    );
};

export default Order;
