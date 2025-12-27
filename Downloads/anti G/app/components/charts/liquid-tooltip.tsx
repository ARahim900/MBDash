"use strict";

import { TooltipProps } from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LiquidTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card px-4 py-3 border border-white/50 shadow-xl !rounded-xl !bg-white/80 dark:!bg-slate-900/80 backdrop-blur-md">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-slate-500 dark:text-slate-400 capitalize">
                            {entry.name}:
                        </span>
                        <span className="font-mono font-medium text-slate-700 dark:text-slate-200">
                            {typeof entry.value === 'number'
                                ? entry.value >= 1000
                                    ? `${(entry.value / 1000).toFixed(1)}k`
                                    : entry.value.toLocaleString()
                                : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};
