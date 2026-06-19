import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, CalendarDays, Receipt, UtensilsCrossed, User, ChevronLeft, Menu, X, Phone, MapPin, Shield, Loader2 } from 'lucide-react';
import { generateAttendance } from '../data/mockStudents';
import { DAYS, MONTHS, WEEKLY_MENU } from '../data/mockMenus';
import StudentLayout from '../layouts/StudentLayout';
import { dashboardApi } from '../services/dashboardApi';
import { attendanceApi } from '../services/attendanceApi';
import { rechargeApi } from '../services/rechargeApi';
import { menuApi } from '../services/menuApi';
import { useAuth } from '../contexts/AuthContext';

export default function StudentDashboard() {
  const [tab, setTab] = useState('home');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [weeklyMenu, setWeeklyMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, token } = useAuth();

  useEffect(() => {
    // ProtectedRoute already handles redirect if not authenticated

    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          dashboardApi.getStudentDashboard(),
          rechargeApi.getRechargeHistory(),
          attendanceApi.getAttendanceHistory(),
          menuApi.getWeeklyMenu()
        ]);
        
        const [dashRes, rechRes, attHistRes, weeklyMenuRes] = results;

        if (dashRes.status === 'fulfilled' && dashRes.value.success) {
          setDashboardData(dashRes.value.dashboard);
        }
        
        if (rechRes.status === 'fulfilled' && rechRes.value.success) {
          setRechargeHistory(rechRes.value.recharges || []);
        }
        
        if (attHistRes.status === 'fulfilled' && attHistRes.value.success) {
          setAttendanceHistory(attHistRes.value.attendance || []);
        }

        if (weeklyMenuRes.status === 'fulfilled' && weeklyMenuRes.value.success) {
          setWeeklyMenu(weeklyMenuRes.value.weeklyMenu);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDayName = dayNames[today.getDay()];
  
  // Real Menu Logic: Prioritize Daily Override -> Real Weekly Menu -> Default Data
  const getTodayMenu = () => {
    // 1. Check for specific today menu override from backend
    const dailyOverride = dashboardData?.todayMenu;
    if (dailyOverride && (dailyOverride.breakfast || dailyOverride.dinner)) {
      return { 
        lunch: dailyOverride.breakfast || 'Not specified', 
        dinner: dailyOverride.dinner || 'Not specified' 
      };
    }

    // 2. Fallback to real loaded weekly menu
    if (weeklyMenu && weeklyMenu[todayDayName]) {
      return {
        lunch: weeklyMenu[todayDayName].lunch || 'No menu set',
        dinner: weeklyMenu[todayDayName].dinner || 'No menu set'
      };
    }

    // 3. Last fallback to local data
    const localDay = todayDayName === 'Sun' ? 'Sun' : (WEEKLY_MENU[todayDayName] ? todayDayName : 'Mon');
    return WEEKLY_MENU[localDay];
  };

  const todayMenu = getTodayMenu();

  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create attendance map from real history
  const attendance = useMemo(() => {
    const map = {};
    const history = Array.isArray(attendanceHistory) ? attendanceHistory : [];
    history.forEach(att => {
      const date = new Date(att.date);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        map[date.getDate()] = {
          lunch: att.morning ? 'ate' : 'skipped',
          dinner: att.evening ? 'ate' : 'skipped'
        };
      }
    });
    return map;
  }, [attendanceHistory, currentMonth, currentYear]);


  const stats = useMemo(() => {
    const consumed = dashboardData?.mealsConsumed || 0;
    const purchased = dashboardData?.mealsPurchased || 0;
    const remaining = dashboardData?.mealsRemaining || 0;
    const overdueThalis = dashboardData?.overdueMeals || 0;
    
    // Calculate overdue amount
    // Assuming ₹2800 for 60 thalis (~₹46.67 per thali)
    const thaliRate = 2800 / 60;
    const overdueAmount = Math.ceil(overdueThalis * thaliRate);

    return { consumed, purchased, remaining, overdueThalis, overdueAmount };
  }, [dashboardData]);

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
      messName={dashboardData?.messDetails?.name || user?.messName || 'Your Mess'}
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
              <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">Meals Consumed</p>
              <p className="font-display text-2xl font-black text-brand-secondary mt-2">{stats.consumed} thalis</p>
              <div className="mt-4 h-2 bg-brand-surface rounded-full overflow-hidden">
                <div className="h-full bg-brand-accent rounded-full transition-all duration-500" style={{ width: `${(stats.consumed / Math.max(stats.purchased, 1)) * 100}%` }} />
              </div>
              <p className="text-[10px] text-warm-400 mt-2">Life-time usage from your account</p>
            </div>

            <div className={`global-card p-6 relative overflow-hidden ring-2 ${stats.remaining < 10 ? 'ring-terra-500/20' : 'ring-brand-primary/20'}`}>
              <span className="absolute -right-4 -bottom-4 text-7xl opacity-05 pointer-events-none">🎫</span>
              <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">Remaining Balance</p>
              <p className={`font-display text-2xl font-black mt-2 ${stats.remaining < 10 ? 'text-terra-500' : 'text-brand-primary'}`}>{stats.remaining} thalis</p>
              <span className={`inline-block mt-3.5 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${stats.remaining < 10 ? 'bg-terra-50 border-terra-100 text-terra-600' : 'bg-forest-50 border-forest-100 text-forest-700'}`}>
                {stats.remaining < 10 ? 'Running Low' : 'Active Plan'}
              </span>
            </div>

            <div className={`global-card p-6 relative overflow-hidden ring-2 ${stats.overdueThalis > 0 ? 'ring-terra-500/50 bg-terra-50' : 'ring-brand-surface'}`}>
               <span className="absolute -right-4 -bottom-4 text-7xl opacity-05 pointer-events-none">{stats.overdueThalis > 0 ? '⚠️' : '✅'}</span>
               <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">Outstanding Loan</p>
               <p className={`font-display text-2xl font-black mt-2 ${stats.overdueThalis > 0 ? 'text-terra-600' : 'text-warm-400'}`}>
                 {stats.overdueThalis} thalis
               </p>
               {stats.overdueThalis > 0 ? (
                 <p className="text-[10px] text-terra-500 font-bold mt-3.5">
                   ₹{stats.overdueAmount} will be deducted from next recharge
                 </p>
               ) : (
                 <span className="inline-block mt-3.5 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border bg-forest-50 border-forest-100 text-forest-700">Account Clear</span>
               )}
            </div>

            <div className="global-card p-6 relative overflow-hidden">
              <span className="absolute -right-4 -bottom-4 text-7xl opacity-05 pointer-events-none">📍</span>
              <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">My Active Mess</p>
              {dashboardData?.messDetails ? (
                <>
                  <p className="font-display text-lg font-black text-brand-secondary mt-2 truncate">{dashboardData.messDetails.name}</p>
                  <p className="text-xs text-warm-400 mt-4 font-semibold">{dashboardData.messDetails.ownerName}</p>
                </>
              ) : (
                <>
                  <p className="font-display text-lg font-black text-brand-accent mt-2">No Mess Joined</p>
                  <button onClick={() => navigate('/discover')} className="text-[10px] text-brand-primary font-bold underline mt-4 hover:text-brand-secondary transition-colors">
                    Browse & Join Now →
                  </button>
                </>
              )}
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
                      {dashboardData?.todayAttendance?.morning ? 
                        <span className="text-xs font-semibold text-forest-600 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">Attended</span> : 
                        <span className="text-xs font-semibold text-terra-500 bg-terra-50 px-2 py-0.5 rounded border border-terra-100">Skipped</span>
                      }
                    </div>
                    <div className="mt-2 py-3 px-4 rounded-xl bg-blend-soft-light bg-brand-surface/30 border border-brand-surface/20 flex items-center justify-between">
                      <span className="text-[10px] text-warm-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Shield size={12} className="text-brand-primary" />
                        Official Attendance Log
                      </span>
                      <span className="text-[10px] text-warm-400 font-medium italic">Verified by Owner</span>
                    </div>
                  </div>

                  {/* Dinner Option */}
                  <div className="p-4 rounded-2xl bg-brand-background/45 border border-brand-surface/50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-warm-400">Dinner Meal</span>
                        <p className="text-sm font-bold text-brand-secondary mt-0.5">{todayMenu.dinner}</p>
                      </div>
                      {dashboardData?.todayAttendance?.evening ? 
                        <span className="text-xs font-semibold text-forest-600 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">Attended</span> : 
                        <span className="text-xs font-semibold text-terra-500 bg-terra-50 px-2 py-0.5 rounded border border-terra-100">Skipped</span>
                      }
                    </div>
                    <div className="mt-2 py-3 px-4 rounded-xl bg-blend-soft-light bg-brand-surface/30 border border-brand-surface/20 flex items-center justify-between">
                      <span className="text-[10px] text-warm-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Shield size={12} className="text-brand-primary" />
                        Official Attendance Log
                      </span>
                      <span className="text-[10px] text-warm-400 font-medium italic">Verified by Owner</span>
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
                      <p className="font-semibold text-brand-secondary">{dashboardData?.messDetails?.ownerName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-brand-accent" />
                    <div>
                      <p className="text-[10px] text-warm-400 font-semibold uppercase">Phone Number</p>
                      <p className="font-semibold text-brand-secondary">{dashboardData?.messDetails?.ownerPhone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-brand-accent" />
                    <div>
                      <p className="text-[10px] text-warm-400 font-semibold uppercase">Address</p>
                      <p className="font-semibold text-brand-secondary leading-normal">{dashboardData?.messDetails?.address || 'N/A'}</p>
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

      {/* ===== 3. RECHARGES TAB ===== */}
      {tab === 'bill' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-display text-xl font-bold text-brand-secondary">Prepaid Wallet & Billing</h2>
              <p className="text-xs text-warm-500 mt-1">Monitor your consumption, recharges, and pending dues.</p>
            </div>
            {stats.isOverdue && (
              <div className="bg-terra-50 border border-terra-100 px-4 py-2 rounded-xl flex items-center gap-2 animate-pulse">
                <Shield size={16} className="text-terra-600" />
                <span className="text-xs font-bold text-terra-700">Action Required: Overdue Dues</span>
              </div>
            )}
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="global-card p-6 bg-white border-l-4 border-l-brand-primary">
              <p className="text-[10px] text-warm-400 font-bold uppercase tracking-wider">Total Purchased</p>
              <p className="font-display text-2xl font-black text-brand-secondary mt-1">{stats.purchased} <span className="text-xs text-warm-400 font-medium">thalis</span></p>
            </div>
            <div className="global-card p-6 bg-white border-l-4 border-l-brand-secondary">
              <p className="text-[10px] text-warm-400 font-bold uppercase tracking-wider">Total Consumed</p>
              <p className="font-display text-2xl font-black text-brand-secondary mt-1">{stats.consumed} <span className="text-xs text-warm-400 font-medium">thalis</span></p>
            </div>
            <div className={`global-card p-6 border-l-4 ${stats.isOverdue ? 'border-l-terra-500 bg-terra-50/30' : 'border-l-forest-500 bg-white'}`}>
              <p className="text-[10px] text-warm-400 font-bold uppercase tracking-wider">{stats.isOverdue ? 'Overdue Thalis' : 'Available Balance'}</p>
              <p className={`font-display text-2xl font-black mt-1 ${stats.isOverdue ? 'text-terra-600' : 'text-forest-700'}`}>
                {stats.isOverdue ? `-${stats.overdueThalis}` : stats.remaining} <span className="text-xs font-medium opacity-60">thalis</span>
              </p>
            </div>
            <div className={`global-card p-6 border-l-4 ${stats.isOverdue ? 'border-l-terra-600 bg-terra-100/20' : 'border-l-brand-accent bg-white'}`}>
              <p className="text-[10px] text-warm-400 font-bold uppercase tracking-wider">{stats.isOverdue ? 'Overdue Amount' : 'Wallet Status'}</p>
              <p className={`font-display text-2xl font-black mt-1 ${stats.isOverdue ? 'text-terra-700' : 'text-brand-primary'}`}>
                {stats.isOverdue ? `₹${stats.overdueAmount}` : 'RECHARGED'}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Active Plan info */}
            <div className="global-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-brand-surface/30 pb-4">
                <div>
                  <p className="font-display text-lg font-bold text-brand-secondary">Payment Summary</p>
                  <p className="text-xs text-warm-400 font-medium">Standard Pack: 60 Thalis</p>
                </div>
                <Receipt size={22} className="text-brand-primary" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-warm-500">Wallet Health</span>
                    <span className={`font-bold ${stats.overdueThalis > 0 ? 'text-terra-600' : (stats.remaining < 10 ? 'text-terra-400' : 'text-forest-600')}`}>
                      {stats.overdueThalis > 0 ? 'LOAN ACTIVE' : (stats.remaining < 10 ? 'Low Balance' : 'Healthy')}
                    </span>
                  </div>
                  <div className="h-2.5 bg-brand-background rounded-full overflow-hidden border border-brand-surface/50">
                    <div 
                      className={`h-full transition-all duration-700 ${stats.overdueThalis > 0 ? 'bg-terra-500' : (stats.remaining < 10 ? 'bg-terra-400' : 'bg-brand-accent')}`} 
                      style={{ width: stats.overdueThalis > 0 ? '100%' : `${Math.min((stats.remaining / 60) * 100, 100)}%` }} 
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs text-warm-600">
                  <div className="flex justify-between p-2 rounded-lg bg-brand-background/40">
                    <span className="text-warm-500">Standard Rate</span>
                    <span className="font-bold text-brand-secondary">₹2,800 / Pack</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-brand-background/40">
                    <span className="text-warm-500">Price per Thali</span>
                    <span className="font-bold text-brand-secondary">₹46.67</span>
                  </div>
                  
                  {stats.overdueThalis > 0 && (
                    <div className="flex justify-between p-3 rounded-xl bg-terra-50 border border-terra-100 items-center">
                      <div className="flex flex-col">
                         <span className="text-terra-700 font-bold">Outstanding Loan</span>
                         <span className="text-[10px] text-terra-500">{stats.overdueThalis} meals overdue</span>
                      </div>
                      <span className="font-display text-lg font-black text-terra-700">₹{stats.overdueAmount}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-brand-surface/30 pt-6 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display font-semibold text-brand-secondary text-sm">Remaining Thalis:</span>
                    <p className="font-display text-4xl font-black text-brand-primary">{stats.remaining}</p>
                  </div>
                  {stats.overdueThalis > 0 && (
                    <p className="text-[10px] text-terra-600 font-bold text-right pt-1 flex items-center justify-end gap-1">
                      <Shield size={12} /> These will be deducted from your next recharge.
                    </p>
                  )}
              </div>
            </div>

              {/* Recharge history list */}
            <div className="col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-brand-secondary uppercase tracking-wider">Transaction History</h3>
              <div className="space-y-3">
                {(rechargeHistory || []).length > 0 ? (
                  rechargeHistory.map((r, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-brand-surface/40 shadow-premium-sm flex items-center justify-between group hover:border-brand-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-background flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                          <Receipt size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-brand-secondary text-sm">₹{r.amountPaid.toLocaleString()} Recharge</p>
                          <p className="text-[10px] text-warm-400 font-semibold">
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • {r.mealsAdded} Thalis added
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest-700 uppercase tracking-wider">Success</span>
                        <p className="text-[9px] text-warm-400 mt-1 font-medium italic">Via {r.paymentMethod}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-12 global-card border-dashed">
                    <p className="text-warm-400 text-sm">No recharge history found.</p>
                  </div>
                )}
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
                  const displayMenu = (weeklyMenu && weeklyMenu[day]) ? weeklyMenu[day] : WEEKLY_MENU[day];
                  return (
                    <tr key={day} className={`transition-colors ${isToday ? 'bg-brand-accent/08 font-medium' : 'hover:bg-brand-background/10'}`}>
                      <td className="py-4 px-6 font-bold text-brand-secondary">
                        {day} {isToday && <span className="ml-1.5 text-[8px] px-1.5 py-0.5 rounded-full bg-brand-accent text-brand-primary border border-brand-accent/30 font-bold uppercase tracking-wider">Today</span>}
                      </td>
                      <td className="py-4 px-6 text-warm-700 text-xs">{displayMenu?.lunch}</td>
                      <td className="py-4 px-6 text-warm-700 text-xs">{displayMenu?.dinner}</td>
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
