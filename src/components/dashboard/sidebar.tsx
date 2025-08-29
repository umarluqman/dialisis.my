"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  Home,
  ShieldCheck,
  Image,
  DollarSign,
} from "lucide-react";

interface DashboardSidebarProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  const businessOwnerItems = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "My Centers",
      href: "/dashboard/centers",
      icon: Building2,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Subscription",
      href: "/dashboard/subscription",
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const adminItems = [
    {
      title: "Admin Overview",
      href: "/admin",
      icon: ShieldCheck,
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "All Centers",
      href: "/admin/centers",
      icon: Building2,
    },
    {
      title: "Subscriptions",
      href: "/admin/subscriptions",
      icon: CreditCard,
    },
    {
      title: "Pricing",
      href: "/admin/pricing",
      icon: DollarSign,
    },
    {
      title: "Default Images",
      href: "/admin/images",
      icon: Image,
    },
    {
      title: "System Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  const items = user.role === "SUPER_ADMIN" ? adminItems : businessOwnerItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}