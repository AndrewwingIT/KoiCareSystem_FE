import React, { useEffect, useState } from "react";
import {
  DesktopOutlined,
  DropboxOutlined,
  PieChartOutlined,
  ProductOutlined,
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
  getItem("Product", "product", <ProductOutlined />),
  getItem("Category", "category", <PieChartOutlined />),
  getItem("User", "user", <UserOutlined />),
  getItem("Order", "order", <DropboxOutlined />),
  getItem("Blog", "blog", <DropboxOutlined />),
];

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const role = localStorage.getItem("Role");
    if (role !== "Admin" || role === null) {
      navigate("/");
    }
  }, []);
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
    localStorage.clear();
    // For example, clear user session and navigate to login
    navigate("/"); // Uncomment if you have a login route
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          position: "sticky",
          top: 0, // Keeps the Sider stuck to the top of the viewport
          height: "100vh", // Ensures the Sider covers the full viewport height
          zIndex: 100, // Makes sure it's above other elements
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["/user"]}
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
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
