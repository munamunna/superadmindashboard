import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import UserPermissions from "./pages/UserPermissions";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/dashboard" element={<h1>Super Admin Dashboard</h1>} /> */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserManagement />} />
          <Route path="/permissions" element={<UserPermissions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
