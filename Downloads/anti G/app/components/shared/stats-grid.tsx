
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

export type StatVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "water";

interface StatItem {
    label: string;
    value: string;
    subtitle?: string;
    icon: LucideIcon;
    variant?: StatVariant; // Use semantic color variant
    color?: string; // Fallback: Optional text color class
    bgColor?: string; // Fallback: Optional bg color class for icon container
    trend?: 'up' | 'down' | 'neutral'; // Trend direction
    trendValue?: string; // e.g., "+5.2%" or "-3.1%"
}

interface StatsGridProps {
    stats: StatItem[];
    className?: string;
}

// Map variants to CSS custom properties
const variantStyles: Record<StatVariant, { bg: string; text: string }> = {
    primary: { bg: "bg-[var(--mb-primary-light)]/20", text: "text-[var(--mb-primary)]" },
    secondary: { bg: "bg-[var(--mb-secondary)]/20", text: "text-[var(--mb-secondary-active)]" },
    success: { bg: "bg-[var(--mb-success-light)]", text: "text-[var(--mb-success)]" },
    warning: { bg: "bg-[var(--mb-warning-light)]", text: "text-[var(--mb-warning)]" },
    danger: { bg: "bg-[var(--mb-danger-light)]", text: "text-[var(--mb-danger)]" },
    info: { bg: "bg-[var(--mb-info-light)]", text: "text-[var(--mb-info)]" },
    water: { bg: "bg-[var(--mb-water-light)]", text: "text-[var(--mb-water)]" },
};

export function StatsGrid({ stats, className }: StatsGridProps) {
    return (
        <div className={cn("grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", className)}>
            {stats.map((stat, index) => {
                const variant = stat.variant || "primary";
                const styles = variantStyles[variant];

                return (
                    <Card key={index} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                                    {stat.trend && stat.trendValue && (
                                        <span className={cn(
                                            "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
                                            stat.trend === 'up' ? "text-mb-success bg-mb-success-light dark:text-mb-success-hover dark:bg-mb-success-light/20" :
                                                stat.trend === 'down' ? "text-mb-danger bg-mb-danger-light dark:text-mb-danger-hover dark:bg-mb-danger-light/20" :
                                                    "text-mb-primary bg-mb-primary-light/20 dark:text-mb-primary-light dark:bg-mb-primary-light/10"
                                        )}>
                                            {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                                            {stat.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                                            {stat.trend === 'neutral' && <Minus className="w-3 h-3" />}
                                            {stat.trendValue}
                                        </span>
                                    )}
                                </div>
                                {stat.subtitle && (
                                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                                )}
                            </div>
                            <div className={cn(
                                "p-3 rounded-full",
                                stat.bgColor || styles.bg
                            )}>
                                <stat.icon className={cn(
                                    "w-6 h-6",
                                    stat.color || styles.text
                                )} />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

