import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FaWallet, FaBolt } from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi";

const Wallet = () => {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);

  const quickAmounts = [100, 500, 1000, 5000];

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/buyer/wallet/transactions");
      const data = res.data?.items || res.data?.data || res.data;
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTopup = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (!numAmount || numAmount <= 0) {
      toast.error("กรอกจำนวนเงินให้ถูกต้อง");
      return;
    }

    setLoading(true);
    try {
      await api.post("/buyer/topup", { amount: numAmount });
      toast.success(`เติมเงิน +฿${numAmount.toLocaleString()} สำเร็จ`);
      await refreshUser();
      setAmount("");
      await fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.error || "เติมเงินไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const balance = parseFloat(user?.balance || 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaWallet className="text-3xl text-indigo-300" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Wallet
          </h1>
        </div>
        <p className="text-white/60">
          เติมเงินจำลองเพื่อทดสอบระบบ และดูประวัติรายการของคุณ
        </p>
      </div>

      {/* Balance Card */}
      <div className="mb-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-500/10 p-6">
        <p className="text-white/60 text-sm">Available Balance</p>

        <div className="mt-2 flex items-end justify-between gap-4">
          <div className="text-5xl font-extrabold bg-gradient-to-r from-cyan-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            ฿{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-white/60 text-sm">
            <HiOutlineClock className="text-lg" />
            <span>อัปเดตล่าสุด: ตอนนี้</span>
          </div>
        </div>

        <div className="mt-4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-black/20 border border-white/10 p-3">
            <p className="text-white/60">สถานะ</p>
            <p className="text-white font-semibold mt-1">พร้อมใช้งาน</p>
          </div>
          <div className="rounded-xl bg-black/20 border border-white/10 p-3">
            <p className="text-white/60">ประเภท</p>
            <p className="text-white font-semibold mt-1">Deposit-only</p>
          </div>
        </div>
      </div>

      {/* Top Up Form */}
      <div className="mb-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl shadow-purple-500/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FaBolt className="text-yellow-300" />
          Top Up
        </h2>

        <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl p-4 mb-4">
          <p className="text-indigo-100/90 text-sm leading-relaxed">
            <strong>ℹ️ Note:</strong> นี่คือการเติมเงินจำลองสำหรับทดสอบระบบ
            กระเป๋า Buyer เติมได้อย่างเดียว (ถอนไม่ได้) แต่ใช้ซื้อสินค้าได้
          </p>
        </div>

        {/* Quick amounts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickAmounts.map((qa) => (
            <button
              type="button"
              key={qa}
              onClick={() => setAmount(qa.toString())}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              ฿{qa.toLocaleString()}
            </button>
          ))}
        </div>

        <form onSubmit={handleTopup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            min="1"
            step="0.01"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Funds"}
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl shadow-indigo-500/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Transaction History
        </h2>

        {txLoading ? (
          <p className="text-white/60">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-white/50">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const amt = parseFloat(tx.amount || 0);
              const isPlus = amt >= 0;

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl bg-black/20 border border-white/10 p-4 hover:bg-black/30 transition"
                >
                  <div>
                    <p className="text-sm font-semibold text-white capitalize">
                      {(tx.type || "").replaceAll("_", " ") || "transaction"}
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleDateString("th-TH", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </p>
                  </div>

                  <span
                    className={`text-lg font-extrabold ${
                      isPlus ? "text-emerald-300" : "text-red-300"
                    }`}
                  >
                    {isPlus ? "+" : ""}
                    ฿{amt.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
