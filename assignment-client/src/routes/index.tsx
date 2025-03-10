import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Public pages
import HomePage from "@/pages/HomePage";
import PerfumeDetailPage from "@/pages/PerfumeDetailPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

// Private pages
import ProfilePage from "@/pages/ProfilePage";

// Admin pages
import AdminDashboard from "@/pages/Admin/components/AdminDashboard";
import BrandsListPage from "@/pages/Admin/components/BrandsListPage";
import PerfumesListPage from "@/pages/Admin/components/PerfumesListPage";
import CollectorsPage from "@/pages/Admin/components/CollectorsPage";

// Route guards
import PrivateRoute from "./guards/PrivateRoute";
import AdminRoute from "./guards/AdminRoute";

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/perfumes/:id" element={<PerfumeDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes - require authentication */}
      <Route
        path="/profile"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* Admin Routes - require admin role */}
      <Route
        path="/admin"
        element={
          <AdminRoute
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            loading={loading}
          >
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/brands"
        element={
          <AdminRoute
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            loading={loading}
          >
            <BrandsListPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/perfumes"
        element={
          <AdminRoute
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            loading={loading}
          >
            <PerfumesListPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/collectors"
        element={
          <AdminRoute
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            loading={loading}
          >
            <CollectorsPage />
          </AdminRoute>
        }
      />

      {/* Catch all - 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
