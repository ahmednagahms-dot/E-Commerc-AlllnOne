import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Carts from "./pages/Carts";
import ProductForm from "./pages/ProductForm";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
       <Route path="/dashboard/carts" element={<ProtectedRoute><Carts /></ProtectedRoute>} />
      
      <Route path="/dashboard/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/dashboard/products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;