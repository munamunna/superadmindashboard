import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import UserPermissions from "./pages/UserPermissions";
import ProductsPage from "./pages/ProductsPage";
import MarketingPage from "./pages/MarketingPage";
import OrdersPage from "./pages/OrdersPage";
import MediaPage from "./pages/MediaPage";
import OffersPage from "./pages/OffersPage";
import ClientsPage from "./pages/ClientsPage";
import SuppliersPage from "./pages/SuppliersPage";
import SupportPage from "./pages/SupportPage";
import SalesPage from "./pages/SalesPage";
import FinancePage from "./pages/FinancePage";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./components/ProtectedRoute";
import PermissionProtectedRoute from "./components/PermissionProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page - choose between admin/user login */}
        <Route path="/" element={<LandingPage />} />

        {/* Separate login pages */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-login" element={<UserLogin />} />

        {/* Unauthorized page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin-only routes (requires super admin) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserManagement />} />
          <Route path="/permissions" element={<UserPermissions />} />
        </Route>

        {/* Permission-protected content pages */}
        <Route
          path="/products"
          element={
            <PermissionProtectedRoute pageName="products">
              <ProductsPage />
            </PermissionProtectedRoute>
          }
        />
        <Route
          path="/marketing"
          element={
            <PermissionProtectedRoute pageName="marketing">
              <MarketingPage />
            </PermissionProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PermissionProtectedRoute pageName="orders">
              <OrdersPage />
            </PermissionProtectedRoute>
          }
        />
        <Route
          path="/media"
          element={
            <PermissionProtectedRoute pageName="media">
              <MediaPage />
            </PermissionProtectedRoute>
          }
        />
        <Route
          path="/offers"
          element={
            <PermissionProtectedRoute pageName="offers">
              <OffersPage />
            </PermissionProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <PermissionProtectedRoute pageName="clients">
              <ClientsPage />
            </PermissionProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <PermissionProtectedRoute pageName="suppliers">
              <SuppliersPage />
            </PermissionProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <PermissionProtectedRoute pageName="support">
              <SupportPage />
            </PermissionProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <PermissionProtectedRoute pageName="sales">
              <SalesPage />
            </PermissionProtectedRoute>
          }
        />
        <Route
          path="/finance"
          element={
            <PermissionProtectedRoute pageName="finance">
              <FinancePage />
            </PermissionProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
