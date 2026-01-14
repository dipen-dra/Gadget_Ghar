import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/api';
import Lottie from "lottie-react";
import secureAnimation from "../assets/Login_GadgetGhar.json";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const calculateStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        if (strength === 0) return '';
        if (strength < 3) return 'Weak';
        if (strength < 5) return 'Medium';
        return 'Strong';
    };

    const passwordStrength = calculateStrength(formData.password);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }
        if (passwordStrength !== 'Strong') {
            toast.error("Please choose a strong password.");
            return;
        }

        setIsLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password: formData.password });
            setIsSuccess(true);
            toast.success('Password reset successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* LEFT SIDE: Brand / Visuals */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/Gadget_logo.png" alt="Gadget_Ghar" className="h-10 w-auto" />
                        <span className="text-xl font-bold tracking-tight">Gadget_Ghar</span>
                    </Link>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
                    <div className="w-full max-w-md">
                        <Lottie animationData={secureAnimation} loop={true} />
                    </div>
                    <div className="text-center mt-8 max-w-md">
                        <h2 className="text-3xl font-bold mb-4">Secure Your Account</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Create a strong new password to protect your personal information and order history.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-slate-500 text-center">
                    &copy; {new Date().getFullYear()} Gadget_Ghar. All rights reserved.
                </div>
            </div>

            {/* RIGHT SIDE: Content */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link to="/">
                            <img src="/Gadget_logo.png" alt="Gadget_Ghar" className="h-12 w-auto" />
                        </Link>
                    </div>

                    {!isSuccess ? (
                        <>
                            <div className="text-center lg:text-left mb-8">
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Set new password</h1>
                                <p className="mt-2 text-slate-600">
                                    Must be at least 8 characters.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            id="password"
                                            className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all"
                                            placeholder="New password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
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
                                    {formData.password && (
                                        <div className="mt-2 space-y-2">
                                            <div className="flex h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`flex-1 transition-all duration-300 ${passwordStrength === 'Weak' ? 'bg-red-500' : passwordStrength === 'Medium' ? 'bg-yellow-500' : passwordStrength === 'Strong' ? 'bg-green-500' : 'bg-transparent'}`}></div>
                                                <div className={`flex-1 transition-all duration-300 ${passwordStrength === 'Medium' || passwordStrength === 'Strong' ? (passwordStrength === 'Medium' ? 'bg-yellow-500' : 'bg-green-500') : 'bg-transparent'}`}></div>
                                                <div className={`flex-1 transition-all duration-300 ${passwordStrength === 'Strong' ? 'bg-green-500' : 'bg-transparent'}`}></div>
                                            </div>
                                            <p className={`text-xs font-semibold ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                                {passwordStrength && `${passwordStrength} Password`}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1">Confirm password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all"
                                            placeholder="Confirm new password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>


                                <button
                                    type="submit"
                                    disabled={isLoading || passwordStrength !== 'Strong' || formData.password !== formData.confirmPassword}
                                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Reset password'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Password reset</h2>
                            <p className="text-slate-600 mb-8">
                                Your password has been successfully reset. Click below to log in.
                            </p>
                            <Link
                                to="/login"
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-all"
                            >
                                Continue to Log in
                            </Link>
                        </div>
                    )}

                    {!isSuccess && (
                        <div className="mt-8 text-center">
                            <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to log in
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
