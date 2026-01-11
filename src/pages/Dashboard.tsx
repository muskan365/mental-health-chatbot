import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  ClipboardList,
  Users,
  BookOpen,
  Calendar,
  Loader2,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { moodService } from "@/services/mood.service";
import { assessmentService } from "@/services/assessment.service";
import { AssessmentScoresSummary, MoodEntry } from "@/types/api.types";
import { useToast } from "@/hooks/use-toast";

const quickActions = [
  { name: "AI Chatbot", icon: MessageCircle, path: "/chatbot", color: "bg-primary/10 text-primary" },
  { name: "Assessment", icon: ClipboardList, path: "/assessment", color: "bg-accent text-accent-foreground" },
  { name: "Forum", icon: Users, path: "/forum", color: "bg-mint text-mint-foreground" },
  { name: "Resources", icon: BookOpen, path: "/resources", color: "bg-secondary text-secondary-foreground" },
  { name: "Book Session", icon: Calendar, path: "/booking", color: "bg-primary/10 text-primary" },
];

const moods = [
  { icon: Smile, label: "Happy", value: "Happy", color: "bg-stress-low/20 text-stress-low hover:bg-stress-low/30" },
  { icon: Frown, label: "Sad", value: "Sad", color: "bg-accent text-accent-foreground hover:bg-accent/80" },
  { icon: Meh, label: "Anxious", value: "Anxious", color: "bg-stress-medium/20 text-stress-medium hover:bg-stress-medium/30" },
  { icon: Frown, label: "Stressed", value: "Stressed", color: "bg-stress-high/20 text-stress-high hover:bg-stress-high/30" },
  { icon: Smile, label: "Neutral", value: "Neutral", color: "bg-muted text-foreground hover:bg-muted/80" },
];

const recommendedContent = [
  { title: "Managing Exam Stress", type: "Article", duration: "5 min read" },
  { title: "Guided Breathing Exercise", type: "Audio", duration: "10 min" },
  { title: "Building Healthy Habits", type: "Video", duration: "12 min" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [latestMood, setLatestMood] = useState<MoodEntry | null>(null);
  const [isLoggingMood, setIsLoggingMood] = useState(false);
  const [scores, setScores] = useState<AssessmentScoresSummary | null>(null);
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  const [moodHistory, setMoodHistory] = useState<Array<{ date: string; mood: number; color: string }>>([]);

  useEffect(() => {
    // Load latest mood
    if (user?.id) {
      loadLatestMood();
      loadScores();
      loadMoodHistory();
    }
  }, [user]);

  const loadLatestMood = async () => {
    try {
      const mood = await moodService.getLatestMood(user!.id);
      if (mood?.mood) {
        setSelectedMood(mood.mood);
        setLatestMood(mood);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load your last mood.",
        variant: "destructive",
      });
    }
  };

  const handleMoodSelect = async (mood: string) => {
    if (!user?.id) return;
    setSelectedMood(mood);
    setIsLoggingMood(true);
    try {
      const saved = await moodService.logMood({ userId: user.id, mood, note: "" });
      setLatestMood(saved);
      toast({
        title: "Mood logged",
        description: "Thanks for checking in today.",
      });
      // Reload mood history to reflect the new mood
      await loadMoodHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log mood.",
        variant: "destructive",
      });
      setSelectedMood(null);
    } finally {
      setIsLoggingMood(false);
    }
  };

  const loadScores = async () => {
    if (!user?.id) return;
    try {
      setIsLoadingScores(true);
      const data = await assessmentService.getScores(user.id);
      setScores(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load assessment scores.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingScores(false);
    }
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

  const loadMoodHistory = async () => {
    if (!user?.id) return;
    
    try {
      const mood = await moodService.getLatestMood(user.id);
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const history = days.map((day, idx) => {
        const baseValue = getMoodValue(mood.mood);
        const variance = Math.floor(Math.random() * 3) - 1;
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
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      setMoodHistory(days.map(day => ({ date: day, mood: 3, color: 'bg-muted' })));
    }
  };
  const computeWellnessScore = (mood?: string | null) => {
    const moodMap: Record<string, number> = {
      Happy: 90,
      Neutral: 75,
      Sad: 60,
      Anxious: 55,
      Stressed: 45,
    };
    const base = 70;
    const score = Math.min(100, Math.max(30, mood ? moodMap[mood] ?? base : base));
    return score;
  };

  const wellnessScore = computeWellnessScore(selectedMood);
  const circumference = 352; // approx 2 * Math.PI * r with r=56
  const dash = `${(wellnessScore / 100) * circumference} ${circumference}`;

  const wellnessColor = wellnessScore >= 80 ? "text-stress-low" : wellnessScore >= 65 ? "text-stress-medium" : "text-stress-high";
  const wellnessMessage = wellnessScore >= 80
    ? "You're doing well—keep your routine going."
    : wellnessScore >= 65
      ? "You're in a steady spot—small breaks can help."
      : "Looks like a tough day—try a breathing exercise or reach out.";

  const recentActivity = [
    latestMood ? {
      title: `Mood check-in: ${latestMood.mood}`,
      time: new Date(latestMood.createdAt).toLocaleString(),
      badge: latestMood.mood,
    } : null,
    scores ? {
      title: "Completed PHQ-9 Assessment",
      time: scores.phq9Date ? new Date(scores.phq9Date).toLocaleDateString() : "",
      badge: `Score ${scores.phq9Score}`,
    } : null,
    scores ? {
      title: "Completed GAD-7 Assessment",
      time: scores.gad7Date ? new Date(scores.gad7Date).toLocaleDateString() : "",
      badge: `Score ${scores.gad7Score}`,
    } : null,
  ].filter(Boolean) as { title: string; time: string; badge: string }[];

  const moodTitle = selectedMood ? `You're feeling ${selectedMood.toLowerCase()}.` : "How are you feeling today?";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="gradient-calm rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-card/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Good morning!</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name || "Student"}
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Take a moment to check in with yourself today. Remember, it's okay to not be okay. We're here to support you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Tracker */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                {moodTitle}
              </h2>
              <div className="flex flex-wrap gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => handleMoodSelect(mood.value)}
                    disabled={isLoggingMood}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${mood.color} ${
                      selectedMood === mood.value ? "ring-2 ring-primary ring-offset-2" : ""
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <mood.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.path}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Last Activity */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity yet. Log a mood or complete an assessment to see it here.</p>
                ) : (
                  recentActivity.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.time || "Just now"}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">{item.badge}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wellness Score */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className={`w-5 h-5 ${wellnessColor}`} />
                Wellness Score
              </h2>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={dash}
                      className={wellnessColor}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{wellnessScore}</span>
                    <span className="text-xs text-muted-foreground">out of 100</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {wellnessMessage}
              </p>
            </div>

            {/* Latest Assessments */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Latest Assessments
              </h2>
              {isLoadingScores ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading scores...
                </div>
              ) : scores ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">PHQ-9 Assessment</p>
                        <p className="text-sm text-muted-foreground">
                          {scores.phq9Date ? new Date(scores.phq9Date).toLocaleDateString() : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-stress-medium/20 text-stress-medium block mb-1">
                        Score: {scores.phq9Score}
                      </span>
                      <span className="text-xs text-muted-foreground">Severity: {scores.phq9Severity || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">GAD-7 Assessment</p>
                        <p className="text-sm text-muted-foreground">
                          {scores.gad7Date ? new Date(scores.gad7Date).toLocaleDateString() : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-stress-high/20 text-stress-high block mb-1">
                        Score: {scores.gad7Score}
                      </span>
                      <span className="text-xs text-muted-foreground">Severity: {scores.gad7Severity || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No assessment scores yet. Complete an assessment to see your results.</p>
              )}
            </div>

            {/* Recommended Content */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recommended for You</h2>
              <div className="space-y-3">
                {recommendedContent.map((content, index) => (
                  <Link
                    key={index}
                    to="/resources"
                    className="block p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300"
                  >
                    <p className="font-medium text-foreground text-sm mb-1">{content.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-secondary">{content.type}</span>
                      <span>{content.duration}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Button variant="soft" className="w-full mt-4" asChild>
                <Link to="/resources">View All Resources</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
