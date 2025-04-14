"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login, register } from "@/store/slices/authSlice";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "seeker" | "owner";
    mobile: string;
  }>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "seeker",
    mobile: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRoleChange = (role: "owner" | "seeker") => {
    setFormData({
      ...formData,
      role,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      if (isLogin) {
        const result = await dispatch(
          login({
            email: formData.email,
            password: formData.password,
          })
        );

        if (login.fulfilled.match(result)) {
          toast.success("Logged in successfully!");
          router.push("/dashboard");
        }
      } else {
        const result = await dispatch(
          register({
            name: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            mobile: formData.mobile,
          })
        );

        if (register.fulfilled.match(result)) {
          toast.success("Account created successfully!");
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-50 to-blue-100">
      <motion.div
        key={isLogin ? "login" : "signup"}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "tween",
          ease: "easeOut",
          duration: 0.5,
        }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BookBuddies
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? "Welcome Back, Book Explorer! 📖"
              : "Join Our Reading Community! 📚"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                key="username"
                className="overflow-hidden"
              >
                <Label htmlFor="username" className="text-gray-700">
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="BookLover123"
                  className="mt-1"
                  value={formData.username}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="reader@bookbuddies.com"
              className="mt-1"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              className="mt-1"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                key="confirmPassword"
                className="overflow-hidden"
              >
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="mt-1"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!isLogin && (
            <div className="space-y-4">
              <Label className="text-gray-700">I want to:</Label>
              <div className="flex  flex-col space-x-5 space-y-2">
                <Button
                  type="button"
                  variant={formData.role === "seeker" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleRoleChange("seeker")}
                >
                  Find Books
                </Button>
                <Button
                  type="button"
                  variant={formData.role === "owner" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleRoleChange("owner")}
                >
                  Share Books
                </Button>
              </div>
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Processing...
              </span>
            ) : isLogin ? (
              "Unlock Your Library 🔓"
            ) : (
              "Create Account 📚"
            )}
          </Button>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <div className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already a member? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              disabled={loading}
            >
              {isLogin ? "Join BookBuddies" : "Sign In Instead"}
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
