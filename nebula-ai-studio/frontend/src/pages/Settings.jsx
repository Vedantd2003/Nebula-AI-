import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiUser, FiCreditCard, FiShield } from 'react-icons/fi';
import { authAPI, subscriptionAPI } from '../services/api';
import { useAuthStore } from '../store';

function Settings() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const { data: plansData } = useQuery({
    queryKey: ['plans'],
    queryFn: () => subscriptionAPI.getPlans(),
  });

  const plans = plansData?.data?.data?.plans || {};

  const updateProfileMutation = useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: (response) => {
      updateUser(response.data.data.user);
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: subscriptionAPI.subscribe,
    onSuccess: () => {
      toast.success('Subscription updated successfully');
      window.location.reload();
    },
    onError: () => {
      toast.error('Failed to update subscription');
    },
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handleSubscribe = (tier) => {
    subscribeMutation.mutate({ tier });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold gradient-text mb-2">Settings</h1>
        <p className="text-dark-600">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/10">
        {[
          { id: 'profile', icon: FiUser, label: 'Profile' },
          { id: 'subscription', icon: FiCreditCard, label: 'Subscription' },
          { id: 'security', icon: FiShield, label: 'Security' },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-nebula-500 text-white'
                  : 'border-transparent text-dark-600 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="input-nebula"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="input-nebula"
              />
            </div>
            <button type="submit" className="btn-neon">
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Current Plan</h2>
            <p className="text-dark-600 mb-6">
              You are currently on the <span className="text-nebula-400 font-semibold capitalize">{user?.subscription?.tier}</span> plan
            </p>
            <div className="p-4 bg-dark-100/50 rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-dark-700">Credits</span>
                <span className="text-white font-semibold">{user?.credits?.remaining} / {user?.credits?.total}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(plans).map(([tier, details]) => (
              <div key={tier} className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-2 capitalize">{tier}</h3>
                <div className="text-3xl font-bold gradient-text mb-4">
                  ${details.price}
                  <span className="text-sm text-dark-600">/mo</span>
                </div>
                <div className="mb-6">
                  <div className="text-dark-700 mb-2">{details.credits} credits/month</div>
                </div>
                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={user?.subscription?.tier === tier}
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                    user?.subscription?.tier === tier
                      ? 'bg-dark-200 text-dark-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-nebula-600 to-cosmic-600 text-white hover:shadow-neon'
                  }`}
                >
                  {user?.subscription?.tier === tier ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
          <div className="space-y-4">
            <button className="w-full px-6 py-4 glass hover:bg-white/10 text-white rounded-xl transition-all text-left">
              <div className="font-semibold mb-1">Change Password</div>
              <div className="text-sm text-dark-500">Update your password regularly</div>
            </button>
            <button className="w-full px-6 py-4 glass hover:bg-white/10 text-white rounded-xl transition-all text-left">
              <div className="font-semibold mb-1">Two-Factor Authentication</div>
              <div className="text-sm text-dark-500">Add an extra layer of security</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
