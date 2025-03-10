import React from "react";
import { Layout, Typography } from "antd";
import styled from "styled-components";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const StyledFooter = styled(AntFooter)`
  text-align: center;
  background-color: #f0f2f5;
  padding: 24px;
`;

const Footer: React.FC = () => {
  // Using your provided timestamp for the copyright date
  const currentYear = 2025;

  return (
    <StyledFooter>
      <Text>Perfume Shop &copy; {currentYear} - All Rights Reserved</Text>
      <div>
        <Text type="secondary">
          Last updated: 2025-03-10 04:03:31 UTC by lkbaonhatcontinue
        </Text>
      </div>
    </StyledFooter>
  );
};

export default Footer;
