import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  MessageCircle,
  Heart,
  Clock,
  TrendingUp,
  Users,
  Shield,
  Loader2,
} from "lucide-react";
import { forumService } from "@/services/forum.service";
import { userService } from "@/services/user.service";
import { ForumThread } from "@/types/api.types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "all", label: "All Topics", icon: Users },
  { id: "anxiety", label: "Anxiety", icon: Heart },
  { id: "depression", label: "Depression", icon: Heart },
  { id: "stress", label: "Academic Stress", icon: TrendingUp },
  { id: "relationships", label: "Relationships", icon: Users },
];

const avatars = ["🦉", "🐻", "🦊", "🐰", "🦋", "🐼", "🦁", "🐨"];
const colors = ["bg-primary/10", "bg-accent", "bg-mint", "bg-secondary", "bg-stress-low/20"];

const Forum = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", description: "", category: "all" });
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Load threads
  useEffect(() => {
    loadThreads();
  }, []);

  const loadUserNames = async (threadList: ForumThread[]) => {
    const ids = threadList
      .map((t) => ({ id: t.createdBy, name: t.createdByName }))
      .filter((t) => t.id && !t.name && !userNames[t.id]);

    const uniqueIds = Array.from(new Set(ids.map((t) => t.id)));
    if (uniqueIds.length === 0) return;

    const entries = await Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const user = await userService.getUserById(id);
          return [id, user.name || "Anonymous"] as const;
        } catch {
          return [id, "Anonymous"] as const;
        }
      })
    );

    setUserNames((prev) => {
      const next = { ...prev };
      for (const [id, name] of entries) {
        next[id] = name;
      }
      return next;
    });
  };

  const loadThreads = async () => {
    try {
      setIsLoading(true);
      const data = await forumService.getAllThreads();
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.data)
          ? (data as any).data
          : [];
      setThreads(normalized);
      await loadUserNames(normalized);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load forum threads.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!newThread.title.trim() || !newThread.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const tags = newThread.category !== "all" ? [newThread.category] : [];
      await forumService.createThread({
        title: newThread.title,
        description: newThread.description,
        createdBy: user?.id || "",
        tags,
      });
      
      toast({
        title: "Success",
        description: "Your thread has been created!",
      });
      
      setNewThread({ title: "", description: "", category: "all" });
      setIsDialogOpen(false);
      loadThreads();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create thread.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const filteredTopics = threads.filter((thread) => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || thread.tags?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Community Forum</h1>
            <p className="text-muted-foreground">
              A safe space to share, connect, and support each other.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="calm">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Thread</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    placeholder="What's on your mind?"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={newThread.category}
                    onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <textarea
                    value={newThread.description}
                    onChange={(e) => setNewThread({ ...newThread, description: e.target.value })}
                    placeholder="Share your thoughts..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background min-h-[120px]"
                    maxLength={1000}
                  />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Your post will be anonymous to protect your privacy
                  </span>
                </div>
                <Button 
                  variant="calm" 
                  className="w-full" 
                  onClick={handleCreateThread}
                  disabled={isCreating || !newThread.title.trim() || !newThread.description.trim()}
                >
                  {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isCreating ? "Creating..." : "Create Thread"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="pl-12"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Loading threads...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTopics.map((topic, index) => {
              const avatar = avatars[index % avatars.length];
              const color = colors[index % colors.length];
              const displayName = topic.createdByName || userNames[topic.createdBy] || topic.createdBy || "Anonymous";
              
              return (
                <Link
                  key={topic.id}
                  to={`/forum/${topic.id}`}
                  className="block bg-card rounded-2xl p-5 shadow-card border border-border/50 hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{topic.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium">{displayName}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(topic.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {topic.replyCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {topic.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No topics found matching your search.</p>
          </div>
        )}

        {/* Community Guidelines */}
        <div className="mt-8 gradient-lavender rounded-2xl p-6 border border-accent/30">
          <h3 className="font-semibold text-foreground mb-2">Community Guidelines</h3>
          <p className="text-sm text-muted-foreground">
            This is a supportive space. Please be kind, respectful, and maintain anonymity. 
            If you're in crisis, please reach out to professional support services.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Forum;
