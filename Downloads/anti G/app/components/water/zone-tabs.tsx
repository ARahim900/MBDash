"use client";

import React from 'react';

interface ZoneTabsProps {
    zones: { code: string; name: string }[];
    selectedZone: string;
    onZoneChange: (zone: string) => void;
}

export function ZoneTabs({ zones, selectedZone, onZoneChange }: ZoneTabsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {zones.map((zone) => {
                const isSelected = zone.code === selectedZone;
                return (
                    <button
                        key={zone.code}
                        onClick={() => onZoneChange(zone.code)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isSelected
                                ? 'bg-emerald-500 text-white shadow-md'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        {zone.name}
                    </button>
                );
            })}
        </div>
    );
}
