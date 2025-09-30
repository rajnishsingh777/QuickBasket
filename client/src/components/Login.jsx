import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post(`/api/user/${state} `, {
        name,
        email,
        password,
      });
      if (data.success) {
        // Store token in localStorage for Render subdomain compatibility
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        navigate("/");
        setUser(data.user);
        setShowUserLogin(false);
        toast.success(state === "login" ? "Login successful!" : "Registration successful!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full"
      >
        {/* Left Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            className="h-full w-full object-cover"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
            alt="leftSideImage"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
          <form
            onSubmit={onSubmitHandler}
            className="w-full max-w-md flex flex-col items-center"
          >
            <h2 className="text-3xl text-gray-900 font-semibold">
              {state === "login" ? "Sign In" : "Sign Up"}
            </h2>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              {state === "login"
                ? "Welcome back! Please sign in to continue"
                : "Join us by creating your account"}
            </p>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full bg-gray-100 flex items-center justify-center h-11 rounded-full mb-5"
            >
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="googleLogo"
              />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 w-full mb-5">
              <div className="w-full h-px bg-gray-300" />
              <p className="text-sm text-gray-500 whitespace-nowrap">
                or sign in with email
              </p>
              <div className="w-full h-px bg-gray-300" />
            </div>

            {/* Name Field for Sign Up */}
            {state === "register" && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-4 py-2 mb-4 text-sm"
                required
              />
            )}

            {/* Email Field */}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-4 py-2 mb-4 text-sm"
              required
            />

            {/* Password Field */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-4 py-2 mb-4 text-sm"
              required
            />

            {/* Remember Me & Forgot Password */}
            {state === "login" && (
              <div className="w-full flex items-center justify-between text-sm text-gray-500 mb-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#" className="underline">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dull transition-all text-white py-2 rounded-full mb-3"
            >
              {state === "register" ? "Create Account" : "Login"}
            </button>

            {/* Toggle Sign In/Up */}
            <p className="text-sm text-gray-500">
              {state === "register" ? (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-primary cursor-pointer underline"
                    onClick={() => setState("login")}
                  >
                    Sign In
                  </span>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <span
                    className="text-primary cursor-pointer underline"
                    onClick={() => setState("register")}
                  >
                    Sign Up
                  </span>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
