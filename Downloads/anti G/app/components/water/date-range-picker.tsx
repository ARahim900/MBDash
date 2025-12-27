"use client";

import React from 'react';
import { Calendar } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface DateRangePickerProps {
    startMonth: string;
    endMonth: string;
    availableMonths: string[];
    onRangeChange: (start: string, end: string) => void;
    onReset: () => void;
}

export function DateRangePicker({
    startMonth,
    endMonth,
    availableMonths,
    onRangeChange,
    onReset
}: DateRangePickerProps) {
    const startIndex = availableMonths.indexOf(startMonth);
    const endIndex = availableMonths.indexOf(endMonth);

    const formatMonthDisplay = (month: string) => {
        const [m, y] = month.split('-');
        const months: Record<string, string> = {
            'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
            'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
            'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
        };
        return `${months[m] || m} 20${y}`;
    };

    const handleSliderChange = (values: number[]) => {
        const newStartIndex = values[0];
        const newEndIndex = values[1];
        onRangeChange(availableMonths[newStartIndex], availableMonths[newEndIndex]);
    };

    // Quick preset handlers
    const applyPreset = (preset: 'ytd' | 'last3' | 'last6' | 'full') => {
        const lastIndex = availableMonths.length - 1;
        switch (preset) {
            case 'ytd':
                // From January to latest
                onRangeChange(availableMonths[0], availableMonths[lastIndex]);
                break;
            case 'last3':
                onRangeChange(availableMonths[Math.max(0, lastIndex - 2)], availableMonths[lastIndex]);
                break;
            case 'last6':
                onRangeChange(availableMonths[Math.max(0, lastIndex - 5)], availableMonths[lastIndex]);
                break;
            case 'full':
                onRangeChange(availableMonths[0], availableMonths[lastIndex]);
                break;
        }
    };

    return (
        <div className="space-y-5">
            {/* Title and Range Display */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date Range</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatMonthDisplay(startMonth)}</span>
                            {' – '}
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatMonthDisplay(endMonth)}</span>
                        </p>
                    </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 mr-1">Quick:</span>
                    <button
                        onClick={() => applyPreset('last3')}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Last 3M
                    </button>
                    <button
                        onClick={() => applyPreset('last6')}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Last 6M
                    </button>
                    <button
                        onClick={() => applyPreset('ytd')}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        YTD
                    </button>
                    <button
                        onClick={onReset}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-slate-600 dark:bg-slate-500 rounded-md hover:bg-slate-700 dark:hover:bg-slate-400 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Dual-Thumb Range Slider */}
            <div className="px-2">
                <Slider
                    value={[startIndex, endIndex]}
                    onValueChange={handleSliderChange}
                    max={availableMonths.length - 1}
                    min={0}
                    step={1}
                    className="w-full"
                    aria-label="Month Range"
                />
            </div>

            {/* Month Labels */}
            <div className="flex justify-between px-1 text-xs text-slate-400 dark:text-slate-500">
                {availableMonths.map((m, i) => (
                    <span
                        key={m}
                        className={`
                            ${i >= startIndex && i <= endIndex ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}
                            ${i === startIndex || i === endIndex ? 'text-emerald-700 dark:text-emerald-300 font-semibold' : ''}
                        `}
                    >
                        {m.split('-')[0]}
                    </span>
                ))}
            </div>
        </div>
    );
}

