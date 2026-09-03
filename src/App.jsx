import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import ProductForm from "./pages/ProductForm";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />



      <Route path="*" element={<Navigate to="/dashboard" replace />} />
     
     <Route path="/dashboard/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
    <Route path="/dashboard/products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;