import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Alert from "@/components/SuccessAlert";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import { referralAPI } from "../../api/auth.api.js";
import ErrorAlert from "../../components/ErrorAlert";

const Register = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || "";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    referralCode: refCode,
  });
  const [referrerName, setReferrerName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (refCode) {
      referralAPI
        .resolve(refCode)
        .then((res) => {
          if (res.data.data.valid) {
            setReferrerName(res.data.data.referrer.fullName);
          }
        })
        .catch(() => {});
    }
  }, [refCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.referralCode) delete payload.referralCode;
      if (!payload.phone) delete payload.phone;
      await signup(payload);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
        {referrerName && (
          <p className="text-center text-sm text-green-600 mb-4">
            You were invited by <strong>{referrerName}</strong>
          </p>
        )}
        <ErrorAlert type="error" message={error} onClose={() => setError("")} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input
              type="text"
              className="input"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
              minLength={2}
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Password *</label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              placeholder="Min 8 chars, upper, lower, number, special"
            />
          </div>
          <div>
            <label className="label">Phone (optional)</label>
            <input
              type="tel"
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+2348012345678"
            />
          </div>
          <div>
            <label className="label">Referral Code (optional)</label>
            <input
              type="text"
              className="input"
              value={form.referralCode}
              onChange={(e) =>
                setForm({ ...form, referralCode: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
