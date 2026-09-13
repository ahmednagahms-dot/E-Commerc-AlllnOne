import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Camera, Loader2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { uploadToCloudinary } from "../api/cloudinary";
import api from "../api/axios";
import PageLoader from "../components/ui/sessionLoader/PageLoader";

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { username: user?.username, phone: user?.phone },
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setAvatar(url);
    } catch (err) {
      toast.error(t("errors.uploadImage"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onSubmit = async (formData) => {
    try {
      setSaving(true);
      const response = await api.patch(`/users/${user._id}`, {
        username: formData.username,
        phone: formData.phone,
        avatar,
      });
      updateUser(response.data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      toast.success(t("pages.profileUpdated"));
    } catch (err) {
       toast.error(
      err.response?.data?.message || t("errors.updateProfile")
    );
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("pages.profile")}</h1>
        <p className="text-sm text-gray-500">{t("pages.profileDescription")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold overflow-hidden">
              {uploading ? (
                <Loader2 size={24} className="animate-spin text-primary-400" />
              ) : avatar ? (
                <img src={avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                user.username?.charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600">
              <Camera size={14} />
              <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={uploading} className="hidden" />
            </label>
          </div>
          <h3 className="font-semibold mt-4">{user.username}</h3>
          <p className="text-xs text-gray-400">{user.email}</p>
          <span className="mt-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium capitalize">
            {user.role}
          </span>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold mb-4">{t("pages.personalInformation")}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label={t("pages.username")}
              error={errors.username?.message}
              {...register("username", { required: t("errors.usernameRequired") })}
            />
            <Input label={t("pages.emailAddress")} value={user.email} disabled className="bg-gray-50" />
            <Input label={t("pages.phoneNumber")} {...register("phone")} />

            <div>
              <Button type="submit" disabled={saving || uploading}>
                {saving ? t("pages.saving") : t("pages.saveChanges")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}