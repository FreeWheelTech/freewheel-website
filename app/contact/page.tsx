"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { companyInfo } from "@/data/company";
import {
  Mail,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Clock,
  Send,
} from "lucide-react";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState("₹10k - ₹50k");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    details: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const budgetOptions = ["< ₹10k", "₹10k - ₹50k", "₹50k - ₹1.5L", "₹1.5L+"];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(companyInfo.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "d3bacfeb-d6c3-49aa-bf4c-ef87f4e7c447",
          name: formData.name,
          email: formData.email,
          subject: `🚀 New Project Inquiry from ${formData.name} (${formData.service})`,
          from_name: "FreeWheel Inquiries",
          service_category: formData.service,
          estimated_budget: selectedBudget,
          message: formData.details,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to submit project request.");
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", service: "", details: "" });
      setTimeout(() => {
        setIsSubmitted(false);
      }, 7000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong. Please try again or email directly.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pt-36 pb-28 relative overflow-hidden min-h-screen">
      {/* Background Atmosphere */}
      <div className="absolute top-1/4 left-0 w-[550px] h-[550px] bg-primary/[0.04] rounded-full blur-[160px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[550px] h-[550px] bg-primary-bright/[0.03] rounded-full blur-[160px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Info Column (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-6 leading-tight tracking-tight">
              Have an idea? <br />
              <span className="text-gradient">Let&apos;s build it.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed">
              We&apos;re ready to partner with you to turn your digital roadmap into high-performing software. Fill out the form or reach out directly.
            </p>

            {/* Direct Contact Cards */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Email Card with Copy button */}
              <div className="glass-card p-5 rounded-2xl flex items-center justify-between group hover:border-primary/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Email Us
                    </h3>
                    <a
                      href={`mailto:${companyInfo.contact.email}`}
                      className="text-sm font-bold font-heading text-foreground hover:text-primary transition-colors"
                    >
                      {companyInfo.contact.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  type="button"
                  aria-label="Copy Email"
                  className="p-2 rounded-lg bg-secondary/80 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Global Remote Card */}
              <div className="glass-card p-5 rounded-2xl flex items-center gap-4 group hover:border-primary/40 transition-all">
                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Worldwide Delivery
                  </h3>
                  <p className="text-sm font-bold font-heading text-foreground">
                    Available Globally • Remote-First
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time Guarantee */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Fast Response Guarantee:</strong> We review inquiries and reply within 24 business hours with initial project scope insights.
              </p>
            </div>
          </motion.div>

          {/* Right: Interactive Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-8 sm:p-10 rounded-3xl border-border/80 shadow-2xl relative overflow-hidden">
              {/* Subtle top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-bright to-[#B8860B]" />

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center min-h-[460px] text-center space-y-4 py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold font-heading text-foreground">
                    Project Request Received!
                  </h3>
                  <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                    Thank you for reaching out to FreeWheel. Our engineering lead will review your project details and respond shortly.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Send another request
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold font-heading mb-1">
                      Let&apos;s Discuss Your Project
                    </h3>
                    <p className="text-xs text-muted-foreground mb-6">
                      Provide a few details and we will put together an actionable plan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Your Name *
                      </label>
                      <input
                        required
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                        placeholder="e.g. Alex Morgan"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                        placeholder="alex@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="service" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Service Interested In *
                    </label>
                    <select
                      required
                      id="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all text-foreground"
                    >
                      <option value="">Select a service category</option>
                      <option value="web-development">Website Development & Modern Web Apps</option>
                      <option value="app-development">Mobile App Development (iOS & Android)</option>
                      <option value="business-automation">Business & Workflow Automation</option>
                      <option value="whatsapp-automation">WhatsApp Automation & API</option>
                      <option value="chatbot-integration">AI Chatbots & Conversational Agents</option>
                      <option value="final-year-project">Final Year Engineering Projects</option>
                      <option value="seo">SEO & Digital Optimization</option>
                      <option value="other">Custom Engineering Solution</option>
                    </select>
                  </div>

                  {/* Budget Selector Pills */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Estimated Project Budget
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {budgetOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedBudget(opt)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                            selectedBudget === opt
                              ? "bg-primary text-primary-foreground font-semibold border-primary shadow-sm shadow-primary/20"
                              : "bg-background border-border/80 text-muted-foreground hover:text-foreground hover:border-primary/40"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="details" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Project Goals & Details *
                    </label>
                    <textarea
                      required
                      id="details"
                      rows={4}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-sm"
                      placeholder="Tell us about what you want to build, key features, target timeline, etc."
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <MagneticButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 text-base rounded-xl font-bold shadow-lg shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Request...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        <span>Send Project Request</span>
                      </span>
                    )}
                  </MagneticButton>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
