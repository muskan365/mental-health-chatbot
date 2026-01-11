import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, Heart, RefreshCw, Loader2 } from "lucide-react";
import { chatService } from "@/services/chat.service";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ChatSessionSummary } from "@/types/api.types";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const suggestions = [
  "I'm feeling stressed about exams",
  "How can I improve my sleep?",
  "I need help with anxiety",
  "Tips for staying motivated",
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your MindCare companion. I'm here to listen and support you. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "concerned">("neutral");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize chat session
  useEffect(() => {
    if (user?.id) {
      loadSessions(true);
    }
  }, [user]);

  const mapSessionMessages = (messagesData: any[] | undefined): Message[] => {
    if (!messagesData || !Array.isArray(messagesData)) return [];
    return messagesData.map((m, idx) => ({
      id: `hist-${idx}-${m.timestamp}`,
      content: m.text,
      sender: m.sender === "user" ? "user" : "bot",
      timestamp: new Date(m.timestamp),
    }));
  };

  const setSessionFromDetail = (session: any) => {
    setSessionId(session.id);
    const mapped = mapSessionMessages(session.messages);
    setMessages(mapped.length > 0 ? mapped : [
      {
        id: "welcome",
        content: "Hello! I'm your MindCare companion. I'm here to listen and support you. How are you feeling today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setSentiment("neutral");
  };

  const loadSessions = async (selectLatest: boolean) => {
    if (!user?.id) return;
    try {
      setIsLoadingSessions(true);
      const data = await chatService.getSessions(user.id);
      const ordered = Array.isArray(data)
        ? [...data].sort((a, b) => new Date(b.sessionStart).getTime() - new Date(a.sessionStart).getTime())
        : [];
      setSessions(ordered);
      if (selectLatest && ordered.length > 0) {
        await loadSessionDetail(ordered[0].id);
      } else if (selectLatest && ordered.length === 0) {
        await handleNewSession();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load chat sessions.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadSessionDetail = async (id: string) => {
    try {
      setIsLoading(true);
      const session = await chatService.getSession(id);
      setSessionFromDetail(session);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load session.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !sessionId || isSending) return;

    const userMessageContent = input.trim();
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: userMessageContent,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      // Send message to API
      const response = await chatService.sendMessage({
        sessionId: sessionId,
        message: userMessageContent,
      });

      // Add bot response
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: response.botReply,
        sender: "bot",
        timestamp: new Date(response.timestamp),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setSentiment("positive");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleNewSession = async () => {
    try {
      setIsLoading(true);
      const session = await chatService.createSession({ userId: user?.id || "" });
      setSessionFromDetail(session);
      await loadSessions(false);
      toast({
        title: "New Session Started",
        description: "Ready for a fresh conversation!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start new session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderBotContent = (content: string) => {
    // Helper to render text with **bold** markers
    const renderWithBold = (text: string) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, idx) => {
        const boldMatch = part.match(/^\*\*(.*)\*\*$/);
        if (boldMatch) {
          return (
            <strong key={`b-${idx}`} className="font-semibold text-foreground">
              {boldMatch[1]}
            </strong>
          );
        }
        return <span key={`t-${idx}`}>{part}</span>;
      });
    };

    // Split content into lines
    const lines = content.split('\n').map(l => l.trim());
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let currentList: { type: 'bullet' | 'number', items: string[] } | null = null;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`p-${elements.length}`} className="text-sm leading-relaxed">
            {renderWithBold(currentParagraph.join(' '))}
          </p>
        );
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList && currentList.items.length > 0) {
        const ListTag = currentList.type === 'number' ? 'ol' : 'ul';
        const listClass = currentList.type === 'number' 
          ? 'list-decimal pl-6 space-y-1 text-sm'
          : 'list-disc pl-6 space-y-1 text-sm';
        elements.push(
          <ListTag key={`list-${elements.length}`} className={listClass}>
            {currentList.items.map((item, idx) => (
              <li key={`li-${idx}`}>{renderWithBold(item)}</li>
            ))}
          </ListTag>
        );
        currentList = null;
      }
    };

    lines.forEach((line) => {
      // Check for bullet point (-, *, •)
      const bulletMatch = line.match(/^[-*•]\s+(.+)$/);
      // Check for numbered list (1., 2), etc.)
      const numberMatch = line.match(/^\d+[.)]\s+(.+)$/);

      if (bulletMatch) {
        flushParagraph();
        if (!currentList || currentList.type !== 'bullet') {
          flushList();
          currentList = { type: 'bullet', items: [] };
        }
        currentList.items.push(bulletMatch[1]);
      } else if (numberMatch) {
        flushParagraph();
        if (!currentList || currentList.type !== 'number') {
          flushList();
          currentList = { type: 'number', items: [] };
        }
        currentList.items.push(numberMatch[1]);
      } else if (line.length === 0) {
        // Empty line - flush current paragraph or list
        flushParagraph();
        flushList();
      } else {
        // Regular text line
        flushList();
        currentParagraph.push(line);
      }
    });

    // Flush any remaining content
    flushParagraph();
    flushList();

    return <div className="space-y-3">{elements}</div>;
  };

  return (
    <Layout showFooter={false}>
      <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">MindCare Companion</h1>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Starting session..." : "Your supportive AI friend"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Sentiment Indicator */}
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                sentiment === "positive"
                  ? "bg-stress-low/20 text-stress-low"
                  : sentiment === "concerned"
                  ? "bg-stress-high/20 text-stress-high"
                  : "bg-muted text-muted-foreground"
              }`}>
                <Heart className="w-3 h-3" />
                {sentiment === "positive" ? "Supportive" : sentiment === "concerned" ? "Here for you" : "Listening"}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sessionId || ""}
                  onChange={(e) => loadSessionDetail(e.target.value)}
                  disabled={isLoadingSessions || sessions.length === 0}
                  className="px-3 py-2 rounded-xl border border-border bg-background text-sm"
                >
                  {sessions.length === 0 ? (
                    <option value="">No sessions yet</option>
                  ) : (
                    sessions.map((s, idx) => (
                      <option key={s.id} value={s.id}>
                        Session {idx + 1} • {new Date(s.sessionStart).toLocaleDateString()} ({s.messageCount || 0} msgs)
                      </option>
                    ))
                  )}
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => loadSessions(true)}
                  disabled={isLoadingSessions}
                  title="Reload sessions"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoadingSessions ? "animate-spin" : ""}`} />
                </Button>
                <Button 
                  variant="calm" 
                  size="sm"
                  onClick={handleNewSession}
                  disabled={isLoading}
                >
                  New Session
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 animate-fade-up ${
                message.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gradient-to-br from-secondary to-accent"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5 text-foreground" />
                )}
              </div>
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-md"
                    : "bg-card border border-border/50 shadow-card rounded-tl-md"
                }`}
              >
                {message.sender === "bot" ? (
                  renderBotContent(message.content)
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
                <p
                  className={`text-xs mt-2 ${
                    message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex items-start gap-3 animate-fade-up">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-secondary to-accent">
                <Bot className="w-5 h-5 text-foreground" />
              </div>
              <div className="max-w-[70%] p-4 rounded-2xl bg-card border border-border/50 shadow-card rounded-tl-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Typing...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="py-3 border-t border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestion(suggestion)}
                className="px-4 py-2 rounded-xl bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-end">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isSending || isLoading || !sessionId}
            />
            <Button
              onClick={handleSend}
              variant="calm"
              size="icon"
              disabled={!input.trim() || isSending || isLoading || !sessionId}
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chatbot;
