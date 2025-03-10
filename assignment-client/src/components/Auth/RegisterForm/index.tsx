import React, { useState, useContext } from "react";
import { Form, Input, Button, Card, Radio, InputNumber, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "@/context/AuthContext";
import { RegisterData } from "@/types";

const StyledCard = styled(Card)`
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
`;

const RegisterForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { registerUser } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const currentYear = new Date().getFullYear();

  const handleSubmit = async (values: any) => {
    // Confirm password is not part of the register data
    const { confirmPassword, ...registerData } = values;

    try {
      setLoading(true);
      await registerUser(registerData as RegisterData);
      message.success("Registration successful!");
      navigate("/");
    } catch (error) {
      // Error handling is done in AuthContext
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledCard title="Create an Account">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Full Name"
            size="large"
          />
        </Form.Item>

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
          name="YOB"
          rules={[
            { required: true, message: "Please input your year of birth!" },
            {
              type: "number",
              min: 1900,
              max: currentYear,
              message: `Year must be between 1900 and ${currentYear}!`,
            },
          ]}
        >
          <InputNumber
            prefix={<CalendarOutlined />}
            placeholder="Year of Birth"
            size="large"
            style={{ width: "100%" }}
            min={1900}
            max={currentYear}
          />
        </Form.Item>

        <Form.Item
          name="gender"
          rules={[{ required: true, message: "Please select your gender!" }]}
        >
          <Radio.Group>
            <Radio value={true}>Male</Radio>
            <Radio value={false}>Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
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
            Register
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center" }}>
        Already have an account? <a href="/login">Login now!</a>
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

export default RegisterForm;
