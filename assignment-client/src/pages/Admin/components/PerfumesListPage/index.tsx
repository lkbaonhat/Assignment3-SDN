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
  Image,
  Tag,
} from "antd";
import {
  HomeOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PerfumeForm from "../PerfumeForm";
import {
  getAllPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume,
} from "@/services/perfumeService";
import moment from "moment";
import { Perfume, Brand } from "@/types";

const { Title } = Typography;

const Container = styled.div`
  padding: 0 0 32px 0;
`;

const PerfumesListPage: React.FC = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [currentPerfume, setCurrentPerfume] = useState<Partial<Perfume>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      const data = await getAllPerfumes();
      setPerfumes(data);
    } catch (error) {
      message.error("Failed to fetch perfumes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const showAddModal = () => {
    setCurrentPerfume({});
    setIsEditing(false);
    setModalVisible(true);
  };

  const showEditModal = async (id: string) => {
    try {
      setFormLoading(true);
      const perfume = await getPerfumeById(id);
      setCurrentPerfume(perfume);
      setIsEditing(true);
      setModalVisible(true);
    } catch (error) {
      message.error("Failed to load perfume details");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSavePerfume = async (values: Partial<Perfume>) => {
    try {
      setFormLoading(true);
      if (isEditing && currentPerfume._id) {
        await updatePerfume(currentPerfume._id, values);
        message.success("Perfume updated successfully");
      } else {
        await createPerfume(values);
        message.success("Perfume created successfully");
      }
      setModalVisible(false);
      fetchPerfumes();
    } catch (error) {
      message.error(
        isEditing ? "Failed to update perfume" : "Failed to create perfume"
      );
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePerfume = async (id: string) => {
    try {
      setLoading(true);
      await deletePerfume(id);
      message.success("Perfume deleted successfully");
      fetchPerfumes();
    } catch (error) {
      message.error(
        (error as any).response?.data?.message || "Failed to delete perfume"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAudienceColor = (audience: string): string => {
    switch (audience.toLowerCase()) {
      case "male":
        return "blue";
      case "female":
        return "magenta";
      case "unisex":
        return "purple";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "uri",
      key: "uri",
      render: (uri: string) => (
        <Image
          src={uri}
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
          alt="Perfume"
        />
      ),
    },
    {
      title: "Perfume Name",
      dataIndex: "perfumeName",
      key: "perfumeName",
      sorter: (a: Perfume, b: Perfume) =>
        a.perfumeName.localeCompare(b.perfumeName),
    },
    {
      title: "Brand",
      key: "brand",
      render: (text: string, record: Perfume) => {
        const brandName =
          typeof record.brand === "string"
            ? "Brand" // Fallback when only ID is available
            : (record.brand as Brand).brandName;
        return brandName;
      },
    },
    {
      title: "Price (USD)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: (a: Perfume, b: Perfume) => a.price - b.price,
    },
    {
      title: "Audience",
      dataIndex: "targetAudience",
      key: "targetAudience",
      render: (audience: string) => (
        <Tag color={getAudienceColor(audience)}>{audience}</Tag>
      ),
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
        { text: "Unisex", value: "unisex" },
      ],
      onFilter: (value: string, record: Perfume) =>
        record.targetAudience === value,
    },
    {
      title: "Reviews",
      key: "reviews",
      render: (text: string, record: Perfume) => record.comments.length,
      sorter: (a: Perfume, b: Perfume) => a.comments.length - b.comments.length,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Perfume) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record._id)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this perfume?"
            onConfirm={() => handleDeletePerfume(record._id)}
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
          <ShoppingOutlined /> Perfumes
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
        <Title level={2}>Manage Perfumes</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          Add Perfume
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={perfumes.map((perfume) => ({
            ...perfume,
            key: perfume._id,
          }))}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={isEditing ? "Edit Perfume" : "Add Perfume"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <PerfumeForm
          initialValues={currentPerfume}
          onSubmit={handleSavePerfume}
          loading={formLoading}
        />
      </Modal>

      {/* Updated timestamp and user info */}
      <div
        style={{
          marginTop: 40,
          textAlign: "right",
          fontSize: 12,
          color: "#999",
        }}
      >
        Last updated: 2025-03-10 05:01:10 UTC by lkbaonhatcontinue
      </div>
    </Container>
  );
};

export default PerfumesListPage;
