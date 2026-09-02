import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/profile";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      <Route path="/forgot-password" element={<ForgotPassword />} />
   

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      <Route path="/profile" element={<Profile />} />

    </Routes>
  );
}

export default App;