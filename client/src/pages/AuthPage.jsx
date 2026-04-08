import { useState } from "react";
import axios from "axios";

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [signUpData, setSignUpData] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        otp: "",
        is_verified: false
    });
    const [showVerifyButton, setShowVerifyButton] = useState(false);

    const handleChangeLoginData = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleChangeSignUpData = (e) => {
        setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8080/api/user/login", loginData);
            localStorage.setItem("token", res.data.accessToken);
            alert("Login Successful!");
        } catch (err) {
            alert("Login Failed: " + err.response?.data?.message || "Server Error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitSignUp = async (e) => {
        e.preventDefault();
        if (signUpData.password !== signUpData.confirmPassword) {
            return alert("Passwords do not match!");
        }
        setLoading(true);
        if (!signUpData.is_verified) {
            await axios.post("http://localhost:8080/otp/send", { mail: signUpData.email });
            setShowVerifyButton(true);
            setLoading(false);
            return alert("Otp sent to your email.");
        }
        try {
            await axios.post("http://localhost:8080/api/user/register", signUpData);
            alert("Registration successful! Please login.");
            setIsLogin(true);
        } catch (err) {
            alert("Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCheck = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/api/check", {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Status: " + res.data.message);
        } catch (err) {
            alert("Unauthorized or Session Expired");
        }
    };

    const handleOtpVerify = async () => {
        try {
            await axios.post("http://localhost:8080/otp/verify", { mail: signUpData.email, otp: signUpData.otp });
            setShowVerifyButton(false);
            setSignUpData(prev => ({ ...prev, is_verified: true }));
            alert("Otp verified successfully!");
        } catch (err) {
            alert("Otp verification failed: " + err.response?.data?.message || "Server Error");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                {/* Toggle Headers */}
                <div className="flex mb-8 border-b">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 pb-4 font-semibold transition-colors ${isLogin ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-400"}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 pb-4 font-semibold transition-colors ${!isLogin ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-400"}`}
                    >
                        Sign Up
                    </button>
                </div>

                {isLogin ? (
                    /* Login Form */
                    <form onSubmit={handleSubmitLogin} className="space-y-4">
                        <input
                            type="text" name="username" placeholder="Username" required
                            onChange={handleChangeLoginData}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="password" name="password" placeholder="Password" required
                            onChange={handleChangeLoginData}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
                        >
                            {loading ? "Processing..." : "Sign In"}
                        </button>
                    </form>
                ) : (
                    /* Sign Up Form */
                        <form onSubmit={handleSubmitSignUp} className="space-y-4">
                            <input
                                type="text" name="name" placeholder="Name" required
                                onChange={handleChangeSignUpData}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        <input
                            type="text" name="username" placeholder="Username" required
                            onChange={handleChangeSignUpData}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="email" name="email" placeholder="Email Address" required
                            onChange={handleChangeSignUpData}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="text" name="phone" placeholder="Phone Number"
                            onChange={handleChangeSignUpData}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="password" name="password" placeholder="Password" required
                            onChange={handleChangeSignUpData}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="password" name="confirmPassword" placeholder="Confirm Password" required
                            onChange={handleChangeSignUpData}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            {
                                showVerifyButton ? <div className="flex gap-3">
                                    <input
                                        type="text" name="otp" placeholder="Enter Otp Sent to Your Email" required
                                        onChange={handleChangeSignUpData}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button onClick={handleOtpVerify} className="bg-orange-600 text-white px-3 p-1 rounded-md">Verify</button>
                                </div> : signUpData.is_verified && <p className="text-green-400">OTP verified successfully!</p>
                            }
                        <button
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
                        >
                            {loading ? "Creating Account..." : "Register"}
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t">
                    <button
                        onClick={handleCheck}
                        className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                        Verify Authentication Status
                    </button>
                </div>
            </div>
        </div>
    );
};