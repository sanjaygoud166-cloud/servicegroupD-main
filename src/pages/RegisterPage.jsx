import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Mail, Lock, Eye, EyeOff, Building2, User, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../store/auth';

export function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

   try {
  const response = await fetch("http://localhost:8000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName,
      businessName,
      email,
      password,
    }),
  });

  const data = await response.json();

  alert(data.message);
  navigate("/dashboard");
} catch (err) {
  console.log("ERROR:", err);
  setError(err.message);
}

setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-600 to-primary-600 opacity-90" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md text-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Start Your Business Journey</h1>
            <p className="text-secondary-100 text-lg">
              Join thousands of businesses who trust BizEase for secure document management and verification.
            </p>
            <div className="mt-12 space-y-4 text-left">
              {[
                'Secure document storage with encryption',
                'Real-time verification tracking',
                'Compliance reminders and alerts',
                'Easy team collaboration',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">BizEase</span>
            </Link>
          </div>

          <Card padding="lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
              <p className="text-slate-600 mt-1">Get started with BizEase today</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Business Name"
                  type="text"
                  placeholder="Company Inc."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  leftIcon={<Building2 className="w-4 h-4" />}
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                helperText="Minimum 8 characters"
                required
              />

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  required
                />
                <span className="text-sm text-slate-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Create Account
              </Button>
            </form>

            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-slate-500">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" type="button">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
