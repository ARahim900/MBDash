"use strict";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps,
    Cell,
} from "recharts";

interface LiquidBarChartProps {
    data: any[];
    categories: string[];
    index: string;
    colors?: string[]; // Hex codes
    height?: number;
    barRadius?: [number, number, number, number];
    showGrid?: boolean;
}

const DEFAULT_COLORS = ["#4E4456", "#81D8D0", "#5BA88B"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
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
                            {Number(entry.value).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function LiquidBarChart({
    data,
    categories,
    index,
    colors = DEFAULT_COLORS,
    height = 350,
    barRadius = [8, 8, 8, 8],
    showGrid = false,
}: LiquidBarChartProps) {
    return (
        <div style={{ width: "100%", height }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={2}>
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="rgba(0,0,0,0.05)"
                        />
                    )}
                    <XAxis
                        dataKey={index}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        tickFormatter={(value) =>
                            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                        }
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(0,0,0,0.04)", radius: 8 }}
                    />
                    {categories.map((cat, i) => (
                        <Bar
                            key={cat}
                            dataKey={cat}
                            fill={colors[i % colors.length]}
                            radius={barRadius}
                            animationDuration={1500}
                            barSize={32}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
