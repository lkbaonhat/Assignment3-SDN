import React, { useState, useContext } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "@/context/AuthContext";
import { LoginCredentials } from "@/types";

const StyledCard = styled(Card)`
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
`;

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: LoginCredentials) => {
    try {
      setLoading(true);
      await loginUser(values);
      message.success("Login successful!");
      navigate("/");
    } catch (error) {
      // Error handling is done in AuthContext
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledCard title="Login to Your Account">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center" }}>
        Don't have an account? <a href="/register">Register now!</a>
      </div>

      {/* Updated timestamp and user info */}
      <div
        style={{
          marginTop: 40,
          textAlign: "right",
          fontSize: 12,
          color: "#999",
        }}
      >
        Last updated: 2025-03-10 04:29:58 UTC by lkbaonhatcontinue
      </div>
    </StyledCard>
  );
};

export default LoginForm;
