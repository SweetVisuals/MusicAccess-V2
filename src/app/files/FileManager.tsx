import { useState } from 'react';
import { AppSidebar } from "@/components/dashboard/layout/app-sidebar";
import { SiteHeader } from "@/components/dashboard/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/@/ui/sidebar";
import { FileManager as FileManagerComponent } from '@/components/upload/file-manager';

export default function FileManager() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 overflow-y-auto">
            <FileManagerComponent />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}