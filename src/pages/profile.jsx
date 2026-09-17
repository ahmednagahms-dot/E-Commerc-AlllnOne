import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      toast.error(t("profile.invalidImage"));
      return;
    }

    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setAvatar(url);
      toast.success(t("profile.avatarUpdated"));
    } catch (err) {
      toast.error(t("profile.avatarUploadFailed"));
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
      toast.success(t("profile.profileUpdated"));
    } catch (err) {
      console.error("Update Profile Error:", err.response?.data);
      toast.error(
        err.response?.data?.message ||
          t("profile.profileUpdateFailed")
      );
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
            {t("profile.accountSettings")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t("profile.title")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("profile.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs p-6 flex flex-col items-center text-center transition-colors">
              {/* Avatar Wrapper */}
              <div className="relative group mb-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 dark:from-indigo-950 dark:to-slate-800 border-2 border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400 overflow-hidden shadow-inner">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
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
                  className="absolute bottom-1 right-1 rtl:right-auto rtl:left-1 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition transform hover:scale-105"
                  title={t("profile.uploadPhoto")}
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
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mt-3">
                {user.username}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">{user.email}</p>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 capitalize">
                  <ShieldCheck size={13} />
                  {t(`users.roles.${user.role?.toLowerCase()}`, { defaultValue: user.role }) || "User"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                  <CheckCircle2 size={13} />
                  {t("profile.activeStatus")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Personal Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs p-6 transition-colors">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">
                    {t("profile.personalInfo")}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-400">
                    {t("profile.personalInfoDesc")}
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmitProfile(onProfileSubmit)}
                className="space-y-4"
              >
                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    {t("profile.username")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder={t("profile.usernamePlaceholder")}
                      {...registerProfile("username", {
                        required: t("profile.usernameRequired"),
                        minLength: {
                          value: 3,
                          message: t("profile.usernameMinLength"),
                        },
                      })}
                      className="w-full bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 rtl:pl-3.5 rtl:pr-10 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition"
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    {t("profile.emailAddress")}
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      readOnly
                      className="w-full bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl pl-10 pr-3.5 rtl:pl-3.5 rtl:pr-10 py-2.5 text-sm cursor-not-allowed select-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    {t("profile.emailNotice")}
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    {t("profile.phoneNumber")}
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder={t("profile.phonePlaceholder")}
                      {...registerProfile("phone", {
                        pattern: {
                          value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
                          message: t("profile.phoneInvalid"),
                        },
                      })}
                      className="w-full bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 rtl:pl-3.5 rtl:pr-10 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition"
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
                        <span>{t("profile.saving")}</span>
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        <span>{t("profile.saveInfo")}</span>
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