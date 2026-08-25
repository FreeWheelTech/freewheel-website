"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowUp, Send, CheckCircle2, MapPin } from "lucide-react";
import { companyInfo } from "@/data/company";
import { Logo } from "./Logo";

export const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-card/90 border-t border-border/80 pt-20 pb-10 relative overflow-hidden">
      {/* Subtle bottom ambient tone */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-32 bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6 group">
              <Logo size="md" />
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
              {companyInfo.description}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href={companyInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 bg-background border border-border/80 rounded-xl hover:border-primary hover:text-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center text-muted-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a
                href={companyInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-background border border-border/80 rounded-xl hover:border-primary hover:text-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center text-muted-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors inline-block">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors inline-block">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
              Contact & Support
            </h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="p-2 rounded-lg bg-background border border-border mt-0.5">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground/80 font-medium">Email Us</span>
                  <a
                    href={`mailto:${companyInfo.contact.email}`}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {companyInfo.contact.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="p-2 rounded-lg bg-background border border-border mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground/80 font-medium">Location</span>
                  <span className="text-foreground font-medium">Remote & Global Delivery</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
              Stay Connected
            </h4>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Subscribe to our monthly tech insights and digital growth updates.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="px-3.5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-bright transition-colors shadow-md shadow-primary/20 flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>All systems operational • Accepting new projects</span>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} FreeWheel Technology Solutions. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
