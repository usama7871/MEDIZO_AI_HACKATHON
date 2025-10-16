'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { MedizoAiLogo } from "@/components/icons";
import { LogOut, PanelLeft, ChevronsUpDown } from "lucide-react";
import UserSwitcher from "./user-switcher";

type DashboardLayoutProps = {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
};

export default function DashboardLayout({ children, sidebarContent }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background text-foreground flex relative">
         <div className="absolute inset-0 z-0 bg-grid-pattern opacity-5" />
         <div className="absolute inset-0 z-0 animated-background-pan bg-gradient-to-c from-primary/5 via-transparent to-accent/5" />
        
        <Sidebar 
          collapsible="icon" 
          className="group-data-[collapsible=icon]:-translate-x-0 !w-72 group-data-[collapsible=icon]:!w-16 transition-all duration-300 ease-in-out z-20"
        >
            <div className="flex h-16 items-center justify-between p-4 border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                    <MedizoAiLogo className="h-8 w-8" />
                    <span className="font-semibold text-lg text-primary group-data-[collapsible=icon]:hidden font-headline">Medizo AI</span>
                </div>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
                {sidebarContent}
            </div>

             <div className="p-2 border-t border-sidebar-border mt-auto">
                <UserSwitcher />
            </div>
        </Sidebar>

        <div className="flex flex-col w-full z-10">
           <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-sm">
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
