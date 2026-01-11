import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Filter,
  Play,
  FileText,
  Headphones,
  Clock,
  X,
  BookOpen,
  Heart,
  Brain,
  Moon,
} from "lucide-react";

const guidedBreathingAudio = new URL("../assets/WhatsApp Audio 2025-12-10 at 14.44.08_9b116989.dat.unknown", import.meta.url).href;
const pmrAudio = new URL("../assets/WhatsApp Audio 2025-12-10 at 14.45.31_8a5e368b.dat.unknown", import.meta.url).href;

type Resource = {
  id: number;
  title: string;
  type: "article" | "audio" | "video";
  category: string;
  duration: string;
  description: string;
  content: string;
  videoUrl?: string;
  audioUrl?: string;
};

const categories = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "anxiety", label: "Anxiety", icon: Heart },
  { id: "stress", label: "Stress", icon: Brain },
  { id: "sleep", label: "Sleep", icon: Moon },
];

const resources: Resource[] = [
  {
    id: 1,
    title: "Understanding Anxiety: A Student's Guide",
    type: "article",
    category: "anxiety",
    duration: "8 min read",
    description: "Learn about the causes and symptoms of anxiety, and discover practical strategies to manage anxious thoughts.",
    content: "Anxiety is a natural response to stress, but when it becomes overwhelming, it can interfere with daily life...",
  },
  {
    id: 2,
    title: "Guided Breathing for Calm",
    type: "audio",
    category: "stress",
    duration: "10 min",
    description: "A gentle breathing exercise to help you relax and center yourself during stressful moments.",
    content: "Welcome to this guided breathing session. Find a comfortable position...",
    audioUrl: guidedBreathingAudio,
  },
  {
    id: 3,
    title: "Better Sleep Habits",
    type: "video",
    category: "sleep",
    duration: "12 min",
    description: "Discover evidence-based techniques to improve your sleep quality and establish healthy bedtime routines.",
    content: "Video content about sleep hygiene and creating optimal conditions for rest...",
    videoUrl: "https://www.youtube.com/embed/g0jfhRcXtLQ?si=OT5EIw9TYLvR9zIz",
  },
  {
    id: 4,
    title: "Managing Exam Stress",
    type: "article",
    category: "stress",
    duration: "6 min read",
    description: "Practical tips and strategies to stay calm and focused during exam periods.",
    content: "Exam stress is common among students. Here are some evidence-based strategies...",
  },
  {
    id: 5,
    title: "Progressive Muscle Relaxation",
    type: "audio",
    category: "anxiety",
    duration: "15 min",
    description: "Learn to release physical tension through systematic muscle relaxation techniques.",
    content: "Progressive muscle relaxation is a technique where you tense and then relax each muscle group...",
    audioUrl: pmrAudio,
  },
  {
    id: 6,
    title: "Mindfulness for Beginners",
    type: "video",
    category: "stress",
    duration: "8 min",
    description: "An introduction to mindfulness meditation and how to incorporate it into your daily routine.",
    content: "Mindfulness is the practice of being present in the moment...",
    videoUrl: "https://www.youtube.com/embed/ZToicYcHIOU?si=fVAGwAp4wHx2kw4W",
  },
];

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [articleOpen, setArticleOpen] = useState(false);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [videoAutoplay, setVideoAutoplay] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset autoplay state when switching resources
    setVideoAutoplay(false);
    setVideoKey((key) => key + 1);
  }, [selectedResource?.id]);

  const generateArticleContent = (title: string, description?: string) => {
    const focus = description || "this topic";
    return (
      `${title} \n\n` +
      `Introduction: ${focus} matters because it shapes how you show up for classes, friends, and yourself. In this article, you will get a simple, realistic walkthrough you can try immediately without special tools.\n\n` +
      `Core ideas: Start by noticing your baseline - sleep, mood, and focus. Then pick one lever: breathing drills, a short walk, or a brief journaling check-in. Keep each lever tiny (5-10 minutes) so it is hard to skip. Pair the habit with an existing routine like after breakfast or before studying.\n\n` +
      `How to practice: For the next 7 days, choose one daily anchor habit and one weekly reflection. Each day, log one sentence: what you tried, how you felt, and what you would tweak. Each week, review your notes and celebrate any small win - a calmer commute, better concentration, or less evening restlessness.\n\n` +
      `When to seek help: If mood, sleep, or concentration stay low for two weeks, reach out to a counselor or mentor. They can adapt these ideas to your needs. Remember, asking for support is a skill, not a setback.\n\n` +
      `Closing: Consistency beats intensity. Keep the habit small, keep the reflection honest, and iterate. You deserve care that fits your life.`
    );
  };

  const handleReadFullArticle = (resource: Resource) => {
    setArticleTitle(resource.title);
    setArticleContent(generateArticleContent(resource.title, resource.description));
    setArticleOpen(true);
  };

  const getVideoSrc = (url: string) => {
    const joinChar = url.includes("?") ? "&" : "?";
    return `${url}${joinChar}autoplay=${videoAutoplay ? 1 : 0}`;
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play;
      case "audio":
        return Headphones;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-primary/10 text-primary";
      case "audio":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-mint text-mint-foreground";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Resources</h1>
          <p className="text-muted-foreground">
            Explore our collection of self-help resources designed to support your mental wellness journey.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Resource List */}
          <div className={`${selectedResource ? "lg:w-1/2" : "w-full"} transition-all duration-300`}>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
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

            {/* Resource Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <button
                    key={resource.id}
                    onClick={() => setSelectedResource(resource)}
                    className={`text-left p-5 rounded-2xl transition-all duration-300 ${
                      selectedResource?.id === resource.id
                        ? "bg-primary/5 border-2 border-primary shadow-soft"
                        : "bg-card border border-border/50 shadow-card hover:shadow-hover hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${getTypeColor(resource.type)} flex items-center justify-center flex-shrink-0`}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{resource.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="px-2 py-1 rounded-full bg-muted capitalize">{resource.type}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {resource.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No resources found matching your search.</p>
              </div>
            )}
          </div>

          {/* Right Panel - Content Viewer */}
          {selectedResource && (
            <div className="lg:w-1/2 animate-fade-up">
              <div className="bg-card rounded-3xl shadow-card border border-border/50 sticky top-24 overflow-hidden">
                <div className="gradient-calm p-6 relative">
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className={`w-16 h-16 rounded-2xl ${getTypeColor(selectedResource.type)} flex items-center justify-center mb-4`}>
                    {(() => {
                      const Icon = getTypeIcon(selectedResource.type);
                      return <Icon className="w-8 h-8" />;
                    })()}
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{selectedResource.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="px-3 py-1 rounded-full bg-card/80 capitalize">{selectedResource.type}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedResource.duration}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-muted-foreground mb-6">{selectedResource.description}</p>

                  {selectedResource.type === "video" && (
                    <div className="aspect-video bg-muted rounded-2xl overflow-hidden mb-6">
                      {selectedResource.videoUrl ? (
                        <iframe
                          key={`${selectedResource.id}-${videoKey}-${videoAutoplay ? "auto" : "no"}`}
                          className="w-full h-full"
                          src={getVideoSrc(selectedResource.videoUrl)}
                          title={selectedResource.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Video unavailable</div>
                      )}
                    </div>
                  )}

                  {selectedResource.type === "audio" && (
                    <div className="bg-muted/50 rounded-2xl p-6 mb-6">
                      {selectedResource.audioUrl ? (
                        <audio controls className="w-full" ref={audioRef}>
                          <source src={selectedResource.audioUrl} />
                          Your browser does not support the audio element.
                        </audio>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Play className="w-4 h-4" />
                          Audio unavailable
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{selectedResource.title}</span>
                        <span>{selectedResource.duration}</span>
                      </div>
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed">{selectedResource.content}</p>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="calm"
                      className="flex-1"
                      onClick={() => {
                        if (selectedResource.type === "article") {
                          handleReadFullArticle(selectedResource);
                        } else if (selectedResource.type === "video") {
                          setVideoAutoplay(true);
                          setVideoKey((key) => key + 1);
                        } else if (selectedResource.type === "audio") {
                          if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play().catch(() => {
                              /* ignore play errors (autoplay restrictions) */
                            });
                          }
                        }
                      }}
                    >
                      {selectedResource.type === "article" ? "Read Full Article" : selectedResource.type === "video" ? "Watch Now" : "Listen Now"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog open={articleOpen} onOpenChange={setArticleOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{articleTitle}</DialogTitle>
            <DialogDescription>Generated article based on this topic.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <p className="whitespace-pre-line leading-7 text-muted-foreground">{articleContent}</p>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Resources;
