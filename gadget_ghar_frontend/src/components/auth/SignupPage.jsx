import React, { useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import api from '../../api/api';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useRegisterUser } from '../../hooks/useRegisterUser';
import TermsModal from '../TermsModal';
import ReCAPTCHA from "react-google-recaptcha";
import Lottie from "lottie-react";
import signupAnimation from "../../assets/Login_GadgetGhar.json";

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isTermsModalOpen, setTermsModalOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [nameInPasswordError, setNameInPasswordError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);

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

  const { mutate: registerUser, isLoading: isSubmitting } = useRegisterUser();

  const checkNameInPassword = (fullName, password) => {
    if (!fullName || !password) return false;
    const nameParts = fullName.trim().toLowerCase().split(/\s+/);
    return nameParts.some(part => part.length > 2 && password.toLowerCase().includes(part));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'password' || name === 'fullName') {
        const hasName = checkNameInPassword(updated.fullName, updated.password);
        setNameInPasswordError(hasName ? 'Password cannot contain your name.' : '');
      }
      return updated;
    });

    if (name === 'password') {
      setPasswordStrength(calculateStrength(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, email, password } = formData;
    if (!fullName || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (!agreedToTerms) {
      toast.error('You must agree to the Terms and Conditions.');
      return;
    }
    if (passwordStrength !== 'Strong') {
      toast.error("Please choose a strong password.");
      return;
    }
    registerUser({ ...formData, captchaToken }, {
      onSuccess: () => {
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
        toast.error(errorMessage);
      },
    });
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
            <Lottie animationData={signupAnimation} loop={true} />
          </div>
          <div className="text-center mt-8 max-w-md">
            <h2 className="text-3xl font-bold mb-4">Join the Revolution.</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Create your account today to unlock exclusive deals, personalized recommendations, and a premium shopping experience.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500 text-center">
          &copy; {new Date().getFullYear()} Gadget_Ghar. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link to="/">
              <img src="/Gadget_logo.png" alt="Gadget_Ghar" className="h-12 w-auto" />
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h2>
            <p className="mt-2 text-slate-600">Enter your details to get started.</p>
          </div>

          <div className="space-y-6">
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
                <span className="px-2 bg-white text-slate-500">Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
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
                    <div className="flex justify-between items-start">
                      <p className={`text-xs font-semibold ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {passwordStrength && `${passwordStrength} Password`}
                      </p>
                      {nameInPasswordError && (
                        <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                          <AlertCircle size={10} /> {nameInPasswordError}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-slate-700">I agree to the <button type="button" onClick={() => setTermsModalOpen(true)} className="text-sky-600 hover:text-sky-500 underline">Terms and Conditions</button></label>
                </div>
              </div>

              <div className="flex justify-center transform scale-90 sm:scale-100 origin-center">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={(token) => setCaptchaToken(token)}
                  theme="light"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !agreedToTerms || passwordStrength !== 'Strong' || !captchaToken || nameInPasswordError}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>}
              </button>

            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-500 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setTermsModalOpen(false)} />
    </div>
  );
};

export default SignupPage;
