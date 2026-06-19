import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, CalendarDays, Receipt, UtensilsCrossed, User, ChevronLeft, Menu, X, Phone, MapPin, Shield, Loader2 } from 'lucide-react';
import { generateAttendance } from '../data/mockStudents';
import { DAYS, MONTHS, WEEKLY_MENU } from '../data/mockMenus';
import StudentLayout from '../layouts/StudentLayout';
import { dashboardApi } from '../services/dashboardApi';
import { ROUTES } from '../routes/routes';

export default function StudentDashboard() {
  const [tab, setTab] = useState('home');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attendance, setAttendance] = useState(() => generateAttendance());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate(ROUTES.HOME);
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await dashboardApi.getStudentDashboard();
        if (response.success) {
          setDashboardData(response.dashboard);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [token, navigate]);

  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDayName = dayNames[today.getDay()];
  
  // Use today's menu from backend if available, otherwise fallback to mock
  const menuFromBackend = dashboardData?.todayMenu;
  const todayMenu = menuFromBackend && Object.keys(menuFromBackend).length > 0 
    ? { lunch: menuFromBackend.lunch || 'Not specified', dinner: menuFromBackend.dinner || 'Not specified' }
    : (WEEKLY_MENU[todayDayName === 'Sun' ? 'Sun' : todayDayName] || WEEKLY_MENU.Mon);

  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleMealMark = (meal, status) => {
    // In a real app, this would call an API (POST /api/attendance)
    setAttendance(prev => ({
      ...prev,
      [currentDay]: { ...prev[currentDay], [meal]: prev[currentDay]?.[meal] === status ? 'unmarked' : status }
    }));
  };

  const stats = useMemo(() => {
    let ate = dashboardData?.mealsConsumed || 0;
    let totalPossible = dashboardData?.mealsPurchased || 60;
    let amountDue = (dashboardData?.mealsConsumed / totalPossible) * (user?.monthlyRate || 3000);
    
    // Fallback if data is not yet loaded or partial
    if (!dashboardData) {
      ate = 0;
      for (let d = 1; d <= currentDay; d++) {
        const a = attendance[d];
        if (a) {
          if (a.lunch === 'ate') ate++;
          if (a.dinner === 'ate') ate++;
        }
      }
      totalPossible = currentDay * 2;
      amountDue = (ate / Math.max(totalPossible, 1)) * 3000;
    }
    
    return { ate, totalPossible, amountDue: Math.round(amountDue) };
  }, [attendance, currentDay, dashboardData, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <StudentLayout
      activeTab={tab}
      onTabChange={setTab}
      studentName={user?.name || 'Student'}
      messName={dashboardData?.activeMessName || user?.messName || 'Your Mess'}
      mobileMenuOpen={mobileMenuOpen}
      onMobileMenuToggle={setMobileMenuOpen}
    >
      {/* ===== 1. HOME FEED TAB ===== */}
      {tab === 'home' && (
        <div className="space-y-8 animate-fade-in">
          {/* Analytics Metric Cards Grid */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="global-card p-6 relative overflow-hidden">
              <span className="absolute -right-4 -bottom-4 text-7xl opacity-05 pointer-events-none">🍲</span>
              <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">Meals Attended</p>
              <p className="font-display text-2xl font-black text-brand-secondary mt-2">{stats.ate} meals</p>
              <div className="mt-4 h-2 bg-brand-surface rounded-full overflow-hidden">
                <div className="h-full bg-brand-accent rounded-full transition-all duration-500" style={{ width: `${(stats.ate / Math.max(stats.totalPossible, 1)) * 100}%` }} />
              </div>
              <p className="text-[10px] text-warm-400 mt-2">Out of {stats.totalPossible} meals this month</p>
            </div>

            <div className="global-card p-6 relative overflow-hidden">
              <span className="absolute -right-4 -bottom-4 text-7xl opacity-05 pointer-events-none">💳</span>
              <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">Account Balance Due</p>
              <p className="font-display text-2xl font-black text-brand-primary mt-2">₹{stats.amountDue.toLocaleString()}</p>
              <span className="inline-block mt-3.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-terra-50 border border-terra-100 text-terra-500 uppercase">Awaiting Bill</span>
            </div>

            <div className="global-card p-6 relative overflow-hidden">
              <span className="absolute -right-4 -bottom-4 text-7xl opacity-05 pointer-events-none">📍</span>
              <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">My Active Mess</p>
              <p className="font-display text-lg font-black text-brand-secondary mt-2 truncate">{dashboardData?.activeMessName || user?.messName || 'N/A'}</p>
              <p className="text-xs text-warm-400 mt-4 font-semibold">{dashboardData?.ownerName || 'N/A'}</p>
            </div>
          </div>

          {/* Main Attendance Logger and Sidebar widgets */}
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Attendance Trigger Box */}
              <div className="global-card p-6 shadow-premium-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display text-xl font-bold text-brand-secondary">Daily Attendance Log</h3>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-brand-background border border-brand-surface text-warm-600">
                    {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Lunch Option */}
                  <div className="p-4 rounded-2xl bg-brand-background/45 border border-brand-surface/50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-warm-400">Lunch Meal</span>
                        <p className="text-sm font-bold text-brand-secondary mt-0.5">{todayMenu.lunch}</p>
                      </div>
                      {attendance[currentDay]?.lunch === 'ate' && <span className="text-xs font-semibold text-forest-600 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">Attended</span>}
                      {attendance[currentDay]?.lunch === 'skipped' && <span className="text-xs font-semibold text-terra-500 bg-terra-50 px-2 py-0.5 rounded border border-terra-100">Skipped</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleMealMark('lunch', 'ate')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all btn-press ${attendance[currentDay]?.lunch === 'ate' ? 'bg-forest-700 text-white shadow-premium-sm' : 'bg-white text-warm-600 border border-brand-surface/80 hover:bg-brand-surface/30'}`}>
                        ✓ Khaaya
                      </button>
                      <button onClick={() => handleMealMark('lunch', 'skipped')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all btn-press ${attendance[currentDay]?.lunch === 'skipped' ? 'bg-terra-600 text-white shadow-premium-sm' : 'bg-white text-warm-600 border border-brand-surface/80 hover:bg-brand-surface/30'}`}>
                        ✗ Skip kiya
                      </button>
                    </div>
                  </div>

                  {/* Dinner Option */}
                  <div className="p-4 rounded-2xl bg-brand-background/45 border border-brand-surface/50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-warm-400">Dinner Meal</span>
                        <p className="text-sm font-bold text-brand-secondary mt-0.5">{todayMenu.dinner}</p>
                      </div>
                      {attendance[currentDay]?.dinner === 'ate' && <span className="text-xs font-semibold text-forest-600 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">Attended</span>}
                      {attendance[currentDay]?.dinner === 'skipped' && <span className="text-xs font-semibold text-terra-500 bg-terra-50 px-2 py-0.5 rounded border border-terra-100">Skipped</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleMealMark('dinner', 'ate')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all btn-press ${attendance[currentDay]?.dinner === 'ate' ? 'bg-forest-700 text-white shadow-premium-sm' : 'bg-white text-warm-600 border border-brand-surface/80 hover:bg-brand-surface/30'}`}>
                        ✓ Khaaya
                      </button>
                      <button onClick={() => handleMealMark('dinner', 'skipped')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all btn-press ${attendance[currentDay]?.dinner === 'skipped' ? 'bg-terra-600 text-white shadow-premium-sm' : 'bg-white text-warm-600 border border-brand-surface/80 hover:bg-brand-surface/30'}`}>
                        ✗ Skip kiya
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Info Panels */}
            <div className="space-y-6 col-span-1">
              <div className="global-card p-6 space-y-4">
                <h4 className="font-display text-base font-bold text-brand-secondary">Mess Provider Contacts</h4>
                <div className="space-y-3.5 text-xs text-warm-600">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-brand-accent" />
                    <div>
                      <p className="text-[10px] text-warm-400 font-semibold uppercase">Owner Name</p>
                      <p className="font-semibold text-brand-secondary">{dashboardData?.ownerName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-brand-accent" />
                    <div>
                      <p className="text-[10px] text-warm-400 font-semibold uppercase">Phone Number</p>
                      <p className="font-semibold text-brand-secondary">{dashboardData?.ownerPhone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-brand-accent" />
                    <div>
                      <p className="text-[10px] text-warm-400 font-semibold uppercase">Address</p>
                      <p className="font-semibold text-brand-secondary leading-normal">{dashboardData?.messAddress || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 2. MEALS LOG TAB ===== */}
      {tab === 'meals' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-xl font-bold text-brand-secondary">{MONTHS[currentMonth]} {currentYear} Log</h2>
            <div className="flex gap-3 text-xs text-warm-500 font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-forest-600" />Ate</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-terra-400" />Skipped</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-surface border" />Unmarked</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Large Desktop Calendar */}
            <div className="global-card p-6">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-brand-secondary uppercase tracking-wider mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => <div key={i}>{d}</div>)}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for start of month */}
                {[...Array(new Date(currentYear, currentMonth, 1).getDay())].map((_, i) => <div key={`e${i}`} className="aspect-square bg-transparent" />)}
                
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const a = attendance[day];
                  const isToday = day === currentDay;
                  return (
                    <div key={day} className={`aspect-square border border-brand-surface/40 rounded-xl flex flex-col justify-between p-2 transition-all ${isToday ? 'ring-2 ring-brand-accent bg-brand-background' : 'bg-brand-background/20 hover:bg-brand-background/50'}`}>
                      <span className={`text-[10px] font-bold ${isToday ? 'text-brand-primary' : 'text-warm-500'}`}>{day}</span>
                      <div className="flex gap-1 justify-end">
                        <div className={`w-2 h-2 rounded-full ${a?.lunch === 'ate' ? 'bg-forest-600' : a?.lunch === 'skipped' ? 'bg-terra-400' : 'bg-brand-surface border border-brand-surface/80'}`} title={`Lunch: ${a?.lunch || 'unmarked'}`} />
                        <div className={`w-2 h-2 rounded-full ${a?.dinner === 'ate' ? 'bg-forest-600' : a?.dinner === 'skipped' ? 'bg-terra-400' : 'bg-brand-surface border border-brand-surface/80'}`} title={`Dinner: ${a?.dinner || 'unmarked'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right side: Recent Log List */}
            <div className="col-span-1 space-y-4">
              <h3 className="text-sm font-bold text-brand-secondary uppercase tracking-wider">Recent Logs</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {[...Array(7)].map((_, i) => {
                  const day = currentDay - i;
                  if (day < 1) return null;
                  const a = attendance[day];
                  const dateObj = new Date(currentYear, currentMonth, day);
                  return (
                    <div key={day} className="bg-white rounded-2xl p-4 border border-brand-surface/40 shadow-premium-sm flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-brand-secondary">{dateObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}</p>
                        <p className="text-[10px] text-warm-400 font-medium">{MONTHS[currentMonth]}</p>
                      </div>
                      <div className="flex gap-2 text-[10px]">
                        <span className={`px-2 py-1 rounded-lg font-bold border ${a?.lunch === 'ate' ? 'bg-forest-50 border-forest-200 text-forest-700' : a?.lunch === 'skipped' ? 'bg-terra-50 border-terra-200 text-terra-600' : 'bg-brand-background border-brand-surface text-warm-400'}`}>
                          L: {a?.lunch === 'ate' ? '✓' : a?.lunch === 'skipped' ? '✗' : '—'}
                        </span>
                        <span className={`px-2 py-1 rounded-lg font-bold border ${a?.dinner === 'ate' ? 'bg-forest-50 border-forest-200 text-forest-700' : a?.dinner === 'skipped' ? 'bg-terra-50 border-terra-200 text-terra-600' : 'bg-brand-background border-brand-surface text-warm-400'}`}>
                          D: {a?.dinner === 'ate' ? '✓' : a?.dinner === 'skipped' ? '✗' : '—'}
                        </span>
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 3. BILLS & DUES TAB ===== */}
      {tab === 'bill' && (
        <div className="space-y-8 animate-fade-in">
          <h2 className="font-display text-xl font-bold text-brand-secondary">Billing & Statements</h2>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Active Cycle calculations */}
            <div className="global-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-brand-surface/30 pb-4">
                <div>
                  <p className="font-display text-lg font-bold text-brand-secondary">Current Billing Cycle</p>
                  <p className="text-xs text-warm-400 font-medium">{MONTHS[currentMonth]} {currentYear}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-terra-50 border border-terra-100 text-terra-600">Pending Invoice</span>
              </div>

              <div className="space-y-3.5 text-xs text-warm-600">
                <div className="flex justify-between"><span className="font-medium text-warm-400">Total possible meals</span><span className="font-bold text-brand-secondary">60 meals</span></div>
                <div className="flex justify-between"><span className="font-medium text-warm-400">Meals attended (Ate)</span><span className="font-bold text-brand-secondary">{stats.ate} meals</span></div>
                <div className="flex justify-between"><span className="font-medium text-warm-400">Subscription plan rate</span><span className="font-bold text-brand-secondary">₹{(user?.monthlyRate || 3000).toLocaleString()} / mo</span></div>
                <div className="border-t border-brand-surface/30 pt-3.5 flex justify-between items-center text-xs">
                  <span className="font-medium text-warm-400">Formula</span>
                  <span className="font-mono text-brand-primary bg-brand-background px-2.5 py-1 rounded border border-brand-surface/80">
                    ({stats.ate} / {stats.totalPossible}) × ₹{(user?.monthlyRate || 3000).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-brand-surface/30 pt-6 flex justify-between items-baseline">
                <span className="font-display font-semibold text-brand-secondary text-sm">Calculated Due:</span>
                <p className="font-display text-3xl font-black text-brand-primary">₹{stats.amountDue.toLocaleString()}</p>
              </div>
            </div>

            {/* Billing History Panel */}
            <div className="col-span-1 space-y-4">
              <h3 className="text-sm font-bold text-brand-secondary uppercase tracking-wider">Statement History</h3>
              <div className="space-y-3">
                {[
                  { month: 'April 2026', meals: 52, amount: 2427, status: 'Paid' },
                  { month: 'March 2026', meals: 48, amount: 2240, status: 'Paid' },
                  { month: 'February 2026', meals: 45, amount: 2100, status: 'Paid' },
                ].map((b, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-brand-surface/40 shadow-premium-sm flex items-center justify-between">
                    <div>
                      <p className="font-bold text-brand-secondary text-sm">{b.month}</p>
                      <p className="text-[10px] text-warm-400 font-semibold">{b.meals} meals • ₹{b.amount.toLocaleString()}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-forest-50 border border-forest-100 text-forest-700">{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 4. WEEKLY MENU TAB ===== */}
      {tab === 'menu' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-secondary">Weekly Meal Board</h2>
            <p className="text-xs text-warm-500 mt-1">Check scheduled dishes beforehand for proper meal skipping coordination.</p>
          </div>

          <div className="global-card overflow-hidden">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="bg-brand-background border-b border-brand-surface/60 text-[10px] uppercase font-bold text-brand-secondary tracking-wider">
                  <th className="py-4 px-6">Day</th>
                  <th className="py-4 px-6">Lunch / Morning Meal</th>
                  <th className="py-4 px-6">Dinner / Evening Meal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-surface/30">
                {DAYS.map((day, i) => {
                  const isToday = dayNames[today.getDay()] === day || (day === 'Sun' && today.getDay() === 0);
                  return (
                    <tr key={day} className={`transition-colors ${isToday ? 'bg-brand-accent/08 font-medium' : 'hover:bg-brand-background/10'}`}>
                      <td className="py-4 px-6 font-bold text-brand-secondary">
                        {day} {isToday && <span className="ml-1.5 text-[8px] px-1.5 py-0.5 rounded-full bg-brand-accent text-brand-primary border border-brand-accent/30 font-bold uppercase tracking-wider">Today</span>}
                      </td>
                      <td className="py-4 px-6 text-warm-700 text-xs">{WEEKLY_MENU[day]?.lunch}</td>
                      <td className="py-4 px-6 text-warm-700 text-xs">{WEEKLY_MENU[day]?.dinner}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
