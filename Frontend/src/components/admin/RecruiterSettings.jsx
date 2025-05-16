import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/Redux/authSlice';
import { 
  Bell, 
  Settings, 
  Mail, 
  Lock, 
  Shield, 
  Calendar, 
  Users, 
  ListFilter, 
  BookOpen, 
  Building,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const RecruiterSettings = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  // Personal Settings
  const [personalSettings, setPersonalSettings] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    applicationAlerts: true,
    messageAlerts: true,
    marketingEmails: false,
    weeklyDigest: true,
  });
  
  // Recruitment Settings
  const [recruitmentSettings, setRecruitmentSettings] = useState({
    autoRejectAfterDays: 30,
    defaultScreeningQuestions: '',
    interviewModes: ['in-person', 'video', 'phone'],
    automaticReplies: true,
    showSalaryRange: true,
    candidateTagging: true,
    aiAssisted: true,
  });
  
  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    shareData: false,
    contactable: true,
    anonymizeRejected: true,
  });
  
  // Update personal info
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Toggle notification settings
  const handleNotificationToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Toggle recruitment settings
  const handleRecruitmentToggle = (setting) => {
    setRecruitmentSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Toggle privacy settings
  const handlePrivacyToggle = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Load user data on initial render
  useEffect(() => {
    if (user) {
      setPersonalSettings({
        fullname: user.fullname || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        password: '',
        confirmPassword: '',
      });
      
      // TODO: In a real application, these settings would be fetched from the backend
      // This is placeholder data for now
    }
  }, [user]);
  
  // Save all settings
  const saveSettings = async () => {
    try {
      setLoading(true);
      
      // Validation for personal info update
      if (personalSettings.password || personalSettings.confirmPassword) {
        if (personalSettings.password !== personalSettings.confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        
        if (personalSettings.password.length < 8) {
          toast.error("Password must be at least 8 characters");
          setLoading(false);
          return;
        }
      }
      
      // Only update personal info for now
      // In a real app, all settings would be saved
      const response = await axios.put(`${USER_API_END_POINT}/update-profile`, {
        fullname: personalSettings.fullname,
        email: personalSettings.email,
        phoneNumber: personalSettings.phoneNumber,
        password: personalSettings.password || undefined,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success("Settings updated successfully");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <motion.div 
            className="md:w-1/4" 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <Settings className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
              </div>
              
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Building className="mr-2 h-4 w-4" />
                  <span>Company Profile</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>Recruitment</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Privacy & Security</span>
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <motion.div 
            className="md:w-3/4" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Recruiter Settings</h1>
              
              <Tabs defaultValue="account">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="account" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                    <Lock className="h-4 w-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="recruitment" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                    <Users className="h-4 w-4 mr-2" />
                    Recruitment
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy
                  </TabsTrigger>
                </TabsList>
                
                {/* Account Settings */}
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>
                        Update your personal details and password
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="fullname">Full Name</Label>
                          <Input 
                            id="fullname" 
                            name="fullname"
                            value={personalSettings.fullname}
                            onChange={handlePersonalChange}
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email"
                            type="email"
                            value={personalSettings.email}
                            onChange={handlePersonalChange}
                            placeholder="Your email address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input 
                            id="phoneNumber" 
                            name="phoneNumber"
                            value={personalSettings.phoneNumber}
                            onChange={handlePersonalChange}
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-6 mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input 
                              id="password" 
                              name="password"
                              type="password"
                              value={personalSettings.password}
                              onChange={handlePersonalChange}
                              placeholder="Enter new password"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input 
                              id="confirmPassword" 
                              name="confirmPassword"
                              type="password"
                              value={personalSettings.confirmPassword}
                              onChange={handlePersonalChange}
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Notification Settings */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>
                        Manage how and when you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Job Application Alerts</h3>
                            <p className="text-sm text-gray-500">Get notified when someone applies to your job</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.applicationAlerts}
                            onCheckedChange={() => handleNotificationToggle('applicationAlerts')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Message Alerts</h3>
                            <p className="text-sm text-gray-500">Get notified when you receive a message</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.messageAlerts}
                            onCheckedChange={() => handleNotificationToggle('messageAlerts')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                            <p className="text-sm text-gray-500">Receive updates about HireWave services</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.marketingEmails}
                            onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Weekly Digest</h3>
                            <p className="text-sm text-gray-500">Receive a weekly summary of your job postings</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.weeklyDigest}
                            onCheckedChange={() => handleNotificationToggle('weeklyDigest')}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Recruitment Settings */}
                <TabsContent value="recruitment">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recruitment Preferences</CardTitle>
                      <CardDescription>
                        Customize your recruiting workflow and candidate experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Show Salary Range</h3>
                            <p className="text-sm text-gray-500">Display salary information in job listings</p>
                          </div>
                          <Switch 
                            checked={recruitmentSettings.showSalaryRange}
                            onCheckedChange={() => handleRecruitmentToggle('showSalaryRange')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Automatic Replies</h3>
                            <p className="text-sm text-gray-500">Send automated responses to applicants</p>
                          </div>
                          <Switch 
                            checked={recruitmentSettings.automaticReplies}
                            onCheckedChange={() => handleRecruitmentToggle('automaticReplies')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Candidate Tagging</h3>
                            <p className="text-sm text-gray-500">Use tags to organize and filter candidates</p>
                          </div>
                          <Switch 
                            checked={recruitmentSettings.candidateTagging}
                            onCheckedChange={() => handleRecruitmentToggle('candidateTagging')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">AI-Assisted Recruiting</h3>
                            <p className="text-sm text-gray-500">Use AI to help match and sort candidates</p>
                          </div>
                          <Switch 
                            checked={recruitmentSettings.aiAssisted}
                            onCheckedChange={() => handleRecruitmentToggle('aiAssisted')}
                          />
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100">
                          <Label htmlFor="autoRejectAfterDays" className="mb-2 block">
                            Auto-Reject Applications After (days)
                          </Label>
                          <Select 
                            value={recruitmentSettings.autoRejectAfterDays.toString()}
                            onValueChange={(value) => 
                              setRecruitmentSettings(prev => ({
                                ...prev,
                                autoRejectAfterDays: parseInt(value)
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="14">14 days</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="60">60 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="0">Never</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="pt-4">
                          <Label htmlFor="defaultScreeningQuestions" className="mb-2 block">
                            Default Screening Questions
                          </Label>
                          <Textarea
                            id="defaultScreeningQuestions"
                            placeholder="Enter questions to ask all candidates..."
                            className="h-32"
                            value={recruitmentSettings.defaultScreeningQuestions}
                            onChange={(e) => 
                              setRecruitmentSettings(prev => ({
                                ...prev,
                                defaultScreeningQuestions: e.target.value
                              }))
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            These questions will be included in all your job applications.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Privacy Settings */}
                <TabsContent value="privacy">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy & Security</CardTitle>
                      <CardDescription>
                        Manage your privacy settings and account security
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Public Company Profile</h3>
                            <p className="text-sm text-gray-500">Make your company profile visible to the public</p>
                          </div>
                          <Switch 
                            checked={privacySettings.publicProfile}
                            onCheckedChange={() => handlePrivacyToggle('publicProfile')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Data Sharing</h3>
                            <p className="text-sm text-gray-500">Allow anonymous data sharing for platform improvements</p>
                          </div>
                          <Switch 
                            checked={privacySettings.shareData}
                            onCheckedChange={() => handlePrivacyToggle('shareData')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Public Contact</h3>
                            <p className="text-sm text-gray-500">Allow candidates to contact you directly</p>
                          </div>
                          <Switch 
                            checked={privacySettings.contactable}
                            onCheckedChange={() => handlePrivacyToggle('contactable')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Anonymize Rejected Candidates</h3>
                            <p className="text-sm text-gray-500">Automatically anonymize data of rejected candidates after 90 days</p>
                          </div>
                          <Switch 
                            checked={privacySettings.anonymizeRejected}
                            onCheckedChange={() => handlePrivacyToggle('anonymizeRejected')}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-8">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={saveSettings}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterSettings; 