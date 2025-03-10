import React from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";

interface AdminRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading?: boolean;
}

const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  isAuthenticated,
  isAdmin,
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

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return isAdmin ? <>{children}</> : <Navigate to="/" />;
};

export default AdminRoute;
