import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, MapPin, Store, ChevronRight, ArrowRight } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const Logo = () => (
  <div className="flex flex-col items-center justify-center mb-10">
    <BrandLogo variant="full" size="lg" linked={false} className="mb-2" />
    <p className="text-xs font-body tracking-[0.3em] text-[#A67E60] uppercase mt-2">Ghar Jaisa Bharosa</p>
  </div>
);

const OptionCard = ({ icon: Icon, title, description, onClick, isHovered, onHover, onLeave, index }) => (
  <div 
    className={`relative overflow-hidden cursor-pointer transition-all duration-500 ease-out p-6 rounded-2xl flex flex-col h-full bg-white border border-[var(--color-brand-surface)]
      ${isHovered ? 'shadow-xl -translate-y-2 scale-[1.02] border-[var(--color-brand-accent)]' : 'shadow-sm'}
    `}
    onClick={onClick}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Background accent that slides up on hover */}
    <div 
      className={`absolute inset-0 bg-gradient-to-br from-[var(--color-brand-accent)]/10 to-transparent transition-transform duration-500 ease-out origin-bottom
        ${isHovered ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}
      `}
    />
    
    <div className="relative z-10 flex flex-col h-full">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors duration-300
        ${isHovered ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-[var(--color-brand-surface)] text-[var(--color-brand-secondary)]'}
      `}>
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="text-xl font-display font-medium text-[var(--color-brand-secondary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--color-warm-500)] text-sm leading-relaxed flex-grow">
        {description}
      </p>
      
      <div className={`mt-6 flex items-center text-sm font-medium transition-colors duration-300
        ${isHovered ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-warm-400)]'}
      `}>
        <span>Continue</span>
        <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
      </div>
    </div>
  </div>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleSelection = (path) => {
    // Navigate to the respective dashboard or flow
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-6 relative overflow-hidden grain-overlay">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[var(--color-brand-surface)] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-[var(--color-brand-accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="w-full max-w-4xl z-10 animate-fade-in-up">
        <Logo />
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display text-[var(--color-brand-secondary)] mb-3">Welcome to Zevan</h2>
          <p className="text-[var(--color-warm-600)]">How would you like to continue today?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="animate-fade-in-up delay-100">
            <OptionCard 
              index={1}
              icon={MapPin}
              title="Find a Mess Nearby"
              description="Discover the best homemade food options in your area. Browse menus, read reviews, and subscribe to a mess."
              onClick={() => handleSelection('/discover')}
              isHovered={hoveredCard === 'customer'}
              onHover={() => setHoveredCard('customer')}
              onLeave={() => setHoveredCard(null)}
            />
          </div>

          <div className="animate-fade-in-up delay-200">
            <OptionCard 
              index={2}
              icon={Store}
              title="Login as Mess Owner"
              description="Manage your mess, update menus, track subscriptions, and grow your customer base with our tools."
              onClick={() => handleSelection('/owner')}
              isHovered={hoveredCard === 'owner'}
              onHover={() => setHoveredCard('owner')}
              onLeave={() => setHoveredCard(null)}
            />
          </div>
        </div>
        
        <div className="mt-12 text-center animate-fade-in-up delay-300">
          <p className="text-sm text-[var(--color-warm-400)]">
            By continuing, you agree to our <a href="#" className="underline hover:text-[var(--color-brand-primary)] transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-[var(--color-brand-primary)] transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
