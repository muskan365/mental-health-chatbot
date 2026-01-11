import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Shield,
  Bell,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { assessmentService } from "@/services/assessment.service";
import { moodService } from "@/services/mood.service";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  
  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [phq9Score, setPhq9Score] = useState<number | null>(null);
  const [phq9Date, setPhq9Date] = useState<string | null>(null);
  const [gad7Score, setGad7Score] = useState<number | null>(null);
  const [gad7Date, setGad7Date] = useState<string | null>(null);
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  const [moodHistory, setMoodHistory] = useState<Array<{ date: string; mood: number; color: string }>>([]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      loadAssessmentScores();
      loadMoodHistory();
    }
  }, [user]);

  // Reload mood history when switching to wellness tab
  useEffect(() => {
    if (activeTab === "wellness" && user?.id) {
      loadMoodHistory();
    }
  }, [activeTab, user?.id]);

  const loadMoodHistory = async () => {
    if (!user?.id) return;
    
    try {
      const latestMood = await moodService.getLatestMood(user.id);
      // For now, we'll create a simple pattern with the latest mood
      // In a real app, you'd fetch the last 7 days of mood entries
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const history = days.map((day, idx) => {
        // Simulate variance around the latest mood
        const baseValue = getMoodValue(latestMood.mood);
        const variance = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const value = Math.max(1, Math.min(5, baseValue + variance));
        return {
          date: day,
          mood: value,
          color: value >= 4 ? 'bg-stress-low' : value === 3 ? 'bg-mint' : 'bg-stress-medium',
        };
      });
      setMoodHistory(history);
    } catch (error) {
      console.error('Failed to load mood history:', error);
      // Set default empty history
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      setMoodHistory(days.map(day => ({ date: day, mood: 3, color: 'bg-muted' })));
    }
  };

  const loadAssessmentScores = async () => {
    if (!user?.id) return;
    
    setIsLoadingScores(true);
    try {
      const scores = await assessmentService.getScores(user.id);
      setPhq9Score(scores.phq9Score);
      setPhq9Date(scores.phq9Date);
      setGad7Score(scores.gad7Score);
      setGad7Date(scores.gad7Date);
    } catch (error) {
      console.error("Failed to load assessment scores:", error);
    } finally {
      setIsLoadingScores(false);
    }
  };

  const getMoodColor = (mood: string) => {
    const moodLower = mood.toLowerCase();
    if (moodLower.includes('happy') || moodLower.includes('great') || moodLower.includes('excited')) return 'bg-stress-low';
    if (moodLower.includes('good') || moodLower.includes('calm') || moodLower.includes('okay')) return 'bg-mint';
    if (moodLower.includes('neutral') || moodLower.includes('fine')) return 'bg-secondary';
    if (moodLower.includes('sad') || moodLower.includes('anxious') || moodLower.includes('stressed')) return 'bg-stress-medium';
    if (moodLower.includes('depressed') || moodLower.includes('overwhelmed')) return 'bg-stress-high';
    return 'bg-muted';
  };

  const getMoodValue = (mood: string) => {
    const moodLower = mood.toLowerCase();
    if (moodLower.includes('happy') || moodLower.includes('great') || moodLower.includes('excited')) return 5;
    if (moodLower.includes('good') || moodLower.includes('calm') || moodLower.includes('okay')) return 4;
    if (moodLower.includes('neutral') || moodLower.includes('fine')) return 3;
    if (moodLower.includes('sad') || moodLower.includes('anxious') || moodLower.includes('stressed')) return 2;
    if (moodLower.includes('depressed') || moodLower.includes('overwhelmed')) return 1;
    return 3;
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      await userService.updateProfile(user.id, {
        name,
        email,
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      await userService.deleteAccount(user.id);
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      
      // Logout and redirect to home
      logout();
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "wellness", label: "Wellness History", icon: TrendingUp },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
              <div className="pt-4 border-t border-border/50 mt-4">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-destructive hover:bg-destructive/10 transition-all duration-300"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 animate-fade-up">
                <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User ID: {user?.id}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                    <Input 
                      placeholder="Enter your name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">This is how you'll appear in the community</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                    <Input 
                      type="email" 
                      placeholder="student@university.edu" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="calm" 
                    className="mt-4"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 animate-fade-up">
                <h2 className="text-lg font-semibold text-foreground mb-6">Privacy Controls</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">Anonymous Mode</p>
                      <p className="text-sm text-muted-foreground">Hide your identity in forum posts</p>
                    </div>
                    <Switch checked={anonymousMode} onCheckedChange={setAnonymousMode} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">Data Sharing for Research</p>
                      <p className="text-sm text-muted-foreground">Help improve mental health support (anonymized)</p>
                    </div>
                    <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <Button variant="soft">Download My Data</Button>
                    <p className="text-xs text-muted-foreground mt-2">Request a copy of all your data</p>
                  </div>
                  <div className="pt-4 border-t border-border/50 mt-4">
                    <h3 className="text-sm font-medium text-foreground mb-2">Danger Zone</h3>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </Button>
                    <p className="text-xs text-destructive mt-2">This action cannot be undone</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 animate-fade-up">
                <h2 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">Daily Check-in Reminders</p>
                      <p className="text-sm text-muted-foreground">Get a gentle reminder to log your mood</p>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">Session Reminders</p>
                      <p className="text-sm text-muted-foreground">Notifications for upcoming counsellor sessions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">Community Updates</p>
                      <p className="text-sm text-muted-foreground">New replies to your forum posts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "wellness" && (
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 animate-fade-up">
                <h2 className="text-lg font-semibold text-foreground mb-6">Wellness History</h2>
                
                {/* Assessment History */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Assessment History</h3>
                  {isLoadingScores ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground mt-2">Loading assessments...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {phq9Score !== null && (
                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">PHQ-9 Assessment</p>
                              <p className="text-sm text-muted-foreground">
                                {phq9Date ? new Date(phq9Date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "No date"}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            phq9Score <= 4 ? "bg-stress-low/20 text-stress-low" :
                            phq9Score <= 9 ? "bg-mint/20 text-mint-foreground" :
                            phq9Score <= 14 ? "bg-stress-medium/20 text-stress-medium" :
                            "bg-stress-high/20 text-stress-high"
                          }`}>
                            Score: {phq9Score}
                          </span>
                        </div>
                      )}
                      {gad7Score !== null && (
                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">GAD-7 Assessment</p>
                              <p className="text-sm text-muted-foreground">
                                {gad7Date ? new Date(gad7Date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "No date"}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            gad7Score <= 4 ? "bg-stress-low/20 text-stress-low" :
                            gad7Score <= 9 ? "bg-mint/20 text-mint-foreground" :
                            gad7Score <= 14 ? "bg-stress-medium/20 text-stress-medium" :
                            "bg-stress-high/20 text-stress-high"
                          }`}>
                            Score: {gad7Score}
                          </span>
                        </div>
                      )}
                      {phq9Score === null && gad7Score === null && (
                        <p className="text-center text-muted-foreground py-8">No assessment history available</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
