import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Star, Shield, MapPin, Calendar, Clock, MessageSquare, Plus } from 'lucide-react';
import { MESS_LIST, DAYS } from '../data';
import BrandLogo from '../components/BrandLogo';
import LoginModal from '../components/LoginModal';

export default function MessDetailsPage() {
  const { id } = useParams();
  const mess = MESS_LIST.find(m => m.id === parseInt(id));

  // State for active menu tab
  const [activeDay, setActiveDay] = useState('Mon');
  
  // State for reviews simulator
  const [reviews, setReviews] = useState(mess ? mess.reviews : []);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  if (!mess) {
    return (
      <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-6 text-center">
        <span className="text-5xl mb-4">⚠️</span>
        <h2 className="font-display text-2xl font-bold text-brand-secondary">Mess Not Found</h2>
        <p className="text-warm-500 mt-2">The tiffin service or mess profile you are trying to visit does not exist.</p>
        <Link to="/discover" className="mt-6 bg-brand-primary text-white px-6 py-3 rounded-xl hover:bg-brand-secondary transition-colors btn-press shadow-premium-md">
          Go Back to Search
        </Link>
      </div>
    );
  }

  // Get similar mess recommendations in same city
  const recommendations = MESS_LIST.filter(m => m.id !== mess.id).slice(0, 2);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    const added = {
      name: newReview.name,
      rating: parseInt(newReview.rating),
      text: newReview.text,
      date: 'Just now'
    };
    setReviews([added, ...reviews]);
    setNewReview({ name: '', rating: 5, text: '' });
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen bg-brand-background pb-24 grain-overlay">
      {/* Standardized Navbar Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-background/90 backdrop-blur-md border-b border-brand-surface/40 shadow-premium-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/discover" className="text-warm-500 hover:text-brand-primary transition-colors p-1.5 rounded-full hover:bg-brand-surface/50 flex items-center gap-1">
              <ChevronLeft size={20} />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Back to Search</span>
            </Link>
          </div>
          <BrandLogo variant="full" size="navbar" />
          <div className="flex items-center gap-7 text-sm font-medium text-warm-600">
            <Link to="/discover" className="hover:text-brand-primary transition-colors">Find a Mess</Link>
            <button onClick={() => setLoginOpen(true)} className="btn btn-primary btn-md">Login</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32">
        {/* Title and Hero Metadata */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-accent/20 text-brand-primary border border-brand-accent/40 uppercase tracking-wider">Top Choice</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-secondary leading-tight tracking-tight">{mess.name}</h1>
          
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
            <span className="flex items-center gap-1 font-bold text-brand-secondary bg-white px-3 py-1 rounded-full border border-brand-surface/60 shadow-premium-sm">
              <Star size={13} fill="currentColor" className="text-brand-accent" /> {mess.rating}
              <span className="text-warm-400 font-normal">({reviews.length} reviews)</span>
            </span>
            <span className="font-semibold px-3 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest-700 flex items-center gap-1">
              <Shield size={12} /> Hygiene: {mess.hygiene} Grade
            </span>
            <span className={`font-semibold px-3 py-1 rounded-full ${mess.cuisine === 'Veg' ? 'bg-forest-50 border border-forest-100 text-forest-700' : mess.cuisine === 'Non-Veg' ? 'bg-terra-50 border border-terra-100 text-terra-500' : 'bg-brand-surface border border-brand-accent/20 text-brand-primary'}`}>{mess.cuisine}</span>
            <span className="text-warm-500 flex items-center gap-1 ml-1"><MapPin size={14} className="text-brand-accent" /> {mess.distance} away • {mess.city}</span>
          </div>
        </div>

        {/* Gallery Grid Section (Airbnb Style - 5 images) */}
        <div className="grid grid-cols-4 gap-3 h-80 sm:h-96 mb-10 overflow-hidden rounded-3xl border border-brand-surface/40">
          <div className="col-span-2 relative overflow-hidden group cursor-pointer">
            <img src="/mess-1.jpg" alt="Main Dining Hall" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-350" />
            <span className="absolute bottom-4 left-4 bg-brand-secondary/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-semibold">Main Dining Hall</span>
          </div>
          <div className="col-span-1 flex flex-col gap-3">
            <div className="flex-1 relative overflow-hidden group cursor-pointer">
              <img src="/mess-2.jpg" alt="Kitchen Area" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-350" />
              <span className="absolute bottom-2 left-2 bg-brand-secondary/80 text-[10px] text-white px-2 py-0.5 rounded-full backdrop-blur-sm font-semibold">Kitchen Area</span>
            </div>
            <div className="flex-1 relative overflow-hidden group cursor-pointer">
              <img src="/mess-3.jpg" alt="Fresh Ingredients" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-350" />
              <span className="absolute bottom-2 left-2 bg-brand-secondary/80 text-[10px] text-white px-2 py-0.5 rounded-full backdrop-blur-sm font-semibold">Fresh Ingredients</span>
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-3">
            <div className="flex-1 relative overflow-hidden group cursor-pointer">
              <img src="/mess-4.jpg" alt="Standard Thali Plate" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-350" />
              <span className="absolute bottom-2 left-2 bg-brand-secondary/80 text-[10px] text-white px-2 py-0.5 rounded-full backdrop-blur-sm font-semibold">Homely Thali</span>
            </div>
            <div className="flex-1 relative overflow-hidden group cursor-pointer">
              <img src="/mess-5.jpg" alt="Dining Tables" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-350" />
              <span className="absolute bottom-2 left-2 bg-brand-secondary/80 text-[10px] text-white px-2 py-0.5 rounded-full backdrop-blur-sm font-semibold">Dining Seating</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Left: Menu & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="global-card p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-brand-secondary mb-3">About the Mess</h3>
              <p className="text-warm-600 text-sm leading-relaxed">{mess.description}</p>
              
              <div className="mt-6 pt-5 border-t border-brand-surface/30 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-warm-400 font-medium">Owner</p>
                  <p className="text-brand-secondary font-semibold mt-0.5">{mess.ownerName}</p>
                </div>
                <div>
                  <p className="text-warm-400 font-medium">Phone Support</p>
                  <p className="text-brand-secondary font-semibold mt-0.5">{mess.phone}</p>
                </div>
                <div>
                  <p className="text-warm-400 font-medium">Billing Period</p>
                  <p className="text-brand-secondary font-semibold mt-0.5">Monthly Cycle</p>
                </div>
              </div>
            </div>

            {/* Weekly Menu Planner */}
            <div className="global-card p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-xl font-bold text-brand-secondary flex items-center gap-2">
                  <Calendar size={20} className="text-brand-accent" /> Weekly Meal Menu
                </h3>
                <span className="text-xs text-warm-500 font-medium bg-brand-background px-3 py-1 rounded-full border border-brand-surface/60">Updated Weekly</span>
              </div>

              {/* Day Selection Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-2 border-b border-brand-surface/30">
                {DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all btn-press shrink-0 ${activeDay === day ? 'bg-brand-primary text-white shadow-premium-sm' : 'text-warm-500 hover:text-brand-primary hover:bg-brand-surface/30'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="border border-brand-surface/40 rounded-2xl p-5 bg-brand-background/40 relative">
                  <div className="absolute top-4 right-4 bg-brand-accent/20 text-brand-primary p-1.5 rounded-full"><Clock size={14} /></div>
                  <h4 className="text-[9px] text-warm-500 uppercase tracking-wider font-semibold">Lunch / Morning Meal</h4>
                  <p className="text-sm font-semibold text-brand-secondary mt-2">{mess.weeklyMenu[activeDay]?.lunch || 'Simple homely lunch thali'}</p>
                </div>
                <div className="border border-brand-surface/40 rounded-2xl p-5 bg-brand-background/40 relative">
                  <div className="absolute top-4 right-4 bg-brand-accent/20 text-brand-primary p-1.5 rounded-full"><Clock size={14} /></div>
                  <h4 className="text-[9px] text-warm-500 uppercase tracking-wider font-semibold">Dinner / Evening Meal</h4>
                  <p className="text-sm font-semibold text-brand-secondary mt-2">{mess.weeklyMenu[activeDay]?.dinner || 'Simple homely dinner thali'}</p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="global-card p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-xl font-bold text-brand-secondary flex items-center gap-2">
                  <MessageSquare size={20} className="text-brand-accent" /> Customer Reviews
                </h3>
                {!showReviewForm && (
                  <button onClick={() => setShowReviewForm(true)} className="text-xs font-semibold text-brand-primary flex items-center gap-1 hover:text-brand-secondary transition-colors">
                    <Plus size={14} /> Write a Review
                  </button>
                )}
              </div>

              {/* Zomato-style Rating Breakdown Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-brand-surface/30 pb-6 mb-6">
                <div className="text-center sm:border-r sm:border-brand-surface/30 sm:pr-8">
                  <p className="text-5xl font-display font-extrabold text-brand-secondary">{mess.rating}</p>
                  <div className="flex items-center gap-0.5 text-brand-accent mt-2 justify-center">
                    {[...Array(5)].map((_, j) => <Star key={j} size={15} fill={j < Math.floor(mess.rating) ? "currentColor" : "none"} />)}
                  </div>
                  <p className="text-xs text-warm-400 mt-1.5">Out of 5 stars</p>
                </div>
                <div className="flex-1 w-full space-y-2 text-xs text-warm-600">
                  {[
                    { stars: 5, pct: '75%' },
                    { stars: 4, pct: '15%' },
                    { stars: 3, pct: '8%' },
                    { stars: 2, pct: '2%' },
                    { stars: 1, pct: '0%' }
                  ].map(item => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="w-12 text-right font-medium">{item.stars} Stars</span>
                      <div className="flex-1 h-2 bg-brand-surface rounded-full overflow-hidden">
                        <div className="h-full bg-brand-accent rounded-full" style={{ width: item.pct }} />
                      </div>
                      <span className="w-8 text-left text-warm-400">{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Input Box (Simulator) */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className="border border-brand-surface/60 rounded-2xl p-5 bg-brand-background/40 mb-6 space-y-4 animate-scale-in">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={newReview.name}
                        onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                        className="w-full bg-white border border-brand-surface rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-1">Rating</label>
                      <select
                        value={newReview.rating}
                        onChange={e => setNewReview({ ...newReview, rating: e.target.value })}
                        className="w-full bg-white border border-brand-surface rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-transparent"
                      >
                        {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-warm-500 tracking-wider mb-1">Review Comments</label>
                    <textarea
                      required
                      rows={3}
                      value={newReview.text}
                      onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                      className="w-full bg-white border border-brand-surface rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowReviewForm(false)} className="text-xs font-semibold px-4 py-2 border border-brand-surface rounded-xl text-warm-600 bg-white hover:bg-brand-surface/40 transition-colors btn-press">Cancel</button>
                    <button type="submit" className="text-xs font-semibold px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-colors btn-press shadow-premium-sm">Submit Review</button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="premium-card rounded-2xl p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1 text-brand-accent mb-2">
                        {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={j < r.rating ? "currentColor" : "none"} className={j < r.rating ? "" : "text-brand-surface"} />)}
                      </div>
                      <span className="text-[10px] text-warm-400 font-medium">{r.date}</span>
                    </div>
                    <p className="text-sm text-warm-700 italic leading-relaxed">"{r.text}"</p>
                    <p className="text-xs font-semibold text-brand-secondary mt-3">— {r.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Mess Recommendations */}
            <div className="global-card p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-brand-secondary mb-6">Similar Mess Recommendations</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {recommendations.map(rec => (
                  <Link key={rec.id} to={`/messes/${rec.id}`} className="block global-card-hover overflow-hidden bg-brand-background/35">
                    <div className="h-28 bg-gradient-to-tr from-brand-surface to-brand-background relative flex items-center justify-center border-b border-brand-surface/20">
                      <span className="text-3xl">🍲</span>
                      <div className="absolute top-2 right-2 bg-white/90 shadow-premium-sm px-2.5 py-0.5 rounded-full flex items-center gap-0.5 text-[10px] font-bold text-brand-secondary">
                        <Star size={11} fill="currentColor" className="text-brand-accent" /> {rec.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-display font-bold text-base text-brand-secondary truncate">{rec.name}</h4>
                      <p className="text-[10px] text-warm-500 mt-1 flex items-center gap-0.5"><MapPin size={10} /> {rec.distance} away • {rec.city}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="font-display font-extrabold text-sm text-brand-primary">₹{rec.price.toLocaleString()}<span className="text-[10px] font-body text-warm-500 font-normal">/mo</span></p>
                        <span className="text-[10px] font-bold text-brand-primary bg-white px-2.5 py-1 rounded-lg border border-brand-surface/60 transition-colors">View Details</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Sticky Pricing Details Card */}
          <div className="lg:col-span-1">
            <div className="global-card p-6 shadow-premium-lg sticky top-24 space-y-6">
              <div>
                <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Monthly Subscription Rate</span>
                <p className="font-display text-3xl font-black text-brand-primary mt-1">₹{mess.price.toLocaleString()}<span className="text-sm font-body text-warm-500 font-normal"> / mo</span></p>
              </div>

              {/* Bullet Features */}
              <ul className="space-y-3.5 text-xs text-warm-600 pt-4 border-t border-brand-surface/40">
                <li className="flex items-center gap-2"><span className="text-forest-600 font-bold">✓</span> Morning &amp; Evening Meals Included</li>
                <li className="flex items-center gap-2"><span className="text-forest-600 font-bold">✓</span> Skip Meals to Earn Account Credits</li>
                <li className="flex items-center gap-2"><span className="text-forest-600 font-bold">✓</span> Live attendance calendar log</li>
                <li className="flex items-center gap-2"><span className="text-forest-600 font-bold">✓</span> One-click direct WhatsApp invoice share</li>
              </ul>

              {/* CTA Button */}
              <button onClick={() => setLoginOpen(true)} className="block w-full bg-brand-primary text-white font-semibold py-4 rounded-xl text-center transition-all duration-300 hover:bg-brand-secondary btn-press shadow-premium-md hover:shadow-premium-lg text-base">
                Join This Mess
              </button>

              <div className="text-center pt-2">
                <p className="text-[10px] text-warm-400">Join request will be sent to the owner ({mess.ownerName}) for immediate onboarding verification.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
