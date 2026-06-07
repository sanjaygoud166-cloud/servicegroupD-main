import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
  const response = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (response.ok) {
  localStorage.setItem(
    "user",
    JSON.stringify({
      email: email,
    })
  );

  window.location.href= "/dashboard";
} else {
    setError(data.error || "Login failed");
  }
} catch (err) {
  setError("Server error");
}

setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 opacity-90" />
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
            <h1 className="text-3xl font-bold mb-4">Welcome to BizEase</h1>
            <p className="text-primary-100 text-lg">
              Your complete business document management and verification platform. Secure, compliant, and trusted.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-primary-100">Businesses</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-primary-100">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold">256-bit</div>
                <div className="text-sm text-primary-100">Encryption</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
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
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-slate-600 mt-1">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Sign In
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
              Sign in with Google
            </Button>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Create one
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
