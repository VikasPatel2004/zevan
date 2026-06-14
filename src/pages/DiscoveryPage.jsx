import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Shield, MapPin, ChevronLeft } from 'lucide-react';
import { MESS_LIST } from '../data';
import BrandLogo from '../components/BrandLogo';
import LoginModal from '../components/LoginModal';

export default function DiscoveryPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ cuisine: 'All', price: 'All' });
  const [loginOpen, setLoginOpen] = useState(false);

  const toggleFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? 'All' : value }));
  };

  const filtered = MESS_LIST.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.city.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.cuisine !== 'All' && m.cuisine !== filters.cuisine && m.cuisine !== 'Both') return false;
    if (filters.price === 'Under ₹3000' && m.price >= 3000) return false;
    if (filters.price === 'Under ₹4000' && m.price >= 4000) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-brand-background pb-20 grain-overlay">
      {/* Standardized Navbar Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-background/90 backdrop-blur-md border-b border-brand-surface/40 shadow-premium-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-warm-500 hover:text-brand-primary transition-colors p-1.5 rounded-full hover:bg-brand-surface/50 flex items-center gap-1">
              <ChevronLeft size={20} />
            </Link>
            <BrandLogo variant="full" size="navbar" />
          </div>
          <div className="flex items-center gap-7 text-sm font-medium text-warm-600">
            <Link to="/discover" className="hover:text-brand-primary transition-colors">Find a Mess</Link>
            <button onClick={() => setLoginOpen(true)} className="btn btn-primary btn-md">Login</button>
          </div>
        </div>
      </nav>

      {/* Main SaaS Layout Grid */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Filter Sidebar */}
          <aside className="w-full lg:w-1/4 bg-white border border-brand-surface/40 rounded-3xl p-6 shadow-premium-sm sticky top-24 space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold text-brand-secondary mb-4">Search & Filters</h3>
              <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-2">Search Location or Mess</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                <input
                  type="text"
                  placeholder="E.g., Indore or Annapurna"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-brand-background border border-brand-surface/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-brand-secondary placeholder:text-warm-400 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="border-t border-brand-surface/40 pt-5">
              <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-3">Cuisine Category</label>
              <div className="flex flex-col gap-2">
                {['Veg', 'Non-Veg', 'Both'].map(c => (
                  <button
                    key={c}
                    onClick={() => toggleFilter('cuisine', c)}
                    className={`text-xs font-semibold px-4 py-2.5 rounded-xl border text-left transition-all btn-press flex justify-between items-center ${filters.cuisine === c ? 'bg-brand-primary text-white border-brand-primary shadow-premium-sm' : 'bg-brand-background text-brand-secondary border-brand-surface/60 hover:border-brand-accent/40'}`}
                  >
                    <span>{c}</span>
                    {filters.cuisine === c && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-brand-surface/40 pt-5">
              <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-3">Price Budget</label>
              <div className="flex flex-col gap-2">
                {['Under ₹3000', 'Under ₹4000'].map(p => (
                  <button
                    key={p}
                    onClick={() => toggleFilter('price', p)}
                    className={`text-xs font-semibold px-4 py-2.5 rounded-xl border text-left transition-all btn-press flex justify-between items-center ${filters.price === p ? 'bg-brand-primary text-white border-brand-primary shadow-premium-sm' : 'bg-brand-background text-brand-secondary border-brand-surface/60 hover:border-brand-accent/40'}`}
                  >
                    <span>{p}</span>
                    {filters.price === p && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {(search || filters.cuisine !== 'All' || filters.price !== 'All') && (
              <button
                onClick={() => { setSearch(''); setFilters({ cuisine: 'All', price: 'All' }); }}
                className="btn btn-secondary btn-sm w-full"
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Right Column: Listing & Cards Grid */}
          <section className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-brand-secondary">Available Mess Listing</h1>
                <p className="text-xs text-warm-500 mt-1">Homely kitchens, verified hygiene grades, transparent bills</p>
              </div>
              <p className="text-xs font-semibold text-warm-500 bg-white border border-brand-surface/50 px-3 py-1.5 rounded-full shadow-premium-sm self-start sm:self-center">{filtered.length} service{filtered.length !== 1 ? 's' : ''} found</p>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((m, i) => (
                <Link key={m.id} to={`/messes/${m.id}`} className={`global-card-hover overflow-hidden animate-fade-in-up flex flex-col h-full delay-${Math.min(i + 1, 6) * 100}`}>
                  {/* Card visual banner block */}
                  <div className="h-36 bg-gradient-to-tr from-brand-surface to-brand-background relative flex items-center justify-center border-b border-brand-surface/20">
                    <span className="text-4xl">🍲</span>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm shadow-premium-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-semibold text-brand-secondary">
                      <Star size={13} fill="currentColor" className="text-brand-accent" /> {m.rating}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-brand-secondary leading-snug hover:text-brand-primary transition-colors">{m.name}</h3>
                      <p className="text-xs text-warm-500 mt-1 flex items-center gap-1"><MapPin size={12} /> {m.distance} away • {m.city}</p>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${m.cuisine === 'Veg' ? 'bg-forest-50 border border-forest-100 text-forest-700' : m.cuisine === 'Non-Veg' ? 'bg-terra-50 border border-terra-100 text-terra-500' : 'bg-brand-surface border border-brand-accent/20 text-brand-primary'}`}>{m.cuisine}</span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-surface border border-brand-surface/60 text-brand-primary flex items-center gap-0.5"><Shield size={10} /> {m.hygiene} Grade</span>
                      </div>

                      {/* Inside today's menu layout */}
                      <div className="mt-4 bg-brand-surface/50 border border-brand-surface/40 rounded-2xl p-3 shadow-inner">
                        <p className="text-[9px] text-warm-500 uppercase tracking-wider font-semibold">Today's Menu</p>
                        <p className="text-sm text-brand-secondary font-medium mt-1 truncate">{m.todayMenu}</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-brand-surface/30 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-warm-500 uppercase tracking-wider font-semibold">Monthly Plan</p>
                        <p className="font-display text-xl font-bold text-brand-primary mt-0.5">₹{m.price.toLocaleString()}<span className="text-xs font-body text-warm-500 font-normal">/mo</span></p>
                      </div>
                      <span className="btn btn-secondary btn-sm">View Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="global-card max-w-lg mx-auto mt-12 shadow-premium-sm text-center py-20">
                <span className="text-4xl block mb-4">🔍</span>
                <h3 className="font-display text-lg font-bold text-brand-secondary">No Mess Options Found</h3>
                <p className="text-warm-500 text-sm mt-2">Humne search kiya par is filter ya location ke sath koi match nahi mila.</p>
                <button onClick={() => { setSearch(''); setFilters({ cuisine: 'All', price: 'All' }) }} className="btn btn-primary btn-md mt-5">
                  Clear All Filters
                </button>
              </div>
            )}
          </section>

        </div>
      </main>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
