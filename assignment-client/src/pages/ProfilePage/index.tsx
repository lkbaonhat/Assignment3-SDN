import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Breadcrumb,
  Tabs,
  Form,
  Input,
  Button,
  Radio,
  InputNumber,
  message,
  Card,
  Spin,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "@/context/AuthContext";
import { updateMember, updatePassword } from "@/services/memberService";
import { ProfileUpdateData, PasswordUpdateData } from "@/types";

const { Title } = Typography;
const { TabPane } = Tabs;

const Container = styled.div`
  padding: 0 0 32px 0;
`;

const StyledForm = styled(Form)`
  max-width: 500px;
  margin: 0 auto;
`;

const ProfilePage: React.FC = () => {
  const { currentUser, updateUserData } = useContext(AuthContext);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (currentUser) {
      profileForm.setFieldsValue({
        name: currentUser.name,
        email: currentUser.email,
        YOB: currentUser.YOB,
        gender: currentUser.gender,
      });
    }
  }, [currentUser, profileForm]);

  const handleProfileUpdate = async (values: ProfileUpdateData) => {
    if (!currentUser) return;

    try {
      setProfileLoading(true);
      const updatedData = await updateMember(currentUser._id, values);
      updateUserData(updatedData);
      message.success("Profile updated successfully");
    } catch (error) {
      message.error(
        (error as any).response?.data?.message || "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (values: PasswordUpdateData) => {
    if (!currentUser) return;

    try {
      setPasswordLoading(true);
      await updatePassword(currentUser._id, values);
      passwordForm.resetFields();
      message.success("Password updated successfully");
    } catch (error) {
      message.error(
        (error as any).response?.data?.message || "Failed to update password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Container>
        <Spin size="large" />
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <UserOutlined /> Profile
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2} style={{ marginBottom: 32 }}>
        My Profile
      </Title>

      <Card>
        <Tabs defaultActiveKey="profile">
          <TabPane tab="Profile Information" key="profile">
            <StyledForm
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileUpdate}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Full Name" />
              </Form.Item>

              <Form.Item name="email" label="Email Address">
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  disabled={true} // Email can't be changed
                />
              </Form.Item>

              <Form.Item
                name="YOB"
                label="Year of Birth"
                rules={[
                  {
                    required: true,
                    message: "Please enter your year of birth",
                  },
                  { type: "number", message: "Please enter a valid year" },
                ]}
              >
                <InputNumber
                  prefix={<CalendarOutlined />}
                  placeholder="Year of Birth"
                  style={{ width: "100%" }}
                  min={1900}
                  max={new Date().getFullYear()}
                />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  { required: true, message: "Please select your gender" },
                ]}
              >
                <Radio.Group>
                  <Radio value={true}>Male</Radio>
                  <Radio value={false}>Female</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={profileLoading}
                >
                  Update Profile
                </Button>
              </Form.Item>
            </StyledForm>
          </TabPane>

          <TabPane tab="Change Password" key="password">
            <StyledForm
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordUpdate}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your current password",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Current Password"
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter your new password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="New Password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["newPassword"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm New Password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={passwordLoading}
                >
                  Change Password
                </Button>
              </Form.Item>
            </StyledForm>
          </TabPane>
        </Tabs>
      </Card>
    </Container>
  );
};

export default ProfilePage;
