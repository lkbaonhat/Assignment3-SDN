import React, { useContext, useState } from "react";
import {
  Typography,
  Card,
  Descriptions,
  Rate,
  Divider,
  Row,
  Col,
  Tag,
  Button,
  Image,
  message,
} from "antd";
import styled from "styled-components";
import { AuthContext } from "@/context/AuthContext";
import CommentList from "../CommentList";
import CommentForm from "../CommentForm";
import { Perfume, Brand, CommentFormData } from "@/types";
import { addComment } from "@/services/perfumeService";

const { Title, Text } = Typography;

const DetailCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const PriceText = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: #f5222d;
`;

const AttributeTag = styled(Tag)`
  margin: 0 8px 8px 0;
  padding: 4px 8px;
  font-size: 14px;
`;

const SectionDivider = styled(Divider)`
  margin: 24px 0;
`;

interface PerfumeDetailProps {
  perfume: Perfume;
  onCommentUpdate: () => void;
}

const PerfumeDetail: React.FC<PerfumeDetailProps> = ({
  perfume,
  onCommentUpdate,
}) => {
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Handle brand when it's either a string (ID) or a Brand object
  const brandName =
    typeof perfume.brand === "string"
      ? "Brand" // Fallback when only ID is available
      : (perfume.brand as Brand).brandName;

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

  // Calculate average rating from comments
  const averageRating = perfume.comments.length
    ? perfume.comments.reduce((acc, comment) => acc + comment.rating, 0) /
      perfume.comments.length
    : 0;

  const handleAddComment = async (commentData: CommentFormData) => {
    try {
      setSubmitting(true);
      await addComment(perfume._id, commentData);
      message.success("Comment added successfully");
      onCommentUpdate(); // Refresh the perfume details to show the new comment
    } catch (error) {
      message.error("Failed to add comment");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  //Check if user is admin
  const isAdmin = currentUser?.isAdmin;

  // Check if the current user has already commented
  const hasUserCommented = currentUser
    ? perfume.comments.some((comment) => comment.author._id === currentUser._id)
    : false;

  // Concentration information with colors
  const concentrationColors = {
    "Eau de Parfum (15-20%)": "#8b5cf6", // purple
    "Eau de Toilette (5-15%)": "#3b82f6", // blue
    "Eau de Cologne (2-4%)": "#10b981", // green
    "Parfum (20-30%)": "#ef4444", // red
    "Eau Fraiche (1-3%)": "#f59e0b", // amber
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={10}>
          <Image
            src={perfume.uri}
            alt={perfume.perfumeName}
            width="100%"
            height="auto"
            style={{
              maxHeight: "500px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Col>
        <Col xs={24} md={14}>
          <DetailCard>
            <Title level={2}>{perfume.perfumeName}</Title>
            <Title level={5} type="secondary">
              {brandName}
            </Title>

            <div style={{ margin: "16px 0" }}>
              <Rate disabled allowHalf defaultValue={averageRating} />
              <Text style={{ marginLeft: 8 }}>
                ({perfume.comments.length}{" "}
                {perfume.comments.length === 1 ? "review" : "reviews"})
              </Text>
            </div>

            <PriceText>${perfume.price.toFixed(2)}</PriceText>

            <Descriptions column={1} style={{ marginTop: 16 }}>
              <Descriptions.Item label="Volume">
                {perfume.volume} ml
              </Descriptions.Item>
              <Descriptions.Item label="Concentration">
                <Tag
                  color={
                    concentrationColors[perfume.concentration] || "#2db7f5"
                  }
                  style={{ padding: "4px 8px", marginTop: 4 }}
                >
                  {perfume.concentration}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Target Audience">
                <Tag color={getAudienceColor(perfume.targetAudience)}>
                  {perfume.targetAudience}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </DetailCard>
        </Col>
      </Row>

      <SectionDivider />

      <DetailCard>
        <Title level={4}>Description</Title>
        <Text>{perfume.description}</Text>
      </DetailCard>

      <DetailCard>
        <Title level={4}>Ingredients</Title>
        <Text>{perfume.ingredients}</Text>
      </DetailCard>

      <SectionDivider />

      <DetailCard>
        <Title level={4}>Reviews ({perfume.comments.length})</Title>

        {isAuthenticated && !hasUserCommented && !isAdmin && (
          <>
            <Title level={5}>Add Your Review</Title>
            <CommentForm onSubmit={handleAddComment} loading={submitting} />
            <Divider />
          </>
        )}

        <CommentList
          comments={perfume.comments}
          perfumeId={perfume._id}
          onCommentUpdate={onCommentUpdate}
        />
      </DetailCard>
    </div>
  );
};

export default PerfumeDetail;
