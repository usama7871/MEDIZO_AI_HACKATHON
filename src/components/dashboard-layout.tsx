'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MedizoAiLogo } from "@/components/icons";
import { useMotionValue, useSpring, motion } from "framer-motion";
import React from "react";


type DashboardLayoutProps = {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
};

export default function DashboardLayout({ children, sidebarContent }: DashboardLayoutProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 100, stiffness: 200, mass: 1 };
    const mouseXSpring = useSpring(mouseX, springConfig);
    const mouseYSpring = useSpring(mouseY, springConfig);


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

  return (
    <SidebarProvider>
      <div 
        onMouseMove={handleMouseMove}
        className="min-h-screen w-full bg-background text-foreground flex relative overflow-hidden"
       >
         <motion.div
            className="pointer-events-none fixed left-0 top-0 z-0 h-96 w-96 rounded-full opacity-50 blur-[100px]"
            style={{
                translateX: mouseXSpring,
                translateY: mouseYSpring,
                x: '-50%',
                y: '-50%',
                background:
                'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 80%)',
            }}
        />
         <div className="absolute inset-0 z-0 bg-grid-pattern opacity-10" />
        
        <Sidebar 
          collapsible="icon" 
          className="group-data-[collapsible=icon]:-translate-x-0 !w-72 group-data-[collapsible=icon]:!w-16 transition-all duration-300 ease-in-out z-20"
        >
            <div className="flex h-16 items-center justify-between p-4 border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                    <MedizoAiLogo className="h-8 w-8 text-primary" />
                    <span className="font-semibold text-lg text-primary group-data-[collapsible=icon]:hidden font-headline">Medizo AI</span>
                </div>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
                {sidebarContent}
            </div>
        </Sidebar>

        <div className="flex flex-col w-full z-10">
           <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/50 px-6 backdrop-blur-sm">
            <SidebarTrigger className="flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground/80 font-headline hidden md:block">
              AI-Powered Medical Simulation
            </h2>
          </header>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
