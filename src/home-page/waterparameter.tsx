import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Input, Select, InputNumber, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import './waterparameter.css'; // Ensure to import the CSS file
import { addWaterParameter, getAllPonds, getAllWaterParametersByPondId, getAllWaterParametersByUserId } from "./api";
import { get } from "http";

const WaterParameter: React.FC = () => {
    const [parameters, setParameters] = useState<any[]>([]);
    const [listPond, setListPond] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const userId = localStorage.getItem("userId");

    const fetchAllPondsByUserId = async () => {
        try {
            const response = await getAllPonds(userId); // Adjust the API endpoint
            // Assuming response.data is an array of objects with pondId as a number
            const pondArray: number[] = response.data;
            console.log("pondIdArray: ", pondArray);
            setListPond(pondArray);

        } catch (error) {
            console.error(error);
        }
    }

    const fetchParameters = async () => {
        try {
            // const responses = await Promise.all(
            //     listPondId.map(async (pondId) => {
            //         return getAllWaterParametersByPondId(pondId);
            //     })
            // );

            // // Gộp dữ liệu từ tất cả các phản hồi vào một danh sách
            // const allParameters = responses.flatMap(response => response.data);
            // console.log("allParamm: ", allParameters);

            // setParameters(allParameters);
            const response = await getAllWaterParametersByUserId(userId);
            setParameters(response.data);
            console.log("P: ", response.data);


        } catch (error) {
            console.error("Error fetching parameters:", error);
        }
    };
    useEffect(() => {
        fetchAllPondsByUserId();
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
        values.dateAndTime = values.dateAndTime ? values.dateAndTime.toISOString() : null;
        console.log(values);
        const response = await addWaterParameter(values);
        console.log(response.data);
        setIsModalOpen(false);
        form.resetFields();
        fetchParameters();
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
                            <span className="pond-name">Pond ID: {param.pondId}</span>
                        </div>
                        <div className="parameter-grid">
                            <p>Date: <span>{new Date(param.dateAndTime).toLocaleDateString('vi-VN').replace(/\//g, '-')}</span></p>
                            <p>Nitrite (NO₂): <span>{param.nitrite}</span></p>
                            <p>Nitrate (NO₃): <span>{param.nitrate}</span></p>
                            <p>Oxygen (O₂): <span>{param.oxygen}</span></p>
                            <p>Temperature: <span>{param.temperature}</span></p>
                            <p>pH-value: <span>{param.pH}</span></p>
                            <p>Ammonium (NH₄): <span>{param.ammonium}</span></p>
                            <p>Hardness: <span>{param.hardness}</span></p>
                            <p>Salt: <span>{param.salt}</span></p>
                            <p>Description: <span>{param.description}</span></p>
                            {/* <p>Outdoor Temp: <span>{param.outdoorTemp}</span></p>
                            <p>Total Chlorines: <span>{param.totalChlorines}</span></p>
                            <p>Amount Fed: <span>{param.amountFed}</span></p> */}
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
                    <Form.Item label="Pond Name" name="pondId" rules={[{ required: true, message: "Please select a Pond ID" }]}>
                        <Select placeholder="Select Pond Name">
                            {listPond.map(pond => (
                                <Select.Option key={pond.pondId} value={pond.pondId}>
                                    {pond.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Date and Time"
                        name="dateAndTime"
                        rules={[{ required: true, message: "Please select date and time" }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item label="Temperature" name="temperature" rules={[{ required: true }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Salt" name="salt" rules={[{ required: true, message: "Please enter a Salt value" },
                    { type: 'number', min: 0, max: 2, message: "Salt value must be between 0% and 2%" }]}>
                        <InputNumber />
                    </Form.Item> <Form.Item label="Oxygen (O₂)" name="oxygen" rules={[{ required: true, message: "Please enter a oxygen value" },
                    { type: 'number', min: 0, max: 15, message: "Oxygen value must be between 0 and 15 mg/L" }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="pH-value" name="ph" rules={[{ required: true, message: "Please enter a pH value" },
                    { type: 'number', min: 6.5, max: 9, message: "pH value must be between 6.5 and 9" }]}>
                        <InputNumber min={6.5} max={9} />
                    </Form.Item>
                    <Form.Item label="Nitrite (NO₂)" name="nitrite" rules={[{ required: true, message: "Please enter a nitrite value" },
                    { type: 'number', min: 0, max: 5, message: "Nitrite value must be between 0 and 5" }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Nitrate (NO₃)" name="nitrate" rules={[{ required: true }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Phosphate (PO₃)" name="phosphate" rules={[{ required: true, message: "Please enter a phosphate value" },
                    { type: 'number', min: 0, max: 10, message: "Phosphate value must be between 0 and 10" }]}>
                        <InputNumber />
                    </Form.Item>

                    <Form.Item label="Hardness" name="hardness" rules={[{ required: true }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Ammonium (NH₄)" name="ammonium" rules={[{ required: true, message: "Please enter a ammonium value" },
                    { type: 'number', min: 0, max: 10, message: "ammonium value must be between 0 and 10" }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
};

export default WaterParameter;
