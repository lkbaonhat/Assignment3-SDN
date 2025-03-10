import React, { useState } from "react";
import { Form, Input, Button, Rate } from "antd";
import { CommentFormData } from "@/types";

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => Promise<void>;
  loading: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [rating, setRating] = useState<number>(0);

  const handleSubmit = async (values: any) => {
    await onSubmit({
      rating,
      content: values.content,
    });
    form.resetFields();
    setRating(0);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item label="Rating" required>
        <Rate
          allowHalf
          value={rating}
          onChange={(value) => setRating(value < 1 ? 1 : value)}
          count={3}
          tooltips={["Poor", "Fair", "Good", "Very Good", "Excellent"]}
          className="custom-rate"
        />
        {!rating && (
          <span className="ant-form-item-explain">Please select a rating</span>
        )}
      </Form.Item>
      <Form.Item
        name="content"
        label="Review"
        rules={[
          { required: true, message: "Please enter your review" },
          { min: 10, message: "Review must be at least 10 characters" },
        ]}
      >
        <Input.TextArea rows={4} placeholder="Write your review here..." />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!rating}
        >
          Submit Review
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CommentForm;
