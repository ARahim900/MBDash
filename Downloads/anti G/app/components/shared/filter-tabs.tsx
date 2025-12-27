
import { cn } from "@/lib/utils";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterTabsProps {
    label?: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function FilterTabs({ label, options, value, onChange, className }: FilterTabsProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {label && <span className="text-sm text-muted-foreground hidden sm:inline-block">{label}:</span>}
            <div className="flex p-1 bg-[var(--mb-secondary)]/10 dark:bg-[var(--mb-primary)]/20 rounded-lg">
                {options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <button
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                isSelected
                                    ? "bg-[var(--mb-primary)] text-[var(--mb-primary-foreground)] shadow-sm"
                                    : "text-muted-foreground hover:text-[var(--mb-primary)] hover:bg-[var(--mb-secondary)]/20"
                            )}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
