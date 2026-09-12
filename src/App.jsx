import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/profile";
import Orders from './pages/Orders';
import Carts from "./pages/Carts";
import Wishlists from "./pages/Wishlists";
import Coupons from "./pages/Coupons";
import Notifications from "./pages/Notifications";
import ProductForm from "./pages/ProductForm";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";
import Settings from "./pages/Settings";
import Reviews from "./pages/Reviews";

import Users from "./pages/Users";
import Categories from "./pages/Categories";


function App() {
  return (
    <>
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/dashboard/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/dashboard/carts" element={<ProtectedRoute><Carts /></ProtectedRoute>} />

      <Route path="/dashboard/Wishlists" element={<ProtectedRoute><Wishlists/></ProtectedRoute>} />
      <Route path="/dashboard/Coupons" element={<ProtectedRoute><Coupons/></ProtectedRoute>} />
      <Route path="/dashboard/Notifications" element={<ProtectedRoute><Notifications/></ProtectedRoute>} />


      <Route path="/dashboard/wishlists" element={<ProtectedRoute><Wishlists /></ProtectedRoute>} />
      <Route path="/dashboard/coupons" element={<ProtectedRoute><Coupons /></ProtectedRoute>} />

      {/* Products Routes */}

      <Route path="/dashboard/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/dashboard/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/dashboard/products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/dashboard/products/:id/view" element={<ProtectedRoute><ProductView /></ProtectedRoute>} />
      <Route path="/dashboard/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />

      {/* Settings & Users Routes */}
      <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/dashboard/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />

      


      {/* Catch-all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
  <Route 
  path="/dashboard/reviews" 
  element={
    <ProtectedRoute>
      <Reviews />
    </ProtectedRoute>
  } 
/>
    </Routes>
    
     <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
  draggable
  toastClassName="!bg-[#FCFAF7] !text-[#263653] !rounded-2xl !border !border-[#E3E0DB] !shadow-lg !w-[calc(100vw-2rem)] sm:!w-[380px] !min-h-[60px] !font-medium"
  progressClassName="!bg-[#20A464]"
/>
    </>
  );
}

export default App;