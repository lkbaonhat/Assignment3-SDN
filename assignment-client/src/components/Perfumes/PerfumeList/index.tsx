import React from "react";
import { Row, Col, Empty, Spin } from "antd";
import styled from "styled-components";
import { Perfume } from "@/types";
import PerfumeCard from "../PerfumeCard";

const Container = styled.div`
  margin-top: 20px;
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

interface PerfumeListProps {
  perfumes: Perfume[];
  loading: boolean;
}

const PerfumeList: React.FC<PerfumeListProps> = ({ perfumes, loading }) => {
  if (loading) {
    return (
      <EmptyContainer>
        <Spin size="large" />
      </EmptyContainer>
    );
  }

  if (!perfumes || perfumes.length === 0) {
    return (
      <EmptyContainer>
        <Empty description="No perfumes found" />
      </EmptyContainer>
    );
  }

  return (
    <Container>
      <Row gutter={[16, 16]}>
        {perfumes.map((perfume) => (
          <Col xs={24} sm={12} md={8} lg={6} key={perfume._id}>
            <PerfumeCard perfume={perfume} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PerfumeList;
