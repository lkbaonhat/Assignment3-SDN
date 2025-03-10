import React, { useState, useEffect, useContext } from "react";
import { Typography, Breadcrumb, Card } from "antd";
import {
  HomeOutlined,
  DashboardOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import MembersList from "../MembersList";
import { getAllMembers } from "@/services/memberService";
import { AuthUser } from "@/types";
import { AuthContext } from "@/context/AuthContext";

const { Title } = Typography;

const Container = styled.div`
  padding: 0 0 32px 0;
`;

const CollectorsPage: React.FC = () => {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await getAllMembers();
        const fiterData = data.filter(
          (member) => member._id !== currentUser?._id && !member.isAdmin
        );
        setMembers(fiterData);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

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
          <TeamOutlined /> Collectors
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2} style={{ marginBottom: 32 }}>
        Manage Members
      </Title>

      <Card>
        <MembersList members={members} loading={loading} />
      </Card>
    </Container>
  );
};

export default CollectorsPage;
