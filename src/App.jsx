import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";

// Buyer
import MyOrders from "./pages/buyer/Myorder";
import OrderDetail from "./pages/buyer/OrderDetail";
import Wallet from "./pages/buyer/Wallet";
import OrderPayMock from "./pages/buyer/OrderPayMock"; // ✅ ใช้ mock

// Seller
import SellerDashboard from "./pages/seller/SellerDashboard";
import CreateProduct from "./pages/seller/CreateProduct";
import MyProducts from "./pages/seller/MyProducts";
import SalesHistory from "./pages/seller/SalesHistory";
import Withdraw from "./pages/seller/WithdrawPage";

// Admin
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminWithdraw from "./pages/admin/AdminWithdraw";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 relative z-10">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Profile - All authenticated users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Buyer */}
          <Route
            path="/buyer/orders"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/orders/:id"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <OrderDetail />
              </ProtectedRoute>
            }
          />

          {/* ✅ หน้าชำระเงิน mock */}
          <Route
            path="/buyer/orders/:id/pay"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <OrderPayMock />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/wallet"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <Wallet />
              </ProtectedRoute>
            }
          />

          {/* Seller */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/create-product"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <MyProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/sales"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SalesHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/withdraw"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <Withdraw />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/withdraw"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminWithdraw />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
