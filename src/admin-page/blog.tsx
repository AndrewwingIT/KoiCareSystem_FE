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
import moment from "moment";


const BlogManagment: React.FC = () => {
    const [editingBlog, setEditingBlog] = useState<any>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [data, setData] = useState<any[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState("");


    const navigate = useNavigate();
    useEffect(() => {
        const role = localStorage.getItem("Role");
        if (role !== "Admin" || role === null) {
            navigate("/");
        }
    }, []);

    const handleFileChange = (e: any) => {
        setImageUrl(e.target.files[0]);
    };

    useEffect(() => {
        const get = async () => {
            try {
                const rs = await axios.get(API_SERVER + "api/blogs?page=1&pageSize=1000");
                setData(rs.data.data.listData);
                console.log(rs.data.listData);
            } catch (error) {
                console.error(error);
            }
        };
        get();
        setLoad(false);
    }, [load]);

    // Open modal for editing
    const handleEdit = (Blog: any) => {
        setIsEditing(true);

        setEditingBlog({ ...Blog, image: "" });
        form.setFieldsValue({
            ...Blog,
            image: "",
        });
        setIsModalOpen(true);
    };

    // Open modal for adding a new Blog
    const handleAdd = () => {
        setIsEditing(false);
        setEditingBlog(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Handle delete action
    const handleDelete = async (blogId: number) => {
        const rs = await axios.delete(API_SERVER + "api/Blogs/" + blogId);
        message.success(`Deleted Blog successfully`);
        setLoad(true);
    };

    // Save new or edited Blog
    const saveBlog = async () => {
        try {
            const values = await form.validateFields();

            if (editingBlog !== null) {
                // Update existing Blog
                try {
                    const formData = new FormData();

                    // Append each field in `values` to the FormData object
                    Object.keys(values).forEach((key) => {
                        formData.append(key, values[key]);
                    });

                    // Append the BlogId separately

                    formData.append("ImageFile", imageUrl);

                    const rs = await axios.put(API_SERVER + "api/Blogs/" + editingBlog.blogId, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data", // Ensure correct header for FormData
                        },
                    });

                    message.success("Blog updated successfully!");
                } catch (error) {
                    console.error("Error updating Blog:", error);
                }
            } else {
                try {
                    const formData = new FormData();

                    // Append each field in `values` to the FormData object
                    Object.keys(values).forEach((key) => {
                        formData.append(key, values[key]);
                    });
                    formData.append("userId", "1");
                    // Append the BlogId separately
                    // If you have a file (e.g., `imageFile`), append it as well
                    formData.append("ImageFile", imageUrl);

                    const rs = await axios.post(API_SERVER + "api/Blogs", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data", // Ensure correct header for FormData
                        },
                    });
                } catch (error) {
                    console.error(error);
                }
                message.success("Blog added successfully!");
            }

            setIsModalOpen(false);
            setEditingBlog(null);
            setLoad(true);
        } catch (error) {
            message.error("Please check your input.");
        }
    };

    // Close modal without saving
    const cancelEdit = () => {
        setIsModalOpen(false);
        setEditingBlog(null);
        form.resetFields();
    };

    const columns = [
        { title: "Blog ID", dataIndex: "blogId", key: "blogId" },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        { title: "Content", dataIndex: "content", key: "content" },
        { title: "Author", dataIndex: "author", key: "author" },
        { title: "Created At", dataIndex: "createdAt", key: "createdAt", render: (text: any) => <span>{moment(text).format("DD.MM.yyyy")}</span>, },
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (imageUrl: string) => {
                if (imageUrl) {
                    return (
                        <img
                            src={imageUrl}
                            alt=""
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
            render: (_: any, record: any) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => handleEdit(record)}
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this Blog?"
                        onConfirm={() => handleDelete(record.blogId)}
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
            <p className="text-2xl mb-5">Blog</p>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Add New Blog
            </Button>
            <Table
                dataSource={data}
                columns={columns}
                rowKey="BlogId"
                pagination={false}
            />

            {/* Modal for Add/Edit Blog */}
            <Modal
                title={isEditing ? "Edit Blog" : "Add Blog"}
                visible={isModalOpen}
                onOk={saveBlog}
                onCancel={cancelEdit}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            { required: true, message: "Please enter the Blog name" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Content"
                        rules={[
                            { required: true, message: "Please enter the description" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="author"
                        label="Author"
                        rules={[
                            { required: true, message: "Please enter the price" },
                        ]}
                    >
                        <Input className="w-full" />
                    </Form.Item>
                    <Form.Item
                        name="imageFile"
                        label="Upload Image"
                    >
                        <input type="file" name="imageURl" onChange={handleFileChange} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogManagment;
