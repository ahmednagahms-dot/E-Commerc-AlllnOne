import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/profile";
import Orders from "./pages/Orders";
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

// Routes
import ProtectedRoute from "./routes/ProtectedRoute";

// قائمة الـ routes المحمية
const protectedRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/dashboard/profile", element: <Profile /> },
  { path: "/dashboard/orders", element: <Orders /> },
  { path: "/dashboard/carts", element: <Carts /> },
  { path: "/dashboard/wishlists", element: <Wishlists /> },
  { path: "/dashboard/coupons", element: <Coupons /> },
  { path: "/dashboard/notifications", element: <Notifications /> },

  // Products
  { path: "/dashboard/products", element: <Products /> },
  { path: "/dashboard/products/new", element: <ProductForm /> },
  { path: "/dashboard/products/:id/edit", element: <ProductForm /> },
  { path: "/dashboard/products/edit/:id", element: <ProductForm /> },
  { path: "/dashboard/products/:id/view", element: <ProductView /> },

  // Categories, Reviews, Users, Settings
  { path: "/dashboard/categories", element: <Categories /> },
  { path: "/dashboard/reviews", element: <Reviews /> },
  { path: "/dashboard/settings", element: <Settings /> },
  { path: "/dashboard/users", element: <Users /> },
];

function App() {
  return (
    <>
      <Routes>
        {/* =========================
            Public Routes
        ========================== */}

        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* =========================
            Protected Routes
        ========================== */}

        {protectedRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute>{element}</ProtectedRoute>}
          />
        ))}

        {/* =========================
            Fallback
        ========================== */}

        {/* أي Route غير موجود يرجع للـ Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="!bg-surface !text-ink !rounded-2xl !border !border-surface-border !shadow-lg !w-[calc(100vw-2rem)] sm:!w-[380px] !min-h-[60px] !font-medium"
        progressClassName="!bg-success"
      />
    </>
  );
}

export default App;