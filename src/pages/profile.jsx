import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  Camera,
  Loader2,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Save,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { uploadToCloudinary } from "../api/cloudinary";
import api from "../api/axios";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm({
    defaultValues: {
      username: "",
      phone: "",
    },
  });

  // Sync Form Values with Auth Context
  useEffect(() => {
    if (user) {
      setAvatar(user.avatar || "");
      resetProfile({
        username: user.username || "",
        phone: user.phone || "",
      });
    }
  }, [user, resetProfile]);

  // Upload Avatar to Cloudinary
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setAvatar(url);
      toast.success("Avatar updated successfully! Click 'Save Personal Info' to apply.");
    } catch (err) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Save Profile Info
  const onProfileSubmit = async (formData) => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;

    try {
      setSavingProfile(true);
      const response = await api.patch(`/users/${userId}`, {
        username: formData.username,
        phone: formData.phone,
        avatar,
      });

      const updatedUser = response.data?.user || response.data;
      updateUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update Profile Error:", err.response?.data);
      toast.error(
        err.response?.data?.message || "Failed to update profile information."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Page Title */}
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
            Account Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update your personal profile and contact information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Avatar & Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Header Banner */}
            <div className="h-24 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 relative"></div>

            <div className="px-6 pb-6 text-center -mt-12">
              {/* Avatar Circle */}
              <div className="relative inline-block">
                <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-md text-indigo-600 flex items-center justify-center text-3xl font-extrabold overflow-hidden">
                  {uploading ? (
                    <Loader2 size={28} className="animate-spin text-indigo-600" />
                  ) : avatar ? (
                    <img
                      src={avatar}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.username?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                {/* Upload Button */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-1 right-1 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition transform hover:scale-105"
                  title="Upload New Photo"
                >
                  <Camera size={16} />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* User Info */}
              <h3 className="font-bold text-slate-900 text-lg mt-3">
                {user.username}
              </h3>
              <p className="text-xs text-slate-400 font-medium">{user.email}</p>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize">
                  <ShieldCheck size={13} />
                  {user.role || "User"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <CheckCircle2 size={13} />
                  Active Status
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Personal Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Personal Information
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update your display name and contact phone number.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmitProfile(onProfileSubmit)}
                className="space-y-4"
              >
                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Your username"
                      {...registerProfile("username", {
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters",
                        },
                      })}
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                    />
                  </div>
                  {profileErrors.username && (
                    <p className="text-rose-500 text-xs mt-1 font-medium">
                      • {profileErrors.username.message}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      readOnly
                      className="w-full bg-slate-100/70 border border-slate-200 text-slate-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm cursor-not-allowed select-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Email cannot be changed directly. Contact support for assistance.
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="+20 110 460 9842"
                      {...registerProfile("phone", {
                        pattern: {
                          value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
                    />
                  </div>
                  {profileErrors.phone && (
                    <p className="text-rose-500 text-xs mt-1 font-medium">
                      • {profileErrors.phone.message}
                    </p>
                  )}
                </div>

                {/* Submit Personal Info */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      savingProfile ||
                      uploading ||
                      (!isProfileDirty && avatar === (user.avatar || ""))
                    }
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        <span>Save Personal Info</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}