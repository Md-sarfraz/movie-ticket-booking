import React, { useMemo, useState } from "react";
import axios from "axios";
import { setStoredAuth } from "@/auth/storage";

const CheckoutAuthModal = ({ open, onClose, onAuthSuccess, reason }) => {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ username: "", email: "", password: "" });

  const baseUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
    []
  );

  if (!open) return null;

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email: loginForm.email,
        password: loginForm.password,
      });

      const authData = response?.data?.data;
      if (!authData?.token || !authData?.role) {
        throw new Error("Invalid login response from server.");
      }

      setStoredAuth({ token: authData.token, role: authData.role, user: authData });
      onAuthSuccess?.(authData);
    } catch (submitError) {
      setError(submitError?.response?.data?.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!signupForm.username.trim() || !signupForm.email.trim() || !signupForm.password.trim()) {
      setError("Username, email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${baseUrl}/auth/register`, {
        username: signupForm.username,
        email: signupForm.email,
        password: signupForm.password,
        role: "user",
      });

      setMode("login");
      setLoginForm((prev) => ({ ...prev, email: signupForm.email }));
      setSignupForm({ username: "", email: "", password: "" });
      setError("Account created. Please login to continue booking.");
    } catch (submitError) {
      setError(submitError?.response?.data?.error || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Continue To Checkout</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
            disabled={loading}
          >
            Close
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="mb-4 text-sm text-gray-600">
            {reason || "Please login or create an account before payment."}
          </p>

          <div className="mb-4 grid grid-cols-2 rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`rounded-md py-2 text-sm font-medium transition ${
                mode === "login" ? "bg-white text-gray-900 shadow" : "text-gray-500"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={`rounded-md py-2 text-sm font-medium transition ${
                mode === "signup" ? "bg-white text-gray-900 shadow" : "text-gray-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Login And Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Username"
                value={signupForm.username}
                onChange={(e) => setSignupForm((prev) => ({ ...prev, username: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={signupForm.email}
                onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={signupForm.password}
                onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          {error && (
            <p className={`mt-3 text-sm ${error.includes("Account created") ? "text-emerald-600" : "text-red-600"}`}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutAuthModal;
