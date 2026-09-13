import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const {t} = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoginError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (data.user.role !== "admin") {
        setLoginError("This account doesn't have admin access.");
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      setLoginError(
        errorMessage
          ? t(errorMessage, { defaultValue: errorMessage })
          : t("auth.invalidCredentials")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-indigo-600" size={24} />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900">
            {t("auth.welcomeBack")}
          </h2>
          <p className="text-xs text-center text-gray-500 mt-1 mb-6">
            {t("auth.massage")}
          </p>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-indigo-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
                />
              </svg>
              Google
            </button>

            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-indigo-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
                <path
                  d="M36 18c0-9.94-8.06-18-18-18S0 8.06 0 18c0 8.98 6.58 16.41 15.19 17.76V23.13h-4.57V18h4.57v-3.97c0-4.51 2.69-7.01 6.8-7.01 1.97 0 4.03.35 4.03.35v4.43h-2.27c-2.24 0-2.94 1.39-2.94 2.81V18h5.01l-.8 5.13h-4.21v12.63C29.42 34.41 36 26.98 36 18z"
                  fill="#1877F2"
                />
                <path
                  d="M25.01 23.13L25.81 18h-5.01v-3.39c0-1.42.7-2.81 2.94-2.81h2.27V7.37s-2.06-.35-4.03-.35c-4.11 0-6.8 2.5-6.8 7.01V18h-4.57v5.13h4.57v12.63a18.15 18.15 0 005.62 0V23.13h4.21z"
                  fill="#fff"
                />
              </svg>
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">
              {t("auth.or")}
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 "
                />
              </div>
              {errors.email && (
                <p className="text-danger text-[11px] mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-danger text-[11px] mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 accent-indigo-600"
                />
                <span>{t("auth.rememberMe")}</span>
              </label>
              <Link
                to="/forgot-password"
                className="font-semibold text-primary-600 hover:underline"
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>

            {loginError && (
              <p className="text-danger text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium text-sm rounded-xl disabled:opacity-50"
            >
              {loading ? "Signing in..." : t("auth.login")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}