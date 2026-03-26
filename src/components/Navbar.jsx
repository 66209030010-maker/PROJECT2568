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

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      admin: "ผู้ดูแลระบบ",
      seller: "ผู้ขาย",
      buyer: "ผู้ซื้อ"
    };
    return roleMap[role] || role;
  };

  return (
    <nav className="bg-[#fafaf8]/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-serif font-semibold tracking-tight text-neutral-900">
              ShopZone
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="text-neutral-600 hover:text-neutral-900 px-4 py-2 text-sm font-medium transition-colors"
            >
              ร้านค้า
            </Link>

            {!user && (
              <>
                <Link 
                  to="/login" 
                  className="text-neutral-600 hover:text-neutral-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link 
                  to="/register" 
                  className="ml-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium px-5 py-2 rounded-full transition-all"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}

            {user && user.role === "buyer" && (
              <>
                <Link
                  to="/buyer/orders"
                  className="text-neutral-600 hover:text-neutral-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  คำสั่งซื้อ
                </Link>
                <Link
                  to="/buyer/wallet"
                  className="text-neutral-600 hover:text-neutral-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  กระเป๋าเงิน
                </Link>
              </>
            )}

            {user && user.role === "seller" && (
              <>
                <Link
                  to="/seller/dashboard"
                  className="text-neutral-600 hover:text-neutral-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  แดชบอร์ด
                </Link>
                <Link
                  to="/seller/products"
                  className="text-neutral-600 hover:text-neutral-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  สินค้า
                </Link>
                <Link
                  to="/seller/sales"
                  className="text-neutral-600 hover:text-neutral-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  ยอดขาย
                </Link>
                <Link
                  to="/seller/withdraw"
                  className="text-neutral-600 hover:text-neutral-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  ถอนเงิน
                </Link>
              </>
            )}

            {user && user.role === "admin" && (
              <>
                <Link
                  to="/admin/users"
                  className="text-neutral-600 hover:text-neutral-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  ผู้ใช้
                </Link>
                <Link
                  to="/admin/products"
                  className="text-neutral-600 hover:text-neutral-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  สินค้า
                </Link>
                <Link
                  to="/admin/withdraw"
                  className="text-neutral-600 hover:text-neutral-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  การถอน
                </Link>
              </>
            )}

            {user && (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-neutral-200">
                <div className="text-sm">
                  <span className="text-neutral-500">สวัสดี, </span>
                  <span className="text-neutral-900 font-medium">{user.name}</span>
                  <span className="ml-2 text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                {(user.role === "buyer" || user.role === "seller") && (
                  <span className="text-[#E87975] text-sm font-semibold">
                    ฿{parseFloat(user.balance || 0).toLocaleString()}
                  </span>
                )}
                <Link
                  to="/profile"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors"
                  title="โปรไฟล์"
                >
                  <FaUser className="text-lg" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-neutral-500 hover:text-[#E87975] transition-colors"
                  title="ออกจากระบบ"
                >
                  <HiOutlineLogout className="text-xl" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-neutral-600 p-2"
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
          <div className="md:hidden pb-4 space-y-1 border-t border-neutral-100 pt-4">
            <Link
              to="/"
              className="block text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              ร้านค้า
            </Link>
            {!user && (
              <>
                <Link
                  to="/login"
                  className="block text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="block text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
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
                  className="block text-neutral-600 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  คำสั่งซื้อ
                </Link>
                <Link
                  to="/buyer/wallet"
                  className="block text-neutral-600 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
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
                  className="block text-neutral-600 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  แดชบอร์ด
                </Link>
                <Link
                  to="/seller/products"
                  className="block text-neutral-600 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  สินค้า
                </Link>
                <Link
                  to="/seller/sales"
                  className="block text-neutral-600 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  ยอดขาย
                </Link>
                <Link
                  to="/seller/withdraw"
                  className="block text-neutral-600 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
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
                  className="block text-neutral-600 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  ผู้ใช้
                </Link>
                <Link
                  to="/admin/products"
                  className="block text-neutral-600 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  สินค้า
                </Link>
                <Link
                  to="/admin/withdraw"
                  className="block text-neutral-600 hover:bg-neutral-100 px-4 py-3 rounded-xl text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  การถอน
                </Link>
              </>
            )}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block text-[#E87975] hover:bg-red-50 px-4 py-3 rounded-xl text-sm font-medium w-full text-left"
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
