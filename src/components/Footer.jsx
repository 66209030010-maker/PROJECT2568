import { Link } from "react-router-dom";
import { FaLine, FaFacebook, FaEnvelope } from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif font-medium text-neutral-900 mb-4">
              ShopZone
            </h3>
            <p className="text-neutral-500 leading-relaxed max-w-md mb-6">
              ร้านค้าออนไลน์สำหรับทุกคน ซื้อขายสินค้าอย่างปลอดภัย รวดเร็ว และเชื่อถือได้
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://line.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
              >
                <FaLine className="text-lg" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
              >
                <FaFacebook className="text-lg" />
              </a>
              <a
                href="mailto:contact@shopzone.com"
                className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
              >
                <FaEnvelope className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium text-neutral-900 uppercase tracking-wider mb-4">
              ลิงก์
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm"
                >
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm"
                >
                  เข้าสู่ระบบ
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm"
                >
                  สมัครสมาชิก
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-medium text-neutral-900 uppercase tracking-wider mb-4">
              ติดต่อ
            </h4>
            <p className="text-neutral-500 text-sm mb-4">
              สอบถามข้อมูลเพิ่มเติมหรือต้องการความช่วยเหลือ
            </p>
            <a
              href="mailto:contact@shopzone.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-[#E87975] transition-colors"
            >
              contact@shopzone.com
              <HiOutlineArrowRight />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} ShopZone. สงวนลิขสิทธิ์.
          </p>
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <a href="#" className="hover:text-neutral-900 transition-colors">
              นโยบายความเป็นส่วนตัว
            </a>
            <a href="#" className="hover:text-neutral-900 transition-colors">
              ข้อกำหนดการใช้งาน
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
