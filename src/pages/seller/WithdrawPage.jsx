import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const statusColors = {
  pending: "badge-pending",
  paid: "badge-approved",
  rejected: "badge-rejected",
};

const statusLabels = {
  pending: "รอดำเนินการ",
  paid: "จ่ายแล้ว",
  rejected: "ปฏิเสธ",
};

const Withdraw = () => {
  const { user, refreshUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRequests = () => {
    api
      .get("/seller/withdraw-requests")
      .then((res) => setRequests(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/seller/withdraw-requests", {
        amount: parseFloat(amount),
      });
      toast.success("ส่งคำขอถอนเงินเรียบร้อยแล้ว!");
      setAmount("");
      await refreshUser();
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || "ไม่สามารถส่งคำขอได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">
        ถอนเงิน 💰
      </h1>

      <div className="card bg-gradient-to-r from-indigo-900/50 to-emerald-900/50 border-indigo-500/30 mb-6 text-center">
        <p className="text-sm text-gray-400">ยอดเงินคงเหลือ</p>
        <p className="text-3xl font-bold text-emerald-400 mt-1">
          ฿{parseFloat(user?.balance || 0).toLocaleString()}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card mb-8"
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          จำนวนเงินที่ต้องการถอน (฿)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="0.01"
          required
          className="input-field mb-4"
          placeholder="0.00"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? "กำลังส่งคำขอ..." : "ส่งคำขอถอนเงิน"}
        </button>
      </form>

      <h2 className="text-xl font-bold text-gray-100 mb-4">
        ประวัติการถอนเงิน
      </h2>

      {requests.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-400">ยังไม่มีประวัติการถอนเงิน</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="card flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-white text-lg">
                  ฿{parseFloat(r.amount).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {r.adminNote && (
                  <p className="text-xs text-gray-500 mt-1">
                    หมายเหตุ: {r.adminNote}
                  </p>
                )}
              </div>
              <span className={statusColors[r.status] || "badge-pending"}>
                {statusLabels[r.status] || r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Withdraw;
