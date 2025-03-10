import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Breadcrumb,
  Row,
  Col,
  Card,
  Statistic,
  List,
  Avatar,
  Spin,
  Tag,
} from "antd";
import {
  HomeOutlined,
  DashboardOutlined,
  TeamOutlined,
  ShoppingOutlined,
  TagOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getAllMembers } from "@/services/memberService";
import { getAllPerfumes } from "@/services/perfumeService";
import { getAllBrands } from "@/services/brandService";
import { AuthUser, Perfume, Brand } from "@/types";
import { AuthContext } from "@/context/AuthContext";

const { Title } = Typography;

const Container = styled.div`
  padding: 0 0 32px 0;
`;

const StyledCard = styled(Card)`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  height: 100%;
`;

interface DashboardData {
  memberCount: number;
  perfumeCount: number;
  brandCount: number;
  latestMembers: AuthUser[];
  topPerfumes: Perfume[];
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    memberCount: 0,
    perfumeCount: 0,
    brandCount: 0,
    latestMembers: [],
    topPerfumes: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [members, perfumes, brands] = await Promise.all([
          getAllMembers(),
          getAllPerfumes(),
          getAllBrands(),
        ]);

        const totalMembers = members.filter(
          (member) => member._id !== currentUser?._id && !member.isAdmin
        ).length;

        // Sort members by join date - newest first
        const latestMembers = [...members]
          .filter(
            (member) => member._id !== currentUser?._id && !member.isAdmin
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        // For demonstration - in a real app you might sort by most reviewed or highest rated
        const topPerfumes = perfumes.slice(0, 5);

        setDashboardData({
          memberCount: totalMembers,
          perfumeCount: perfumes.length,
          brandCount: brands.length,
          latestMembers,
          topPerfumes,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
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
          <DashboardOutlined /> Admin Dashboard
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2} style={{ marginBottom: 32 }}>
        Admin Dashboard
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <StyledCard>
            <Statistic
              title="Total Members"
              value={dashboardData.memberCount}
              prefix={<TeamOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <Link to="/admin/collectors">View all members</Link>
            </div>
          </StyledCard>
        </Col>
        <Col xs={24} sm={8}>
          <StyledCard>
            <Statistic
              title="Total Perfumes"
              value={dashboardData.perfumeCount}
              prefix={<ShoppingOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <Link to="/admin/perfumes">Manage perfumes</Link>
            </div>
          </StyledCard>
        </Col>
        <Col xs={24} sm={8}>
          <StyledCard>
            <Statistic
              title="Total Brands"
              value={dashboardData.brandCount}
              prefix={<TagOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <Link to="/admin/brands">Manage brands</Link>
            </div>
          </StyledCard>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <StyledCard title="Newest Members">
            <List
              dataSource={dashboardData.latestMembers}
              renderItem={(member) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<TeamOutlined />} />}
                    title={member.name}
                    description={`Joined: ${new Date(
                      member.createdAt
                    ).toLocaleDateString()}`}
                  />
                </List.Item>
              )}
            />
          </StyledCard>
        </Col>
        <Col xs={24} md={12}>
          <StyledCard title="Top Perfumes">
            <List
              dataSource={dashboardData.topPerfumes}
              renderItem={(perfume) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={perfume.uri} shape="square" />}
                    title={
                      <Link to={`/perfumes/${perfume._id}`}>
                        {perfume.perfumeName}
                      </Link>
                    }
                    description={`$${perfume.price.toFixed(2)} • ${
                      perfume.comments.length
                    } ${perfume.comments.length === 1 ? "review" : "reviews"}`}
                  />
                </List.Item>
              )}
            />
          </StyledCard>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
