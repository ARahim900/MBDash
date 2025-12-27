"use client";

import React from 'react';

interface CircularGaugeProps {
    value: number;
    maxValue?: number;
    label: string;
    sublabel?: string;
    color?: 'emerald' | 'teal' | 'red' | 'amber' | 'blue' | 'purple' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'plum';
    size?: 'sm' | 'md' | 'lg';
    showPercentage?: boolean;
}

const COLOR_CLASSES = {
    emerald: { stroke: 'stroke-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    teal: { stroke: 'stroke-teal-500', text: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/20' },
    red: { stroke: 'stroke-red-500', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
    amber: { stroke: 'stroke-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    blue: { stroke: 'stroke-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    purple: { stroke: 'stroke-purple-500', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    // New Theme Colors
    primary: { stroke: 'stroke-mb-primary', text: 'text-mb-primary dark:text-mb-primary-light', bg: 'bg-mb-primary-light/20' },
    secondary: { stroke: 'stroke-mb-secondary', text: 'text-mb-secondary-foreground dark:text-mb-secondary-foreground', bg: 'bg-mb-secondary/10' },
    success: { stroke: 'stroke-mb-success', text: 'text-mb-success dark:text-mb-success-hover', bg: 'bg-mb-success-light/20' },
    warning: { stroke: 'stroke-mb-warning', text: 'text-mb-warning dark:text-mb-warning', bg: 'bg-mb-warning-light/20' },
    danger: { stroke: 'stroke-mb-danger', text: 'text-mb-danger dark:text-mb-danger-hover', bg: 'bg-mb-danger-light/20' },
    plum: { stroke: 'stroke-mb-primary', text: 'text-mb-primary dark:text-mb-primary-light', bg: 'bg-mb-primary-light/20' }, // Fallback alias
};

const SIZE_CLASSES = {
    sm: { container: 'w-24 h-24', text: 'text-lg', sublabel: 'text-xs', strokeWidth: 6, radius: 40 },
    md: { container: 'w-32 h-32', text: 'text-2xl', sublabel: 'text-sm', strokeWidth: 8, radius: 54 },
    lg: { container: 'w-40 h-40', text: 'text-3xl', sublabel: 'text-base', strokeWidth: 10, radius: 68 },
};

export function CircularGauge({
    value,
    maxValue = 100,
    label,
    sublabel,
    color = 'emerald',
    size = 'md',
    showPercentage = false
}: CircularGaugeProps) {
    const colorClasses = COLOR_CLASSES[color];
    const sizeClasses = SIZE_CLASSES[size];

    const percentage = Math.min((value / maxValue) * 100, 100);
    const circumference = 2 * Math.PI * sizeClasses.radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const formatValue = (val: number) => {
        if (val >= 1000) {
            return `${(val / 1000).toFixed(1)}k`;
        }
        return val.toLocaleString('en-US');
    };

    return (
        <div className={`flex flex-col items-center ${colorClasses.bg} rounded-2xl p-6`}>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 text-center">
                {label}
            </div>
            <div className={`relative ${sizeClasses.container}`}>
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    {/* Background circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r={sizeClasses.radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={sizeClasses.strokeWidth}
                        className="text-slate-200 dark:text-slate-700"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r={sizeClasses.radius}
                        fill="none"
                        strokeWidth={sizeClasses.strokeWidth}
                        strokeLinecap="round"
                        className={colorClasses.stroke}
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                            transition: 'stroke-dashoffset 0.5s ease-in-out'
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`font-bold ${sizeClasses.text} text-slate-800 dark:text-slate-100`}>
                        {formatValue(value)}
                    </span>
                    {showPercentage && (
                        <span className={`${sizeClasses.sublabel} ${colorClasses.text} font-medium`}>
                            {percentage.toFixed(1)}%
                        </span>
                    )}
                </div>
            </div>
            {sublabel && (
                <div className={`mt-2 ${sizeClasses.sublabel} text-slate-500 dark:text-slate-400 text-center`}>
                    {sublabel}
                </div>
            )}
        </div>
    );
}
