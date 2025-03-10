import React, { useContext, useEffect } from "react";
import { Typography, Breadcrumb } from "antd";
import { HomeOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import RegisterForm from "@/components/Auth/RegisterForm";
import { AuthContext } from "@/context/AuthContext";

const { Title } = Typography;

const Container = styled.div`
  padding: 32px 0;
`;

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <UserAddOutlined /> Register
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        Create a New Account
      </Title>

      <RegisterForm />
    </Container>
  );
};

export default RegisterPage;
