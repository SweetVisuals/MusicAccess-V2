import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/layout/nav-main"
import { NavSecondary } from "@/components/dashboard/layout/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import { Progress } from "@/components/@/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/@/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/user/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Orders",
      url: "#",
      icon: UsersIcon,
    },
    {
      title: "Manage Files",
      url: "/dashboard/projects",
      icon: FolderIcon,
    },
    {
      title: "Post A Service",
      url: "/dashboard/services",
      icon: DatabaseIcon,
    },
    {
      title: "Contracts",
      url: "/dashboard/contracts",
      icon: FileTextIcon,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Sales",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      title: "Payments",
      url: "#",
      icon: ListIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Music Access.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        
        {/* Storage Progress Bar */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              Storage
            </span>
            <span className="text-xs pb-2 font-medium text-muted-foreground">
              25% used
            </span>
          </div>
          <Progress 
            value={25} 
            className="h-2 bg-gray-200 dark:bg-gray-700 [&>div]:bg-blue-600 dark:[&>div]:bg-blue-400"
          />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}