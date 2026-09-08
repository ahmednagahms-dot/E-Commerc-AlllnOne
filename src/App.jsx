import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/profile";
import Orders from './pages/Orders';
import Carts from "./pages/Carts";
import Wishlists from "./pages/Wishlists";
import Coupons from "./pages/Coupons";
import ProductForm from "./pages/ProductForm";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import Reviews from "./pages/Reviews";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/dashboard/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/dashboard/carts" element={<ProtectedRoute><Carts /></ProtectedRoute>} />
<<<<<<< HEAD
      <Route path="/dashboard/Wishlists" element={<ProtectedRoute><Wishlists/></ProtectedRoute>} />
      <Route path="/dashboard/Coupons" element={<ProtectedRoute><Coupons/></ProtectedRoute>} />
      <Route path="/dashboard/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
=======
      <Route path="/dashboard/wishlists" element={<ProtectedRoute><Wishlists /></ProtectedRoute>} />
      <Route path="/dashboard/coupons" element={<ProtectedRoute><Coupons /></ProtectedRoute>} />

      {/* Products Routes */}
>>>>>>> 68aa3543cbe0216df74665538c7071d5d29b73d2
      <Route path="/dashboard/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/dashboard/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/dashboard/products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/dashboard/products/:id/view" element={<ProtectedRoute><ProductView /></ProtectedRoute>} />

      {/* Settings & Users Routes */}
      <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/dashboard/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
<<<<<<< HEAD
      <Route path="/dashboard/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
      
=======
>>>>>>> 68aa3543cbe0216df74665538c7071d5d29b73d2

      {/* Catch-all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;