import { useState } from "react";
import { api } from "../lib/axios";

const InputField = ({ label, ...props }) => {
    return <div className="flex flex-col gap-1 w-full">
        {
            label && <label className="text-xs font-semibold text-gray-500 ml-1">{label}</label>
        }
        <input
            {...props}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
        />
    </div>
}

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showOtpSection, setShowOtpSection] = useState(false);
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [signUpData, setSignUpData] = useState({ name: "", username: "", email: "", phone: "", password: "", confirmPassword: "", otp: "", is_verified: false });

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleSignUpChange = (e) => setSignUpData({ ...signUpData, [e.target.name]: e.target.value });

    const onLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/api/user/login", loginData);
            localStorage.setItem("token", res.data.accessToken);
            alert("Welcome back!");
        } catch (err) {
            console.error("Login Error:", err.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const onSignUp = async (e) => {
        e.preventDefault();
        if (signUpData.password !== signUpData.confirmPassword) return alert("Passwords mismatch");
        setLoading(true);
        try {
            if (!signUpData.is_verified) {
                await api.post("/otp/send", { mail: signUpData.email });
                setShowOtpSection(true);
            } else {
                await api.post("/api/user/register", signUpData);
                setIsLogin(true);
                setSignUpData({ name: "", username: "", email: "", phone: "", password: "", confirmPassword: "", otp: "", is_verified: false });
            }
        } catch (err) {
            console.error("Request Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        try {
            await api.post("/otp/verify", { mail: signUpData.email, otp: signUpData.otp });
            setShowOtpSection(false);
            setSignUpData(prev => ({ ...prev, is_verified: true }));
        } catch (err) {
            alert("Invalid OTP");
        }
    };

    const onAuthCheck = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return alert("Please login first.");
            await api.get("/api/check", { headers: { Authorization: `Bearer ${token}` } });
            return alert("You have valid permissions to access this resource.");
        } catch (e) {
            console.log(e.response)
            return alert("You don't have enough permissions to access this resource.");
        }
    }

    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">

            <div className="flex bg-slate-100 p-1 m-4 rounded-xl">
                <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`}>Login</button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`}>Register</button>
            </div>

            <div className="p-8 pt-4">
                <h2 className="text-2xl font-bold mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
                <p className="text-slate-500 text-sm mb-6">{isLogin ? "Enter your credentials to access your account." : "Join us to get started with your journey."}</p>
                {
                    isLogin ? <form onSubmit={onLogin} className="space-y-4">
                        <InputField value={loginData.username} label="Username" name="username" type="text" placeholder="johndoe" onChange={handleLoginChange} required />
                        <InputField value={loginData.password} label="Password" name="password" type="password" placeholder="••••••••" onChange={handleLoginChange} required />
                        <button disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 mt-4">
                            {loading ? "Signing in..." : "Login"}
                        </button>
                    </form> : <form onSubmit={onSignUp} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <InputField value={signUpData.name} label="Full Name" name="name" type="text" placeholder="John" onChange={handleSignUpChange} required />
                            <InputField value={signUpData.username} label="Username" name="username" type="text" placeholder="johnny" onChange={handleSignUpChange} required />
                        </div>
                        <InputField value={signUpData.email} label="Email" name="email" type="email" placeholder="john@example.com" onChange={handleSignUpChange} required />
                        <InputField value={signUpData.phone} label="Phone" name="phone" type="text" placeholder="+1..." onChange={handleSignUpChange} />

                        <div className="grid grid-cols-2 gap-3">
                            <InputField value={signUpData.password} label="Password" name="password" type="password" placeholder="••••" onChange={handleSignUpChange} required />
                            <InputField value={signUpData.confirmPassword} label="Confirm" name="confirmPassword" type="password" placeholder="••••" onChange={handleSignUpChange} required />
                        </div>

                        {
                            showOtpSection ? <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 animate-pulse-once">
                                <p className="text-xs text-orange-700 font-bold mb-2 uppercase">Verify your email</p>
                                <div className="flex gap-2">
                                    <input type="text" name="otp" value={signUpData.otp} placeholder="6-digit OTP" onChange={handleSignUpChange} className="flex-1 px-3 py-2 rounded-lg border border-orange-200 outline-none"/>
                                    <button type="button" onClick={verifyOtp} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Verify</button>
                                </div>
                                </div> : signUpData.is_verified && <div className="text-center py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">✓ Email Verified</div>
                        }
                        <button disabled={loading} className={`w-full py-3 rounded-xl font-bold text-white transition-all ${signUpData.is_verified ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {loading ? "Loading..." : signUpData.is_verified ? "Complete Registration" : "Send Verification Code"}
                        </button>
                    </form>
                }
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-center">
                <button onClick={onAuthCheck} className="text-xs font-semibold text-slate-400 hover:text-blue-500 uppercase tracking-widest transition-colors">Check Auth Status</button>
            </div>
        </div>
    </div>
};