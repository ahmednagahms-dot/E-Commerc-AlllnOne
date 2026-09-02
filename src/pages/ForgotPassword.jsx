import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import api from "../api/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [resendTimer, setResendTimer] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("newPassword", "");

  // -----------------------------
  // Resend OTP Timer
  // -----------------------------
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // -----------------------------
  // Helpers
  // -----------------------------
  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  // -----------------------------
  // Step 1 - Send OTP
  // -----------------------------
  const onSendOtp = async (data) => {
    clearMessages();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password/send-otp", {
        email: data.email,
      });

      setEmail(data.email);

      setMessage("A reset code has been sent to your email.");

      setStep("otp");

      // Start resend timer
      setResendTimer(60);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't send the reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Step 2 - Verify OTP
  // -----------------------------
  const onVerifyOtp = async (data) => {
    clearMessages();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password/verify-otp", {
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      setMessage(
        "Your password has been updated successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Resend OTP
  // -----------------------------
  const handleResend = async () => {
    if (resendTimer > 0 || loading) return;

    clearMessages();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password/send-otp", {
        email,
      });

      setMessage("A new reset code has been sent to your email.");

      setResendTimer(60);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend the code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Password Strength
  // -----------------------------
  const getPasswordStrength = () => {
    if (!password) return 0;

    let strength = 0;

    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  };

  const passwordStrength = getPasswordStrength();

  const strengthText = {
    1: "Weak password",
    2: "Fair password",
    3: "Good password",
    4: "Strong password",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[560px]">

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.10)] px-6 py-8 sm:px-10 sm:py-10">

          {/* Back */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />

            <span>Back to login</span>
          </Link>

          {/* Header */}
          <div className="text-center mt-7">

            {/* Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-50 text-primary-600 rounded-2xl flex items-center justify-center">
              {step === "email" ? (
                <Lock className="w-7 h-7 text-indigo-600" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
              )}
            </div>

            <h1 className="text-[28px] sm:text-[30px] font-bold tracking-tight text-slate-950">
              {step === "email"
                ? "Forgot your password?"
                : "Reset your password"}
            </h1>

            <p className="mt-2 text-sm sm:text-[15px] leading-6 text-slate-500 max-w-[430px] mx-auto">
              {step === "email"
                ? "Enter your email address and we'll send you a secure reset code."
                : `Enter the code sent to ${email} and choose a new password.`}
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mt-7 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
              <CheckCircle2
                size={18}
                className="text-emerald-600 mt-0.5 shrink-0"
              />

              <p className="text-sm text-emerald-700 leading-5">
                {message}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-7 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
              <AlertCircle
                size={18}
                className="text-red-600 mt-0.5 shrink-0"
              />

              <p className="text-sm text-red-700 leading-5">
                {error}
              </p>
            </div>
          )}

          {/* =========================
              STEP 1
          ========================== */}
          {step === "email" && (
            <form
              onSubmit={handleSubmit(onSendOtp)}
              className="mt-8 space-y-5"
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register("email", {
                      required: "Email address is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={`w-full h-12 rounded-xl border bg-white pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all
                    ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Send reset code"
                )}
              </button>
            </form>
          )}

          {/* =========================
              STEP 2
          ========================== */}
          {step === "otp" && (
            <form
              onSubmit={handleSubmit(onVerifyOtp)}
              className="mt-8 space-y-5"
            >
              {/* OTP */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Reset code (OTP)
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  {...register("otp", {
                    required: "Reset code is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Enter the 6-digit verification code",
                    },
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                  className={`w-full h-14 rounded-xl border bg-white text-center text-xl tracking-[0.45em] font-medium text-slate-800 placeholder:text-slate-300 placeholder:tracking-[0.3em] outline-none transition-all
                  ${
                    errors.otp
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  }`}
                />

                {errors.otp && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  New password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className={`w-full h-12 rounded-xl border bg-white pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all
                    ${
                      errors.newPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {/* Password Strength */}
                {password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= passwordStrength
                              ? "bg-indigo-500"
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-1.5 text-[11px] text-slate-500">
                      {strengthText[passwordStrength] || "Enter a password"}
                    </p>
                  </div>
                )}

                {errors.newPassword && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating password...
                  </>
                ) : (
                  "Reset password"
                )}
              </button>

              {/* Resend */}
              <div className="text-center pt-1">
                <p className="text-sm text-slate-400">
                  Didn't receive a code?
                </p>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Resend code"}
                </button>
              </div>

              {/* Change Email */}
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setStep("email");
                }}
                className="w-full text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                Use a different email address
              </button>
            </form>
          )}

          {/* Security Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={15} />
              <span>Your account security is our priority</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-5">
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </p>
      </div>
    </div>
  );
}