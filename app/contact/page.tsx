"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { companyInfo } from "@/data/company";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, send data to backend here
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="pt-32 pb-24 relative overflow-hidden min-h-screen">
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight">
              Have an idea? <br />
              <span className="text-gradient">Let's build it.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-md">
              We're ready to partner with you to turn your vision into a robust digital reality. Reach out to discuss your project.
            </p>
            
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold font-heading text-lg">Email Us</h4>
                  <a href={`mailto:${companyInfo.contact.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {companyInfo.contact.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold font-heading text-lg">Call Us</h4>
                  <a href={`tel:${companyInfo.contact.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {companyInfo.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold font-heading text-lg">Global Remote</h4>
                  <p className="text-muted-foreground">
                    Available worldwide.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card p-8 md:p-10 rounded-2xl">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-primary" />
                  <h3 className="text-2xl font-bold font-heading">Message Sent!</h3>
                  <p className="text-muted-foreground">We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-medium">Service Interested In</label>
                    <select 
                      id="service" 
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                    >
                      <option value="web">Website Development</option>
                      <option value="app">App Development</option>
                      <option value="automation">Business Automation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="details" className="text-sm font-medium">Project Details</label>
                    <textarea 
                      required
                      id="details" 
                      rows={5}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <MagneticButton type="submit" className="w-full">
                    Send Project Request
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
