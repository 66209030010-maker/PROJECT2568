import { FaLine, FaFacebook, FaEnvelope, FaGamepad } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <FaGamepad className="text-3xl text-indigo-500" />
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                ShopGameZone
                            </h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            ซื้อขายรหัสเกมและโค้ดเกมออนไลน์ ปลอดภัย รวดเร็ว น่าเชื่อถือ
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-indigo-400">ลิงก์ด่วน</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/" className="hover:text-indigo-400 transition-colors">หน้าแรก</a></li>
                            <li><a href="/login" className="hover:text-indigo-400 transition-colors">เข้าสู่ระบบ</a></li>
                            <li><a href="/register" className="hover:text-indigo-400 transition-colors">สมัครสมาชิก</a></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-indigo-400">ติดต่อเรา</h4>
                        <div className="space-y-3">
                            {/* Line */}
                            <a
                                href="https://line.me"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors group"
                            >
                                <div className="bg-green-500/10 p-2 rounded-lg group-hover:bg-green-500/20 transition-all">
                                    <FaLine className="text-xl text-green-400" />
                                </div>
                                <span>@shopgamezone</span>
                            </a>

                            {/* Facebook */}
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors group"
                            >
                                <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500/20 transition-all">
                                    <FaFacebook className="text-xl text-blue-400" />
                                </div>
                                <span>ShopGameZone</span>
                            </a>

                            {/* Email */}
                            <a
                                href="mailto:contact@shopgamezone.com"
                                className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors group"
                            >
                                <div className="bg-purple-500/10 p-2 rounded-lg group-hover:bg-purple-500/20 transition-all">
                                    <FaEnvelope className="text-xl text-purple-400" />
                                </div>
                                <span>contact@shopgamezone.com</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-8 text-center">
                    <p className="text-gray-400">
                        © {new Date().getFullYear()} <span className="text-indigo-400 font-semibold">ShopGameZone</span>. สงวนลิขสิทธิ์.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Made with ❤️ for gamers
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
