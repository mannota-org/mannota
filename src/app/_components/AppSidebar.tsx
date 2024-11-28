"use client";
import { Calendar, History, Home, Inbox, Search, Settings } from "lucide-react";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`relative ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
    >
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <div className="mx-2 mt-8 mb-6 flex flex-row items-center gap-2">
                  <Image src="/logo.png" alt="logo" width={26} height={26} />
                  <span className="text-xl font-bold">Mannota</span>
                  <div className="flex-grow" />
                  <UserButton />
                </div>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="mb-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger
        onClick={toggleSidebar}
        className="absolute right-[-40px] top-[55px] z-10 -translate-y-1/2 transform"
      />
    </div>
  );
}