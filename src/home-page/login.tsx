import { Button, Card, Form, Input, message, notification } from "antd";
import React from "react";
import "./home.css";
import logo from "../assets/images/image.png";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./api";
const Login: React.FC = () => {
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    const rs = login(values.email, values.password);

    rs.then((x) => {
      if (x?.role === "User") {
        navigate("/my-koi");
      }
      if (x?.role === "Admin") {
        navigate("/admin/user");
      }
      console.log(x);
      message.success(x?.message);
      notification.success({
        message: "Login Successful",
        description: `Welcome ${x?.role} to KOI system`, // Display role in the description
        duration: 5, // Duration in seconds
      });
      localStorage.setItem("token", x.token);
      localStorage.setItem("userId", x.hint);
      localStorage.setItem("Role", x.role);
    }).catch((error) => {
      console.error("Caught Error in login:", error);
      message.error("Login failed.");
      notification.error({
        message: "Login Error",
        description:
          error.response?.data.errorMessages ||
          "Something went wrong during login.",
        duration: 5,
      });
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
          <p className="text-center">Login Here</p>
          <Form
            name="basic"
            layout="vertical"
            labelCol={{ span: 8 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
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
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                className="w-full login-button"
                type="primary"
                htmlType="submit"
              >
                Login
              </Button>
            </Form.Item>
            <div className="text-center mt-2">
              <Link to={"/register"}>Not a member? Register</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
