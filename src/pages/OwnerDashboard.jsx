import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Users, Receipt, UtensilsCrossed, Settings, Plus, X, Send, CheckCircle, Menu, ChevronLeft, Shield } from 'lucide-react';
import { OWNER_STUDENTS, OWNER_MESS, DEFAULT_OWNER_MENU, generateOwnerBilling, DAYS, MONTHS } from '../data';
import BrandLogo from '../components/BrandLogo';

const TAB_ITEMS = [
  { id: 'today', label: 'Today\'s Log', icon: CalendarCheck },
  { id: 'students', label: 'Student Directory', icon: Users },
  { id: 'billing', label: 'Billing Manager', icon: Receipt },
  { id: 'menu', label: 'Menu Schedule', icon: UtensilsCrossed },
];

export default function OwnerDashboard() {
  const [tab, setTab] = useState('today');
  const [mealType, setMealType] = useState('lunch');
  const [students, setStudents] = useState(OWNER_STUDENTS);
  const [attendanceMap, setAttendanceMap] = useState(() => {
    const m = {};
    OWNER_STUDENTS.filter(s => s.status === 'Active').forEach(s => {
      const isRelevant = mealType === 'lunch' ? (s.plan === 'Lunch' || s.plan === 'Both') : (s.plan === 'Dinner' || s.plan === 'Both');
      if (isRelevant) m[s.id] = true;
    });
    return m;
  });
  const [menu, setMenu] = useState(DEFAULT_OWNER_MENU);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', phone: '', plan: 'Both', rate: 2800 });
  const [billingMonth, setBillingMonth] = useState(new Date().getMonth());
  const [billingData, setBillingData] = useState(() => generateOwnerBilling(new Date().getMonth(), new Date().getFullYear()));
  const [menuSaved, setMenuSaved] = useState(false);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const today = new Date();

  // Filtered students for today's attendance based on meal type
  const todayStudents = useMemo(() => {
    return students.filter(s => {
      if (s.status !== 'Active') return false;
      if (mealType === 'lunch') return s.plan === 'Lunch' || s.plan === 'Both';
      return s.plan === 'Dinner' || s.plan === 'Both';
    });
  }, [students, mealType]);

  const presentCount = useMemo(() => todayStudents.filter(s => attendanceMap[s.id]).length, [todayStudents, attendanceMap]);

  // When meal type changes, reset attendance
  const handleMealTypeChange = (type) => {
    setMealType(type);
    setAttendanceSaved(false);
    const m = {};
    students.filter(s => {
      if (s.status !== 'Active') return false;
      if (type === 'lunch') return s.plan === 'Lunch' || s.plan === 'Both';
      return s.plan === 'Dinner' || s.plan === 'Both';
    }).forEach(s => { m[s.id] = true; });
    setAttendanceMap(m);
  };

  const toggleAttendance = (id) => {
    setAttendanceSaved(false);
    setAttendanceMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addStudent = () => {
    if (!newStudent.name.trim()) return;
    const s = {
      id: students.length + 1,
      name: newStudent.name,
      phone: newStudent.phone || '—',
      plan: newStudent.plan,
      rate: newStudent.rate,
      joinDate: today.toISOString().split('T')[0],
      status: 'Active',
    };
    setStudents(prev => [...prev, s]);
    setNewStudent({ name: '', phone: '', plan: 'Both', rate: 2800 });
    setShowAddModal(false);
  };

  const generateWhatsAppLink = (student) => {
    const msg = `Namaste ${student.name.split(' ')[0]} bhaiya, ${OWNER_MESS.name} ka ${MONTHS[billingMonth]} ka bill: ${student.attended} meals × rate = ₹${student.amount}. Please pay by end of month. -ZEVAN`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  const markAsPaid = (studentId) => {
    setBillingData(prev => prev.map(s => s.id === studentId ? { ...s, status: 'Paid' } : s));
  };

  const billingSummary = useMemo(() => {
    const paid = billingData.filter(s => s.status === 'Paid').reduce((sum, s) => sum + s.amount, 0);
    const pending = billingData.filter(s => s.status === 'Pending').reduce((sum, s) => sum + s.amount, 0);
    return { paid, pending };
  }, [billingData]);

  const handleSaveMenu = () => {
    setMenuSaved(true);
    setTimeout(() => setMenuSaved(false), 2000);
  };

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-brand-background flex">
      {/* 1. Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-secondary text-white sticky top-0 h-screen border-r border-brand-primary/10">
        <div className="p-6 border-b border-brand-primary/25">
          <BrandLogo variant="full" size="sidebar" inverted={true} />
          <span className="text-[10px] tracking-wider font-bold text-brand-accent uppercase block mt-1">Owner Admin Portal</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {TAB_ITEMS.map(item => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all btn-press ${active
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
        </div>
      </aside>

      {/* 2. Main Layout Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-brand-surface/40 px-6 sm:px-8 h-20 flex items-center justify-between sticky top-0 z-30 shadow-premium-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-brand-secondary hover:bg-brand-surface rounded-lg md:hidden"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-brand-secondary">{OWNER_MESS.name}</h1>
              <p className="text-[10px] font-medium text-warm-500">Welcome, {OWNER_MESS.ownerName} • Owner Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest-700 text-xs font-semibold">
              <Shield size={12} /> Verified Provider
            </span>
            <Link to="/" className="w-10 h-10 bg-brand-surface rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors">
              <Settings size={18} />
            </Link>
          </div>
        </header>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-brand-secondary/40 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-brand-secondary w-64 h-full p-6 flex flex-col text-white animate-slide-in-right" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <BrandLogo variant="full" size="sidebar" inverted={true} />
                <button onClick={() => setMobileMenuOpen(false)} className="text-white"><X size={20} /></button>
              </div>
              <nav className="flex-grow space-y-2">
                {TAB_ITEMS.map(item => {
                  const Icon = item.icon;
                  const active = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setTab(item.id); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-brand-primary text-brand-accent' : 'text-warm-300 hover:text-white'
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
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-grow p-6 sm:p-8 max-w-5xl w-full mx-auto">
          {/* ===== 1. TODAY'S ATTENDANCE LOG ===== */}
          {tab === 'today' && (
            <div className="space-y-6 animate-fade-in">
              {/* Daily Statistics Banner */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="global-card p-6">
                  <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">Active Students</p>
                  <p className="font-display text-3xl font-black text-brand-secondary mt-1">{OWNER_MESS.activeStudents}</p>
                </div>
                <div className="global-card p-6">
                  <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">Marked Present Today</p>
                  <p className="font-display text-3xl font-black text-forest-700 mt-1">{presentCount}</p>
                </div>
                <div className="global-card p-6">
                  <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">Marked Absent Today</p>
                  <p className="font-display text-3xl font-black text-terra-500 mt-1">{todayStudents.length - presentCount}</p>
                </div>
              </div>

              {/* Attendance Editor Widget */}
              <div className="global-card p-6 shadow-premium-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-surface/30 pb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-brand-secondary">Daily Presence Marker</h3>
                    <p className="text-xs text-warm-400 mt-0.5">{today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  {/* Meal Toggle */}
                  <div className="bg-brand-background border border-brand-surface rounded-xl p-1 flex shrink-0">
                    <button onClick={() => handleMealTypeChange('lunch')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mealType === 'lunch' ? 'bg-brand-primary text-brand-accent shadow-premium-sm' : 'text-warm-500 hover:text-brand-secondary'}`}>
                      ☀️ Lunch / Morning
                    </button>
                    <button onClick={() => handleMealTypeChange('dinner')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mealType === 'dinner' ? 'bg-brand-primary text-brand-accent shadow-premium-sm' : 'text-warm-500 hover:text-brand-secondary'}`}>
                      🌙 Dinner / Evening
                    </button>
                  </div>
                </div>

                {/* Students Table Presence Log */}
                <div className="border border-brand-surface/40 rounded-2xl overflow-hidden shadow-inner">
                  <table className="w-full text-sm border-collapse text-left bg-brand-background/25">
                    <thead>
                      <tr className="bg-brand-background border-b border-brand-surface/60 text-[10px] uppercase font-bold text-brand-secondary tracking-wider">
                        <th className="py-3 px-5">Student</th>
                        <th className="py-3 px-5">Subscription Plan</th>
                        <th className="py-3 px-5 text-right">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-surface/30">
                      {todayStudents.map(s => (
                        <tr key={s.id} className="hover:bg-white transition-colors">
                          <td className="py-3 px-5 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${attendanceMap[s.id] ? 'bg-forest-50 text-forest-700 border border-forest-200' : 'bg-brand-surface text-brand-primary border'}`}>
                              {s.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-brand-secondary">{s.name}</span>
                          </td>
                          <td className="py-3 px-5 text-xs text-warm-600 font-medium">{s.plan} plan</td>
                          <td className="py-3 px-5 text-right">
                            <button
                              onClick={() => toggleAttendance(s.id)}
                              className={`toggle-switch ${attendanceMap[s.id] ? 'bg-forest-600 active' : 'bg-warm-200'}`}
                              aria-label={`Toggle attendance for ${s.name}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-2">
                  <button onClick={handleSaveAttendance}
                    className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all btn-press ${attendanceSaved ? 'bg-forest-600 text-white shadow-premium-sm' : 'bg-brand-primary hover:bg-brand-secondary text-white shadow-premium-md'}`}>
                    {attendanceSaved ? '✓ Attendance Saved!' : `Save Present Logs (${presentCount} / ${todayStudents.length})`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== 2. STUDENT DIRECTORY TAB ===== */}
          {tab === 'students' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-display text-xl font-bold text-brand-secondary">Student Directory</h2>
                  <p className="text-xs text-warm-500 mt-1">Manage onboarding list, meal plans, and monthly subscriptions.</p>
                </div>
                {/* Desktop Toolbar Button */}
                <button onClick={() => setShowAddModal(true)}
                  className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all btn-press flex items-center gap-1.5 shadow-premium-sm">
                  <Plus size={16} /> Add New Student
                </button>
              </div>

              {/* Directory Table */}
              <div className="global-card overflow-hidden">
                <table className="w-full text-sm border-collapse text-left">
                  <thead>
                    <tr className="bg-brand-background border-b border-brand-surface/60 text-[10px] uppercase font-bold text-brand-secondary tracking-wider">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Phone Number</th>
                      <th className="py-4 px-6">Meal Plan</th>
                      <th className="py-4 px-6">Monthly Rate</th>
                      <th className="py-4 px-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-surface/30">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-brand-background/10 transition-colors">
                        <td className="py-4 px-6 font-bold text-brand-secondary">{s.name}</td>
                        <td className="py-4 px-6 text-xs text-warm-600 font-mono">{s.phone}</td>
                        <td className="py-4 px-6 text-xs text-warm-600">{s.plan} Plan</td>
                        <td className="py-4 px-6 text-xs font-bold text-brand-primary">₹{s.rate.toLocaleString()}</td>
                        <td className="py-4 px-6 text-right">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${s.status === 'Active' ? 'bg-forest-50 border-forest-100 text-forest-700' : 'bg-brand-surface border-brand-surface/80 text-warm-500'}`}>{s.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Student Desktop Modal Dialog */}
              {showAddModal && (
                <div className="fixed inset-0 z-50 bg-brand-secondary/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                  <div className="bg-white w-full max-w-md rounded-3xl border border-brand-surface/40 shadow-premium-lg animate-scale-in" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-brand-surface/30">
                      <h3 className="font-display text-lg font-bold text-brand-secondary">Add Student Profile</h3>
                      <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-brand-background hover:bg-brand-surface flex items-center justify-center text-warm-600"><X size={16} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-warm-500 block mb-1">Student Name *</label>
                        <input type="text" value={newStudent.name} onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))}
                          placeholder="E.g., Ramesh Pal"
                          className="w-full bg-brand-background border border-brand-surface rounded-xl px-3.5 py-2.5 text-xs text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-transparent" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-warm-500 block mb-1">Phone Number</label>
                        <input type="tel" value={newStudent.phone} onChange={e => setNewStudent(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+91 98765 XXXXX"
                          className="w-full bg-brand-background border border-brand-surface rounded-xl px-3.5 py-2.5 text-xs text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-transparent" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-warm-500 block mb-1.5">Meal Plan</label>
                        <div className="flex gap-2">
                          {['Lunch', 'Dinner', 'Both'].map(p => (
                            <button key={p} onClick={() => setNewStudent(prev => ({ ...prev, plan: p }))}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all btn-press ${newStudent.plan === p ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-warm-600 border-brand-surface'}`}>
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-warm-500 block mb-1">Monthly Subscription Rate (₹)</label>
                        <input type="number" value={newStudent.rate} onChange={e => setNewStudent(p => ({ ...p, rate: Number(e.target.value) }))}
                          className="w-full bg-brand-background border border-brand-surface rounded-xl px-3.5 py-2.5 text-xs text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-transparent" />
                      </div>
                      <div className="pt-2 flex gap-2">
                        <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-xs font-bold border border-brand-surface rounded-xl text-warm-600 bg-white hover:bg-brand-background transition-colors btn-press">Cancel</button>
                        <button onClick={addStudent}
                          className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold py-3 rounded-xl transition-all btn-press shadow-premium-sm">
                          Add Student Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== 3. BILLING MANAGER TAB ===== */}
          {tab === 'billing' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-brand-secondary">Billing & Accounts</h2>
                  <p className="text-xs text-warm-500 mt-1">Track student receipts, outstanding counts, and send invoices.</p>
                </div>
                <select value={billingMonth} onChange={e => {
                  const m = Number(e.target.value);
                  setBillingMonth(m);
                  setBillingData(generateOwnerBilling(m, today.getFullYear()));
                }} className="bg-white border border-brand-surface/60 rounded-xl px-4 py-2 text-xs text-warm-700 focus:outline-none focus:ring-1 focus:ring-brand-accent shadow-premium-sm self-start sm:self-center">
                  {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
              </div>

              {/* Billing analytics summary widget */}
              <div className="global-card p-6 shadow-premium-md flex flex-col sm:flex-row gap-6 items-center">
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs text-warm-400 font-semibold uppercase">Total Revenue Collected</p>
                  <p className="font-display text-3xl font-black text-forest-700 mt-1">₹{billingSummary.paid.toLocaleString()}</p>
                </div>
                <div className="w-px h-12 bg-brand-surface hidden sm:block" />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs text-warm-400 font-semibold uppercase">Pending Outstanding Dues</p>
                  <p className="font-display text-3xl font-black text-brand-primary mt-1">₹{billingSummary.pending.toLocaleString()}</p>
                </div>
                <div className="w-px h-12 bg-brand-surface hidden sm:block" />
                <div className="flex-1 w-full">
                  <p className="text-xs text-warm-400 font-semibold uppercase text-center sm:text-left">Collection Rate</p>
                  <div className="mt-2.5 h-2.5 bg-brand-surface rounded-full overflow-hidden">
                    <div className="h-full bg-forest-600 rounded-full" style={{ width: `${(billingSummary.paid / Math.max(billingSummary.paid + billingSummary.pending, 1)) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Billing directory table */}
              <div className="global-card overflow-hidden">
                <table className="w-full text-sm border-collapse text-left">
                  <thead>
                    <tr className="bg-brand-background border-b border-brand-surface/60 text-[10px] uppercase font-bold text-brand-secondary tracking-wider">
                      <th className="py-4 px-6">Student</th>
                      <th className="py-4 px-6">Meals Count</th>
                      <th className="py-4 px-6">Due Amount</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-surface/30">
                    {billingData.map(s => (
                      <tr key={s.id} className="hover:bg-brand-background/10 transition-colors">
                        <td className="py-4 px-6 font-bold text-brand-secondary">{s.name}</td>
                        <td className="py-4 px-6 text-xs text-warm-600 font-medium">{s.attended} / {s.totalMeals} meals</td>
                        <td className="py-4 px-6 text-xs font-bold text-brand-primary">₹{s.amount.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${s.status === 'Paid' ? 'bg-forest-50 border-forest-100 text-forest-700' : 'bg-terra-50 border-terra-100 text-terra-500'}`}>{s.status}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {s.status === 'Pending' ? (
                            <div className="inline-flex gap-2 text-[10px]">
                              <a href={generateWhatsAppLink(s)} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 bg-forest-600 hover:bg-forest-700 text-white font-bold px-3 py-1.5 rounded-xl transition-all btn-press shadow-premium-sm">
                                <Send size={11} /> Send Bill
                              </a>
                              <button onClick={() => markAsPaid(s.id)}
                                className="flex items-center gap-1 bg-brand-background hover:bg-brand-surface text-brand-primary border border-brand-surface font-bold px-3 py-1.5 rounded-xl transition-all btn-press shadow-premium-sm">
                                <CheckCircle size={11} /> Mark Paid
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-warm-400 font-medium italic">Settled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== 4. MENU SCHEDULE TAB ===== */}
          {tab === 'menu' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-xl font-bold text-brand-secondary">Menu Schedule Editor</h2>
                <p className="text-xs text-warm-500 mt-1">Provide daily lunch and dinner items to keep students synchronized.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {DAYS.map(day => (
                  <div key={day} className="global-card p-5 space-y-4">
                    <p className="font-display text-sm font-bold text-brand-secondary border-b border-brand-surface/30 pb-2 flex justify-between items-center">
                      <span>{day} Menu Schedule</span>
                      <span className="text-[9px] uppercase tracking-wider text-warm-400">Homely Thali</span>
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-warm-400 font-bold">Lunch Items</label>
                        <input type="text" value={menu[day]?.lunch || ''} onChange={e => setMenu(prev => ({ ...prev, [day]: { ...prev[day], lunch: e.target.value } }))}
                          className="w-full bg-brand-background border border-brand-surface rounded-xl px-3 py-2 text-xs text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-accent mt-1" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-warm-400 font-bold">Dinner Items</label>
                        <input type="text" value={menu[day]?.dinner || ''} onChange={e => setMenu(prev => ({ ...prev, [day]: { ...prev[day], dinner: e.target.value } }))}
                          className="w-full bg-brand-background border border-brand-surface rounded-xl px-3 py-2 text-xs text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-accent mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={handleSaveMenu}
                  className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all btn-press ${menuSaved ? 'bg-forest-600 text-white shadow-premium-sm' : 'bg-brand-primary hover:bg-brand-secondary text-white shadow-premium-md'}`}>
                  {menuSaved ? '✓ Menu Saved Successfully!' : 'Save Menu Schedule'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
