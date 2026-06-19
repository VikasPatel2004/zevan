import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, Loader2, ArrowRight, User, Mail, Lock, GraduationCap, Store, Phone, MapPin, CreditCard } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { authApi } from '../services/authApi';
import { messApi } from '../services/messApi';
import { ROUTES } from '../routes/routes';

export default function LoginModal({ isOpen, onClose, defaultTab = 'student', mode = 'login' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Owner Mess Fields
  const [messName, setMessName] = useState('');
  const [messAddress, setMessAddress] = useState('');
  const [upiId, setUpiId] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  
  // Student Join Field
  const [joinCode, setJoinCode] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setIsLogin(mode === 'login');
      setError('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let response;
      const role = activeTab === 'student' ? 'RESIDENT' : 'OWNER';

      if (isLogin) {
        response = await authApi.login({ email, password });
      } else {
        if (!name.trim()) throw new Error('Please enter your full name.');
        
        // Register User first
        response = await authApi.register({ name, email, password, role });

        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Primary account created, now handle Mess logic
          if (role === 'OWNER') {
            await messApi.createMess({
              messName,
              address: messAddress,
              upiId,
              ownerPhone,
              monthlyPrice: Number(monthlyPrice)
            });
          } else {
            if (!joinCode) throw new Error('Please enter a Mess Join Code.');
            await messApi.joinMess(joinCode.trim());
          }
        }
      }

      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        onClose();
        navigate(response.user.role === 'OWNER' ? ROUTES.OWNER : ROUTES.STUDENT);
      }
    } catch (err) {
      setError(err.message || 'Action failed. Please check details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop bg-brand-secondary/40 backdrop-blur-sm" onClick={onClose}>
      <div className="global-card w-full max-w-md p-0 overflow-hidden animate-scale-in bg-white/95 shadow-premium-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-surface/30">
          <BrandLogo variant="full" size="login" linked={false} />
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center text-warm-500 hover:text-brand-primary transition-colors focus:outline-none">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 pb-4 pt-4">
          <div className="flex bg-brand-surface rounded-xl p-1 border border-brand-surface/50">
            {['student', 'owner'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all ${
                  activeTab === tab ? 'bg-white text-brand-primary shadow-sm' : 'text-warm-500 hover:text-brand-primary'
                }`}
              >
                {tab === 'student' ? <GraduationCap size={14} /> : <Store size={14} />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pt-2">
          <h2 className="text-xl font-display font-bold text-brand-secondary">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-warm-500 text-xs mt-1">{isLogin ? `Sign in as ${activeTab}` : `Join Zevan as a ${activeTab}`}</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-6 pb-8 space-y-4">
          {error && <div className="p-3 rounded-lg bg-terra-50 border border-terra-100 text-terra-600 text-[11px] font-medium animate-fade-in">{error}</div>}

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300" />
                <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="w-full bg-brand-background border border-brand-surface rounded-xl pl-11 pr-4 py-3 text-sm focus:border-brand-primary focus:outline-none" />
              </div>
            </div>
          )}

          {!isLogin && activeTab === 'student' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider">Mess Join Code</label>
              <div className="relative">
                <ArrowRight size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300" />
                <input required type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="6-digit Mess Code" className="w-full bg-brand-background border border-brand-surface rounded-xl pl-11 pr-4 py-3 text-sm font-mono tracking-widest focus:border-brand-primary focus:outline-none placeholder:font-sans placeholder:tracking-normal" />
              </div>
            </div>
          )}

          {!isLogin && activeTab === 'owner' && (
            <div className="grid grid-cols-2 gap-3 pb-2 pt-2 animate-fade-in border-t border-brand-surface/30 mt-4 pt-4">
              <div className="col-span-2 space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider">Mess / Tiffin Name</label>
                <div className="relative">
                  <Store size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-300" />
                  <input required type="text" value={messName} onChange={e => setMessName(e.target.value)} placeholder="E.g. Annapurna Tiffin" className="w-full bg-brand-background border border-brand-surface rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none" />
                </div>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider">Mess Address</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-300" />
                  <input required type="text" value={messAddress} onChange={e => setMessAddress(e.target.value)} placeholder="Full location address" className="w-full bg-brand-background border border-brand-surface rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider">UPI ID for Payment</label>
                <div className="relative">
                  <CreditCard size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-300" />
                  <input required type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="name@upi" className="w-full bg-brand-background border border-brand-surface rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider">Monthly Rate</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-500 text-xs">₹</span>
                  <input required type="number" value={monthlyPrice} onChange={e => setMonthlyPrice(e.target.value)} placeholder="3000" className="w-full bg-brand-background border border-brand-surface rounded-xl pl-7 pr-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none" />
                </div>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider">Owner Phone (WhatsApp)</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-300" />
                  <input required type="tel" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full bg-brand-background border border-brand-surface rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5 pt-2">
            <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300" />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-brand-background border border-brand-surface rounded-xl pl-11 pr-4 py-3 text-sm focus:border-brand-primary focus:outline-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300" />
              <input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-brand-background border border-brand-surface rounded-xl pl-11 pr-12 py-3 text-sm focus:border-brand-primary focus:outline-none" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 focus:outline-none">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>

          <button disabled={isLoading} type="submit" className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 group shadow-premium-md hover:bg-brand-secondary transition-all disabled:opacity-50">
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <span>{isLogin ? 'Sign In' : 'Create Account'}</span>}
            {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="pt-4 text-center border-t border-brand-surface/40">
            <p className="text-xs text-warm-400 font-medium">
              {isLogin ? "New to Zevan?" : "Already have an account?"}{' '}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-brand-primary font-bold hover:underline ml-1">
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
