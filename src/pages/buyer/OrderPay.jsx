import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const orderKeyStore = (orderId) => `order_code_${orderId}`;

const normalizeTitle = (t = "") =>
  t.toString().trim().toLowerCase().replace(/\s+/g, " ");

const genKey = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${part(5)}-${part(5)}-${part(5)}-${part(5)}`;
};

const getProductKey = (order) => {
  const pid = order?.product?.id ?? order?.productId;
  if (pid) {
    const byId = (localStorage.getItem(`product_key_${pid}`) || "").trim();
    if (byId) return byId;
  }

  const titleNorm = normalizeTitle(order?.product?.title || "");
  if (titleNorm) {
    const byTitle = (localStorage.getItem(`product_key_title_${titleNorm}`) || "").trim();
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/buyer/orders/${id}`);
        setOrder(res.data);
      } catch (e) {
        console.error(e);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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

  const priceText = useMemo(() => Number(order?.price || 0).toLocaleString(), [order]);

  const onPay = () => {
    const productKey = getProductKey(order);
    const newCode = productKey || genKey(); // ถ้าไม่เจอค่อยสุ่ม
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
        <h1 className="text-3xl font-extrabold text-white">ชำระเงิน Order #{order.id}</h1>
        <button onClick={() => nav(-1)} className="btn-secondary">ย้อนกลับ</button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">{order.product?.title || "Product"}</p>
            <p className="text-white/60 text-sm">Seller: {order.seller?.name || "-"}</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-300 font-extrabold text-2xl">฿{priceText}</p>
            <p className="text-white/60 text-sm">{paid ? "Paid" : "Unpaid"}</p>
          </div>
        </div>

        {!paid ? (
          <div className="mt-6">
            <p className="text-white/70 text-sm mb-3">
              *โหมดทดลอง Frontend เท่านั้น — กดปุ่มเพื่อจำลอง “ชำระเงินสำเร็จ” และดึงรหัสจากสินค้ามาแสดง
            </p>
            <button onClick={onPay} className="btn-primary w-full">ยืนยันชำระเงิน</button>

            {/* Debug สั้นๆ */}
            <div className="mt-4 text-xs text-white/50">
              productId: {String(order?.product?.id ?? order?.productId ?? "-")} <br />
              titleKey: {`product_key_title_${normalizeTitle(order?.product?.title || "")}`} <br />
              foundProductKey: {getProductKey(order) ? "YES" : "NO"}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-emerald-200 font-semibold mb-3">✅ ชำระเงินแล้ว</p>
            <div className="rounded-xl bg-black/20 border border-white/10 p-4">
              <p className="text-white/60 text-sm mb-2">รหัสที่ได้รับ</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="font-mono text-lg text-white break-all">{code}</div>
                <div className="flex gap-2">
                  <button onClick={copy} className="btn-secondary">Copy</button>
                  <button onClick={() => nav("/buyer/orders")} className="btn-primary">กลับไปหน้า Orders</button>
                </div>
              </div>
              <p className="text-white/50 text-xs mt-3">(บันทึกไว้แล้วในเครื่องคุณ — เปิดหน้านี้ใหม่ก็ยังเห็นรหัสเดิม)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
