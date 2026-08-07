"use client";

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import { Eye, EyeOff } from "lucide-react";

const translations = {
  en: {
    login: "Log In",
    welcomeBack: "Welcome back to Flower’s Boutique",
    email: "Email Address",
    password: "Password",
    loginButton: "Log In",
    noAccount: "Don't have an account?",
    register: "Register",
    loggingIn: "Logging in...",
    success: "Logged in successfully!",
  },
  ka: {
    login: "შესვლა",
    welcomeBack: "კეთილი იყოს თქვენი დაბრუნება Flower’s Boutique-ში",
    email: "ელ-ფოსტის მისამართი",
    password: "პაროლი",
    loginButton: "შესვლა",
    noAccount: "ანგარიში არ გაქვთ?",
    register: "რეგისტრაცია",
    loggingIn: "შესვლა მიმდინარეობს...",
    success: "წარმატებით შეხვიდით!",
  },
};

export default function Login() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const t =
    translations[language as keyof typeof translations] || translations.en;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const utils = trpc.useUtils();
  const loginMutation = trpc.auth.login.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim())
      newErrors.email =
        language === "ka"
          ? "ელ-ფოსტის მისამართი აუცილებელია"
          : "Email is required";
    if (!formData.password)
      newErrors.password =
        language === "ka" ? "პაროლი აუცილებელია" : "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      // Invalidate and refetch auth.me to update header immediately
      await utils.auth.me.invalidate();
      await utils.auth.me.refetch();

      toast.success(t.success);
      navigate("/");
    } catch (error: any) {
      const errorMsg =
        language === "ka" ? "შესვლა ვერ მოხერხდა" : "Login failed";
      toast.error(error.message || errorMsg);
    }
  };

  return (
    <div className="auth-page auth-page--login p2-account-page min-h-screen">
      <Navbar />

      {/* Main Content */}
      <main className="auth-main flex items-center justify-center px-4 py-12 md:py-20">
        <Card className="auth-card w-full max-w-md">
          <div className="p-8 md:p-10">
            <p className="auth-kicker">Flower's Boutique / Account</p>
            <h1 className="auth-title text-3xl md:text-4xl font-semibold text-center mb-2">
              {t.login}
            </h1>
            <p className="auth-subtitle text-center mb-8">{t.welcomeBack}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="auth-label block text-sm font-semibold mb-2"
                >
                  {t.email}
                </label>
                <Input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`auth-input rounded-lg ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p
                    className="text-red-600 text-sm mt-1 font-medium"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="auth-label block text-sm font-semibold mb-2"
                >
                  {t.password}
                </label>
                <div className="auth-password-field">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`auth-input rounded-lg ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
                    aria-label={
                      showPassword
                        ? language === "ka"
                          ? "პაროლის დამალვა"
                          : "Hide password"
                        : language === "ka"
                          ? "პაროლის ჩვენება"
                          : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p
                    className="text-red-600 text-sm mt-1 font-medium"
                    role="alert"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="auth-submit w-full font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t.loggingIn : t.loginButton}
              </Button>
            </form>

            <p className="auth-switch text-center mt-6 font-medium">
              {t.noAccount}{" "}
              <Link
                href="/register"
                className="auth-link font-bold transition-colors"
              >
                {t.register}
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
