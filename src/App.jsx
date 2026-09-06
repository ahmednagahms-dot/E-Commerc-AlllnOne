import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Carts from "./pages/Carts";
import Wishlists from "./pages/Wishlists";
import Coupons from "./pages/Coupons";
import ProductForm from "./pages/ProductForm";
import Products from "./pages/Products";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/dashboard/carts" element={<ProtectedRoute><Carts /></ProtectedRoute>} />
      <Route path="/dashboard/Wishlists" element={<ProtectedRoute><Wishlists/></ProtectedRoute>} />
      <Route path="/dashboard/Coupons" element={<ProtectedRoute><Coupons/></ProtectedRoute>} />

      <Route path="/dashboard/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/dashboard/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/dashboard/products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      

      {/* Catch-all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;