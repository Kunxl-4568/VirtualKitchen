import { Link } from "react-router-dom";
import { createRef, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Signup() {
  const nameRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const passwordConfirmationRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    axiosClient
      .post("/auth/register", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
        setSuccessMessage("Your sign-up was successful! Welcome aboard.");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Logo/Brand Section */}
        <div className="px-8 pt-8 pb-6 text-center bg-gradient-to-r from-red-600 to-orange-300">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-blue-100">Join our cooking community today</p>
        </div>

        <div className="p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg animate-slide-up">
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Error Messages */}
          {errors && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-shake">
              {Object.keys(errors).map((key) => (
                <p key={key} className="text-red-600 text-sm">{errors[key][0]}</p>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="form-group">
              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  ref={nameRef}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 
                           focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2
                           focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  ref={passwordRef}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2
                           focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</span>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="password_confirmation">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <input
                  ref={passwordConfirmationRef}
                  id="password_confirmation"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2
                           focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-orange-200 text-white font-medium
                       rounded-lg shadow-lg hover:from-orange-200 hover:to-orange-600 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all
                       hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Account
            </button>

            {/* Sign In Link */}
            <p className="text-center text-gray-600 mt-6">
              Already registered?{" "}
              <Link 
                to="/login" 
                className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
