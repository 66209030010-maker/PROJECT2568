import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { FaWallet, FaCheckCircle, FaTimesCircle, FaPlus, FaBoxOpen, FaChartLine, FaGamepad, FaExclamationTriangle } from "react-icons/fa";

const SellerDashboard = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/seller/me")
      .then((res) => setSeller(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <FaGamepad className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-indigo-400 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaGamepad className="text-4xl text-indigo-400" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Seller Dashboard
          </h1>
        </div>
        <p className="text-gray-400 ml-14">จัดการธุรกิจเกมของคุณ</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Balance Card */}
        <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/5 group-hover:to-green-500/5 transition-all duration-300"></div>

          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <FaWallet className="text-2xl text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-gray-400">ยอดเงินคงเหลือ</p>
            </div>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              ฿{parseFloat(seller?.balance || 0).toFixed(2)}
            </p>
          </div>
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Permission Card */}
        <div className={`group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border ${seller?.sellerCanPost ? 'border-green-700/50 hover:border-green-500/50 hover:shadow-green-500/10' : 'border-red-700/50 hover:border-red-500/50 hover:shadow-red-500/10'} rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300`}>
          <div className={`absolute inset-0 ${seller?.sellerCanPost ? 'bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5' : 'bg-gradient-to-r from-red-500/0 to-pink-500/0 group-hover:from-red-500/5 group-hover:to-pink-500/5'} transition-all duration-300`}></div>

          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 ${seller?.sellerCanPost ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-xl`}>
                {seller?.sellerCanPost ? (
                  <FaCheckCircle className="text-2xl text-green-400" />
                ) : (
                  <FaTimesCircle className="text-2xl text-red-400" />
                )}
              </div>
              <p className="text-sm font-medium text-gray-400">สิทธิ์การโพสต์</p>
            </div>
            {seller?.sellerCanPost ? (
              <p className="text-2xl font-bold text-green-300 flex items-center gap-2">
                <FaCheckCircle className="text-xl" /> อนุมัติแล้ว
              </p>
            ) : (
              <p className="text-2xl font-bold text-red-300 flex items-center gap-2">
                <FaTimesCircle className="text-xl" /> ยังไม่อนุมัติ
              </p>
            )}
          </div>
          <div className={`h-1 ${seller?.sellerCanPost ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>
      </div>

      {/* Warning or Action Buttons */}
      {!seller?.sellerCanPost ? (
        <div className="relative bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border-2 border-yellow-500/50 rounded-2xl overflow-hidden mb-8">
          <div className="p-8 text-center">
            <FaExclamationTriangle className="text-5xl text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-300 mb-3">
              ⚠️ คุณยังไม่สามารถโพสต์สินค้าได้
            </h2>
            <p className="text-yellow-200/80 text-lg">
              กรุณาติดต่อแอดมินผ่าน{" "}
              <span className="font-bold text-yellow-300">LINE: @gamekey-admin</span>{" "}
              เพื่อขอสิทธิ์ในการขาย
            </p>
          </div>
          <div className="h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 animate-gradient"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Product Button */}
          <Link
            to="/seller/create-product"
            className="group relative bg-gradient-to-br from-indigo-600 to-purple-600 border border-indigo-500/50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-300"></div>
            <div className="relative p-8 text-center">
              <FaPlus className="text-4xl text-white mx-auto mb-3" />
              <p className="text-xl font-bold text-white">Create Product</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          {/* My Products Button */}
          <Link
            to="/seller/products"
            className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300"></div>
            <div className="relative p-8 text-center">
              <FaBoxOpen className="text-4xl text-blue-400 mx-auto mb-3" />
              <p className="text-xl font-bold text-white">My Products</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          {/* Sales History Button */}
          <Link
            to="/seller/sales"
            className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all duration-300"></div>
            <div className="relative p-8 text-center">
              <FaChartLine className="text-4xl text-emerald-400 mx-auto mb-3" />
              <p className="text-xl font-bold text-white">Sales History</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;