import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaChartLine, FaGamepad, FaUser, FaCoins, FaPercentage, FaTrophy, FaBoxOpen } from "react-icons/fa";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/seller/sales")
      .then((res) => setSales(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalEarn = sales.reduce(
    (sum, s) => sum + parseFloat(s.sellerEarn),
    0
  );

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaChartLine className="text-4xl text-emerald-400" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
            ประวัติการขาย
          </h1>
        </div>
        <p className="text-gray-400 ml-14">ติดตามรายได้และยอดขายของคุณ</p>
      </div>

      {/* Total Earnings Card */}
      <div className="group relative bg-gradient-to-br from-emerald-600/20 to-green-600/20 backdrop-blur-sm border border-emerald-500/50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/10 group-hover:to-green-500/10 transition-all duration-300"></div>

        <div className="relative p-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-4 bg-emerald-500/30 rounded-2xl">
              <FaTrophy className="text-4xl text-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-200/80">รายได้รวมทั้งหมด</p>
              <p className="text-5xl font-extrabold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                ฿{totalEarn.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 animate-gradient"></div>
      </div>

      {/* Sales Table */}
      {sales.length === 0 ? (
        <div className="card-hover text-center py-20">
          <FaBoxOpen className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">ยังไม่มียอดขาย</p>
          <p className="text-gray-500 text-sm mt-2">เมื่อมีคนซื้อสินค้าของคุณ จะแสดงที่นี่</p>
        </div>
      ) : (
        <div className="card-hover overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-700 border-b-2 border-indigo-500/30">
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
                      <FaGamepad />
                      <span>สินค้า</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
                      <FaUser />
                      <span>ผู้ซื้อ</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-sm font-semibold text-indigo-300">
                      <FaCoins />
                      <span>ราคา</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-sm font-semibold text-indigo-300">
                      <FaPercentage />
                      <span>ค่าธรรมเนียม (7%)</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-sm font-semibold text-emerald-300">
                      <FaTrophy />
                      <span>คุณได้รับ</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-semibold text-indigo-300">วันที่</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s, index) => (
                  <tr
                    key={s.id}
                    className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/40'
                      }`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{s.product?.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">{s.buyer?.name}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-blue-300 font-semibold">
                        ฿{parseFloat(s.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-red-400 font-semibold">
                        -฿{parseFloat(s.platformFee).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-emerald-300 font-bold text-lg">
                        ฿{parseFloat(s.sellerEarn).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {new Date(s.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;