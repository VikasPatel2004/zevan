import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff } from 'lucide-react';
import BrandLogo from './BrandLogo';

/**
 * LoginModal — Authentication UI with Student/Owner tabs.
 *
 * Props:
 *   isOpen: boolean — controls visibility
 *   onClose: () => void — close handler
 *   defaultTab: 'student' | 'owner' — which tab is active by default
 */
export default function LoginModal({ isOpen, onClose, defaultTab = 'student' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email/phone and password.');
      return;
    }

    // Demo login — route to the appropriate dashboard
    if (activeTab === 'student') {
      navigate('/student');
    } else {
      navigate('/owner');
    }
    onClose();
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop bg-brand-secondary/40"
      onClick={onClose}
    >
      <div
        className="global-card w-full max-w-md p-0 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <BrandLogo variant="full" size="login" linked={false} />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center text-warm-500 hover:text-brand-primary hover:bg-brand-surface/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            aria-label="Close login"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6">
          <div className="flex bg-brand-surface rounded-xl p-1">
            <button
              onClick={() => handleTabSwitch('student')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all ${
                activeTab === 'student'
                  ? 'bg-brand-primary text-white shadow-premium-sm'
                  : 'text-warm-500 hover:text-brand-secondary'
              }`}
            >
              Student Login
            </button>
            <button
              onClick={() => handleTabSwitch('owner')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all ${
                activeTab === 'owner'
                  ? 'bg-brand-primary text-white shadow-premium-sm'
                  : 'text-warm-500 hover:text-brand-secondary'
              }`}
            >
              Owner Login
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pt-6 pb-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-1.5">
              {activeTab === 'student' ? 'Email or Phone Number' : 'Owner Email or Phone'}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === 'student' ? 'rahul@example.com or +91 98765...' : 'owner@messbusiness.com'}
              className="w-full bg-brand-background border border-brand-surface rounded-xl px-4 py-3 text-sm text-brand-secondary placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-transparent transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-brand-background border border-brand-surface rounded-xl px-4 py-3 pr-11 text-sm text-brand-secondary placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-brand-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-terra-500 font-semibold bg-terra-50 border border-terra-100 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-xs font-semibold text-brand-accent hover:text-brand-primary transition-colors focus:outline-none focus-visible:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
          >
            {activeTab === 'student' ? 'Login as Student' : 'Login as Owner'}
          </button>

          <p className="text-center text-[10px] text-warm-400 pt-1">
            By logging in, you agree to our{' '}
            <a href="#" className="underline hover:text-brand-primary transition-colors">Terms</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-brand-primary transition-colors">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
