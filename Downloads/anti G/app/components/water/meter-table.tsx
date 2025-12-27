"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from 'lucide-react';
import { WaterMeter, getConsumption } from '@/lib/water-data';

interface MeterTableProps {
    meters: WaterMeter[];
    months: string[];
    pageSize?: number;
}

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
    'L1': { bg: 'bg-mb-success', text: 'text-white' },
    'L2': { bg: 'bg-mb-primary', text: 'text-white' },
    'L3': { bg: 'bg-mb-secondary-active', text: 'text-white' },
    'L4': { bg: 'bg-mb-danger', text: 'text-white' },
    'DC': { bg: 'bg-mb-warning', text: 'text-white' },
    'N/A': { bg: 'bg-slate-400 dark:bg-slate-600', text: 'text-white' },
};

export function MeterTable({ meters, months, pageSize = 15 }: MeterTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Filter and sort meters
    const filteredMeters = useMemo(() => {
        let result = [...meters];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(m =>
                m.label.toLowerCase().includes(term) ||
                m.accountNumber.toLowerCase().includes(term) ||
                m.zone.toLowerCase().includes(term) ||
                m.type.toLowerCase().includes(term)
            );
        }

        // Sort
        if (sortField) {
            result.sort((a, b) => {
                let aVal: string | number = '';
                let bVal: string | number = '';

                if (sortField === 'label') { aVal = a.label; bVal = b.label; }
                else if (sortField === 'account') { aVal = a.accountNumber; bVal = b.accountNumber; }
                else if (sortField === 'level') { aVal = a.level; bVal = b.level; }
                else if (sortField === 'zone') { aVal = a.zone; bVal = b.zone; }
                else if (sortField === 'type') { aVal = a.type; bVal = b.type; }
                else if (months.includes(sortField)) {
                    aVal = getConsumption(a, sortField);
                    bVal = getConsumption(b, sortField);
                }

                if (typeof aVal === 'string') {
                    return sortDirection === 'asc'
                        ? aVal.localeCompare(bVal as string)
                        : (bVal as string).localeCompare(aVal);
                }
                return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
            });
        }

        return result;
    }, [meters, searchTerm, sortField, sortDirection, months]);

    const totalPages = Math.ceil(filteredMeters.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedMeters = filteredMeters.slice(startIndex, startIndex + pageSize);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const displayMonths = months.slice(-4); // Show last 4 months

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search meters..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredMeters.length)} of {filteredMeters.length} entries
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => handleSort('label')}>
                                <div className="flex items-center gap-1">Meter Label <ArrowUpDown className="w-3 h-3" /></div>
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => handleSort('account')}>
                                <div className="flex items-center gap-1">Account # <ArrowUpDown className="w-3 h-3" /></div>
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => handleSort('level')}>
                                <div className="flex items-center justify-center gap-1">Level <ArrowUpDown className="w-3 h-3" /></div>
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => handleSort('zone')}>
                                <div className="flex items-center gap-1">Zone <ArrowUpDown className="w-3 h-3" /></div>
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Parent Meter</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => handleSort('type')}>
                                <div className="flex items-center gap-1">Type <ArrowUpDown className="w-3 h-3" /></div>
                            </th>
                            {displayMonths.map(m => (
                                <th key={m} className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => handleSort(m)}>
                                    <div className="flex items-center justify-end gap-1">{m} <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedMeters.map((meter, idx) => {
                            const levelColors = LEVEL_COLORS[meter.level] || LEVEL_COLORS['N/A'];
                            return (
                                <tr key={meter.accountNumber} className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 ${idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/20'}`}>
                                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{meter.label}</td>
                                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{meter.accountNumber}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${levelColors.bg} ${levelColors.text}`}>
                                            {meter.level}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{meter.zone}</td>
                                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">{meter.parentMeter}</td>
                                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{meter.type}</td>
                                    {displayMonths.map(m => {
                                        const val = getConsumption(meter, m);
                                        return (
                                            <td key={m} className="py-3 px-4 text-right font-medium text-slate-700 dark:text-slate-300">
                                                {val > 0 ? val.toLocaleString('en-US') : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page = i + 1;
                        if (totalPages > 5) {
                            if (currentPage <= 3) page = i + 1;
                            else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                            else page = currentPage - 2 + i;
                        }
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                    ? 'bg-primary text-white'
                                    : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
