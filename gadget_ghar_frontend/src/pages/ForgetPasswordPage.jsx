import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import Lottie from "lottie-react";
import forgotPasswordAnimation from "../assets/Forgot password.json";

const ForgetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address.');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            await api.post('/auth/forgot-password', { email });
            setIsSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
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
                        <Lottie animationData={forgotPasswordAnimation} loop={true} />
                    </div>
                    <div className="text-center mt-8 max-w-md">
                        <h2 className="text-3xl font-bold mb-4">Account Recovery</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Don't worry, we've got you covered. Enter your email and we'll help you get back into your account.
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

                    {!isSubmitted ? (
                        <>
                            <div className="text-center lg:text-left mb-8">
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Forgot password?</h1>
                                <p className="mt-2 text-slate-600">
                                    No worries, we'll send you reset instructions.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
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
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Check your email</h2>
                            <p className="text-slate-600 mb-8">
                                We sent a password reset link to <span className="font-semibold text-slate-900">{email}</span>
                            </p>
                            <div className="space-y-4">
                                <a href={`mailto:${email}`} className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-all">
                                    Open email app
                                </a>
                                <p className="text-sm text-slate-500">
                                    Didn't receive the email? <button onClick={() => setIsSubmitted(false)} className="text-sky-600 hover:underline font-semibold">Click to resend</button>
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPasswordPage;
