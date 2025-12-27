"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Droplets,
    Zap,
    Activity,
    Users,
    HardHat,
    Bug,
    Boxes,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
    },
    {
        label: "Water",
        icon: Droplets,
        href: "/water",
    },
    {
        label: "Electricity",
        icon: Zap,
        href: "/electricity",
    },
    {
        label: "STP",
        icon: Activity,
        href: "/stp",
    },
    {
        label: "Contractors",
        icon: Users,
        href: "/contractors",
    },
    {
        label: "Firefighting",
        icon: HardHat,
        href: "/firefighting",
    },
    {
        label: "Pest Control",
        icon: Bug,
        href: "/pest-control",
    },
    {
        label: "Assets",
        icon: Boxes,
        href: "/assets",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
]

interface SidebarProps {
    className?: string;
    isCollapsed?: boolean;
    setIsCollapsed?: (value: boolean) => void;
}

export function Sidebar({ className, isCollapsed = false, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname()

    const toggleCollapse = () => {
        if (setIsCollapsed) {
            setIsCollapsed(!isCollapsed)
        }
    }

    return (
        <div
            className={cn(
                "relative py-4 flex flex-col h-full text-white transition-all duration-300",
                isCollapsed ? "w-20" : "w-72",
                className
            )}
            style={{ background: "linear-gradient(180deg, #4E4456 0%, #3A3341 100%)" }}
        >
            {/* Collapse Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapse}
                className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-white/20 bg-[var(--mb-primary)] hover:bg-[var(--mb-primary-hover)] text-white"
            >
                {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                ) : (
                    <ChevronLeft className="h-4 w-4" />
                )}
            </Button>

            <div className="px-3 py-2 flex-1">
                {/* Logo */}
                <Link href="/" className={cn(
                    "flex items-center mb-10 transition-all duration-300",
                    isCollapsed ? "justify-center px-0" : "pl-3"
                )}>
                    <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Muscat Bay Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold ml-3 whitespace-nowrap">
                            Muscat Bay
                        </h1>
                    )}
                </Link>

                {/* Navigation Links */}
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            title={isCollapsed ? route.label : undefined}
                            className={cn(
                                "text-sm group flex p-3 w-full font-medium cursor-pointer rounded-lg transition-all duration-200",
                                isCollapsed ? "justify-center" : "justify-start",
                                pathname === route.href
                                    ? "text-white bg-white/15"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                            )}
                        >
                            <div className={cn(
                                "flex items-center",
                                isCollapsed ? "" : "flex-1"
                            )}>
                                <route.icon className="h-5 w-5 text-white flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="ml-3">{route.label}</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
