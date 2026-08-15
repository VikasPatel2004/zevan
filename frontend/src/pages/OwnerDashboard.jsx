import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, Users, Receipt, UtensilsCrossed, Settings, Plus, X, Send, CheckCircle, Menu, ChevronLeft, Shield, Loader2, Image as ImageIcon, Store } from 'lucide-react';
import { OWNER_STUDENTS, OWNER_MESS, generateOwnerBilling } from '../data/mockStudents';
import { DAYS, MONTHS, DEFAULT_OWNER_MENU, WEEKLY_MENU } from '../data/mockMenus';
import OwnerLayout from '../layouts/OwnerLayout';
import { dashboardApi } from '../services/dashboardApi';
import { attendanceApi } from '../services/attendanceApi';
import { menuApi } from '../services/menuApi';
import { rechargeApi } from '../services/rechargeApi';
import { useAuth } from '../contexts/AuthContext';
import { messApi } from '../services/messApi';
import OnboardingModal from '../components/OnboardingModal';

export default function OwnerDashboard() {
  const [tab, setTab] = useState('today');
  const [mealType, setMealType] = useState('lunch');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [residentThaliData, setResidentThaliData] = useState([]);
  const [weeklyMenu, setWeeklyMenu] = useState(WEEKLY_MENU);
  const [todayMenuEntry, setTodayMenuEntry] = useState({ breakfast: '', dinner: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', phone: '', plan: 'Both', rate: 2800 });
  const [menuSaved, setMenuSaved] = useState(false);
  const [isSavingMenu, setIsSavingMenu] = useState(false);
  const [isRecharging, setIsRecharging] = useState(false);
  const [rechargeModal, setRechargeModal] = useState({ show: false, student: null });
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [messInfo, setMessInfo] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, attRes, menuRes, rechStatusRes, weeklyMenuRes, messRes] = await Promise.allSettled([
          dashboardApi.getOwnerDashboard(),
          attendanceApi.getTodayAttendance(),
          menuApi.getTodayMenu(),
          rechargeApi.getResidentThaliStatus(),
          menuApi.getWeeklyMenu(),
          messApi.getMyMess()
        ]);
        
        if (dashRes.status === 'fulfilled' && dashRes.value.success) {
          setDashboardData(dashRes.value.dashboard);
        }

        if (messRes.status === 'fulfilled' && messRes.value && messRes.value.success && messRes.value.mess) {
          const messObj = messRes.value.mess;
          setMessInfo(messObj);
          
          // Show onboarding modal ONLY ONCE when owner signs up, NOT on regular sign-ins
          if (sessionStorage.getItem('just_signed_up_owner') === 'true') {
            setShowOnboarding(true);
            sessionStorage.removeItem('just_signed_up_owner');
          }
        } else if (messRes.status === 'fulfilled' && messRes.value && messRes.value.success && !messRes.value.mess) {
          console.warn('Owner has no mess linked');
        }
        
        if (attRes.status === 'fulfilled' && attRes.value.success) {
          setStudentsList(attRes.value.attendance);
          const m = {};
          attRes.value.attendance.forEach(s => {
            m[s.id] = mealType === 'lunch' ? s.morning : s.evening;
          });
          setAttendanceMap(m);
        }

        if (menuRes.status === 'fulfilled' && menuRes.value.success) {
          setTodayMenuEntry({
            breakfast: menuRes.value.menu.breakfast || '',
            dinner: menuRes.value.menu.dinner || ''
          });
        }

        if (rechStatusRes.status === 'fulfilled' && rechStatusRes.value.success) {
          setResidentThaliData(rechStatusRes.value.residents);
        }

        if (weeklyMenuRes.status === 'fulfilled' && weeklyMenuRes.value.success) {
          if (weeklyMenuRes.value.weeklyMenu) {
            setWeeklyMenu(weeklyMenuRes.value.weeklyMenu);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const todayStudents = useMemo(() => {
    return studentsList.filter(s => {
      // If plan is 'Both', 'FULL' (legacy), or undefined, show in both
      const isBoth = !s.plan || s.plan === 'Both' || s.plan === 'FULL';
      if (mealType === 'lunch') return isBoth || s.plan === 'Lunch' || s.plan === 'HALF';
      return isBoth || s.plan === 'Dinner';
    });
  }, [studentsList, mealType]);

  const presentCount = useMemo(() => todayStudents.filter(s => attendanceMap[s.id]).length, [todayStudents, attendanceMap]);

  const handleMealTypeChange = (type) => {
    setMealType(type);
    setAttendanceSaved(false);
    const m = {};
    studentsList.forEach(s => {
      m[s.id] = type === 'lunch' ? s.morning : s.evening;
    });
    setAttendanceMap(m);
  };

  const toggleAttendance = (id) => {
    setAttendanceSaved(false);
    setAttendanceMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveAttendance = async () => {
    if (isSavingAttendance) return;
    setIsSavingAttendance(true);
    try {
      const payload = studentsList.map(s => ({
        residentId: s.id,
        morning: mealType === 'lunch' ? (attendanceMap[s.id] ?? s.morning) : s.morning,
        evening: mealType === 'dinner' ? (attendanceMap[s.id] ?? s.evening) : s.evening,
      }));

      const response = await attendanceApi.bulkMarkAttendance(payload);
      if (response.success) {
        setAttendanceSaved(true);
        // Refresh both dashboard summary and student list to stay 100% in sync
        const [dashRes, attRes] = await Promise.all([
          dashboardApi.getOwnerDashboard(),
          attendanceApi.getTodayAttendance()
        ]);

        if (dashRes.success) setDashboardData(dashRes.dashboard);

        if (attRes.success) {
          setStudentsList(attRes.attendance);
          const m = {};
          attRes.attendance.forEach(s => {
            m[s.id] = mealType === 'lunch' ? s.morning : s.evening;
          });
          setAttendanceMap(m);
        }

        setTimeout(() => setAttendanceSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save attendance:', err);
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const handleSaveMenu = async () => {
    if (isSavingMenu) return;
    setIsSavingMenu(true);
    try {
      const [todayRes, weeklyRes] = await Promise.all([
        menuApi.updateMenu({
          breakfast: todayMenuEntry.breakfast,
          dinner: todayMenuEntry.dinner
        }),
        menuApi.updateWeeklyMenu(weeklyMenu)
      ]);
      
      if (todayRes.success && weeklyRes.success) {
        setMenuSaved(true);
        setTimeout(() => setMenuSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save menu:', err);
    } finally {
      setIsSavingMenu(false);
    }
  };

  const handleProcessRecharge = async () => {
    if (isRecharging || !rechargeModal.student) return;
    setIsRecharging(true);
    try {
      const response = await rechargeApi.addRecharge({
        residentId: rechargeModal.student.id,
        amountPaid: 2800,
        mealsAdded: 60,
        paymentMethod: 'Cash/Manual'
      });
      if (response.success) {
        const [dashRes, rechRes] = await Promise.all([
          dashboardApi.getOwnerDashboard(),
          rechargeApi.getResidentThaliStatus()
        ]);
        if (dashRes.success) setDashboardData(dashRes.dashboard);
        if (rechRes.success) setResidentThaliData(rechRes.residents);
        setRechargeModal({ show: false, student: null });
      }
    } catch (err) {
      console.error('Recharge failed:', err);
    } finally {
      setIsRecharging(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <OwnerLayout
      activeTab={tab}
      onTabChange={setTab}
      messName={user?.messName || 'Your Mess'}
      ownerName={user?.name || 'Owner'}
      mobileMenuOpen={mobileMenuOpen}
      onMobileMenuToggle={setMobileMenuOpen}
    >
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
        messId={messInfo?._id}
        initialData={messInfo}
        onComplete={(updated) => {
          setMessInfo(updated);
          setShowOnboarding(false);
        }}
      />

      {!isLoading && !messInfo ? (
        <div className="max-w-2xl mx-auto mt-20 text-center animate-fade-in">
          <div className="w-20 h-20 bg-brand-surface text-brand-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-premium-sm rotate-3">
            <Store size={40} />
          </div>
          <h1 className="font-display text-3xl font-bold text-brand-secondary mb-4">No Mess Linked</h1>
          <p className="text-warm-500 mb-8 leading-relaxed">Your profile isn't connected to a mess yet. Create your mess now to start managing residents and menus.</p>
          <button 
            onClick={() => setShowOnboarding(true)}
            className="btn btn-primary btn-xl shadow-premium-lg"
          >
            Create Your Mess Profile
          </button>
        </div>
      ) : (
        <>
          {/* ===== 1. DASHBOARD OVERVIEW ===== */}
          {tab === 'today' && (
            <div className="space-y-6 animate-fade-in">
          {/* Join Code Banner */}
          <div className="global-card p-4 bg-brand-primary text-brand-accent flex flex-col sm:flex-row items-center justify-between gap-4 shadow-premium-md relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
              <Shield size={120} className="-mr-10 -mt-10" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Your Unique Mess Join Code</p>
              <h3 className="font-mono text-3xl font-black tracking-widest mt-1">{dashboardData?.joinCode || 'ZEVAN1'}</h3>
            </div>
            <div className="text-center sm:text-right max-w-xs">
              <p className="text-xs font-medium text-white/90 leading-relaxed">Share this code with your students. They will need it to join your mess on the Zevan app.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="global-card p-6 border-b-4 border-brand-primary">
              <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">Active Students</p>
              <p className="font-display text-3xl font-black text-brand-secondary mt-1">{dashboardData?.totalResidents || 0}</p>
            </div>
            <div className="global-card p-6 border-b-4 border-forest-500">
              <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">Marked Present Today</p>
              <p className="font-display text-3xl font-black text-forest-700 mt-1">
                {dashboardData?.morningCount + dashboardData?.eveningCount || 0}
              </p>
            </div>
            <div className="global-card p-6 border-b-4 border-terra-500">
              <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold">Pending Actions</p>
              <p className="font-display text-3xl font-black text-terra-500 mt-1">{dashboardData?.pendingLeaves || 0}</p>
            </div>
          </div>
          
          <div className="global-card p-8 bg-brand-background/30 border-dashed border-2 border-brand-surface flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-premium-sm mb-4">
                <CalendarCheck className="text-brand-primary" size={32} />
             </div>
             <h3 className="font-display text-xl font-bold text-brand-secondary">Ready to take Attendance?</h3>
             <p className="text-xs text-warm-500 mt-2 max-w-sm">Use the Daily Presence Maker tab to mark who ate today. This will automatically update student balances.</p>
             <button onClick={() => setTab('attendance')} className="mt-6 px-8 py-3 bg-brand-primary text-white text-xs font-bold rounded-xl shadow-premium-md hover:bg-brand-secondary transition-all transform hover:-translate-y-1">
                Open Presence Maker →
             </button>
          </div>
        </div>
      )}

      {/* ===== 2. DAILY PRESENCE MAKER (ATTENDANCE) ===== */}
      {tab === 'attendance' && (
        <div className="space-y-6 animate-fade-in">
          <div className="global-card p-6 shadow-premium-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-surface/30 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-brand-secondary">Daily Presence Maker</h3>
                <p className="text-xs text-warm-400 mt-0.5">{today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
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

            <div className="border border-brand-surface/40 rounded-2xl overflow-hidden shadow-inner">
              <table className="w-full text-sm border-collapse text-left bg-brand-background/25">
                <thead>
                  <tr className="bg-brand-background border-b border-brand-surface/60 text-[10px] uppercase font-bold text-brand-secondary tracking-wider">
                    <th className="py-3 px-5">Student</th>
                    <th className="py-3 px-5">Meal Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-surface/20">
                  {todayStudents.length > 0 ? todayStudents.map(s => (
                    <tr key={s.id} className="hover:bg-brand-background/10 transition-colors">
                      <td className="py-4 px-5 align-middle">
                        <div className="flex flex-col">
                          <span className="font-bold text-brand-secondary">{s.name}</span>
                          <span className="text-[10px] text-warm-400 font-medium">{s.plan} Plan</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${attendanceMap[s.id] ? 'bg-forest-50 text-forest-700 border border-forest-100' : 'bg-terra-50 text-terra-600 border border-terra-100'}`}>
                          {attendanceMap[s.id] ? '✓ KHAAYA' : '✗ NAHI KHAAYA'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button 
                          onClick={() => toggleAttendance(s.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all btn-press ${attendanceMap[s.id] ? 'bg-forest-600 text-white shadow-forest' : 'bg-brand-surface text-warm-400'}`}>
                          <CheckCircle size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="py-12 text-center text-warm-400 text-xs italic">
                        No students joined the mess yet. 
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-warm-500">
                <span className="w-2 h-2 rounded-full bg-forest-500" />
                {presentCount} Present / {todayStudents.length} Total
              </div>
              <button 
                onClick={handleSaveAttendance}
                disabled={isSavingAttendance}
                className={`min-w-[140px] py-4 px-6 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all btn-press ${attendanceSaved ? 'bg-forest-600 text-white' : 'bg-brand-primary text-white shadow-premium-md hover:bg-brand-secondary'}`}>
                {isSavingAttendance ? <Loader2 size={16} className="animate-spin" /> : 
                 attendanceSaved ? <><CheckCircle size={16} /> Saved Successfully</> : 
                 <><Send size={16} /> Update Presence Log</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 3. STUDENT DIRECTORY TAB ===== */}
      {tab === 'students' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-display text-xl font-bold text-brand-secondary">Student Directory</h2>
              <p className="text-xs text-warm-500 mt-1">Manage onboarding list and meal plans.</p>
            </div>
          </div>

          <div className="global-card overflow-hidden">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="bg-brand-background border-b border-brand-surface/60 text-[10px] uppercase font-bold text-brand-secondary tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Plan</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-surface/30">
                {studentsList.length > 0 ? studentsList.map(s => (
                  <tr key={s.id} className="hover:bg-brand-background/10 transition-colors">
                    <td className="py-4 px-6 font-bold text-brand-secondary">{s.name}</td>
                    <td className="py-4 px-6 text-xs text-warm-600">{s.plan} Plan</td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-forest-50 border-forest-100 text-forest-700">ACTIVE</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-warm-400 text-xs italic">No students joined yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== 4. RECHARGE MANAGER TAB ===== */}
      {tab === 'billing' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-brand-secondary">Recharge Manager</h2>
              <p className="text-xs text-warm-500 mt-1">Monitor thali balances and credit student accounts.</p>
            </div>
          </div>

          <div className="global-card overflow-hidden">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="bg-brand-background border-b border-brand-surface/60 text-[10px] uppercase font-bold text-brand-secondary tracking-wider">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Consumed</th>
                  <th className="py-4 px-6">Remaining</th>
                  <th className="py-4 px-6">Overdue (Loan)</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-surface/30">
                {residentThaliData.map(s => (
                  <tr key={s.id} className="hover:bg-brand-background/10 transition-colors">
                    <td className="py-4 px-6 font-bold text-brand-secondary">{s.name}</td>
                    <td className="py-4 px-6 text-xs text-warm-600">{s.consumed} thalis</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className={`font-display font-black ${s.remaining < 10 ? 'text-terra-400' : 'text-brand-primary'}`}>
                          {s.remaining}
                        </span>
                        <div className="w-16 h-1 bg-brand-surface rounded-full overflow-hidden mt-1">
                          <div className={`h-full rounded-full ${s.remaining < 10 ? 'bg-terra-400' : 'bg-brand-accent'}`} style={{ width: `${Math.min(100, Math.max(0, (s.remaining / 60) * 100))}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                       {s.overdue > 0 ? (
                         <div className="flex flex-col">
                           <span className="font-display font-black text-terra-600">{s.overdue} thalis</span>
                           <span className="text-[9px] font-black text-terra-500 uppercase">Outstanding Loan</span>
                         </div>
                       ) : (
                         <span className="text-xs text-warm-400 font-medium whitespace-nowrap">No Overdue ✓</span>
                       )}
                    </td>
                    <td className="py-4 px-6 text-right">
                       <button 
                        onClick={() => setRechargeModal({ show: true, student: s })}
                        className="bg-brand-primary hover:bg-brand-secondary text-white text-[10px] font-bold px-4 py-2 rounded-xl transition-all btn-press shadow-premium-sm flex items-center gap-1.5 ml-auto">
                        <Plus size={12} /> Add Recharge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rechargeModal.show && (
            <div className="fixed inset-0 z-50 bg-brand-secondary/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setRechargeModal({ show: false, student: null })}>
              <div className="bg-white w-full max-w-sm rounded-3xl border border-brand-surface/40 shadow-premium-lg animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-brand-accent/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt size={32} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-brand-secondary">Process Recharge</h3>
                  <p className="text-xs text-warm-500">
                    Add a fresh <span className="font-bold text-brand-primary">60 Thali pack</span> (₹2800) to <span className="font-bold text-brand-secondary">{rechargeModal.student?.name}</span>'s account?
                  </p>
                  <div className="pt-4 flex gap-3">
                    <button onClick={() => setRechargeModal({ show: false, student: null })} 
                      className="flex-1 py-3.5 text-xs font-bold border border-brand-surface rounded-xl text-warm-600 bg-white hover:bg-brand-background transition-colors btn-press">Cancel</button>
                    <button onClick={handleProcessRecharge}
                      disabled={isRecharging}
                      className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold py-3.5 rounded-xl transition-all btn-press shadow-premium-sm flex items-center justify-center">
                      {isRecharging ? <Loader2 size={16} className="animate-spin" /> : 'Confirm'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== 5. MENU SCHEDULE TAB ===== */}
      {tab === 'menu' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-secondary">Menu Schedule Editor</h2>
            <p className="text-xs text-warm-500 mt-1">Provide daily lunch and dinner items to keep students synchronized.</p>
          </div>

          <div className="global-card p-6 border-2 border-brand-accent/30 bg-brand-accent/05">
            <h3 className="font-display text-lg font-bold text-brand-secondary mb-4 flex items-center gap-2">
              <UtensilsCrossed size={20} className="text-brand-primary" />
              Update Today's Special
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-warm-500 font-bold">Lunch / Morning Items</label>
                <input 
                  type="text" 
                  value={todayMenuEntry.breakfast} 
                  onChange={e => setTodayMenuEntry(p => ({ ...p, breakfast: e.target.value }))}
                  placeholder="E.g. Rajma Chawal, Raita"
                  className="w-full bg-white border border-brand-surface rounded-xl px-4 py-3 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-primary" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-warm-500 font-bold">Dinner / Evening Items</label>
                <input 
                  type="text" 
                  value={todayMenuEntry.dinner} 
                  onChange={e => setTodayMenuEntry(p => ({ ...p, dinner: e.target.value }))}
                  placeholder="E.g. Paneer Masala, Roti"
                  className="w-full bg-white border border-brand-surface rounded-xl px-4 py-3 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-primary" 
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={handleSaveMenu}
                disabled={isSavingMenu}
                className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all btn-press flex items-center gap-2 ${menuSaved ? 'bg-forest-600 text-white shadow-premium-sm' : 'bg-brand-primary hover:bg-brand-secondary text-white shadow-premium-md'}`}>
                {isSavingMenu ? <Loader2 size={18} className="animate-spin" /> : (menuSaved ? '✓ Today\'s Menu Updated!' : 'Update Today\'s Menu')}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {DAYS.map(day => (
              <div key={day} className="global-card p-5 space-y-4 hover:border-brand-primary/30 transition-all border-transparent border">
                <p className="font-display text-sm font-bold text-brand-secondary border-b border-brand-surface/30 pb-2 flex justify-between items-center">
                  <span>{day} Menu Schedule</span>
                  <span className="text-[9px] uppercase tracking-wider text-warm-400">Regular Menu</span>
                </p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-warm-400 font-bold">Lunch Items</label>
                    <input 
                      type="text" 
                      value={weeklyMenu[day]?.lunch || ''} 
                      onChange={e => setWeeklyMenu(prev => ({
                        ...prev,
                        [day]: { ...prev[day], lunch: e.target.value }
                      }))}
                      className="w-full bg-brand-background border border-brand-surface rounded-xl px-3 py-2 text-xs text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-warm-400 font-bold">Dinner Items</label>
                    <input 
                      type="text" 
                      value={weeklyMenu[day]?.dinner || ''} 
                      onChange={e => setWeeklyMenu(prev => ({
                        ...prev,
                        [day]: { ...prev[day], dinner: e.target.value }
                      }))}
                      className="w-full bg-brand-background border border-brand-surface rounded-xl px-3 py-2 text-xs text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 flex justify-center">
            <button onClick={handleSaveMenu}
              disabled={isSavingMenu}
              className={`min-w-[300px] py-4 rounded-2xl text-base font-black transition-all btn-press flex items-center justify-center gap-3 border-2 ${menuSaved ? 'bg-forest-600 border-forest-500 text-white shadow-premium-sm' : 'bg-white border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white shadow-premium-md'}`}>
               {isSavingMenu ? <Loader2 size={24} className="animate-spin" /> : (menuSaved ? 'COMPLETE SCHEDULE SAVED ✓' : 'SAVE ALL WEEKLY CHANGES')}
            </button>
          </div>
        </div>
      )}
      {/* ===== 6. MESS PROFILE TAB ===== */}
      {tab === 'settings' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-brand-secondary">Mess Profile Management</h2>
              <p className="text-xs text-warm-500 mt-1">Update how your mess appears to students on the discovery page.</p>
            </div>
            <button 
              onClick={() => setShowOnboarding(true)}
              className="px-4 py-2 bg-brand-surface border border-brand-surface/60 text-brand-secondary hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition-all btn-press shadow-premium-sm flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Store size={16} /> Launch Profile Setup Wizard
            </button>
          </div>

          <div className="global-card p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-2">Mess Name</label>
                  <input 
                    value={messInfo?.messName || ''} 
                    onChange={e => setMessInfo({...messInfo, messName: e.target.value})}
                    placeholder="Enter mess name..."
                    className="w-full bg-white border border-brand-surface rounded-xl px-4 py-3 text-sm focus:border-brand-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-2">Cuisine Type</label>
                  <select 
                    value={messInfo?.cuisine || 'Veg'} 
                    onChange={e => setMessInfo({...messInfo, cuisine: e.target.value})}
                    className="w-full bg-white border border-brand-surface rounded-xl px-4 py-3 text-sm focus:border-brand-primary focus:outline-none"
                  >
                    <option value="Veg">Pure Veg</option>
                    <option value="Non-Veg">Non-Veg Specialty</option>
                    <option value="Both">Both (Veg & Non-Veg)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-2">Monthly Price (₹)</label>
                  <input 
                    type="number"
                    value={messInfo?.monthlyPrice || ''} 
                    onChange={e => setMessInfo({...messInfo, monthlyPrice: e.target.value})}
                    className="w-full bg-white border border-brand-surface rounded-xl px-4 py-3 text-sm focus:border-brand-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-2">City</label>
                  <input 
                    type="text"
                    value={messInfo?.city || ''} 
                    onChange={e => setMessInfo({...messInfo, city: e.target.value})}
                    className="w-full bg-white border border-brand-surface rounded-xl px-4 py-3 text-sm focus:border-brand-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-2">Contact Phone (WhatsApp)</label>
                  <input 
                    type="tel"
                    value={messInfo?.ownerPhone || ''} 
                    onChange={e => setMessInfo({...messInfo, ownerPhone: e.target.value})}
                    className="w-full bg-white border border-brand-surface rounded-xl px-4 py-3 text-sm focus:border-brand-primary focus:outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-2">Public Description</label>
                  <textarea 
                    rows={5}
                    value={messInfo?.description || ''} 
                    onChange={e => setMessInfo({...messInfo, description: e.target.value})}
                    placeholder="Describe your thalis, space, and vibe..."
                    className="w-full bg-white border border-brand-surface rounded-xl px-4 py-3 text-sm focus:border-brand-primary focus:outline-none"
                  />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-2">UPI ID for Payments</label>
                    <input 
                        type="text"
                        value={messInfo?.upiId || ''} 
                        onChange={e => setMessInfo({...messInfo, upiId: e.target.value})}
                        className="w-full bg-white border border-brand-surface rounded-xl px-4 py-3 text-sm focus:border-brand-primary focus:outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-2">Mess Address</label>
                    <input 
                        type="text"
                        value={messInfo?.address || ''} 
                        onChange={e => setMessInfo({...messInfo, address: e.target.value})}
                        className="w-full bg-white border border-brand-surface rounded-xl px-4 py-3 text-sm focus:border-brand-primary focus:outline-none" 
                    />
                </div>
              </div>
            </div>

            {/* Image Management Section */}
            <div className="border-t border-brand-surface/30 pt-8">
                <h3 className="text-sm font-bold text-brand-secondary mb-4 flex items-center gap-2">
                    <ImageIcon size={18} className="text-brand-primary" />
                    Mess Photo Gallery
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                    {messInfo && (messInfo.images || []).map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-brand-surface shadow-premium-sm">
                            <img src={img} alt={`Mess ${idx}`} className="w-full h-full object-cover" />
                            <button 
                                onClick={() => {
                                    const newImgs = [...messInfo.images];
                                    newImgs.splice(idx, 1);
                                    setMessInfo({...messInfo, images: newImgs});
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-terra-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {(messInfo && (!messInfo.images || messInfo.images.length < 5)) && (
                        <div className="aspect-square rounded-2xl border-2 border-dashed border-brand-surface flex flex-col items-center justify-center text-warm-400 p-4">
                            <Plus size={24} className="mb-2" />
                            <span className="text-[10px] font-bold">Add Photo</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <input 
                        type="text" 
                        placeholder="Paste Image URL (e.g., https://example.com/photo.jpg)"
                        value={newImageUrl}
                        onChange={e => setNewImageUrl(e.target.value)}
                        className="flex-1 bg-brand-background border border-brand-surface rounded-xl px-4 py-2.5 text-xs focus:border-brand-primary focus:outline-none"
                    />
                    <button 
                        onClick={() => {
                            if (!newImageUrl || !messInfo) return;
                            const currentImgs = messInfo.images || [];
                            setMessInfo({...messInfo, images: [...currentImgs, newImageUrl]});
                            setNewImageUrl('');
                        }}
                        className="px-6 py-2.5 bg-brand-secondary text-white rounded-xl text-xs font-bold hover:bg-brand-primary transition-colors btn-press"
                    >
                        Add Image
                    </button>
                </div>
                <p className="text-[9px] text-warm-400 mt-2 italic font-medium">Tip: Use Unsplash or Google Photos links for best results. Recommended 1-5 photos.</p>
            </div>

            <div className="pt-6 border-t border-brand-surface/30 flex justify-end">
              <button 
                onClick={async () => {
                  setIsUpdatingProfile(true);
                  try {
                    await messApi.updateMess({ id: messInfo._id, ...messInfo });
                    alert('Profile updated successfully!');
                  } catch (err) {
                    alert('Failed to update profile.');
                  } finally {
                    setIsUpdatingProfile(false);
                  }
                }}
                disabled={isUpdatingProfile}
                className="btn btn-primary btn-md min-w-[200px]"
              >
                {isUpdatingProfile ? <Loader2 className="animate-spin" /> : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </OwnerLayout>
  );
}
