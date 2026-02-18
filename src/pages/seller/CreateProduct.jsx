import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { FaImage, FaVideo, FaTimes } from "react-icons/fa";

const normalizeTitle = (t = "") =>
  t.toString().trim().toLowerCase().replace(/\s+/g, " "); // กันช่องว่างแปลกๆ

const CreateProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    gameCode: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const checkVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        if (duration > 150) {
          reject(
            new Error(
              `วีดีโอยาวเกินไป (${Math.floor(duration / 60)}:${Math.floor(duration % 60)
                .toString()
                .padStart(2, "0")} นาที) กรุณาอัพโหลดวีดีโอไม่เกิน 2:30 นาที`
            )
          );
        } else resolve(true);
      };
      video.onerror = () => reject(new Error("ไม่สามารถโหลดวีดีโอได้"));
      video.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("ไฟล์รูปภาพใหญ่เกินไป! (ไม่เกิน 5MB)");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) return toast.error("ไฟล์วีดีโอใหญ่เกินไป! (ไม่เกิน 100MB)");
    try {
      await checkVideoDuration(file);
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/seller/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);

    try {
      let imageUrl = form.imageUrl;
      let videoUrl = form.videoUrl;

      if (imageFile) {
        toast.loading("กำลังอัพโหลดรูปภาพ...");
        imageUrl = await uploadFile(imageFile);
        toast.dismiss();
      }

      if (videoFile) {
        toast.loading("กำลังอัพโหลดวีดีโอ...");
        videoUrl = await uploadFile(videoFile);
        toast.dismiss();
      }

      setUploading(false);

      // ✅ Create product
      const res = await api.post("/seller/products", { ...form, imageUrl, videoUrl });

      // ✅ หา created product object แบบยืดหยุ่น
      const created = res.data?.product || res.data?.data || res.data;
      const productId = created?.id;

      const key = form.gameCode.trim();
      const titleNorm = normalizeTitle(form.title);

      // ✅ เก็บแบบ “กันพัง” 2 ที่เสมอ
      // 1) ตาม title-normalized (ใช้ได้แม้ไม่มี id)
      localStorage.setItem(`product_key_title_${titleNorm}`, key);

      // 2) ถ้ามี id ก็เก็บเพิ่มตาม id (ดีที่สุด)
      if (productId) localStorage.setItem(`product_key_${productId}`, key);

      toast.success("สร้างสินค้าเรียบร้อยแล้ว!");
      navigate("/seller/products");
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.error || "ไม่สามารถสร้างสินค้าได้");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">สร้างสินค้าใหม่ 🎮</h1>

        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mb-6 text-sm text-orange-300">
          ⚠️ เมื่อสร้างแล้ว<strong>ไม่สามารถแก้ไขได้</strong> กรุณาตรวจสอบข้อมูลให้ครบถ้วน
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ชื่อเกม</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="เช่น Cyberpunk 2077"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">คำอธิบาย</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="input-field"
              placeholder="รายละเอียดเกม..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FaImage className="inline mr-2" />รูปภาพ (ไม่บังคับ)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">รองรับ: JPG, PNG, GIF, WebP (ไม่เกิน 5MB)</p>
            {imagePreview && (
              <div className="mt-3 relative inline-block">
                <img src={imagePreview} alt="Preview" className="w-64 h-40 object-cover rounded-lg border-2 border-gray-600" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FaVideo className="inline mr-2" />วีดีโอ (ไม่บังคับ)
            </label>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoChange}
              className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">รองรับ: MP4, WebM, MOV (ไม่เกิน 100MB, ความยาวไม่เกิน 2:30 นาที)</p>
            {videoPreview && (
              <div className="mt-3 relative inline-block">
                <video src={videoPreview} controls className="w-96 h-56 object-cover rounded-lg border-2 border-gray-600" />
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview("");
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ราคา (฿)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">รหัสเกม / Key</label>
            <input
              type="text"
              name="gameCode"
              value={form.gameCode}
              onChange={handleChange}
              required
              placeholder="เช่น XXXXX-XXXXX-XXXXX"
              className="input-field font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">🔐 รหัสนี้จะถูกส่งให้ผู้ซื้อหลังชำระเงิน (โหมดทดลอง)</p>
          </div>

          <button type="submit" disabled={loading || uploading} className="btn-primary w-full py-3 text-lg">
            {uploading ? "กำลังอัพโหลด..." : loading ? "กำลังสร้าง..." : "สร้างสินค้า 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
