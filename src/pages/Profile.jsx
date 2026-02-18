import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaUniversity, FaCreditCard, FaBuilding } from "react-icons/fa";

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bankAccountName: "",
        bankAccountNumber: "",
        bankName: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/users/profile");
            setUser(res.data);
            setFormData({
                name: res.data.name || "",
                email: res.data.email || "",
                bankAccountName: res.data.bankAccountName || "",
                bankAccountNumber: res.data.bankAccountNumber || "",
                bankName: res.data.bankName || "",
            });
        } catch (error) {
            toast.error(error.response?.data?.error || "ไม่สามารถโหลดข้อมูลได้");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await api.patch("/users/profile", formData);
            setUser(res.data);
            toast.success("อัพเดทข้อมูลเรียบร้อยแล้ว");
        } catch (error) {
            toast.error(error.response?.data?.error || "ไม่สามารถอัพเดทข้อมูลได้");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                bankAccountName: user.bankAccountName || "",
                bankAccountNumber: user.bankAccountNumber || "",
                bankName: user.bankName || "",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-400">กำลังโหลด...</div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-indigo-200/30 dark:border-indigo-500/20 shadow-lg">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    โปรไฟล์ของฉัน
                </h1>
                {user && (
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        บทบาท: <span className="font-semibold">
                            {user.role === "admin" ? "ผู้ดูแลระบบ" : user.role === "seller" ? "ผู้ขาย" : "ผู้ซื้อ"}
                        </span>
                    </p>
                )}
            </div>

            {/* Profile Form */}
            <div className="card mb-6">
                <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
                            <FaUser className="text-indigo-500" />
                            ข้อมูลพื้นฐาน
                        </h2>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    ชื่อ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                    placeholder="ชื่อของคุณ"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaEnvelope className="inline mr-2 text-indigo-500" />
                                    อีเมล <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bank Info - Only for Sellers */}
                    {user?.role === "seller" && (
                        <div className="mb-6 pt-6 border-t border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
                                <FaUniversity className="text-green-500" />
                                ข้อมูลบัญชีธนาคาร
                            </h2>

                            <div className="space-y-4">
                                {/* Bank Account Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <FaCreditCard className="inline mr-2 text-green-500" />
                                        ชื่อบัญชี
                                    </label>
                                    <input
                                        type="text"
                                        name="bankAccountName"
                                        value={formData.bankAccountName}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="ชื่อเจ้าของบัญชี"
                                    />
                                </div>

                                {/* Bank Account Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        เลขที่บัญชี
                                    </label>
                                    <input
                                        type="text"
                                        name="bankAccountNumber"
                                        value={formData.bankAccountNumber}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="xxx-x-xxxxx-x"
                                    />
                                </div>

                                {/* Bank Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <FaBuilding className="inline mr-2 text-green-500" />
                                        ธนาคาร
                                    </label>
                                    <input
                                        type="text"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="ชื่อธนาคาร"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-700">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary flex-1"
                        >
                            {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="btn-secondary flex-1"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>

            {/* Balance Display (for sellers) */}
            {user?.role === "seller" && (
                <div className="card bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30">
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">
                        ยอดเงินคงเหลือ
                    </h3>
                    <p className="text-3xl font-bold text-green-400">
                        ฿{user.balance?.toLocaleString() || "0"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Profile;
