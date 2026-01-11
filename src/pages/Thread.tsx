import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  Loader2,
  Trash2,
} from "lucide-react";
import { forumService } from "@/services/forum.service";
import { userService } from "@/services/user.service";
import { ForumThread, ForumComment } from "@/types/api.types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const avatars = ["🦉", "🐻", "🦊", "🐰", "🦋", "🐼", "🦁", "🐨"];
const colors = ["bg-primary/10", "bg-accent", "bg-mint", "bg-secondary", "bg-stress-low/20"];

const Thread = () => {
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newReply, setNewReply] = useState("");
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [isDeletingThread, setIsDeletingThread] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadThread();
      loadComments();
    }
  }, [id]);

  const loadThread = async () => {
    try {
      const data = await forumService.getThreadById(id!);
      setThread(data);
      if (data?.createdBy) ensureUserName(data.createdBy);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load thread.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await forumService.getThreadComments(id!);
      setComments(data);
      const uniqueIds = Array.from(new Set(data.map((c) => c.userId).filter(Boolean)));
      uniqueIds.forEach((uid) => ensureUserName(uid));
    } catch (error: any) {
      console.error("Failed to load comments:", error);
    }
  };

  const ensureUserName = async (userId: string) => {
    if (!userId || userNames[userId]) return;
    try {
      const userProfile = await userService.getUserById(userId);
      if (userProfile?.name) {
        setUserNames((prev) => ({ ...prev, [userId]: userProfile.name }));
      }
    } catch {
      // ignore resolution failures; fallback to ID
    }
  };

  const handlePostReply = async () => {
    if (!newReply.trim()) return;

    try {
      setIsPosting(true);
      await forumService.createComment({
        threadId: id!,
        userId: user?.id || '',
        message: newReply,
      });
      
      toast({
        title: "Success",
        description: "Your reply has been posted!",
      });
      
      setNewReply("");
      loadComments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post reply.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteThread = async () => {
    if (!thread || !user?.id || thread.createdBy !== user.id) return;
    const confirmed = window.confirm("Delete this thread? This cannot be undone.");
    if (!confirmed) return;

    try {
      setIsDeletingThread(true);
      await forumService.deleteThread(thread.id);
      toast({
        title: "Thread deleted",
        description: "Your thread has been removed.",
      });
      navigate("/forum");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete thread.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingThread(false);
    }
  };

  const handleDeleteComment = async (commentId: string, ownerId: string) => {
    if (!user?.id || ownerId !== user.id) {
      toast({
        title: "Action not allowed",
        description: "You can only delete your own comment.",
        variant: "destructive",
      });
      return;
    }

    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;

    try {
      setDeletingCommentId(commentId);
      await forumService.deleteComment(commentId, user.id);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete comment.",
        variant: "destructive",
      });
    } finally {
      setDeletingCommentId(null);
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

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-4">Loading thread...</p>
        </div>
      </Layout>
    );
  }

  if (!thread) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Thread not found.</p>
          <Link to="/forum">
            <Button variant="calm" className="mt-4">Back to Forum</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/forum"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Forum
        </Link>

        {/* Original Post */}
        <div className="bg-card rounded-3xl p-6 shadow-card border border-border/50 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-14 h-14 rounded-xl ${colors[0]} flex items-center justify-center text-2xl flex-shrink-0`}>
              {avatars[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground mb-1">{thread.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium">{thread.createdByName || (thread.createdBy && userNames[thread.createdBy]) || thread.createdBy || "Anonymous"}</span>
                <span>•</span>
                <span>{getTimeAgo(thread.createdAt)}</span>
              </div>
            </div>
          </div>

          <p className="text-foreground leading-relaxed mb-6">{thread.description}</p>

          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                liked
                  ? "bg-stress-high/20 text-stress-high"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{liked ? 1 : 0}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted transition-all duration-300">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{comments.length}</span>
            </button>
            {user?.id === thread.createdBy && (
              <button
                onClick={handleDeleteThread}
                disabled={isDeletingThread}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stress-high/10 text-stress-high hover:bg-stress-high/20 transition-all duration-300 disabled:opacity-50"
              >
                {isDeletingThread ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground">
            Replies ({comments.length})
          </h2>
          {comments.map((reply, index) => {
            const avatar = avatars[(index + 1) % avatars.length];
            const color = colors[(index + 1) % colors.length];
            
            return (
              <div
                key={reply.id}
                className="bg-card rounded-2xl p-5 shadow-card border border-border/50 ml-6 relative animate-fade-up"
              >
                <div className="absolute -left-6 top-6 w-6 h-px bg-border" />
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-xl flex-shrink-0`}>
                    {avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-foreground">{reply.userName || userNames[reply.userId] || reply.userId || "Anonymous"}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{getTimeAgo(reply.createdAt)}</span>
                    </div>
                  </div>
                  {user?.id === reply.userId && (
                    <button
                      onClick={() => handleDeleteComment(reply.id, reply.userId)}
                      disabled={deletingCommentId === reply.id}
                      className="ml-auto text-muted-foreground hover:text-stress-high transition-colors"
                      aria-label="Delete comment"
                    >
                      {deletingCommentId === reply.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-foreground text-sm leading-relaxed mb-4">{reply.message}</p>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>0</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Input */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 sticky bottom-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
              🦋
            </div>
            <div className="flex-1">
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Share your thoughts or support..."
                className="w-full min-h-[80px] p-3 rounded-xl bg-muted/50 border border-border/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 text-sm"
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-muted-foreground">
                  Your identity remains anonymous
                </p>
                <Button 
                  variant="calm" 
                  size="sm" 
                  disabled={!newReply.trim() || isPosting}
                  onClick={handlePostReply}
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Thread;
