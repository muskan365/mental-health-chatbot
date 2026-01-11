import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or need support? We're here to help and would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/50">
            {isSubmitted ? (
              <div className="text-center py-8 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-stress-low/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-stress-low" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. We'll get back to you within 24-48 hours.
                </p>
                <Button variant="soft" onClick={() => setIsSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-foreground mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        First Name
                      </label>
                      <Input placeholder="John" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Last Name
                      </label>
                      <Input placeholder="Doe" required />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Email Address
                    </label>
                    <Input type="email" placeholder="john@university.edu" required />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Subject
                    </label>
                    <Input placeholder="How can we help?" required />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Message
                    </label>
                    <textarea
                      placeholder="Tell us more about your inquiry..."
                      required
                      className="w-full min-h-[150px] p-4 rounded-xl bg-background border border-input resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 text-sm"
                    />
                  </div>

                  <Button type="submit" variant="calm" size="lg" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                  <p className="text-muted-foreground text-sm mb-2">For general inquiries and support</p>
                  <a href="mailto:support@solacesphere.in" className="text-primary hover:underline">
                    support@solacesphere.in
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Mental Health Helpline</h3>
                  <p className="text-muted-foreground text-sm mb-2">24/7 immediate support</p>
                  <a href="tel:+91-9152987821" className="text-primary hover:underline">
                    +91 9152987821 (Vandrevala Foundation)
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-mint flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-mint-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Response Time</h3>
                  <p className="text-muted-foreground text-sm">We typically respond within 24-48 hours during business days.</p>
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="gradient-lavender rounded-2xl p-6 border border-accent/30">
              <h3 className="font-semibold text-foreground mb-2">In Crisis?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you're experiencing a mental health emergency or having thoughts of self-harm, 
                please reach out immediately:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• AASRA Suicide Prevention: 9820466726</li>
                <li>• iCall Helpline: 9152987821</li>
                <li>• Emergency Services: 112</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
