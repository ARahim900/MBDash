"use strict";

import React from 'react';

interface LiquidProgressRingProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    color?: string; // Hex or tailwind class if generic
    label?: string;
    sublabel?: string;
    showPercentage?: boolean;
    elementId?: string; // For gradients
}

export function LiquidProgressRing({
    value,
    max = 100,
    size = 120,
    strokeWidth = 10,
    color = "#81D8D0",
    label,
    sublabel,
    showPercentage = true,
    elementId = "ring-grad"
}: LiquidProgressRingProps) {
    const percentage = Math.min(Math.max(value / max, 0), 1);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - percentage * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="transform -rotate-90 origin-center"
                >
                    <defs>
                        <linearGradient id={`${elementId}-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={color} stopOpacity="1" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
                        </linearGradient>
                    </defs>

                    {/* Background Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(0,0,0,0.05)"
                        strokeWidth={strokeWidth}
                        fill="none"
                        className="dark:stroke-white/10"
                    />

                    {/* Progress Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={`url(#${elementId}-gradient)`}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: offset,
                            transition: "stroke-dashoffset 1s ease-in-out",
                        }}
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {showPercentage ? (
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {Math.round(percentage * 100)}%
                        </span>
                    ) : (
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                        </span>
                    )}
                </div>
            </div>

            {/* Labels */}
            {(label || sublabel) && (
                <div className="mt-2 text-center">
                    {label && (
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {label}
                        </p>
                    )}
                    {sublabel && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            {sublabel}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
