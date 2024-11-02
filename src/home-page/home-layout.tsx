import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme, Button } from "antd";
import { Outlet, useNavigate } from "react-router-dom"; // Import useNavigate

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

// Helper function to create menu items
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// Define your menu items with path keys
const items: MenuItem[] = [
  getItem("My Koi", "/my-koi", <PieChartOutlined />),
  getItem("My Pond", "/my-pond", <DesktopOutlined />),
  getItem("Water Parameter", "/water-parameter", <UserOutlined />),
  getItem("Food Calculator", "/food-calculator", <TeamOutlined />),
  getItem("Salt Calculator", "/salt-calculator", <FileOutlined />),
  getItem("Statistics", "/statistics", <FileOutlined />),
  getItem("Product", "/product", <FileOutlined />),
];

const HomeLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Handle menu item click to navigate to the path
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  // Handle logout logic
  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
    // For example, clear user session and navigate to login
    navigate("/login"); // Uncomment if you have a login route
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["/my-koi"]}
          mode="inline"
          items={items}
          onClick={handleMenuClick} // Attach click handler to navigate
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="primary"
            onClick={handleLogout}
            style={{ float: "right", margin: "16px" }}
          >
            Logout
          </Button>
        </Header>
        <Content className="mt-5">
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet /> {/* Render nested routes here */}
          </div>
        </Content>
        <Footer className="!sticky" style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default HomeLayout;
