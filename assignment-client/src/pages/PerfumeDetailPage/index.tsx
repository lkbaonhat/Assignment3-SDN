import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Breadcrumb, Spin, Result, Button } from "antd";
import { HomeOutlined, ShopOutlined } from "@ant-design/icons";
import { getPerfumeById } from "@/services/perfumeService";
import PerfumeDetail from "@/components/Perfumes/PerfumeDetail";
import styled from "styled-components";
import { Perfume } from "@/types";

const { Title } = Typography;

const Container = styled.div`
  padding: 0 0 32px 0;
`;

const SpinContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

interface RouteParams {
  id: string;
  [key: string]: string | undefined;
}

const PerfumeDetailPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerfume = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getPerfumeById(id);
      setPerfume(data);
    } catch (err) {
      console.error("Error fetching perfume details:", err);
      setError("Failed to load perfume details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfume();
  }, [id]);

  if (loading) {
    return (
      <SpinContainer>
        <Spin size="large" />
      </SpinContainer>
    );
  }

  if (error || !perfume) {
    return (
      <Result
        status="404"
        title="Perfume Not Found"
        subTitle="Sorry, the perfume you are looking for does not exist."
        extra={
          <Link to="/">
            <Button type="primary">Back to Home</Button>
          </Link>
        }
      />
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
          <Link to="/">
            <ShopOutlined /> Perfumes
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{perfume.perfumeName}</Breadcrumb.Item>
      </Breadcrumb>

      <PerfumeDetail perfume={perfume} onCommentUpdate={fetchPerfume} />
    </Container>
  );
};

export default PerfumeDetailPage;
