import React from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";

interface PrivateRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  loading?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  isAuthenticated,
  loading = false,
}) => {
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
