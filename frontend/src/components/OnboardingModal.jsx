import { useState, useEffect } from 'react';
import { X, Store, Info, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';
import { messApi } from '../services/messApi';
import { useAuth } from '../contexts/AuthContext';

export default function OnboardingModal({ isOpen, onClose, messId, initialData, onComplete }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cuisine: initialData?.cuisine || 'Veg',
    description: initialData?.description || '',
    images: initialData?.images || []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        cuisine: initialData.cuisine || 'Veg',
        description: initialData.description || '',
        images: initialData.images || []
      });
    }
  }, [initialData]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      let response;
      if (messId) {
        response = await messApi.updateMess({
          id: messId,
          ...formData
        });
      } else {
        // If no mess exists, create a basic one with the onboarding data
        response = await messApi.createMess({
          messName: `${user?.name || 'My'}'s Mess`,
          address: 'Update Address in Profile',
          upiId: 'notset@upi',
          ownerPhone: '0000000000',
          monthlyPrice: 2800,
          ...formData
        });
      }

      if (response && response.success) {
        onComplete(response.mess);
        onClose();
      }
    } catch (err) {
      console.error('Failed to save mess:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-secondary/40 backdrop-blur-sm">
      <div className="global-card w-full max-w-lg p-0 overflow-hidden animate-scale-in bg-white shadow-premium-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-surface/30 bg-brand-primary text-white">
          <div className="flex items-center gap-2">
            <Store size={20} />
            <h2 className="font-display font-bold">Complete Your Mess Profile</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="flex justify-between mb-8">
              {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-brand-primary text-white' : 'bg-brand-surface text-warm-400'}`}>
                          {step > s ? <CheckCircle size={16} /> : s}
                      </div>
                      {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-brand-primary' : 'bg-brand-surface'}`} />}
                  </div>
              ))}
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-brand-secondary mb-2">Cuisine Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Veg', 'Non-Veg', 'Both'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, cuisine: type })}
                      className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${formData.cuisine === type ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-brand-surface text-warm-500 hover:border-brand-accent/40'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setStep(2)} className="btn btn-primary btn-md">Next Step</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-brand-secondary mb-2">Describe Your Mess</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell students about your specialty dishes, hygiene standards, and atmosphere..."
                  rows={4}
                  className="w-full bg-brand-background border border-brand-surface rounded-xl px-4 py-3 text-sm focus:border-brand-primary focus:outline-none"
                />
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="btn btn-secondary btn-md">Back</button>
                <button onClick={() => setStep(3)} className="btn btn-primary btn-md" disabled={!formData.description.trim()}>Next Step</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-brand-secondary mb-2">Add Mess Photos</label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Paste Image URL (e.g. from Unsplash)"
                      id="new-onboard-img"
                      className="flex-1 bg-brand-background border border-brand-surface rounded-xl px-4 py-2 text-xs focus:border-brand-primary focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                        const val = document.getElementById('new-onboard-img').value;
                        if(val) {
                          setFormData({...formData, images: [...formData.images, val]});
                          document.getElementById('new-onboard-img').value = '';
                        }
                      }}
                      className="px-4 py-2 bg-brand-secondary text-white rounded-xl text-[10px] font-bold"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-brand-surface">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => {
                            const n = [...formData.images];
                            n.splice(i, 1);
                            setFormData({...formData, images: n});
                          }}
                          className="absolute top-1 right-1 p-1 bg-terra-500 text-white rounded-full"
                        >
                          <X size={8} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {formData.images.length === 0 && (
                    <div className="border-2 border-dashed border-brand-surface rounded-2xl p-6 text-center">
                       <p className="text-[10px] text-warm-400">No images added. Default photos will be used.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="btn btn-secondary btn-md">Back</button>
                <button onClick={handleUpdate} disabled={isLoading} className="btn btn-primary btn-md flex items-center gap-2">
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle size={16} /> Complete Setup</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
