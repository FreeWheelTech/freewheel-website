"use client";

import { motion } from "framer-motion";
import { teamMembers } from "@/data/team";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Team = () => {
  return (
    <section className="py-24 relative bg-background/50 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">
              Meet The Team
            </h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold">
              The minds behind the magic
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            <button className="p-3 rounded-full border border-border hover:border-primary hover:text-primary transition-colors glass-card">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-full border border-border hover:border-primary hover:text-primary transition-colors glass-card">
              <ChevronRight className="w-5 h-5" />
            </button>
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
              className="glass-card rounded-xl overflow-hidden group glass-card-hover"
            >
              <div className="relative aspect-square">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${member.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
              </div>
              <div className="p-6 text-center relative z-10 -mt-10">
                <h4 className="text-lg font-heading font-bold">{member.name}</h4>
                <p className="text-sm text-primary mb-4">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
