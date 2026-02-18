import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { FaGamepad } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // แปลบทบาทเป็นภาษาไทย
  const getRoleLabel = (role) => {
    const roleMap = {
      admin: "ผู้ดูแลระบบ",
      seller: "ผู้ขาย",
      buyer: "ผู้ซื้อ"
    };
    return roleMap[role] || role;
  };

  return (
    <nav className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaGamepad className="text-indigo-500 text-2xl" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
              ShopGameZone
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
            >
              ตลาด
            </Link>

            {!user && (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                  เข้าสู่ระบบ
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  สมัครสมาชิก
                </Link>
              </>
            )}

            {user && user.role === "buyer" && (
              <>
                <Link
                  to="/buyer/orders"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  คำสั่งซื้อของฉัน
                </Link>
                <Link
                  to="/buyer/wallet"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  กระเป๋าเงิน
                </Link>
              </>
            )}

            {user && user.role === "seller" && (
              <>
                <Link
                  to="/seller/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  แดชบอร์ด
                </Link>
                <Link
                  to="/seller/products"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  สินค้าของฉัน
                </Link>
                <Link
                  to="/seller/sales"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  ยอดขาย
                </Link>
                <Link
                  to="/seller/withdraw"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  ถอนเงิน
                </Link>
              </>
            )}

            {user && user.role === "admin" && (
              <>
                <Link
                  to="/admin/users"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  ผู้ใช้
                </Link>
                <Link
                  to="/admin/products"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  สินค้า
                </Link>
                <Link
                  to="/admin/withdraw"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  การถอนเงิน
                </Link>
              </>
            )}

            {user && (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-700">
                <div className="text-sm">
                  <span className="text-gray-400">สวัสดี, </span>
                  <span className="text-white font-medium">{user.name}</span>
                  <span className="ml-2 text-xs bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded-full">
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                {(user.role === "buyer" || user.role === "seller") && (
                  <span className="text-emerald-400 text-sm font-medium">
                    ฿{parseFloat(user.balance || 0).toLocaleString()}
                  </span>
                )}
                <Link
                  to="/profile"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  title="โปรไฟล์"
                >
                  <FaUser className="text-xl" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  title="ออกจากระบบ"
                >
                  <HiOutlineLogout className="text-xl" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenu className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block text-gray-300 hover:text-white px-3 py-2 text-sm"
              onClick={() => setMobileOpen(false)}
            >
              ตลาด
            </Link>
            {!user && (
              <>
                <Link
                  to="/login"
                  className="block text-gray-300 hover:text-white px-3 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-300 hover:text-white px-3 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
            {user && user.role === "buyer" && (
              <>
                <Link
                  to="/buyer/orders"
                  className="block text-gray-300 px-3 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  คำสั่งซื้อของฉัน
                </Link>
                <Link
                  to="/buyer/wallet"
                  className="block text-gray-300 px-3 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  กระเป๋าเงิน
                </Link>
              </>
            )}
            {user && user.role === "seller" && (
              <>
                <Link
                  to="/seller/dashboard"
                  className="block text-gray-300 px-3 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  แดชบอร์ด
                </Link>
                <Link
                  to="/seller/products"
                  className="block text-gray-300 px-3 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  สินค้าของฉัน
                </Link>
                <Link
                  to="/seller/sales"
                  className="block text-gray-300 px-3 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  ยอดขาย
                </Link>
                <Link
                  to="/seller/withdraw"
                  className="block text-gray-300 px-3 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  ถอนเงิน
                </Link>
              </>
            )}
            {user && user.role === "admin" && (
              <>
                <Link
                  to="/admin/users"
                  className="block text-gray-300 px-3 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  ผู้ใช้
                </Link>
                <Link
                  to="/admin/products"
                  className="block text-gray-300 px-3 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  สินค้า
                </Link>
                <Link
                  to="/admin/withdraw"
                  className="block text-gray-300 px-3 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  การถอนเงิน
                </Link>
              </>
            )}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block text-red-400 px-3 py-2 text-sm w-full text-left"
              >
                ออกจากระบบ
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;