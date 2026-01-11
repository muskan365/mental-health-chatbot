import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg text-foreground">MindCare</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Supporting student mental wellness through accessible, compassionate digital care. 
              You're not alone on this journey.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/resources" className="text-sm text-muted-foreground hover:text-primary transition-colors">Self-Help Articles</Link></li>
              <li><Link to="/assessment" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mental Health Assessment</Link></li>
              <li><Link to="/chatbot" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Support</Link></li>
              <li><Link to="/booking" className="text-sm text-muted-foreground hover:text-primary transition-colors">Counsellor Booking</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/forum" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community Forum</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 MindCare. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            If you're in crisis, please call emergency services or a crisis hotline.
          </p>
        </div>
      </div>
    </footer>
  );
};
