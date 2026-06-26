import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Building2, LockKeyhole, AlertCircle, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [portalType, setPortalType] = useState("public"); // 'public' or 'official'

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!isLogin && portalType === "public" && !fullName.trim()) {
      errors.fullName = "Full name is required for registration.";
    }
    if (!email.trim()) {
      errors.email = "Email address is required.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    setFormErrors({});

    try {
      //  CONDITION 1: CITIZEN REGISTRATION
      if (!isLogin && portalType === "public") {
        await axios.post(
          "https://jansetu-eta0.onrender.com/api/auth/register",
          {
            fullName,
            email,
            password,
            contact,
            role: "citizen",
          },
        );

        alert("Registration successful! Please sign in.");
        setIsLogin(true);
        setIsLoading(false);
        return;
      }

      //  CONDITION 2: LOGIN
      const res = await axios.post(
        "https://jansetu-eta0.onrender.com/api/auth/login",
        {
          email,
          password,
          portalType: portalType, // Backend ko batayega ki public portal hai ya official
        },
      );

      const loggedInRole = res.data.user.role;

      //  STRIKE 1: Official Portal Validation
      if (portalType === "official") {
        if (
          loggedInRole !== "admin" &&
          loggedInRole !== "officer" &&
          loggedInRole !== "worker"
        ) {
          alert(
            "Access Denied: You are not authorized to use the Official Staff Portal.",
          );
          localStorage.clear();
          return;
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (loggedInRole === "admin") {
          navigate("/admin-dashboard");
        } else if (loggedInRole === "officer") {
          navigate("/officer");
        } else if (loggedInRole === "worker") {
          navigate("/worker-dashboard");
        }
      }
      //  STRIKE 2: Public/Citizen Portal Validation
      else {
        if (isLogin) {
          if (
            loggedInRole !== "admin" &&
            loggedInRole !== "officer" &&
            loggedInRole !== "worker"
          ) {
            alert(
              "Access Denied: You are not authorized to use the Official Staff Portal.",
            );
            localStorage.clear();
            return;
          }

          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/citizen-dashboard");
        } else {
          // CITIZEN REGISTRATION
          await axios.post(
            "https://jansetu-eta0.onrender.com/api/auth/register",
            {
              fullName,
              email,
              password,
              role: "citizen",
            },
          );

          alert("Registration successful! Please sign in.");
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Authentication failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          to="/"
          className="text-3xl font-black tracking-tight text-slate-900 cursor-pointer inline-block mb-1"
        >
          <span className="flex items-center gap-1 justify-center">
            <Building2 className="h-8 w-8 text-orange-600" />
            JAN<span className="text-orange-600">SETU</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mt-2">
          {portalType === "official"
            ? "Official Staff Portal"
            : isLogin
              ? "Sign in to your account"
              : "Create a new account"}
        </h2>

        {portalType === "public" && (
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Or{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormErrors({});
              }}
              className="font-bold text-orange-600 hover:text-orange-500 transition-colors cursor-pointer outline-none"
            >
              {isLogin
                ? "register as a new citizen"
                : "sign in to your existing account"}
            </button>
          </p>
        )}
        {portalType === "official" && (
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Restricted access for Municipal Officers & Admins.
          </p>
        )}
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200/60 sm:rounded-3xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {portalType === "public" && !isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (formErrors.fullName)
                      setFormErrors({ ...formErrors, fullName: "" });
                  }}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none bg-slate-50/50"
                  placeholder="Rahul Kumar"
                />
                {formErrors.fullName && (
                  <p className="text-red-600 font-extrabold text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {formErrors.fullName}
                  </p>
                )}
              </div>
            )}

            {portalType === "public" && !isLogin && (
              <div className="mt-4">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none bg-slate-50/50"
                  placeholder="9876543210"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {portalType === "official"
                  ? "Official Email / Staff ID"
                  : "Email address"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email)
                    setFormErrors({ ...formErrors, email: "" });
                }}
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none bg-slate-50/50"
                placeholder={
                  portalType === "official"
                    ? "officer@jansetu.gov.in"
                    : "xyz@gmail.com"
                }
              />
              {formErrors.email && (
                <p className="text-red-600 font-extrabold text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formErrors.password)
                      setFormErrors({ ...formErrors, password: "" });
                  }}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none bg-slate-50/50 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-600 font-extrabold text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end pt-1">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-bold text-orange-600 hover:text-orange-500 cursor-pointer outline-none"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-slate-900 focus:outline-none transition-all cursor-pointer mt-2 ${
                isLoading
                  ? "bg-slate-500 cursor-not-allowed"
                  : "hover:bg-slate-800 hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              }`}
            >
              {isLoading
                ? "Processing..."
                : portalType === "official"
                  ? "Secure Staff Login"
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
            </button>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setPortalType(
                    portalType === "public" ? "official" : "public",
                  );
                  setIsLogin(true);
                  setFormErrors({});
                }}
                className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60 outline-none"
              >
                {portalType === "public" ? (
                  <>
                    <LockKeyhole className="h-4 w-4 text-orange-600" /> Switch
                    to Official Staff Login
                  </>
                ) : (
                  "← Back to Public Portal"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
