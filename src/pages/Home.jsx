import { useState, useEffect } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { HiOutlineSearch, HiOutlineArrowRight } from "react-icons/hi";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      const res = await api.get("/products", { params });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-neutral-900 mb-6 text-balance">
              ร้านค้าออนไลน์
              <br />
              <span className="italic">สำหรับทุกคน</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
              ค้นพบสินค้าคุณภาพจากผู้ขายที่ผ่านการตรวจสอบ
              ซื้อง่าย ส่งไว ปลอดภัย 100%
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#products"
                className="group inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-8 py-4 rounded-full transition-all"
              >
                เลือกซื้อสินค้า
                <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/register"
                className="inline-flex items-center gap-2 border border-neutral-300 hover:border-neutral-400 text-neutral-700 font-medium px-8 py-4 rounded-full transition-all"
              >
                เริ่มต้นขาย
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full border border-neutral-200 opacity-50"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full border border-neutral-200 opacity-50"></div>
      </section>

      {/* Features */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            <div className="py-10 md:py-16 px-6 text-center">
              <div className="text-4xl font-serif text-neutral-900 mb-2">01</div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">สินค้าคุณภาพ</h3>
              <p className="text-neutral-500 text-sm">คัดสรรสินค้าจากผู้ขายที่เชื่อถือได้</p>
            </div>
            <div className="py-10 md:py-16 px-6 text-center">
              <div className="text-4xl font-serif text-neutral-900 mb-2">02</div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">จัดส่งรวดเร็ว</h3>
              <p className="text-neutral-500 text-sm">รับสินค้าได้ทันทีหลังชำระเงิน</p>
            </div>
            <div className="py-10 md:py-16 px-6 text-center">
              <div className="text-4xl font-serif text-neutral-900 mb-2">03</div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">ปลอดภัย 100%</h3>
              <p className="text-neutral-500 text-sm">ระบบป้องกันการฉ้อโกงขั้นสูง</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">สินค้าทั้งหมด</p>
              <h2 className="text-3xl md:text-4xl font-serif text-neutral-900">
                ค้นพบสินค้า
              </h2>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="w-full md:w-auto">
              <div className="relative">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xl" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาสินค้า..."
                  className="w-full md:w-80 pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-full text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
            </form>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
              <p className="text-neutral-500">ยังไม่มีสินค้าในขณะนี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 text-balance">
            พร้อมเริ่มต้นขายสินค้าของคุณหรือยัง?
          </h2>
          <p className="text-neutral-400 mb-10 max-w-xl mx-auto">
            สมัครเป็นผู้ขายวันนี้ เริ่มขายสินค้าได้ทันที ไม่มีค่าใช้จ่ายเริ่มต้น
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-900 font-medium px-8 py-4 rounded-full transition-all"
          >
            สมัครเลย
            <HiOutlineArrowRight />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
