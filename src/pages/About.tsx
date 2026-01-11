import { Layout } from "@/components/layout/Layout";
import { Heart, Target, Eye, Users, Shield, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Compassion First",
    description: "We approach every interaction with empathy and understanding, creating a judgment-free environment.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shield,
    title: "Privacy & Safety",
    description: "Your privacy is sacred. All conversations and data are protected with the highest security standards.",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Healing happens together. Our platform fosters connection among students facing similar challenges.",
    color: "bg-mint text-mint-foreground",
  },
  {
    icon: Sparkles,
    title: "Evidence-Based",
    description: "All our resources and assessments are grounded in proven psychological research and best practices.",
    color: "bg-secondary text-secondary-foreground",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-card shadow-hover flex items-center justify-center mx-auto mb-8 animate-float">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Supporting Student Mental Wellness
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            MindCare is a digital psychological intervention platform designed specifically for students. 
            We believe that mental health support should be accessible, compassionate, and always available.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wide">Our Mission</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Making Mental Health Support Accessible to Every Student
              </h2>
              <p className="text-muted-foreground mb-6">
                We understand the unique pressures students face – academic stress, social challenges, 
                and the transition to adulthood. MindCare bridges the gap between needing help and 
                getting it, providing immediate support when professional services might have long wait times.
              </p>
              <p className="text-muted-foreground">
                Our platform combines AI-powered support, evidence-based self-assessments, 
                peer community forums, and professional counsellor access – all in one safe, 
                welcoming space.
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 shadow-card border border-border/50">
              <div className="grid grid-cols-1 gap-8">
                <div className="text-center p-6 rounded-2xl bg-stress-low/5 border border-stress-low/20">
                  <div className="text-4xl font-bold text-stress-low mb-2">24/7</div>
                  <p className="font-semibold text-foreground mb-1">Always Available</p>
                  <p className="text-sm text-muted-foreground">AI support anytime you need it</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                  <p className="font-semibold text-foreground mb-1">Students Supported</p>
                  <p className="text-sm text-muted-foreground">And growing every day</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-accent/5 border border-accent/20">
                  <div className="text-4xl font-bold text-accent-foreground mb-2">100%</div>
                  <p className="font-semibold text-foreground mb-1">Confidential</p>
                  <p className="text-sm text-muted-foreground">Your privacy is our priority</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Our Vision</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-6">
            A World Where No Student Struggles Alone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We envision a future where mental health support is as normalized as physical health care, 
            where every student has the tools and community they need to thrive, and where asking 
            for help is seen as a sign of strength.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl ${value.color} flex items-center justify-center mb-4`}>
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="gradient-lavender rounded-3xl p-8 md:p-12 text-center border border-accent/30">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of students who have taken the first step toward better mental health. 
              It's free, confidential, and we're here for you.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
