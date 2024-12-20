"use client";
import {
  Calendar,
  History,
  Home,
  Inbox,
  Search,
  Settings,
  BarChart,
} from "lucide-react";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
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
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";

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
    title: "Analysis",
    url: "/analysis",
    icon: BarChart,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentPath = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const { data: userData } = api.user.getUserByEmail.useQuery({
    email: email,
  });

  if (!userData) {
    return null;
  }

  return (
    <div
      className={`relative ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
    >
      <Sidebar className="h-screen overflow-hidden">
        <SidebarContent className="flex flex-col h-full">
          <SidebarGroup className="flex flex-col flex-grow">
            <SidebarGroupContent className="flex flex-col flex-grow overflow-y-auto">
              <SidebarMenu className="flex flex-col flex-grow px-4">
                <Link href="/" className="">
                  <div className="mx-2 mb-6 mt-8 flex flex-row items-center gap-2">
                    <Image src="/logo.png" alt="logo" width={26} height={26} />
                    <span className="text-xl font-bold">Mannota</span>
                  </div>
                </Link>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`pb-2 ${
                          currentPath === item.url ? "bg-gray-100" : ""
                        }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <div className="mt-auto mb-8">
                  <Card className="p-3">
                    <UserButton/>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      {userData.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userData.role
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                    </p>
                  </Card>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger
        onClick={toggleSidebar}
        className="absolute right-[-52px] top-[55px] z-50 -translate-y-1/2 transform"
      />
    </div>
  );
}
