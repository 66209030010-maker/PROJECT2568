import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminWithdraw = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    setLoading(true);
    api
      .get(`/admin/withdraw_requests?status=${filter}`)
      .then((res) => setRequests(res.data))
      .catch((err) => {
        toast.error(err.response?.data?.error || "ไม่สามารถโหลดคำขอถอนเงินได้");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handlePaid = async (id) => {
    try {
      await api.patch(`/admin/withdraw_requests/${id}/paid`, {
        adminNote: "ชำระเงินเรียบร้อย",
      });
      toast.success("อนุมัติและชำระเงินเรียบร้อยแล้ว");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || "ไม่สามารถดำเนินการได้");
    }
  };

  const handleReject = async (id) => {
    const note = prompt("เหตุผลในการปฏิเสธ (ไม่บังคับ):");
    if (note === null) return; // User cancelled
    try {
      await api.patch(`/admin/withdraw_requests/${id}/reject`, {
        adminNote: note || "ปฏิเสธโดยผู้ดูแลระบบ",
      });
      toast.success("ปฏิเสธคำขอถอนเงินเรียบร้อยแล้ว");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || "ไม่สามารถปฏิเสธคำขอได้");
    }
  };

  const statusLabels = {
    pending: "รออนุมัติ",
    paid: "จ่ายแล้ว",
    rejected: "ปฏิเสธ"
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-pink-200/30 dark:border-pink-500/20 shadow-lg">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          ผู้ดูแลระบบ - คำขอถอนเงิน
        </h1>
      </div>

      <div className="flex gap-2 mb-6">
        {["pending", "paid", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === s
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : requests.length === 0 ? (
        <p className="text-gray-400">
          ไม่พบคำขอถอนเงิน "{statusLabels[filter]}"
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-gray-800 rounded-lg shadow border border-gray-700 p-5 flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-lg text-gray-100">
                  ฿{parseFloat(r.amount).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">
                  ผู้ขาย: {r.seller?.name} ({r.seller?.email})
                </p>
                <p className="text-sm text-gray-500">
                  ยอดคงเหลือผู้ขาย: ฿
                  {parseFloat(r.seller?.balance || 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(r.createdAt).toLocaleString('th-TH')}
                </p>
                {r.adminNote && (
                  <p className="text-xs text-gray-500 mt-1">
                    หมายเหตุ: {r.adminNote}
                  </p>
                )}
              </div>

              {r.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePaid(r.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    ✅ อนุมั ติและจ่ายเงิน
                  </button>
                  <button
                    onClick={() => handleReject(r.id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    ❌ ปฏิเสธ
                  </button>
                </div>
              )}

              {r.status !== "pending" && (
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${r.status === "paid"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-red-500/20 text-red-300"
                    }`}
                >
                  {statusLabels[r.status]}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminWithdraw;