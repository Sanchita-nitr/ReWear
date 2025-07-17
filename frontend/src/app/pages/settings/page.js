"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const API_BASE_URL = "http://127.0.0.1:8000";

const SettingPage = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        number: "",
        
    });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [stars, setStars] = useState([]);

    // Generate random stars
    useEffect(() => {
        const generateStars = (count) => {
            return Array.from({ length: count }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                animationDelay: Math.random() * 2,
            }));
        };

        setStars(generateStars(150));
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/users/me/`, {
                    headers: getAuthHeaders(),
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setFormData({
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        email: data.email || "",
                        number: data.number || "",
                    });
                } else {
                    router.push("/pages/login");
                }
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
            }
        };
        fetchUserProfile();
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const sendOtp = async () => {
        setLoading(true);
        setMessage("");
        setError("");
        try {
            const res = await fetch(`${API_BASE_URL}/users/send-otp/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: formData.email }),
            });
            if (res.ok) {
                setOtpSent(true);
                setMessage("OTP sent to your email.");
            } else {
                const data = await res.json();
                setError(data.detail || "Failed to send OTP.");
            }
        } catch (err) {
            setError("Error sending OTP.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setLoading(true);
        setMessage("");
        setError("");
        try {
            const res = await fetch(`${API_BASE_URL}/users/verify-otp/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: formData.email, otp }),
            });
            if (res.ok) {
                setOtpVerified(true);
                setMessage("OTP verified. You can now update your profile.");
            } else {
                const data = await res.json();
                setError(data.detail || "Failed to verify OTP.");
            }
        } catch (err) {
            setError("Error verifying OTP.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async () => {
        setLoading(true);
        setMessage("");
        setError("");
        try {
            const res = await fetch(`${API_BASE_URL}/users/me/`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setMessage("Profile updated successfully.");
                setOtpSent(false);
                setOtpVerified(false);
                setOtp("");
            } else {
                const data = await res.json();
                setError(data.detail || "Failed to update profile.");
            }
        } catch (err) {
            setError("Error updating profile.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-bl from-black via-gary-900 to-purple-950 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
              {/* Animated Star Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute bg-white rounded-full animate-pulse"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            animationDelay: `${star.animationDelay}s`,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
                {/* Header */}                <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "3s" }} />
                <div className="text-center mb-6 sm:mb-8">
                    <div className="flex items-center justify-center mb-6">
                        <button
                            onClick={() => router.push("/pages/dashboard")}
                            className="absolute left-4 top-8 p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-950 to-purple-950 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        My Profile
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        Manage your personal information
                    </p>
                    {/* <p className="text-xs mt-1">
                      Member since{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p> */}
                </div>

                {/* Main Card */}
                <div className="0 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                    {/* Alerts */}
                    {message && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-green-800 dark:text-green-200 font-medium">{message}</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-800 dark:text-red-200 font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Name Fields Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter first name"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter last name"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter email address"
                                    disabled={loading || otpSent}
                                />
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                        </div>

                        {/* Phone Number Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Phone Number
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter phone number"
                                    disabled={loading}
                                />
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </div>

                        {/* OTP Field */}
                        {otpSent && !otpVerified && (
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Verification Code
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter 6-digit code"
                                        disabled={loading}
                                        maxLength={6}
                                    />
                                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-4 space-y-3">
                            {!otpSent && (
                                <button
                                    onClick={sendOtp}
                                    disabled={loading}
                                    className="w-full py-3 px-6 bg-gradient-to-br from-purple-800 to-gray-950 hover:from-purple-600 hover:to-purple-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Send Verification Code
                                        </div>
                                    )}
                                </button>
                            )}

                            {otpSent && !otpVerified && (
                                <button
                                    onClick={verifyOtp}
                                    disabled={loading}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Verify Code
                                        </div>
                                    )}
                                </button>
                            )}

                            {otpVerified && (
                                <button
                                    onClick={updateProfile}
                                    disabled={loading}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Update Profile
                                        </div>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 sm:mt-8">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Your information is secure and encrypted
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingPage;