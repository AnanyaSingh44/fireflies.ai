"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, MessageSquare, Calendar, Upload, Zap, Users,
  BarChart2, Settings, MoreHorizontal, Bot, Sparkles, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { icon: Home,          label: "Home",           href: "/" },
  { icon: MessageSquare, label: "AskFred",         href: "/askfred" },
  { icon: Calendar,      label: "Meetings",        href: "/meetings" },
  { icon: Zap,           label: "Meeting Status",  href: "/status" },
  { icon: Upload,        label: "Uploads",         href: "/uploads" },
  { icon: BarChart2,     label: "Integrations",    href: "/integrations" },
  { icon: BarChart2,     label: "Analytics",       href: "/analytics" },
  { icon: Bot,           label: "Voice Agents",    href: "/voice",     badge: "NEW" },
  { icon: Sparkles,      label: "AI Skills",       href: "/ai-skills" },
  { icon: Users,         label: "Team",            href: "/team" },
  { icon: ChevronUp,     label: "Upgrade",         href: "/upgrade" },
  { icon: Settings,      label: "Settings",        href: "/settings" },
  { icon: MoreHorizontal,label: "More",            href: "/more" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[300px] min-h-screen bg-sidebar border-r border-sidebar-border text-sidebar-foreground flex flex-col py-5 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 mb-7">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-xl font-bold">F</span>
          </div>
          <span className="text-sidebar-foreground font-semibold text-2xl">fireflies.ai</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/meetings"
              ? pathname.startsWith("/meetings")
              : pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-xl text-[17px] mb-1 transition-colors group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 shrink-0",
                  isActive ? "text-purple-600" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs font-semibold bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 pt-4 border-t border-sidebar-border space-y-3">
        <ThemeToggle className="w-full justify-start" />
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-purple-600 flex items-center justify-center text-white text-base font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-sidebar-foreground truncate">Ananya</p>
            <p className="text-sm text-sidebar-foreground/60 truncate">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}