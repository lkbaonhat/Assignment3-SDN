import React from "react";
import { Card, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Perfume, Brand } from "@/types";

const { Meta } = Card;
const { Text } = Typography;

const StyledCard = styled(Card)`
  width: 100%;
  margin-bottom: 16px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .ant-card-cover img {
    height: 250px;
    object-fit: cover;
  }
`;

const PriceTag = styled(Text)`
  font-weight: bold;
  font-size: 16px;
  color: #f5222d;
`;

const TagContainer = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
`;

interface PerfumeCardProps {
  perfume: Perfume;
}

const concentrationColors = {
  "Eau de Parfum (15-20%)": "#8b5cf6", // purple
  "Eau de Toilette (5-15%)": "#3b82f6", // blue
  "Eau de Cologne (2-4%)": "#10b981", // green
  "Parfum (20-30%)": "#ef4444", // red
  "Eau Fraiche (1-3%)": "#f59e0b", // amber
};

const PerfumeCard: React.FC<PerfumeCardProps> = ({ perfume }) => {
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

  // Handle brand either as a string (ID) or as a Brand object
  const brandName =
    typeof perfume.brand === "string"
      ? "Brand" // Fallback when only ID is available
      : (perfume.brand as Brand).brandName;

  return (
    <Link to={`/perfumes/${perfume._id}`}>
      <StyledCard
        hoverable
        cover={<img alt={perfume.perfumeName} src={perfume.uri} />}
      >
        <Meta title={perfume.perfumeName} description={brandName} />
        <Tag
          color={concentrationColors[perfume.concentration] || "#2db7f5"}
          style={{ padding: "4px 8px", marginTop: 4 }}
        >
          {perfume.concentration}
        </Tag>
        <TagContainer>
          <Tag
            color={getAudienceColor(perfume.targetAudience)}
            style={{ textTransform: "capitalize" }}
          >
            {perfume.targetAudience}
          </Tag>
          <PriceTag>${perfume.price.toFixed(2)}</PriceTag>
        </TagContainer>
      </StyledCard>
    </Link>
  );
};

export default PerfumeCard;
