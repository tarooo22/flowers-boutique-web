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
    register: "Register",
    createAccount: "Create your Flower’s Boutique account",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    registerButton: "Create Account",
    haveAccount: "Already have an account?",
    login: "Log in",
    registering: "Creating account...",
    success: "Account created successfully!",
    passwordMismatch: "Passwords don't match",
  },
  ka: {
    register: "რეგისტრაცია",
    createAccount: "შექმენით თქვენი Flower’s Boutique ანგარიში",
    name: "სრული სახელი",
    email: "ელ-ფოსტის მისამართი",
    phone: "ტელეფონის ნომერი",
    password: "პაროლი",
    confirmPassword: "პაროლის დადასტურება",
    registerButton: "ანგარიშის შექმნა",
    haveAccount: "უკვე გაქვთ ანგარიში?",
    login: "შესვლა",
    registering: "ანგარიშის შექმნა...",
    success: "ანგარიში წარმატებით შეიქმნა!",
    passwordMismatch: "პაროლები არ ემთხვევა",
  },
};

export default function Register() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const t =
    translations[language as keyof typeof translations] || translations.en;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState(false);
  const registerMutation = trpc.auth.register.useMutation();

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
    if (!formData.name.trim())
      newErrors.name =
        language === "ka" ? "სახელი აუცილებელია" : "Name is required";
    if (!formData.email.trim())
      newErrors.email =
        language === "ka"
          ? "ელ-ფოსტის მისამართი აუცილებელია"
          : "Email is required";
    if (!formData.phone.trim())
      newErrors.phone =
        language === "ka"
          ? "ტელეფონის ნომერი აუცილებელია"
          : "Phone is required";
    if (!formData.password)
      newErrors.password =
        language === "ka" ? "პაროლი აუცილებელია" : "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(t.success);
      navigate("/login");
    } catch (error: any) {
      const errorMsg =
        language === "ka" ? "რეგისტრაცია ვერ მოხერხდა" : "Registration failed";
      toast.error(error.message || errorMsg);
    }
  };

  return (
    <div className="auth-page auth-page--register min-h-screen">
      <Navbar />

      {/* Main Content */}
      <div className="auth-main flex items-center justify-center px-4 py-12 md:py-16">
        <Card className="auth-card w-full max-w-md">
          <div className="p-8 md:p-10">
            <p className="auth-kicker">Flower's Boutique / Account</p>
            <h1 className="auth-title text-3xl md:text-4xl font-semibold text-center mb-2">
              {t.register}
            </h1>
            <p className="auth-subtitle text-center mb-8">
              {t.createAccount}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label htmlFor="register-name" className="auth-label block text-sm font-semibold mb-2">
                  {t.name}
                </label>
                <Input
                  id="register-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`auth-input rounded-lg ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1 font-medium" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                  <label htmlFor="register-email" className="auth-label block text-sm font-semibold mb-2">
                  {t.email}
                </label>
                <Input
                  id="register-email"
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
                  <p className="text-red-600 text-sm mt-1 font-medium" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                  <label htmlFor="register-phone" className="auth-label block text-sm font-semibold mb-2">
                  {t.phone}
                </label>
                <Input
                  id="register-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+995 5XX XX XX XX"
                  className={`auth-input rounded-lg ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1 font-medium" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                  <label htmlFor="register-password" className="auth-label block text-sm font-semibold mb-2">
                  {t.password}
                </label>
                <div className="auth-password-field">
                  <Input
                    id="register-password"
                    type={showPasswords ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.password)}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`auth-input rounded-lg ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button type="button" onClick={() => setShowPasswords(value => !value)} aria-label={showPasswords ? (language === "ka" ? "პაროლის დამალვა" : "Hide password") : (language === "ka" ? "პაროლის ჩვენება" : "Show password")}>{showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1 font-medium" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                  <label htmlFor="register-confirm-password" className="auth-label block text-sm font-semibold mb-2">
                  {t.confirmPassword}
                </label>
                <Input
                  id="register-confirm-password"
                  type={showPasswords ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`auth-input rounded-lg ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1 font-medium" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="auth-submit w-full font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 mt-6"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? t.registering : t.registerButton}
              </Button>
            </form>

            <p className="auth-switch text-center mt-6 font-medium">
              {t.haveAccount}{" "}
              <Link
                href="/login"
                className="auth-link font-bold transition-colors"
              >
                {t.login}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
