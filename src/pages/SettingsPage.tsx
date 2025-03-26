import { useState, useEffect } from 'react';

interface SettingsTab {
  id: string;
  label: string;
  icon: string;
}

interface FormData {
  // Profile settings
  profileName: string;
  username: string;
  status: string;
  aboutMe: string;
  language: string;
  timezone: string;
  visibility: string;

  // Tutor settings
  hourlyRate: number;
  minimumSessionDuration: number;
  maximumSessionDuration: number;
  autoAcceptBookings: boolean;
  bookingLeadTime: number;
  cancellationPolicy: string;

  // Study preferences
  preferredStudyTime: string;
  studyDuration: number;
  breakDuration: number;
  dailyStudyGoal: number;
  weeklyStudyGoal: number;
  pomodoroWorkDuration: number;
  pomodoroBreakDuration: number;
  pomodoroLongBreakDuration: number;
  pomodoroSessionsBeforeLongBreak: number;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Profile settings
    profileName: '',
    username: '',
    status: '',
    aboutMe: '',
    language: 'English',
    timezone: 'GMT+0',
    visibility: 'public',

    // Tutor settings
    hourlyRate: 45,
    minimumSessionDuration: 30,
    maximumSessionDuration: 120,
    autoAcceptBookings: false,
    bookingLeadTime: 24,
    cancellationPolicy: '24h',

    // Study preferences
    preferredStudyTime: 'morning',
    studyDuration: 45,
    breakDuration: 15,
    dailyStudyGoal: 120,
    weeklyStudyGoal: 600,
    pomodoroWorkDuration: 25,
    pomodoroBreakDuration: 5,
    pomodoroLongBreakDuration: 15,
    pomodoroSessionsBeforeLongBreak: 4
  });

  const tabs: SettingsTab[] = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'tutor', label: 'Tutor Settings', icon: '📚' },
    { id: 'study', label: 'Study Preferences', icon: '📖' }
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setSaveError('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving changes:', formData);
      setSaveSuccess(true);
    } catch (error) {
      setSaveError('Failed to save changes. Please try again.');
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettingsSection = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <img
                  src={profileImage || '/default-avatar.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button
                  onClick={() => document.getElementById('profile-image')?.click()}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                <p className="text-sm text-gray-500">Upload a new profile picture</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderInput('profileName', 'Full Name')}
              {renderInput('username', 'Username')}
              {renderInput('status', 'Status')}
              {renderInput('language', 'Language', 'select', [
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' }
              ])}
              {renderInput('timezone', 'Timezone', 'select', [
                { value: 'utc', label: 'UTC' },
                { value: 'est', label: 'Eastern Time' },
                { value: 'pst', label: 'Pacific Time' }
              ])}
              {renderInput('visibility', 'Profile Visibility', 'select', [
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
                { value: 'friends', label: 'Friends Only' }
              ])}
            </div>
            <div className="col-span-full">
              {renderInput('aboutMe', 'About Me', 'textarea')}
            </div>
          </div>
        );

      case 'tutor':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInput('hourlyRate', 'Hourly Rate', 'number')}
            {renderInput('minimumSessionDuration', 'Minimum Session Duration (minutes)', 'number')}
            {renderInput('maximumSessionDuration', 'Maximum Session Duration (minutes)', 'number')}
            {renderInput('bookingLeadTime', 'Booking Lead Time (hours)', 'number')}
            {renderInput('cancellationPolicy', 'Cancellation Policy', 'select', [
              { value: 'flexible', label: 'Flexible' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'strict', label: 'Strict' }
            ])}
            <div className="col-span-full">
              {renderInput('autoAcceptBookings', 'Auto-accept Bookings', 'checkbox')}
            </div>
          </div>
        );

      case 'study':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInput('preferredStudyTime', 'Preferred Study Time', 'select', [
              { value: 'morning', label: 'Morning' },
              { value: 'afternoon', label: 'Afternoon' },
              { value: 'evening', label: 'Evening' }
            ])}
            {renderInput('studyDuration', 'Study Duration (minutes)', 'number')}
            {renderInput('breakDuration', 'Break Duration (minutes)', 'number')}
            {renderInput('dailyStudyGoal', 'Daily Study Goal (hours)', 'number')}
            {renderInput('weeklyStudyGoal', 'Weekly Study Goal (hours)', 'number')}
            {renderInput('pomodoroWorkDuration', 'Pomodoro Work Duration (minutes)', 'number')}
            {renderInput('pomodoroBreakDuration', 'Pomodoro Break Duration (minutes)', 'number')}
            {renderInput('pomodoroLongBreakDuration', 'Pomodoro Long Break Duration (minutes)', 'number')}
            {renderInput('pomodoroSessionsBeforeLongBreak', 'Pomodoro Sessions Before Long Break', 'number')}
          </div>
        );

      default:
        return null;
    }
  };

  const renderInput = (name: string, label: string, type: string = 'text', options?: { value: string; label: string }[]) => {
    const value = formData[name as keyof FormData];

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={value as string}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        ) : type === 'select' ? (
          <select
            name={name}
            value={value as string}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={name}
              checked={value as boolean}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">{label}</span>
          </div>
        ) : (
          <input
            type={type}
            name={name}
            value={value as string}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Settings</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          {/* Sidebar */}
          <div className={`${isMobile ? 'w-full' : 'w-64 shrink-0'}`}>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
              {saveError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  Changes saved successfully!
                </div>
              )}

              {renderSettingsSection()}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:static sm:border-0 sm:mt-8">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
} 