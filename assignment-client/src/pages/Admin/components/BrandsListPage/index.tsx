import React, { useState, useEffect } from "react";
import {
  Typography,
  Breadcrumb,
  Table,
  Button,
  Space,
  message,
  Modal,
  Popconfirm,
  Card,
} from "antd";
import {
  HomeOutlined,
  DashboardOutlined,
  TagOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import BrandForm from "../BrandForm";
import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/services/brandService";
import moment from "moment";
import { Brand } from "@/types";

const { Title } = Typography;

const Container = styled.div`
  padding: 0 0 32px 0;
`;

const BrandsListPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [currentBrand, setCurrentBrand] = useState<Partial<Brand>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await getAllBrands();
      setBrands(data);
    } catch (error) {
      message.error("Failed to fetch brands");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const showAddModal = () => {
    setCurrentBrand({});
    setIsEditing(false);
    setModalVisible(true);
  };

  const showEditModal = async (id: string) => {
    try {
      setFormLoading(true);
      const brand = await getBrandById(id);
      setCurrentBrand(brand);
      setIsEditing(true);
      setModalVisible(true);
    } catch (error) {
      message.error("Failed to load brand details");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveBrand = async (values: { brandName: string }) => {
    try {
      setFormLoading(true);
      if (isEditing && currentBrand._id) {
        await updateBrand(currentBrand._id, values);
        message.success("Brand updated successfully");
      } else {
        await createBrand(values);
        message.success("Brand created successfully");
      }
      setModalVisible(false);
      fetchBrands();
    } catch (error) {
      message.error(
        isEditing ? "Failed to update brand" : "Failed to create brand"
      );
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      setLoading(true);
      await deleteBrand(id);
      message.success("Brand deleted successfully");
      fetchBrands();
    } catch (error) {
      message.error(
        (error as any).response?.data?.message || "Failed to delete brand"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Brand Name",
      dataIndex: "brandName",
      key: "brandName",
      sorter: (a: Brand, b: Brand) => a.brandName.localeCompare(b.brandName),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => moment(text).format("YYYY-MM-DD"),
      sorter: (a: Brand, b: Brand) =>
        moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Brand) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record._id)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this brand?"
            onConfirm={() => handleDeleteBrand(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin">
            <DashboardOutlined /> Admin
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <TagOutlined /> Brands
        </Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2}>Manage Brands</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          Add Brand
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={brands.map((brand) => ({ ...brand, key: brand._id }))}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={isEditing ? "Edit Brand" : "Add Brand"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <BrandForm
          initialValues={currentBrand}
          onSubmit={handleSaveBrand}
          loading={formLoading}
        />
      </Modal>
    </Container>
  );
};

export default BrandsListPage;
