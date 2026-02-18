import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/buyer/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-white/70">Loading...</div>;
  if (!order) return <div className="p-6 text-red-300">Order not found</div>;

  const isPaid = order.status === "paid" || order.paidAt;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white mb-6">Order #{order.id}</h1>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">{order.product?.title}</p>
            <p className="text-white/60 text-sm">Seller: {order.seller?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-300 font-extrabold text-xl">฿{Number(order.price).toLocaleString()}</p>
            <p className="text-white/60 text-sm">{isPaid ? "Paid" : "Unpaid"}</p>
          </div>
        </div>

        {!isPaid ? (
          <Link
            to={`/buyer/orders/${order.id}/pay`}
            className="btn-primary mt-6 inline-block"
          >
            ไปหน้าชำระเงิน
          </Link>
        ) : (
          <div className="mt-6">
            <p className="text-emerald-200 font-semibold">✅ ชำระแล้ว</p>
            <Link
              to={`/buyer/orders/${order.id}/pay`}
              className="btn-secondary mt-3 inline-block"
            >
              ดูรหัสที่ได้รับ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
