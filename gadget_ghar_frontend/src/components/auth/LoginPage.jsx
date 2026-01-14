import { useState, useContext, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import Lottie from "lottie-react";
import loginAnimation from "../../assets/Login_GadgetGhar.json";

import PinVerifyModal from './PinVerifyModal';
import api from '../../api/api';
import { AuthContext } from '../../auth/AuthContext';
import { NavigationContext } from '../../context/NavigationContext';

const LoginPage = () => {
    const [showPinModal, setShowPinModal] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [userId, setUserId] = useState(null);
    const [otp, setOtp] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [requires2FA, setRequires2FA] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Please enter both email and password.');
            return;
        }
        setIsLoading(true);

        try {
            const res = await api.post('/auth/login', formData);

            if (res.data.requires2FA) {
                setUserId(res.data.userId);
                setRequires2FA(true);
                const msg = res.data.message || '';
                const extractedEmail = msg.includes('to ') ? msg.split('to ')[1] : 'your email';
                setMaskedEmail(extractedEmail);
                setShowOtpModal(true);
                toast.info(msg || 'Verification code sent.');
                setIsLoading(false);
                startResendTimer();
                return;
            }

            login(res.data);
            toast.success('Login successful!');
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.status === 403 && error.response.data.requiresPin) {
                toast.warning(error.response.data.message);
                setShowPinModal(true);
                return;
            }
            const errorMessage = error.response?.data?.message || 'Login failed.';
            toast.error(errorMessage);
        }
    };

    const handlePinSubmit = async (pin) => {
        setIsLoading(true);
        try {
            const res = await api.post('/auth/login', { ...formData, pin });
            login(res.data);
            toast.success('Identity Verified! Login successful.');
            setShowPinModal(false);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast.error(error.response?.data?.message || "Invalid PIN");
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit code.");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/verify-otp', { userId, otp });
            login(data);
            toast.success('Verification successful!');
        } catch (error) {
            setIsLoading(false);
            toast.error(error.response?.data?.message || 'Verification failed.');
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setIsLoading(true);
        try {
            await api.post('/auth/resend-otp', { userId });
            toast.success("New code sent to your email.");
            startResendTimer();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend code.');
        } finally {
            setIsLoading(false);
        }
    };

    const startResendTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* LEFT SIDE: Brand / Visuals */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>

                {/* Abstract Pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/Gadget_logo.png" alt="Gadget_Ghar" className="h-10 w-auto" />
                        <span className="text-xl font-bold tracking-tight">Gadget_Ghar</span>
                    </Link>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
                    <div className="w-full max-w-md">
                        <Lottie animationData={loginAnimation} loop={true} />
                    </div>
                    <div className="text-center mt-8 max-w-md">
                        <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Sign in to access your orders, wishlist, and exclusive deals.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-slate-500 text-center">
                    &copy; {new Date().getFullYear()} Gadget_Ghar. All rights reserved.
                </div>
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">

                    {/* Mobile Logo (Visible only on small screens) */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link to="/">
                            <img src="/Gadget_logo.png" alt="Gadget_Ghar" className="h-12 w-auto" />
                        </Link>
                    </div>

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {requires2FA ? "Security Verification" : "Welcome back"}
                        </h2>
                        <p className="mt-2 text-slate-600">
                            {requires2FA ? `We sent a code to ${maskedEmail}` : "Please enter your details to sign in."}
                        </p>
                    </div>

                    {!requires2FA ? (
                        <div className="space-y-6">
                            {/* GOOGLE LOGIN */}
                            <div className="w-full">
                                <GoogleLogin
                                    onSuccess={async (credentialResponse) => {
                                        try {
                                            const { data } = await api.post('/auth/google-login', { token: credentialResponse.credential });
                                            login(data);
                                            toast.success('Google Login successful!');
                                        } catch (error) {
                                            toast.error(error.response?.data?.message || 'Google Login failed.');
                                        }
                                    }}
                                    onError={() => toast.error('Google Signup Failed')}
                                    useOneTap
                                    size="large"
                                    width="100%"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-slate-500">Or continue with</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label htmlFor="password" class="block text-sm font-medium text-slate-700">Password</label>
                                            <Link to="/forgot-password" class="text-sm font-semibold text-sky-600 hover:text-sky-500 hover:underline">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                required
                                                className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-slate-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-500 hover:underline">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    ) : (
                        // 2FA FORM
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div className="bg-sky-50 p-4 rounded-lg flex items-start gap-3">
                                <ShieldCheck className="text-sky-600 shrink-0 mt-0.5" size={24} />
                                <div className="text-sm text-sky-900">
                                    <p className="font-semibold">Two-Factor Authentication Enabled</p>
                                    <p className="mt-1 text-sky-700">Check your email for the 6-digit code.</p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1">Verification Code</label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="block w-full text-center tracking-[1em] text-2xl font-bold p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                                    placeholder="000000"
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.length < 6}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify Code'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendTimer > 0 || isLoading}
                                    className="text-sm font-medium text-slate-600 hover:text-sky-600 disabled:text-slate-400 disabled:cursor-not-allowed"
                                >
                                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Didn't receive the code? Resend"}
                                </button>
                            </div>

                            <div className="text-center pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => window.location.reload()} className="text-sm text-slate-500 hover:text-slate-800">
                                    Back to login
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <PinVerifyModal
                isOpen={showPinModal}
                onClose={() => setShowPinModal(false)}
                onSubmit={handlePinSubmit}
            />
        </div>
    );
};

export default LoginPage;