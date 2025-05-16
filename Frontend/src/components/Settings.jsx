import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/Redux/authSlice';
import Navbar from './shared/Navbar';
import { 
  Bell, 
  Lock, 
  User, 
  LogOut, 
  Mail, 
  Phone, 
  Shield, 
  Save,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';

const Settings = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    browserNotifications: true
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      ...formData,
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      emailNotifications: true, // Default values, adjust based on your user model
      browserNotifications: true
    });
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (name) => {
    setFormData({
      ...formData,
      [name]: !formData[name]
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/update-profile`,
        {
          email: formData.email,
          phoneNumber: formData.phoneNumber
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/update-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success('Password updated successfully');
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSettings = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/update-notification-settings`,
        {
          emailNotifications: formData.emailNotifications,
          browserNotifications: formData.browserNotifications
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success('Notification settings updated');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  const logOutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem('user');
        navigate("/login");
        window.location.reload();
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-2 ${
                  activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <User size={18} />
                <span>Profile Information</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-2 ${
                  activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Lock size={18} />
                <span>Security</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-2 ${
                  activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Bell size={18} />
                <span>Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-2 ${
                  activeTab === 'privacy' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Shield size={18} />
                <span>Privacy</span>
              </button>
              
              <hr className="my-2" />
              
              <button
                onClick={logOutHandler}
                className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <form onSubmit={updateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      value={user.fullname || ''}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      To change your name, please update it from your profile page.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-gray-400" />
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={loading} className="mt-2">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                <form onSubmit={updatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading} className="mt-2">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive job alerts and updates via email</p>
                    </div>
                    <Switch
                      checked={formData.emailNotifications}
                      onCheckedChange={() => handleSwitchChange('emailNotifications')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Browser Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                    </div>
                    <Switch
                      checked={formData.browserNotifications}
                      onCheckedChange={() => handleSwitchChange('browserNotifications')}
                    />
                  </div>
                  
                  <Button onClick={updateNotificationSettings} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Your privacy is important to us. Here you can control how your data is used on HireWave.
                  </p>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Data Usage</h3>
                    <p className="text-sm text-blue-700">
                      We use your data to improve your job search experience and match you with relevant opportunities.
                      Your resume and profile information are only shared with employers when you apply for a position.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Account Data</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      You can request a copy of your data or delete your account at any time.
                    </p>
                    <div className="flex gap-4">
                      <Button variant="outline">Request Data Export</Button>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

