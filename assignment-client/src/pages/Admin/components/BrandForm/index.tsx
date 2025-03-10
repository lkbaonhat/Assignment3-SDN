import React from "react";
import { Form, Input, Button } from "antd";
import { Brand } from "@/types";

interface BrandFormProps {
  initialValues: Partial<Brand>;
  onSubmit: (values: { brandName: string }) => Promise<void>;
  loading: boolean;
}

const BrandForm: React.FC<BrandFormProps> = ({
  initialValues,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Form.Item
        name="brandName"
        label="Brand Name"
        rules={[{ required: true, message: "Please enter the brand name" }]}
      >
        <Input placeholder="Brand name" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ marginRight: 16 }}
        >
          {initialValues._id ? "Update Brand" : "Create Brand"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BrandForm;
