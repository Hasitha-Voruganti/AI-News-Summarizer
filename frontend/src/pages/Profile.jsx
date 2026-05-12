import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, userAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import {
  FiUser, FiMail, FiSun, FiMoon, FiMonitor,
  FiBookmark, FiClock, FiLock, FiSave, FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CATEGORIES = ['general', 'technology', 'business', 'entertainment', 'health', 'science', 'sports'];
const THEMES = [
  { value: 'light', label: 'Light', icon: FiSun },
  { value: 'dark', label: 'Dark', icon: FiMoon },
  { value: 'system', label: 'System', icon: FiMonitor },
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    preferences: { categories: user?.preferences?.categories || [], theme: user?.preferences?.theme || 'system' }
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});

  useEffect(() => {
    userAPI.getStats().then(({ data }) => setStats(data.stats)).catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({
        name: profileForm.name,
        preferences: profileForm.preferences
      });
      updateUser(data.user);
      setTheme(profileForm.preferences.theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : profileForm.preferences.theme);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (cat) => {
    const cats = profileForm.preferences.categories;
    setProfileForm(p => ({
      ...p,
      preferences: {
        ...p.preferences,
        categories: cats.includes(cat) ? cats.filter(c => c !== cat) : [...cats, cat]
      }
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.currentPassword) errs.currentPassword = 'Required';
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) errs.newPassword = 'Min 6 characters';
    if (passwordForm.newPassword !== passwordForm.confirm) errs.confirm = 'Passwords do not match';
    setPwErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiLock },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center text-white text-2xl font-bold font-display shadow-glow">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">{user?.name}</h1>
              <p className="text-ink-500 text-sm">{user?.email}</p>
              {user?.createdAt && (
                <p className="text-xs text-ink-400 mt-0.5">
                  Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <FiBookmark className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-ink-900 dark:text-white">{stats.bookmarksCount}</p>
                  <p className="text-xs text-ink-500">Bookmarks</p>
                </div>
              </div>
              <div className="card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FiClock className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-ink-900 dark:text-white">{stats.articlesRead}</p>
                  <p className="text-xs text-ink-500">Articles Read</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-ink-100 dark:border-ink-800">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-ink-500 hover:text-ink-700 dark:hover:text-ink-300'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card p-6 space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Display Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input type="email" value={user?.email || ''} disabled className="input-field pl-10 opacity-60 cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-3">Theme Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map(t => (
                  <button key={t.value}
                    onClick={() => setProfileForm(p => ({ ...p, preferences: { ...p.preferences, theme: t.value } }))}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                      profileForm.preferences.theme === t.value
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                        : 'border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:border-ink-300'
                    }`}>
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-3">Favorite Categories</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => {
                  const selected = profileForm.preferences.categories.includes(cat);
                  return (
                    <button key={cat} onClick={() => toggleCategory(cat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-200 border ${
                        selected
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-400 border-ink-200 dark:border-ink-700 hover:border-brand-300'
                      }`}>
                      {selected && <FiCheck className="w-3 h-3" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={handleSaveProfile} disabled={saving} className="btn-primary">
              {saving ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving...</> : <><FiSave className="w-4 h-4" />Save Changes</>}
            </button>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card p-6 animate-fade-in">
            <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-white mb-5">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { key: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
                { key: 'newPassword', label: 'New Password', placeholder: 'Min 6 characters' },
                { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">{field.label}</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input
                      type="password"
                      value={passwordForm[field.key]}
                      onChange={e => setPasswordForm(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className={`input-field pl-10 ${pwErrors[field.key] ? 'ring-2 ring-red-400' : ''}`}
                    />
                  </div>
                  {pwErrors[field.key] && <p className="text-xs text-red-500 mt-1">{pwErrors[field.key]}</p>}
                </div>
              ))}
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
