import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ClipboardList, CreditCard, MessageCircle, Users, CalendarCheck, Receipt, Share2, Star, ChevronRight, Menu, X } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import LoginModal from '../components/LoginModal';

function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count}</span>;
}

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-background/90 backdrop-blur-md border-b border-brand-surface/40 shadow-premium-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          <BrandLogo variant="full" size="navbar" />

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-warm-600">
            <Link to="/discover" className="hover:text-brand-primary transition-colors">Find a Mess</Link>
            <a href="#for-owners" className="hover:text-brand-primary transition-colors">For Owners</a>
            <a href="#how-it-works" className="hover:text-brand-primary transition-colors">How It Works</a>
            <button onClick={() => setLoginOpen(true)} className="btn btn-primary btn-md">Login</button>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-warm-700 p-1"><Menu size={24} /></button>
        </div>
        {mobileMenu && (
          <div className="md:hidden absolute top-0 left-0 right-0 bg-brand-background border-b border-brand-surface p-6 animate-fade-in z-50 shadow-premium-md">
            <div className="flex justify-between items-center mb-6">
              <BrandLogo variant="full" size="navbar" linked={false} />
              <button onClick={() => setMobileMenu(false)}><X size={24} className="text-warm-700" /></button>
            </div>
            <div className="flex flex-col gap-4 text-base font-medium text-warm-700">
              <Link to="/discover" onClick={() => setMobileMenu(false)} className="hover:text-brand-primary transition-colors">Find a Mess</Link>
              <a href="#for-owners" onClick={() => setMobileMenu(false)} className="hover:text-brand-primary transition-colors">For Owners</a>
              <button onClick={() => { setMobileMenu(false); setLoginOpen(true); }} className="btn btn-primary btn-md w-full">Login</button>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden grain-overlay">
        {/* Subtle, highly sophisicated background decorative elements */}
        <div className="absolute -top-20 -right-32 w-[500px] h-[500px] bg-brand-surface/30 animate-blob opacity-20 pointer-events-none z-0" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-brand-surface/20 animate-blob opacity-20 pointer-events-none z-0" style={{ animationDelay: '4s' }} />

        <div className="grain-content max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-brand-secondary leading-[1.1] animate-fade-in-up">
                Ghar jaisa khana,<br /><span className="text-brand-primary accent-underline">ab ghar se door bhi.</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-warm-600 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up delay-200">
                Find trusted mess &amp; tiffin services near you. Track your meals. Pay without disputes.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
                <Link to="/discover" className="btn btn-primary btn-lg">
                  Find a Mess Near Me
                </Link>
                <Link to="/owner" className="btn btn-secondary btn-lg">
                  I'm a Mess Owner
                </Link>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="flex-shrink-0 animate-fade-in-up delay-400">
              <div className="animate-float">
                <div className="w-[260px] h-[500px] bg-brand-secondary rounded-[40px] p-3 shadow-[0_25px_60px_-15px_rgba(71,54,45,0.2)] relative border border-brand-primary/10">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-brand-secondary rounded-b-2xl z-10" />
                  <div className="w-full h-full bg-brand-background rounded-[30px] overflow-hidden flex flex-col">
                    <div className="bg-brand-primary px-4 pt-10 pb-4 shadow-sm">
                      <p className="text-white/70 text-xs font-body">Today's Lunch</p>
                      <p className="text-white font-display text-lg font-bold mt-1">Dal Makhani, Roti</p>
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      <div className="flex gap-2">
                        <div className="flex-1 bg-forest-500 text-white rounded-xl py-3 text-center text-sm font-semibold shadow-premium-sm">✓ Khaaya</div>
                        <div className="flex-1 bg-white text-warm-500 rounded-xl py-3 text-center text-sm font-semibold border border-brand-surface/60 shadow-premium-sm">✗ Skip</div>
                      </div>
                      <div className="bg-white border border-brand-surface rounded-xl p-3 mt-1 shadow-premium-sm">
                        <p className="text-xs text-warm-500">This month</p>
                        <p className="font-display font-bold text-brand-secondary text-lg mt-0.5">18/24 meals</p>
                        <div className="mt-2 h-2 bg-brand-surface rounded-full overflow-hidden"><div className="h-full bg-brand-accent rounded-full" style={{ width: '75%' }} /></div>
                      </div>
                      <div className="bg-white border border-brand-surface rounded-xl p-3 shadow-premium-sm">
                        <p className="text-xs text-warm-500">Amount due</p>
                        <p className="font-display font-bold text-forest-600 text-xl mt-0.5">₹2,100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM SECTION ===== */}
      <section className="py-20 md:py-28 bg-brand-surface border-t border-brand-primary/05">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-brand-secondary animate-fade-in-up">Sound familiar?</h2>

          <p className="text-center text-warm-500 mt-3 mb-6 text-lg">Yeh problems har student aur har mess owner ko hoti hain.</p>
          <div className="mt-6 mb-10 text-center">
            <span className="inline-block bg-white text-brand-primary border border-brand-primary/10 shadow-premium-sm text-xs tracking-wider uppercase font-semibold px-4 py-1.5 rounded-full">For Students</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Star size={22} />, title: '"Suna toh tha achha hai..."', desc: 'No proper reviews, no photos, no way to know if the mess is actually good before joining.' },
              { icon: <MessageCircle size={22} />, title: 'WhatsApp pe message kiya...', desc: 'No reply from mess owner. Group mein 50 messages. Important info dub jaata hai.' },
              { icon: <CreditCard size={22} />, title: 'Month-end bill mein confusion', desc: '"Maine toh 3 din skip kiya tha!" — but no proof. Billing disputes every month.' },
            ].map((card, i) => (
              <div key={i} className={`rounded-2xl p-7 card-hover animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="w-12 h-12 bg-brand-background border border-brand-surface rounded-xl flex items-center justify-center text-brand-primary mb-5 shadow-premium-sm relative">
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-accent rounded-full" />
                  {card.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-brand-secondary leading-snug">{card.title}</h3>
                <p className="mt-2.5 text-warm-600 text-[14px] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 mb-10 text-center" id="for-owners">
            <span className="inline-block bg-white text-forest-700 border border-forest-600/10 shadow-premium-sm text-xs tracking-wider uppercase font-semibold px-4 py-1.5 rounded-full">For Mess Owners</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <ClipboardList size={22} />, title: 'Paper register kho jaata hai', desc: 'Attendance records lost. No backup. Month-end pe counting mein galti hoti hai.' },
              { icon: <Users size={22} />, title: 'Students batate nahi skip kiya', desc: 'Pata hi nahi chalta kaun aaya kaun nahi. Bill time pe arguments.' },
              { icon: <Receipt size={22} />, title: 'Billing ke time jhagda', desc: 'Students disagree with bill. No transparent system. Trust issues build up.' },
            ].map((card, i) => (
              <div key={i} className={`rounded-2xl p-7 card-hover animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="w-12 h-12 bg-forest-50 border border-brand-surface rounded-xl flex items-center justify-center text-forest-700 mb-5 shadow-premium-sm relative">
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-forest-400 rounded-full" />
                  {card.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-brand-secondary leading-snug">{card.title}</h3>
                <p className="mt-2.5 text-warm-600 text-[14px] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 md:py-28 bg-brand-background relative grain-overlay border-t border-brand-primary/05">
        <div className="grain-content max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-brand-secondary animate-fade-in-up">How ZEVAN works</h2>
          <p className="text-center text-warm-500 mt-3 text-lg">Simple for everyone. 3 taps, done.</p>

          <div className="mt-14 grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Student side */}
            <div className="animate-fade-in-up delay-200 bg-white/40 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-brand-surface/60 shadow-premium-sm">
              <h3 className="font-display text-xl font-bold text-brand-primary mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center text-sm shadow-premium-sm">🎓</span> For Students
              </h3>
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Discover', desc: 'Browse mess options near you with menus, reviews, and hygiene scores.' },
                  { step: '2', title: 'Join', desc: 'Pick your mess. Select lunch, dinner, or both. Done.' },
                  { step: '3', title: 'Track', desc: 'Mark "Khaaya" or "Skip" daily. Your attendance = your bill.' },
                  { step: '4', title: 'Pay', desc: 'Transparent billing. No disputes. Pay only for what you eat.' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-9 h-9 bg-brand-background text-brand-primary border border-brand-primary/10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-premium-sm">{s.step}</div>
                    <div>
                      <h4 className="font-semibold text-brand-secondary leading-normal">{s.title}</h4>
                      <p className="text-sm text-warm-600 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Owner side */}
            <div className="animate-fade-in-up delay-400 bg-white/40 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-brand-surface/60 shadow-premium-sm">
              <h3 className="font-display text-xl font-bold text-forest-700 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-forest-50 rounded-lg flex items-center justify-center text-sm shadow-premium-sm">👨‍🍳</span> For Mess Owners
              </h3>
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Add Students', desc: 'Add students with name and phone. Takes 10 seconds.' },
                  { step: '2', title: 'Mark Attendance', desc: 'Toggle switches for each student. Default: present. Mark absences.' },
                  { step: '3', title: 'Auto Bill', desc: 'Bills calculated automatically. No manual counting.' },
                  { step: '4', title: 'Share on WhatsApp', desc: 'Send bills directly via WhatsApp. One tap.' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-9 h-9 bg-forest-50 text-forest-700 border border-forest-600/10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-premium-sm">{s.step}</div>
                    <div>
                      <h4 className="font-semibold text-brand-secondary leading-normal">{s.title}</h4>
                      <p className="text-sm text-warm-600 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="py-24 md:py-32 bg-brand-surface border-t border-brand-primary/05">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="animate-fade-in-up">
            <p className="text-6xl sm:text-7xl font-display font-extrabold tracking-tight text-brand-primary"><CountUp end={247} /><span className="text-brand-accent font-light">+</span></p>
            <p className="mt-3 text-warm-500 text-lg tracking-wide">mess owners trust ZEVAN</p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sunita Devi', role: 'Annapurna Tiffin, Indore', initials: 'SD', text: '"Pehle register mein attendance likhte the. Ab phone pe 2 minute mein ho jaata hai. Billing ke time koi jhagda nahi."' },
              { name: 'Rahul Sharma', role: 'Student, MIT Pune', initials: 'RS', text: '"Mujhe pata rehta hai aaj menu mein kya hai, kitne meals liye, kitna pay karna hai. Simple and clear."' },
              { name: 'Farid Khan', role: 'Ghar Ka Swad, Bhopal', initials: 'FK', text: '"WhatsApp pe bill bhejne ka feature kamaal hai. Students ko bill milta hai, payment time pe aati hai."' },
            ].map((t, i) => (
              <div key={i} className={`premium-card rounded-2xl p-8 text-left animate-fade-in-up delay-${(i + 1) * 200}`}>
                <div className="flex items-center gap-1 mb-5 text-brand-accent">{[...Array(5)].map((_, j) => <Star key={j} size={15} fill="currentColor" />)}</div>
                <p className="text-warm-700 text-[15px] leading-relaxed">{t.text}</p>
                <div className="mt-6 pt-5 border-t border-brand-surface flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-surface border border-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-premium-sm">{t.initials}</div>
                  <div>
                    <p className="font-semibold text-brand-secondary text-sm">{t.name}</p>
                    <p className="text-warm-500 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 md:py-28 footer-gradient relative overflow-hidden border-t border-brand-primary/05">
        <div className="grain-content max-w-3xl mx-auto px-6 sm:px-8 text-center relative z-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white animate-fade-in-up">Ghar jaisa bharosa.</h2>
          <p className="mt-4 text-white/70 text-lg animate-fade-in-up delay-100">Join the mess revolution. Whether you eat or you serve — ZEVAN makes it better.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up delay-200">
            <Link to="/discover" className="btn btn-lg bg-white text-brand-primary border border-white hover:bg-brand-surface">Find a Mess</Link>
            <Link to="/owner" className="btn btn-lg border border-white/40 text-white hover:bg-white/10">Register as Owner</Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer-gradient py-14 text-white/60 relative overflow-hidden border-t border-white/05">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
            <div>
              <BrandLogo variant="full" size="footer" inverted={true} linked={false} />
              <p className="mt-3 text-sm text-white/50">Ghar jaisa bharosa.</p>
            </div>
            <div>
              <p className="font-semibold text-white/90 text-sm mb-4 tracking-wide uppercase">Product</p>
              <div className="space-y-2.5 text-sm">
                <Link to="/discover" className="block hover:text-brand-accent transition-colors">Find a Mess</Link>
                <Link to="/owner" className="block hover:text-brand-accent transition-colors">For Owners</Link>
                <Link to="/student" className="block hover:text-brand-accent transition-colors">For Students</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white/90 text-sm mb-4 tracking-wide uppercase">Company</p>
              <div className="space-y-2.5 text-sm">
                <a href="#" className="block hover:text-brand-accent transition-colors">About</a>
                <a href="#" className="block hover:text-brand-accent transition-colors">Contact</a>
                <a href="#" className="block hover:text-brand-accent transition-colors">Careers</a>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white/90 text-sm mb-4 tracking-wide uppercase">Legal</p>
              <div className="space-y-2.5 text-sm">
                <a href="#" className="block hover:text-brand-accent transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-brand-accent transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/10 text-center text-sm text-white/40">
            Made with ❤️ for students away from home &nbsp;•&nbsp; © 2026 ZEVAN
          </div>
        </div>
      </footer>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
