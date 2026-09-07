import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { uploadToCloudinary } from "../../api/cloudinary"; 

const UserFormModal = ({ closeModal, setUsers }) => {
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false); 
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer",
    verified: false,
    image: "", 
  });

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleCloseAnimation = () => {
    setShowModal(false);
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file);
      setFormData({ ...formData, image: imageUrl });
    } catch (error) {
      console.error(error);
      alert("Error.!");
    } finally {
      setIsUploading(false); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(), 
      ...formData,
      verified: formData.verified === "true" || formData.verified === true,
    };

    setUsers((prev) => {
      const updated = [...prev, newUser];
      Cookies.set("users", JSON.stringify(updated), { expires: 7 }); 
      return updated;
    });

    handleCloseAnimation();
  };

  return (
    <div 
      className={`fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300 ${
        showModal ? "bg-black/30 opacity-100" : "bg-black/0 opacity-0"
      }`}
    >
      <div 
        className={`bg-white p-8 rounded-2xl w-[400px] shadow-xl transition-all duration-300 transform ${
          showModal ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New User</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 group hover:border-slate-500 transition-colors">
              
              {isUploading ? (
                <div className="text-slate-500 text-xs text-center flex flex-col items-center gap-1">
                  <span className="animate-spin text-lg">⏳</span>
                  Uploading...
                </div>
              ) : formData.image ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 text-xs text-center px-2 group-hover:text-slate-600 transition-colors">
                  <span className="text-2xl block mb-1">📸</span>
                  Click to Upload
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">Role</label>
              <select
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">Verified</label>
              <select
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow"
                value={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.value })}
              >
                <option value={false}>No</option>
                <option value={true}>Verified</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={handleCloseAnimation}
              className="w-1/2 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="w-1/2 bg-gradient-to-r from-slate-900 to-slate-700 text-white py-2 rounded-lg font-medium hover:from-slate-800 hover:to-slate-600 transition-all hover:scale-101 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;