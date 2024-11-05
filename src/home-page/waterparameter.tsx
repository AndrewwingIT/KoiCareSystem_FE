import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import './waterparameter.css'; // Ensure to import the CSS file

const WaterParameter: React.FC = () => {
    const [parameters, setParameters] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchParameters = async () => {
            try {
                const response = await axios.get('/api/water-parameters'); // Adjust the API endpoint
                setParameters(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchParameters();
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async (values: any) => {
        // Handle form submission
        console.log(values);
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <div className="water-parameter">
            <div className="background-image">
                <h1 className="title">Water Parameters</h1>
            </div>
            <div className="parameter-cards">
                {parameters.map((param) => (
                    <Card key={param.id} className="parameter-card">
                        <div className="parameter-header">
                            <span className="date">{param.date}</span>
                            <span className="pond-name">Pond ID: {param.pondId}</span>
                        </div>
                        <div className="parameter-grid">
                            <p>Nitrite (NO₂): <span>{param.nitrite}</span></p>
                            <p>Nitrate (NO₃): <span>{param.nitrate}</span></p>
                            <p>Oxygen (O₂): <span>{param.oxygen}</span></p>
                            <p>Temperature: <span>{param.temperature}</span></p>
                            <p>pH-value: <span>{param.pH}</span></p>
                            <p>Ammonium (NH₄): <span>{param.ammonium}</span></p>
                            <p>Hardness: <span>{param.hardness}</span></p>
                            <p>Salt: <span>{param.salt}</span></p>
                            <p>Outdoor Temp: <span>{param.outdoorTemp}</span></p>
                            <p>Total Chlorines: <span>{param.totalChlorines}</span></p>
                            <p>Amount Fed: <span>{param.amountFed}</span></p>
                        </div>
                    </Card>
                ))}
                <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    size="large"
                    className="add-button"
                    onClick={showModal}
                />
            </div>
            <Modal
                title="Add Water Parameter"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Nitrite (NO₂)" name="nitrite" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Nitrate (NO₃)" name="nitrate" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Oxygen (O₂)" name="oxygen" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Temperature" name="temperature" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="pH-value" name="pH" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ammonium (NH₄)" name="ammonium" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Hardness" name="hardness" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Salt" name="salt" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Outdoor Temp" name="outdoorTemp" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Total Chlorines" name="totalChlorines" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Amount Fed" name="amountFed" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default WaterParameter;
