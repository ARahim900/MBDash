"use client";

import React from 'react';

interface TypeFilterPillsProps {
    types: string[];
    selectedType: string;
    onTypeChange: (type: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
    'All': 'bg-mb-secondary-active text-white',
    'Residential (Apart)': 'bg-mb-primary-light/20 text-mb-primary dark:text-mb-primary-light',
    'D Building Bulk': 'bg-mb-secondary-light/20 text-mb-secondary-foreground dark:text-mb-secondary-foreground',
    'Zone Bulk': 'bg-mb-info-light/20 text-mb-info dark:text-mb-info',
    'Residential (Villa)': 'bg-mb-success-light/20 text-mb-success dark:text-mb-success-hover',
    'IRR Services': 'bg-mb-warning-light/20 text-mb-warning dark:text-mb-warning',
    'Retail': 'bg-mb-warning-light/30 text-mb-warning dark:text-mb-warning',
    'Main BULK': 'bg-mb-success-light/30 text-mb-success dark:text-mb-success-hover',
    'MB Common': 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    'Building': 'bg-mb-danger-light/20 text-mb-danger dark:text-mb-danger-hover',
    'D Building Common': 'bg-mb-danger-light/30 text-mb-danger dark:text-mb-danger-hover',
};

export function TypeFilterPills({ types, selectedType, onTypeChange }: TypeFilterPillsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {types.map((type) => {
                const isSelected = type === selectedType;
                const baseColors = TYPE_COLORS[type] || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                return (
                    <button
                        key={type}
                        onClick={() => onTypeChange(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isSelected
                            ? 'bg-mb-secondary-active text-white shadow-md scale-105'
                            : `${baseColors} hover:scale-105 hover:shadow-sm`
                            }`}
                    >
                        {type}
                    </button>
                );
            })}
        </div>
    );
}
