import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const orderKeyStore = (orderId) => `order_code_${orderId}`;

// สุ่ม key ไว้เป็น fallback กรณีหา key จากสินค้าไม่ได้
const genKey = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // ไม่ใช้ O/0 I/1
  const part = (n) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${part(5)}-${part(5)}-${part(5)}-${part(5)}`;
};

// ✅ ดึง key จาก API เป็นหลัก (ปลอดภัย/ตรงกับผู้ขาย)
// ถ้าไม่มีใน API ค่อย fallback หาใน localStorage
const getProductKey = (order) => {
  const apiKey = order?.product?.gameCode;
  if (typeof apiKey === "string" && apiKey.trim()) return apiKey.trim();

  const pid = order?.product?.id ?? order?.productId;
  if (pid) {
    const byId = (localStorage.getItem(`product_key_${pid}`) || "").trim();
    if (byId) return byId;
  }

  const title = order?.product?.title?.trim();
  if (title) {
    const byTitle = (localStorage.getItem(`product_key_title_${title}`) || "").trim();
    if (byTitle) return byTitle;
  }

  return "";
};

export default function OrderPayMock() {
  const { id } = useParams();
  const nav = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paid, setPaid] = useState(false);
  const [code, setCode] = useState("");

  // โหลด order จาก API
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/buyer/orders/${id}`);
        const ord = res.data;
        setOrder(ord);

        // ถ้ามี gameCode จาก API ให้ตั้งสถานะและบันทึกทันที
        const apiCode = getProductKey(ord);
        if (apiCode) {
          localStorage.setItem(orderKeyStore(id), apiCode);
          setPaid(true);
          setCode(apiCode);
        }
      } catch (e) {
        console.error(e);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // โหลด code ที่เคย “จ่ายแล้ว” ของ order นี้จาก localStorage
  useEffect(() => {
    const saved = localStorage.getItem(orderKeyStore(id));
    if (saved) {
      setPaid(true);
      setCode(saved);
    } else {
      setPaid(false);
      setCode("");
    }
  }, [id]);

  const priceText = useMemo(() => {
    const p = Number(order?.price || 0);
    return p.toLocaleString();
  }, [order]);

  const onPay = () => {
    // ✅ ใช้ gameCode จาก API เป็นหลัก — ถ้าไม่มีค่อยสุ่ม
    const productKey = getProductKey(order);
    const newCode = productKey || genKey();

    localStorage.setItem(orderKeyStore(id), newCode);
    setPaid(true);
    setCode(newCode);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert("คัดลอกรหัสแล้ว");
    } catch {
      alert("คัดลอกไม่สำเร็จ");
    }
  };

  if (loading) return <div className="p-6 text-white/70">Loading...</div>;
  if (!order) return <div className="p-6 text-red-300">Order not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-white">
          ชำระเงิน Order #{order.id}
        </h1>
        <button onClick={() => nav(-1)} className="btn-secondary">
          ย้อนกลับ
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">
              {order.product?.title || "Product"}
            </p>
            <p className="text-white/60 text-sm">
              Seller: {order.seller?.name || "-"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-emerald-300 font-extrabold text-2xl">฿{priceText}</p>
            <p className="text-white/60 text-sm">
              {paid ? "Paid" : "Unpaid"}
            </p>
          </div>
        </div>

        {!paid ? (
          <div className="mt-6">
            <p className="text-white/70 text-sm mb-3">
              *โหมดทดลอง Frontend เท่านั้น — กดปุ่มเพื่อจำลอง “ชำระเงินสำเร็จ”
              และจะดึงรหัสจากสินค้ามาแสดง (ถ้าไม่มีจะสุ่มให้)
            </p>

            <button onClick={onPay} className="btn-primary w-full">
              ยืนยันชำระเงิน
            </button>

            <div className="mt-4 text-xs text-white/50">
              <div>Debug:</div>
              <div>
                productId: {String(order?.product?.id ?? order?.productId ?? "-")}
              </div>
              <div>
                productKey(localStorage):{" "}
                {getProductKey(order) ? "✅ พบ" : "❌ ไม่พบ (จะสุ่ม)"}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-emerald-200 font-semibold mb-3">
              ✅ ชำระเงินแล้ว
            </p>

            <div className="rounded-xl bg-black/20 border border-white/10 p-4">
              <p className="text-white/60 text-sm mb-2">รหัสที่ได้รับ</p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="font-mono text-lg text-white break-all">{code}</div>
                <div className="flex gap-2">
                  <button onClick={copy} className="btn-secondary">
                    Copy
                  </button>
                  <button onClick={() => nav("/buyer/orders")} className="btn-primary">
                    กลับไปหน้า Orders
                  </button>
                </div>
              </div>

              <p className="text-white/50 text-xs mt-3">
                (บันทึกไว้แล้วในเครื่องคุณ — เปิดหน้านี้ใหม่ก็ยังเห็นรหัสเดิม)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
