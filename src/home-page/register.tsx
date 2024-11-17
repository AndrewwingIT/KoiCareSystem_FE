import { Button, Card, Form, Input, message } from "antd";
import React from "react";
import "./home.css";
import logo from "../assets/images/image.png";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./api";
const Register: React.FC = () => {
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    console.log("Form Values:", values);

    const rs = register(
      values.name,
      values.email,
      values.password,
      values.phone,
      values.address
    );

    rs.then((result) => {
      console.log("Result:", result);
      message.success(result.message);
      navigate("/login");
    }).catch((error) => {
      console.error("Caught Error in onFinish:", error.response.data);
      message.error(error.response.data);
    });
  };

  return (
    <div
      className="bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://www.shutterstock.com/image-photo/koi-crystal-waters-showcases-enchanting-600nw-2500920849.jpg)", // URL hình ảnh
      }}
    >
      <div className="p-5 flex justify-center items-center h-screen">
        <Card className="!shadow-inner" bordered={true} style={{ width: 400 }}>
          <div className="flex justify-center">
            <img src={logo} alt="" />
          </div>
          <p className="text-orange-400 text-center">
            Welcome back <span className="font-bold">KoiCare!</span>
          </p>
          <p className="text-center">Register Here</p>
          <Form
            name="basic"
            layout="vertical"
            labelCol={{ span: 8 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Name:"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email:"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Phone (Optional):"
              name="phone"
              rules={[
                {
                  pattern: /^0\d{7}(\d{2})?$/,
                  message:
                    "Phone number must start with 0 and be 8 or 10 digits long!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Address (Optional):" name="address">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                className="w-full login-button"
                type="primary"
                htmlType="submit"
              >
                Register
              </Button>
            </Form.Item>
            <div className="text-center">
              <Link to={"/login"}>Already a member? Login here</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
