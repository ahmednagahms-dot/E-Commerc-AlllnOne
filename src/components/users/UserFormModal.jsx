import React, { useState, useEffect } from "react";
import { uploadToCloudinary } from "../../api/cloudinary";
import { addUser, updateUser } from "../../api/user.api";

const UserFormModal = ({ closeModal, setUsers, editingUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    if (editingUser) {
      setFormData({
        name: editingUser.username || "",
        email: editingUser.email || "",
        role: editingUser.role ? editingUser.role.toLowerCase() : "customer",
        verified: editingUser.isVerified || false,
        image: editingUser.avatar || "",
      });
    }
  }, [editingUser]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      username: formData.name,
      email: formData.email,
      role: formData.role.toLowerCase(),
      // isVerified: formData.verified === "true" || formData.verified === true,
      avatar: formData.image,
      password: "Password123!",
      phone: "01000000000",
    };

    try {
      if (editingUser) {
        const response = await updateUser(editingUser._id, payload);
        const updatedData =
          response.data?.user ||
          response.data?.data ||
          response.data ||
          payload;

        setUsers((prev) =>
          prev.map((u) =>
            u._id === editingUser._id ? { ...u, ...updatedData } : u,
          ),
        );
      } else {
        const response = await addUser(payload);
        const createdUser =
          response.data?.user ||
          response.data?.data ||
          response.data ||
          payload;
        setUsers((prev) => [...prev, createdUser]);
      }
      handleCloseAnimation();
    } catch (error) {
      console.error("Error saving user:", error);
      const backendError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        " There problem in server.! ";
      alert(" Backend talk: " + backendError);
    } finally {
      setIsSaving(false);
    }
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingUser ? "Edit User" : "Add New User"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 group hover:border-slate-500 transition-colors">
              {isUploading ? (
                <div className="text-slate-500 text-xs text-center flex flex-col items-center gap-1">
                  <span className="animate-spin text-lg">⏳</span>
                  Uploading...
                </div>
              ) : formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {editingUser && (
            <div className="flex gap-4">
              <div className="w-100">
                <label className="block text-sm text-gray-600 mb-1">Role</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* <div className="w-1/2">
                <label className="block text-sm text-gray-600 mb-1">
                  Verified
                </label>
                <select
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow"
                  value={formData.verified}
                  onChange={(e) =>
                    setFormData({ ...formData, verified: e.target.value })
                  }
                >
                  <option value={false}>No</option>
                  <option value={true}>Verified</option>
                </select>
              </div> */}
            </div>
          )}

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
              disabled={isUploading || isSaving}
              style={{backgroundColor:"#4F46E5"}}
              className="w-1/2 text-white py-2 rounded-lg font-medium transition-all hover:scale-102 active:scale-95 shadow-md disabled:opacity-70 disabled:cursor-wait disabled:hover:scale-100 flex justify-center items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {editingUser ? "Updating..." : "Adding..."}
                </>
              ) : 
              editingUser ? (
                "Update User"
              ) : (
                "Save User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
