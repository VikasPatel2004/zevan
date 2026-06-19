import { Link, useNavigate } from 'react-router-dom';
import { Home, CalendarDays, Receipt, UtensilsCrossed, User, ChevronLeft, Menu, X, Shield, LogOut } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const TAB_ITEMS = [
  { id: 'home', label: 'Home Feed', icon: Home },
  { id: 'meals', label: 'Meals Log', icon: CalendarDays },
  { id: 'bill', label: 'Bills & Dues', icon: Receipt },
  { id: 'menu', label: 'Weekly Menu', icon: UtensilsCrossed },
];

export default function StudentLayout({
  children,
  activeTab,
  onTabChange,
  studentName,
  messName,
  mobileMenuOpen,
  onMobileMenuToggle,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-brand-background flex">
      {/* 1. Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-secondary text-white sticky top-0 h-screen border-r border-brand-primary/10">
        <div className="p-6 border-b border-brand-primary/25">
          <BrandLogo variant="full" size="sidebar" inverted={true} />
          <span className="text-[10px] tracking-wider font-bold text-brand-accent uppercase block mt-1">Student Dashboard</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {TAB_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all btn-press ${
                  active 
                    ? 'bg-brand-primary text-brand-accent shadow-premium-sm' 
                    : 'text-warm-300 hover:text-white hover:bg-brand-primary/20'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-primary/25">
          <Link to="/discover" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-warm-300 hover:text-white hover:bg-brand-primary/20 transition-all">
            <ChevronLeft size={16} />
            <span>Go to Marketplace</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-terra-400 hover:text-terra-300 hover:bg-terra-500/10 transition-all mt-2"
          >
            <LogOut size={16} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Layout Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-brand-surface/40 px-6 sm:px-8 h-20 flex items-center justify-between sticky top-0 z-30 shadow-premium-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onMobileMenuToggle(!mobileMenuOpen)}
              className="p-1 text-brand-secondary hover:bg-brand-surface rounded-lg md:hidden"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-brand-secondary">Namaste, {studentName}</h1>
              <p className="text-[10px] font-medium text-warm-500">{messName} • Student Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest-700 text-xs font-semibold">
              <Shield size={12} /> Active Plan
            </span>
            <Link to="/" className="w-10 h-10 bg-brand-surface rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors">
              <User size={18} />
            </Link>
          </div>
        </header>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-brand-secondary/40 backdrop-blur-sm md:hidden" onClick={() => onMobileMenuToggle(false)}>
            <div className="bg-brand-secondary w-64 h-full p-6 flex flex-col text-white animate-slide-in-right" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <BrandLogo variant="full" size="sidebar" inverted={true} />
                <button onClick={() => onMobileMenuToggle(false)} className="text-white"><X size={20} /></button>
              </div>
              <nav className="flex-grow space-y-2">
                {TAB_ITEMS.map(item => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onTabChange(item.id); onMobileMenuToggle(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        active ? 'bg-brand-primary text-brand-accent' : 'text-warm-300 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <Link to="/discover" className="flex items-center gap-2 text-xs font-bold text-warm-300 py-4 border-t border-brand-primary/20">
                <ChevronLeft size={14} /> Back to Search
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-bold text-terra-400 py-4 border-t border-brand-primary/20"
              >
                <LogOut size={14} /> Logout Session
              </button>
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-grow p-6 sm:p-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
