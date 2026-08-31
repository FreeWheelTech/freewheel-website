"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { teamMembers, departmentFilters } from "@/data/team";
import { Users } from "lucide-react";
import Image from "next/image";

export const Team = () => {
  const [selectedRoleMatch, setSelectedRoleMatch] = useState<string>("All");

  const filteredMembers =
    selectedRoleMatch === "All"
      ? teamMembers
      : teamMembers.filter((m) =>
          m.departmentRoles.includes(selectedRoleMatch)
        );

  return (
    <section className="py-24 relative bg-secondary/30 dark:bg-background/40 border-t border-border/80 overflow-hidden">
      {/* Ambient background atmosphere */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[180px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-4 shadow-xs">
              <Users className="w-3.5 h-3.5" />
              <span>Executive Team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight mb-3">
              The minds behind the <span className="text-gradient">magic</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Our multidisciplinary engineering team collaborates across UI/UX, full-stack architecture, testing, project management, and client growth.
            </p>
          </motion.div>

          {/* Sleek Segmented Filter Bar */}
          <div className="mt-8 p-1.5 rounded-full bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/80 shadow-md max-w-full overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 min-w-max">
              {departmentFilters.map((dept) => {
                const isActive = selectedRoleMatch === dept.roleMatch;
                const count =
                  dept.roleMatch === "All"
                    ? teamMembers.length
                    : teamMembers.filter((m) =>
                        m.departmentRoles.includes(dept.roleMatch)
                      ).length;

                return (
                  <button
                    key={dept.label}
                    onClick={() => setSelectedRoleMatch(dept.roleMatch)}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-primary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-team-tab"
                        className="absolute inset-0 bg-primary rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>
                      {dept.label} <span className="opacity-75 text-[11px]">({count})</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3x3 Executive Grid Layout */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="group relative rounded-2xl overflow-hidden border border-border/80 bg-card hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 flex flex-col justify-end"
              >
                {/* Full Portrait Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Seamless Bottom Gradient Integration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 via-40% to-transparent pointer-events-none" />

                  {/* Translucent Corner Role Pill */}
                  <div className="absolute top-3.5 right-3.5 bg-black/65 backdrop-blur-md text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full border border-primary/30 text-primary shadow-sm">
                    {member.departmentRoles[0]}
                  </div>

                  {/* Overlaid Editorial Member Information */}
                  <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end">
                    <h3 className="text-xl font-heading font-bold text-white mb-1 group-hover:text-primary transition-colors tracking-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary/95 mb-3 uppercase tracking-wider">
                      {member.role}
                    </p>

                    {/* Department Roles Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {member.departmentRoles.map((role, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 border border-white/15"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
