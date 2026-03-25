import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfileEditModal = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    practice_name: profile?.practice_name || '',
    specialization: profile?.specialization || '',
    address: profile?.address || '',
    license_number: profile?.license_number || '',
    phone: profile?.phone || '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        toast.success('Profile updated successfully');
        onClose();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-surface-border bg-surface-bg/30">
          <h2 className="text-xl font-bold text-txt-dark">Edit Practice Profile</h2>
          <button onClick={onClose} className="text-txt-secondary hover:text-txt-dark transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-primary outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-1">Practice / Clinic Name</label>
            <input
              type="text"
              name="practice_name"
              value={formData.practice_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-primary outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-1">License Number</label>
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-primary outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
