import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Input, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import type { MenuProps } from "antd";

const { Header: AntHeader } = Layout;
const { Search } = Input;

const StyledHeader = styled(AntHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  &:hover {
    color: #40a9ff;
  }
`;

const MenuContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface HeaderProps {
  onSearch?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = () => {
  const { currentUser, isAuthenticated, isAdmin, logout } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
      onClick: () => navigate("/profile"),
    },
    isAdmin
      ? {
          key: "admin",
          icon: <SettingOutlined />,
          label: "Admin Dashboard",
          onClick: () => navigate("/admin"),
        }
      : null,
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ].filter(Boolean) as MenuProps["items"];

  return (
    <StyledHeader>
      <Logo to="/">Perfume Shop</Logo>
      <MenuContainer>
        <Menu mode="horizontal" defaultSelectedKeys={["home"]}>
          <Menu.Item key="home">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="perfumes">
            <Link to="/">All Perfumes</Link>
          </Menu.Item>
        </Menu>
      </MenuContainer>
      <RightSection>
        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />}>
              {currentUser?.name}
            </Button>
          </Dropdown>
        ) : (
          <>
            <Button type="text" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button type="primary" onClick={() => navigate("/register")}>
              Register
            </Button>
          </>
        )}
      </RightSection>
    </StyledHeader>
  );
};

export default Header;
