import { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../components/layout/DashboardLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { uploadToCloudinary } from "../api/cloudinary";
import api from "../api/axios";

export default function Profile() {
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
      alert("Failed to upload image. Please try again.");
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
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-gray-500">Manage your personal information.</p>
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
          <h3 className="font-semibold mb-4">Personal Information</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Username"
              error={errors.username?.message}
              {...register("username", { required: "Username is required" })}
            />
            <Input label="Email address" value={user.email} disabled className="bg-gray-50" />
            <Input label="Phone number" {...register("phone")} />

            {saved && (
              <p className="text-success text-sm bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                Profile updated successfully!
              </p>
            )}

            <div>
              <Button type="submit" disabled={saving || uploading}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}