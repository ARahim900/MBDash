
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TabItem {
    key: string;
    label: string;
    icon?: LucideIcon;
}

interface TabNavigationProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (key: string) => void;
    className?: string;
}

export function TabNavigation({ tabs, activeTab, onTabChange, className }: TabNavigationProps) {
    return (
        <div className={cn("flex flex-wrap gap-2 pb-4 border-b overflow-x-auto", className)}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <Button
                        key={tab.key}
                        variant="ghost"
                        size="sm"
                        onClick={() => onTabChange(tab.key)}
                        className={cn(
                            "gap-2 transition-all",
                            isActive
                                ? "bg-[var(--mb-primary)] text-[var(--mb-primary-foreground)] shadow-sm hover:bg-[var(--mb-primary-hover)]"
                                : "text-muted-foreground hover:bg-[var(--mb-primary)] hover:text-[var(--mb-primary-foreground)]"
                        )}
                    >
                        {tab.icon && <tab.icon className="w-4 h-4" />}
                        {tab.label}
                    </Button>
                );
            })}
        </div>
    );
}
