"use client";

import { motion } from "framer-motion";
import { teamMembers } from "@/data/team";
import { Users, Mail, Globe } from "lucide-react";

export const Team = () => {
  return (
    <section className="py-28 relative bg-secondary/30 dark:bg-background/40 border-t border-border/80 overflow-hidden">
      {/* Ambient background blend */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-primary/[0.04] rounded-full blur-[160px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>Core Team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight">
              The minds behind the <span className="text-gradient">magic</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl overflow-hidden group glass-card-hover flex flex-col justify-between"
            >
              <div className="relative aspect-[4/4] overflow-hidden bg-muted">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${member.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-75 group-hover:opacity-60 transition-opacity" />

                {/* Role Badge */}
                <div className="absolute top-4 right-4 bg-background/85 backdrop-blur-md text-[11px] font-semibold px-3 py-1 rounded-full border border-border/80 text-primary">
                  {member.role}
                </div>
              </div>

              <div className="p-6 text-center relative z-10 -mt-6">
                <h3 className="text-xl font-heading font-bold mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-primary/90 mb-3 uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                  {member.bio}
                </p>

                {/* Social pill links */}
                <div className="flex items-center justify-center gap-2 pt-3 border-t border-border/60">
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="p-1.5 rounded-lg bg-background/80 hover:text-primary hover:bg-primary/10 transition-colors text-muted-foreground"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <a
                    href="#"
                    aria-label="Website"
                    className="p-1.5 rounded-lg bg-background/80 hover:text-primary hover:bg-primary/10 transition-colors text-muted-foreground"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="#"
                    aria-label="Contact"
                    className="p-1.5 rounded-lg bg-background/80 hover:text-primary hover:bg-primary/10 transition-colors text-muted-foreground"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
