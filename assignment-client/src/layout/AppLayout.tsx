import React from "react";
import { Layout } from "antd";
import styled from "styled-components";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  background-color: #f5f5f5;
`;

const ContentWrapper = styled.div`
  margin: 0 auto;
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <Header />
      <StyledContent>
        <ContentWrapper>{children}</ContentWrapper>
      </StyledContent>
      <Footer />
    </StyledLayout>
  );
};

export default AppLayout;
