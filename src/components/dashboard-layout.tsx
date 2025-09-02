'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { SimuPatientLogo } from "@/components/icons";
import { PanelLeft } from "lucide-react";

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
        
        <Sidebar collapsible="icon" className="group-data-[collapsible=icon]:-translate-x-0 !w-64 group-data-[collapsible=icon]:!w-14 transition-all duration-300 ease-in-out z-20">
          <SidebarHeader className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <SimuPatientLogo />
              <span className="font-semibold text-lg text-primary group-data-[collapsible=icon]:hidden">SimuPatient</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {sidebarContent}
          </SidebarContent>
          <SidebarFooter className="p-4 mt-auto">
             <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center">
              <PanelLeft className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">Collapse</span>
            </Button>
          </SidebarFooter>
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
