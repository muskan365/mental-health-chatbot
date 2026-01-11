import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  ClipboardList,
  Users,
  BookOpen,
  Calendar,
  ArrowRight,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Companion",
    description: "Chat anytime with our supportive AI that understands and guides you through difficult moments.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ClipboardList,
    title: "Self-Assessment",
    description: "Evidence-based screenings help you understand your mental health and track your progress.",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: Users,
    title: "Community Forum",
    description: "Connect anonymously with peers who understand what you're going through.",
    color: "bg-mint text-mint-foreground",
  },
  {
    icon: BookOpen,
    title: "Resources Library",
    description: "Articles, videos, and audio guides to support your wellness journey.",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: Calendar,
    title: "Counsellor Booking",
    description: "Schedule sessions with professional counsellors when you need deeper support.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shield,
    title: "Complete Privacy",
    description: "Your data is protected. Share what you're comfortable with, always.",
    color: "bg-accent text-accent-foreground",
  },
];

const testimonials = [
  {
    quote: "MindCare helped me through my darkest semester. The AI chat was there when I couldn't talk to anyone else.",
    author: "Anonymous Student",
    avatar: "🦋",
    color: "bg-primary/10",
  },
  {
    quote: "The self-assessment tools helped me realize I needed help. Now I'm working with a counsellor and feeling so much better.",
    author: "Anonymous Student",
    avatar: "🌸",
    color: "bg-accent",
  },
  {
    quote: "Knowing there's a community of students going through similar things makes me feel less alone.",
    author: "Anonymous Student",
    avatar: "🌿",
    color: "bg-mint",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="gradient-calm absolute inset-0 opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-secondary/30 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/30 blur-3xl animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 mb-8 shadow-card">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Your safe space for mental wellness</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              You're Not Alone.
              <br />
              <span className="text-primary">We're Here to Help.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              MindCare provides compassionate, accessible mental health support for students. 
              Chat with AI, take assessments, connect with peers, and book counselling — all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button variant="calm" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="soft" size="xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Thrive
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for student mental wellness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Getting Started is Easy
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to begin your wellness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create Account", description: "Sign up in seconds with your email. No personal information required." },
              { step: "2", title: "Check In", description: "Take a quick assessment to understand how you're feeling today." },
              { step: "3", title: "Get Support", description: "Access AI chat, resources, community forums, or book a counsellor." },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className="text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-soft">
                    <span className="text-3xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Voices from Our Community
            </h2>
            <p className="text-lg text-muted-foreground">
              Real experiences from students like you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-stress-medium fill-stress-medium" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${testimonial.color} flex items-center justify-center text-xl`}>
                    {testimonial.avatar}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{testimonial.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="gradient-calm rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-card/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-card shadow-hover flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Your Mental Health Matters
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Take the first step today. Join thousands of students who have found support, 
                community, and hope through MindCare.
              </p>
              <Link to="/login">
                <Button variant="calm" size="xl">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
