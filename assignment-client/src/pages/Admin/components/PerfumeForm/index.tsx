import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Perfume, Brand } from "@/types";
import { getAllBrands } from "@/services/brandService";

const { Option } = Select;
const { TextArea } = Input;

interface PerfumeFormProps {
  initialValues: Partial<Perfume>;
  onSubmit: (values: Partial<Perfume>) => Promise<void>;
  loading: boolean;
}

const PerfumeForm: React.FC<PerfumeFormProps> = ({
  initialValues,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState<boolean>(true);

  // Load brands for dropdown
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        const data = await getAllBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error loading brands:", error);
      } finally {
        setBrandsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Set form initial values
  useEffect(() => {
    if (initialValues) {
      // If brand is an object with _id, extract the id
      const brandId =
        typeof initialValues.brand === "string"
          ? initialValues.brand
          : (initialValues.brand as Brand)?._id;

      form.setFieldsValue({
        ...initialValues,
        brand: brandId,
      });
    }
  }, [form, initialValues]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="perfumeName"
        label="Perfume Name"
        rules={[{ required: true, message: "Please enter the perfume name" }]}
      >
        <Input placeholder="Perfume name" />
      </Form.Item>

      <Form.Item
        name="uri"
        label="Image URL"
        rules={[{ required: true, message: "Please enter the image URL" }]}
      >
        <Input placeholder="Image URL" />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price (USD)"
        rules={[{ required: true, message: "Please enter the price" }]}
      >
        <InputNumber
          min={0}
          step={0.01}
          style={{ width: "100%" }}
          placeholder="Price in USD"
        />
      </Form.Item>

      <Form.Item
        name="volume"
        label="Volume (ml)"
        rules={[{ required: true, message: "Please enter the volume" }]}
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          placeholder="Volume in ml"
        />
      </Form.Item>

      <Form.Item
        name="concentration"
        label="Concentration"
        rules={[{ required: true, message: "Please select the concentration" }]}
      >
        <Select placeholder="Select concentration">
          <Option value="Eau de Parfum (15-20%)">Eau de Parfum</Option>
          <Option value="Eau de Toilette (5-15%)">Eau de Toilette</Option>
          <Option value="Eau de Cologne (2-4%)">Eau de Cologne</Option>
          <Option value="Parfum (20-30%)">Parfum</Option>
          <Option value="Eau Fraiche (1-3%)">Eau Fraiche</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="targetAudience"
        label="Target Audience"
        rules={[
          { required: true, message: "Please select the target audience" },
        ]}
      >
        <Select placeholder="Select target audience">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="unisex">Unisex</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="brand"
        label="Brand"
        rules={[{ required: true, message: "Please select the brand" }]}
      >
        <Select
          placeholder="Select brand"
          loading={brandsLoading}
          showSearch
          optionFilterProp="children"
        >
          {brands.map((brand) => (
            <Option key={brand._id} value={brand._id}>
              {brand.brandName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter the description" }]}
      >
        <TextArea rows={4} placeholder="Description" />
      </Form.Item>

      <Form.Item
        name="ingredients"
        label="Ingredients"
        rules={[{ required: true, message: "Please enter the ingredients" }]}
      >
        <TextArea rows={3} placeholder="Ingredients" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ marginRight: 16 }}
        >
          {initialValues._id ? "Update Perfume" : "Create Perfume"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PerfumeForm;
