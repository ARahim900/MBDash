"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Droplets, ChevronsRight, Users, AlertTriangle, ArrowRightLeft,
    BarChart3, TestTube2, Database, Network, Minus, TrendingUp,
    Gauge, Building2, Calendar, Activity, Loader2
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, BarChart, Bar, Cell, LineChart, Line
} from "recharts";

// Water data imports
import {
    WATER_METERS as MOCK_WATER_METERS, AVAILABLE_MONTHS, ZONE_CONFIG,
    getConsumption, WaterMeter
} from "@/lib/water-data";

// Supabase imports
import { getWaterMetersFromSupabase, isSupabaseConfigured } from "@/lib/supabase";

// Components
import { DateRangePicker } from "@/components/water/date-range-picker";
import { TypeFilterPills } from "@/components/water/type-filter-pills";
// import { CircularGauge } from "@/components/water/circular-gauge"; // Removed
import { LiquidProgressRing } from "../../components/charts/liquid-progress-ring";
import { LiquidTooltip } from "../../components/charts/liquid-tooltip";
import { MeterTable } from "@/components/water/meter-table";
import { ZoneTabs } from "@/components/water/zone-tabs";
import { AnomalyAlerts } from "@/components/water/anomaly-alerts";
import { WaterNetworkHierarchy } from "@/components/water/network-hierarchy";

// Dashboard view type
type DashboardView = 'monthly' | 'daily' | 'hierarchy';
type MonthlyTab = 'overview' | 'zone' | 'consumption' | 'database';

// Helper functions that work with dynamic data
function calculateRangeAnalysisFromData(meters: WaterMeter[], startMonth: string, endMonth: string) {
    const startIdx = AVAILABLE_MONTHS.indexOf(startMonth);
    const endIdx = AVAILABLE_MONTHS.indexOf(endMonth);
    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return { A1: 0, A2: 0, A3Bulk: 0, A3Individual: 0, stage1Loss: 0, stage2Loss: 0, totalLoss: 0, efficiency: 0, lossPercentage: 0 };

    const months = AVAILABLE_MONTHS.slice(startIdx, endIdx + 1);

    const l1Meters = meters.filter(m => m.level === 'L1');
    const l2Meters = meters.filter(m => m.level === 'L2');
    const l3Meters = meters.filter(m => m.level === 'L3');
    const l4Meters = meters.filter(m => m.level === 'L4');
    const dcMeters = meters.filter(m => m.level === 'DC');

    const sumConsumption = (meterList: WaterMeter[]) =>
        meterList.reduce((sum, m) => sum + months.reduce((s, month) => s + getConsumption(m, month), 0), 0);

    const A1 = sumConsumption(l1Meters);
    const A2 = sumConsumption(l2Meters) + sumConsumption(dcMeters);
    const l3NonBuildings = l3Meters.filter(m => !m.type.includes('Building_Bulk'));
    const A3Individual = sumConsumption(l3NonBuildings) + sumConsumption(l4Meters) + sumConsumption(dcMeters);
    const A3Bulk = sumConsumption(l3Meters) + sumConsumption(dcMeters);

    const stage1Loss = A1 - A2;
    const stage2Loss = A2 - A3Individual;
    const totalLoss = A1 - A3Individual;
    const efficiency = A1 > 0 ? Math.round((A3Individual / A1) * 1000) / 10 : 0;
    const lossPercentage = A1 > 0 ? Math.round((totalLoss / A1) * 1000) / 10 : 0;

    return { A1, A2, A3Bulk, A3Individual, stage1Loss, stage2Loss, totalLoss, efficiency, lossPercentage };
}

function getMonthlyTrendsFromData(meters: WaterMeter[], startMonth: string, endMonth: string) {
    const startIdx = AVAILABLE_MONTHS.indexOf(startMonth);
    const endIdx = AVAILABLE_MONTHS.indexOf(endMonth);
    if (startIdx === -1 || endIdx === -1) return [];

    return AVAILABLE_MONTHS.slice(startIdx, endIdx + 1).map(month => {
        const l1Meters = meters.filter(m => m.level === 'L1');
        const l2Meters = meters.filter(m => m.level === 'L2');
        const l3Meters = meters.filter(m => m.level === 'L3');
        const l4Meters = meters.filter(m => m.level === 'L4');
        const dcMeters = meters.filter(m => m.level === 'DC');

        const A1 = l1Meters.reduce((sum, m) => sum + getConsumption(m, month), 0);
        const A2 = l2Meters.reduce((sum, m) => sum + getConsumption(m, month), 0) + dcMeters.reduce((sum, m) => sum + getConsumption(m, month), 0);
        const l3NonBuildings = l3Meters.filter(m => !m.type.includes('Building_Bulk'));
        const A3Individual = l3NonBuildings.reduce((sum, m) => sum + getConsumption(m, month), 0) + l4Meters.reduce((sum, m) => sum + getConsumption(m, month), 0) + dcMeters.reduce((sum, m) => sum + getConsumption(m, month), 0);

        const stage1Loss = A1 - A2;
        const stage2Loss = A2 - A3Individual;
        const totalLoss = A1 - A3Individual;

        return { month, A1, A2, A3Individual, stage1Loss, stage2Loss, totalLoss };
    });
}

function calculateZoneAnalysisFromData(meters: WaterMeter[], zone: string, month: string) {
    const config = ZONE_CONFIG.find(z => z.code === zone);
    if (!config) return { zone, zoneName: zone, bulkMeterReading: 0, individualTotal: 0, loss: 0, lossPercentage: 0, efficiency: 0, meterCount: 0 };

    const bulkMeter = meters.find(m => m.accountNumber === config.bulkMeterAccount);
    const bulkMeterReading = bulkMeter ? getConsumption(bulkMeter, month) : 0;
    const zoneMeters = meters.filter(m => m.zone === zone && (m.level === 'L3' || m.level === 'L4'));
    const l3Meters = zoneMeters.filter(m => m.level === 'L3' && !m.type.includes('Building_Bulk'));
    const l4Meters = zoneMeters.filter(m => m.level === 'L4');
    const individualTotal = l3Meters.reduce((sum, m) => sum + getConsumption(m, month), 0) + l4Meters.reduce((sum, m) => sum + getConsumption(m, month), 0);

    const loss = bulkMeterReading - individualTotal;
    const lossPercentage = bulkMeterReading > 0 ? Math.round((loss / bulkMeterReading) * 1000) / 10 : 0;
    const efficiency = bulkMeterReading > 0 ? Math.round((individualTotal / bulkMeterReading) * 1000) / 10 : 0;

    return { zone, zoneName: config.name, bulkMeterReading, individualTotal, loss, lossPercentage, efficiency, meterCount: zoneMeters.length };
}

function getAllZonesAnalysisFromData(meters: WaterMeter[], month: string) {
    return ZONE_CONFIG.map(config => calculateZoneAnalysisFromData(meters, config.code, month));
}

function getMeterCountsByLevelFromData(meters: WaterMeter[]) {
    return ['L1', 'L2', 'L3', 'L4', 'DC'].map(level => ({ level, count: meters.filter(m => m.level === level).length }));
}

export default function WaterPage() {
    const [dashboardView, setDashboardView] = useState<DashboardView>('monthly');
    const [monthlyTab, setMonthlyTab] = useState<MonthlyTab>('overview');
    const [startMonth, setStartMonth] = useState('Jan-25');
    const [endMonth, setEndMonth] = useState('Oct-25');
    const [selectedZone, setSelectedZone] = useState('Zone_01_(FM)');
    const [selectedType, setSelectedType] = useState('All');

    // Supabase data state
    const [waterMeters, setWaterMeters] = useState<WaterMeter[]>(MOCK_WATER_METERS);
    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState<'supabase' | 'mock'>('mock');

    // Fetch water data from Supabase on mount
    useEffect(() => {
        async function fetchWaterData() {
            setIsLoading(true);
            try {
                if (isSupabaseConfigured()) {
                    const supabaseData = await getWaterMetersFromSupabase();
                    if (supabaseData.length > 0) {
                        setWaterMeters(supabaseData);
                        setDataSource('supabase');
                        console.log(`Water data loaded from Supabase: ${supabaseData.length} meters`);
                    } else {
                        setWaterMeters(MOCK_WATER_METERS);
                        setDataSource('mock');
                        console.log('No Supabase data, using mock data');
                    }
                } else {
                    setWaterMeters(MOCK_WATER_METERS);
                    setDataSource('mock');
                    console.log('Supabase not configured, using mock data');
                }
            } catch (error) {
                console.error('Error fetching water data:', error);
                setWaterMeters(MOCK_WATER_METERS);
                setDataSource('mock');
            } finally {
                setIsLoading(false);
            }
        }
        fetchWaterData();
    }, []);

    // Calculate analysis data using the loaded meters
    const rangeAnalysis = useMemo(() =>
        calculateRangeAnalysisFromData(waterMeters, startMonth, endMonth), [waterMeters, startMonth, endMonth]);

    const monthlyTrends = useMemo(() =>
        getMonthlyTrendsFromData(waterMeters, startMonth, endMonth), [waterMeters, startMonth, endMonth]);

    const zoneAnalysis = useMemo(() =>
        calculateZoneAnalysisFromData(waterMeters, selectedZone, endMonth), [waterMeters, selectedZone, endMonth]);

    const allZones = useMemo(() =>
        getAllZonesAnalysisFromData(waterMeters, endMonth), [waterMeters, endMonth]);

    const meterCounts = useMemo(() => getMeterCountsByLevelFromData(waterMeters), [waterMeters]);

    // Get unique types for filter
    const uniqueTypes = useMemo(() => {
        const types = new Set(waterMeters.map(m => m.type));
        return ['All', ...Array.from(types)];
    }, [waterMeters]);

    // Filter meters by type
    const filteredMeters = useMemo(() => {
        if (selectedType === 'All') return waterMeters;
        return waterMeters.filter(m => m.type === selectedType);
    }, [waterMeters, selectedType]);

    // Calculate total consumption for filtered data
    const totalConsumption = useMemo(() => {
        const startIdx = AVAILABLE_MONTHS.indexOf(startMonth);
        const endIdx = AVAILABLE_MONTHS.indexOf(endMonth);
        const months = AVAILABLE_MONTHS.slice(startIdx, endIdx + 1);
        return filteredMeters.reduce((total, meter) => {
            return total + months.reduce((sum, m) => sum + getConsumption(meter, m), 0);
        }, 0);
    }, [filteredMeters, startMonth, endMonth]);

    // Find highest consumer
    const highestConsumer = useMemo(() => {
        let max = { meter: waterMeters[0], total: 0 };
        const startIdx = AVAILABLE_MONTHS.indexOf(startMonth);
        const endIdx = AVAILABLE_MONTHS.indexOf(endMonth);
        const months = AVAILABLE_MONTHS.slice(startIdx, endIdx + 1);

        filteredMeters.forEach(meter => {
            const total = months.reduce((sum, m) => sum + getConsumption(meter, m), 0);
            if (total > max.total) max = { meter, total };
        });
        return max;
    }, [filteredMeters, startMonth, endMonth]);

    // Sample anomalies for demo
    const anomalies = useMemo(() => [
        {
            id: '1',
            type: 'high_loss' as const,
            title: 'High Water Loss',
            description: `Water loss of 12.5 m³ was significantly higher than the average of -11.1 m³`,
            date: 'Nov 1, 2025',
            severity: 'critical' as const
        },
        {
            id: '2',
            type: 'high_consumption' as const,
            title: 'High Consumption',
            description: `Individual consumption of 89.2 m³ was significantly higher than the average of 60.7 m³`,
            date: 'Nov 3, 2025',
            severity: 'warning' as const
        },
    ], []);

    const handleRangeChange = (start: string, end: string) => {
        setStartMonth(start);
        setEndMonth(end);
    };

    const handleResetRange = () => {
        setStartMonth('Jan-25');
        setEndMonth('Oct-25');
    };

    // Consumption by type chart data
    const consumptionChartData = useMemo(() => {
        const typeConsumption: Record<string, number> = {};
        const startIdx = AVAILABLE_MONTHS.indexOf(startMonth);
        const endIdx = AVAILABLE_MONTHS.indexOf(endMonth);
        const months = AVAILABLE_MONTHS.slice(startIdx, endIdx + 1);

        waterMeters.forEach(meter => {
            const total = months.reduce((sum, m) => sum + getConsumption(meter, m), 0);
            typeConsumption[meter.type] = (typeConsumption[meter.type] || 0) + total;
        });

        return Object.entries(typeConsumption)
            .map(([type, total]) => ({ type, total }))
            .sort((a, b) => b.total - a.total);
    }, [startMonth, endMonth]);

    const TYPE_COLORS = {
        'Main BULK': '#5BA88B', // Success/Green
        'Retail': '#C95D63', // Danger/Red
        'Zone Bulk': '#81D8D0', // Secondary/Teal
        'Residential (Villa)': '#4E4456', // Primary/Plum
        'IRR_Servies': '#E8A838', // Warning/Amber
        'D_Building_Bulk': '#81D8D0', // Teal
        'Residential (Apart)': '#6B5F73', // Primary Light
        'MB_Common': '#374151', // Neutral
        'Building': '#E8A838', // Warning
        'D_Building_Common': '#4E4456' // Primary
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Water System Analysis</h1>
                        {isLoading ? (
                            <span className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Loading...
                            </span>
                        ) : (
                            <span className={`px-2 py-1 text-xs rounded-full ${dataSource === 'supabase'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                }`}>
                                {dataSource === 'supabase' ? '🔗 Supabase' : '📊 Demo Data'}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred analysis view</p>
                </div>

                {/* Dashboard View Toggle */}
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setDashboardView('monthly')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${dashboardView === 'monthly'
                            ? 'bg-mb-secondary text-mb-secondary-foreground shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Monthly Dashboard
                    </button>
                    <button
                        onClick={() => setDashboardView('daily')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${dashboardView === 'daily'
                            ? 'bg-mb-secondary text-mb-secondary-foreground shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Daily Analysis
                    </button>
                    <button
                        onClick={() => setDashboardView('hierarchy')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${dashboardView === 'hierarchy'
                            ? 'bg-mb-secondary text-mb-secondary-foreground shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        <Network className="w-4 h-4" />
                        Water Hierarchy
                    </button>
                </div>
            </div>

            {/* Critical Water Loss Alert */}
            {rangeAnalysis.lossPercentage > 30 && (
                <div className="relative overflow-hidden rounded-lg border border-mb-danger-light dark:border-mb-danger-light/50 bg-gradient-to-r from-mb-danger-light/50 to-mb-warning-light/50 p-4">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mb-danger to-mb-warning animate-pulse" />
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-mb-danger-light flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-mb-danger animate-pulse" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-mb-danger dark:text-mb-danger-hover">Critical Water Loss Detected</h3>
                            <p className="text-sm text-mb-danger dark:text-mb-danger-hover">
                                System water loss is at <span className="font-bold">{rangeAnalysis.lossPercentage}%</span> ({rangeAnalysis.totalLoss.toLocaleString('en-US')} m³).
                                This exceeds the 30% threshold and requires immediate investigation.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-mb-danger text-white">
                                Action Required
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly Dashboard View */}
            {dashboardView === 'monthly' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <p className="text-sm text-slate-500">Monthly trends and KPI analysis</p>

                    {/* Sub-tabs */}
                    <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700">
                        {[
                            { key: 'overview', label: 'Overview', icon: BarChart3 },
                            { key: 'zone', label: 'Zone Analysis', icon: TestTube2 },
                            { key: 'consumption', label: 'Consumption by Type', icon: Activity },
                            { key: 'database', label: 'Main Database', icon: Database },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setMonthlyTab(tab.key as MonthlyTab)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${monthlyTab === tab.key
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Date Range Picker */}
                    <Card>
                        <CardContent className="pt-6">
                            <DateRangePicker
                                startMonth={startMonth}
                                endMonth={endMonth}
                                availableMonths={AVAILABLE_MONTHS}
                                onRangeChange={handleRangeChange}
                                onReset={handleResetRange}
                            />
                        </CardContent>
                    </Card>

                    {/* Overview Tab */}
                    {monthlyTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Stats Cards - Row 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase">A1 - MAIN SOURCE</p>
                                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{(rangeAnalysis.A1 / 1000).toFixed(1)}k m³</p>
                                                <p className="text-xs text-slate-400">L1 (Main source input from NAMA)</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-mb-secondary-light/30 flex items-center justify-center">
                                                <ChevronsRight className="w-5 h-5 text-mb-secondary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase">A2 - ZONE DISTRIBUTION</p>
                                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{(rangeAnalysis.A2 / 1000).toFixed(1)}k m³</p>
                                                <p className="text-xs text-slate-400">L2 Zone Bulks + Direct Connections</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-mb-primary-light/30 flex items-center justify-center">
                                                <Users className="w-5 h-5 text-mb-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase">A3 - INDIVIDUAL</p>
                                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{(rangeAnalysis.A3Individual / 1000).toFixed(1)}k m³</p>
                                                <p className="text-xs text-slate-400">L3 Villas + L4 Apartments + DC</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-mb-primary-light/20 flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-mb-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase">A3 - BULK LEVEL</p>
                                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{(rangeAnalysis.A3Bulk / 1000).toFixed(1)}k m³</p>
                                                <p className="text-xs text-slate-400">All L3 meters + Direct Connections</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Stats Cards - Row 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="bg-mb-danger-light/10 dark:bg-mb-danger-light/5 border-mb-danger-light dark:border-mb-danger-light/20">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-mb-danger-light/30 flex items-center justify-center">
                                                <Minus className="w-5 h-5 text-mb-danger" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-mb-danger uppercase">STAGE 1 LOSS</p>
                                                <p className="text-2xl font-bold text-mb-danger dark:text-mb-danger-hover">{rangeAnalysis.stage1Loss.toLocaleString('en-US')} m³</p>
                                                <p className="text-xs text-mb-danger/80">Loss Rate: {rangeAnalysis.A1 > 0 ? ((rangeAnalysis.stage1Loss / rangeAnalysis.A1) * 100).toFixed(1) : 0}%</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-mb-warning-light/10 dark:bg-mb-warning-light/5 border-mb-warning-light dark:border-mb-warning-light/20">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-mb-warning-light/30 flex items-center justify-center">
                                                <Minus className="w-5 h-5 text-mb-warning" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-mb-warning uppercase">STAGE 2 LOSS</p>
                                                <p className="text-2xl font-bold text-mb-warning dark:text-mb-warning">{rangeAnalysis.stage2Loss.toLocaleString('en-US')} m³</p>
                                                <p className="text-xs text-mb-warning/80">Loss Rate: {rangeAnalysis.A2 > 0 ? ((rangeAnalysis.stage2Loss / rangeAnalysis.A2) * 100).toFixed(1) : 0}%</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-mb-warning-light/10 dark:bg-mb-warning-light/5 border-mb-warning-light dark:border-mb-warning-light/20">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-mb-warning-light/30 flex items-center justify-center">
                                                <AlertTriangle className="w-5 h-5 text-mb-warning" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-mb-warning uppercase">TOTAL SYSTEM LOSS</p>
                                                <p className="text-2xl font-bold text-mb-warning dark:text-mb-warning">{rangeAnalysis.totalLoss.toLocaleString('en-US')} m³</p>
                                                <p className="text-xs text-mb-warning/80">Loss Rate: {rangeAnalysis.lossPercentage}%</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-mb-success-light/10 dark:bg-mb-success-light/5 border-mb-success-light dark:border-mb-success-light/20">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-mb-success-light/30 flex items-center justify-center">
                                                <ArrowRightLeft className="w-5 h-5 text-mb-success" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-mb-success uppercase">SYSTEM EFFICIENCY</p>
                                                <p className="text-2xl font-bold text-mb-success dark:text-mb-success-hover">{rangeAnalysis.efficiency}%</p>
                                                <p className="text-xs text-mb-success/80">A3 Individual / A1 Main Source</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* A-Values Distribution Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold">Water System A-Values Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="gradA1" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#4E4456" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="#4E4456" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="gradA2" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#81D8D0" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="#81D8D0" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="month" className="text-xs" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} dy={10} />
                                                <YAxis className="text-xs" tickFormatter={(v) => `${v / 1000}k`} axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                                                <Tooltip content={<LiquidTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }} />
                                                <Legend iconType="circle" />
                                                <Area type="monotone" name="A1 - Main Source" dataKey="A1" stroke="#4E4456" fill="url(#gradA1)" strokeWidth={3} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
                                                <Area type="monotone" name="A2 - Zone Distribution" dataKey="A2" stroke="#81D8D0" fill="url(#gradA2)" strokeWidth={3} animationDuration={1500} />
                                                <Area type="monotone" name="A3 - Individual" dataKey="A3Individual" stroke="#6B5F73" fill="none" strokeWidth={2} strokeDasharray="5 5" animationDuration={1500} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Water Loss Analysis Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold">Water Loss Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="gradLoss" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#C95D63" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#C95D63" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="month" className="text-xs" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} dy={10} />
                                                <YAxis className="text-xs" tickFormatter={(v) => `${v / 1000}k`} axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                                                <Tooltip content={<LiquidTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }} />
                                                <Legend iconType="circle" />
                                                <Area type="monotone" name="Total Loss" dataKey="totalLoss" stroke="#C95D63" fill="url(#gradLoss)" strokeWidth={2} strokeDasharray="5 5" animationDuration={1500} />
                                                <Line type="monotone" name="Stage 1 Loss" dataKey="stage1Loss" stroke="#E8A838" strokeWidth={2} strokeDasharray="3 3" dot={false} animationDuration={1500} />
                                                <Line type="monotone" name="Stage 2 Loss" dataKey="stage2Loss" stroke="#6B5F73" strokeWidth={2} strokeDasharray="3 3" dot={false} animationDuration={1500} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Zone Analysis Tab */}
                    {monthlyTab === 'zone' && (
                        <div className="space-y-6">
                            {/* Month/Zone Selectors */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Select Month</span>
                                            <select
                                                value={endMonth}
                                                onChange={(e) => setEndMonth(e.target.value)}
                                                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            >
                                                {AVAILABLE_MONTHS.map((m) => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Filter by Zone</span>
                                            <select
                                                value={selectedZone}
                                                onChange={(e) => setSelectedZone(e.target.value)}
                                                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            >
                                                {ZONE_CONFIG.map((z) => (
                                                    <option key={z.code} value={z.code}>{z.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => { setEndMonth('Oct-25'); setSelectedZone('Zone_01_(FM)'); }}
                                            className="px-4 py-2 text-sm font-medium text-white bg-mb-primary rounded-lg hover:bg-mb-primary-hover transition-colors"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Zone Heading */}
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                    {ZONE_CONFIG.find(z => z.code === selectedZone)?.name} Analysis for {endMonth}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    <span className="text-mb-secondary font-medium">Zone Bulk</span> = L2 only •
                                    <span className="text-mb-primary font-medium"> L3/L4 total</span> = L3 + L4 (metered for this zone) •
                                    <span className="text-mb-danger font-medium"> Difference</span> = L2 - (L3 + L4)
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <LiquidProgressRing
                                    value={zoneAnalysis.bulkMeterReading}
                                    max={Math.max(zoneAnalysis.bulkMeterReading, zoneAnalysis.individualTotal) * 1.2 || 100}
                                    label="Zone Bulk Meter Total"
                                    sublabel="Total water entering selected zone(s)"
                                    color="#81D8D0"
                                    size={160}
                                    showPercentage={false}
                                    elementId="gauge-1"
                                />
                                <LiquidProgressRing
                                    value={zoneAnalysis.individualTotal}
                                    max={Math.max(zoneAnalysis.bulkMeterReading, zoneAnalysis.individualTotal) * 1.2 || 100}
                                    label="Individual Meters Sum Total"
                                    sublabel="Recorded by individual meters (NDSS)"
                                    color="#4E4456"
                                    size={160}
                                    showPercentage={false}
                                    elementId="gauge-2"
                                />
                                <LiquidProgressRing
                                    value={Math.abs(zoneAnalysis.loss)}
                                    max={zoneAnalysis.bulkMeterReading || 100}
                                    label="Water Loss Distribution"
                                    sublabel="Leakage, meter loss, etc."
                                    color={zoneAnalysis.loss > 0 ? '#C95D63' : '#5BA88B'}
                                    size={160}
                                    showPercentage={true}
                                    elementId="gauge-3"
                                />
                            </div>

                            {/* Zone Consumption Trend Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Zone Consumption Trend</CardTitle>
                                    <p className="text-sm text-slate-500">Monthly comparison of L2 (Bulk) vs L3 + L4 totals</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={(() => {
                                                // Calculate zone-specific monthly trends
                                                return AVAILABLE_MONTHS.map(month => {
                                                    const analysis = calculateZoneAnalysisFromData(waterMeters, selectedZone, month);
                                                    return {
                                                        month,
                                                        'Zone Bulk': analysis.bulkMeterReading,
                                                        'Individual Total': analysis.individualTotal,
                                                        'Loss': Math.abs(analysis.loss)
                                                    };
                                                });
                                            })()}>
                                                <defs>
                                                    <linearGradient id="gradZoneBulk" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#81D8D0" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="#81D8D0" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="gradIndividual" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#4E4456" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="#4E4456" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="month" className="text-xs" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} dy={10} />
                                                <YAxis className="text-xs" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                                                <Tooltip content={<LiquidTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }} />
                                                <Legend iconType="circle" />
                                                <Area type="monotone" name="Individual Total" dataKey="Individual Total" stroke="#4E4456" fill="url(#gradIndividual)" strokeWidth={3} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
                                                <Line type="monotone" name="Loss" dataKey="Loss" stroke="#C95D63" strokeWidth={2} dot={false} strokeDasharray="5 5" animationDuration={1500} />
                                                <Area type="monotone" name="Zone Bulk" dataKey="Zone Bulk" stroke="#81D8D0" fill="url(#gradZoneBulk)" strokeWidth={3} animationDuration={1500} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Individual Meters Table */}
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-base">Individual Meters - Zone {ZONE_CONFIG.find(z => z.code === selectedZone)?.name}</CardTitle>
                                            <p className="text-sm text-slate-500">All individual meters (L3 Villas + L4 Building Apts) in this zone</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <MeterTable
                                        meters={waterMeters.filter(m => m.zone === selectedZone && (m.level === 'L3' || m.level === 'L4'))}
                                        months={AVAILABLE_MONTHS}
                                        pageSize={10}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Consumption by Type Tab */}
                    {monthlyTab === 'consumption' && (
                        <div className="space-y-6">
                            {/* Type Filter Pills */}
                            <TypeFilterPills
                                types={uniqueTypes}
                                selectedType={selectedType}
                                onTypeChange={setSelectedType}
                            />

                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                <Droplets className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase">TOTAL CONSUMPTION</p>
                                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalConsumption.toLocaleString('en-US')} m³</p>
                                                <p className="text-xs text-slate-400">Selected range</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <Gauge className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase">METER COUNT</p>
                                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{filteredMeters.length}</p>
                                                <p className="text-xs text-slate-400">Type: {selectedType}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                <TrendingUp className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase">HIGHEST CONSUMER</p>
                                                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate max-w-[150px]">{highestConsumer.meter.label}</p>
                                                <p className="text-xs text-slate-400">{highestConsumer.total.toLocaleString('en-US')} m³</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                <Database className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase">ACTIVE TYPES</p>
                                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{uniqueTypes.length - 1}</p>
                                                <p className="text-xs text-slate-400">Across selected range</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Consumption by Type Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Consumption by Type (m³)</CardTitle>
                                    <p className="text-sm text-slate-500">Aggregated for {startMonth} - {endMonth}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[400px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={consumptionChartData} layout="vertical" margin={{ left: 120 }}>
                                                <XAxis type="number" tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                                                <YAxis type="category" dataKey="type" width={110} className="text-xs" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                                                <Tooltip content={<LiquidTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 6 }} />
                                                <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1500}>
                                                    {consumptionChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.type as keyof typeof TYPE_COLORS] || '#6B7280'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Meter Details Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Meter Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <MeterTable meters={filteredMeters} months={AVAILABLE_MONTHS} />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Main Database Tab */}
                    {monthlyTab === 'database' && (
                        <div className="space-y-6">
                            {/* Database Summary */}
                            <Card className="bg-slate-800 text-white">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Database className="w-5 h-5" />
                                            <CardTitle className="text-base text-white">Water Meter Database Summary</CardTitle>
                                        </div>
                                        <span className="text-sm text-slate-300">{startMonth} to {endMonth}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                        <div className="p-3 rounded-lg bg-slate-700">
                                            <p className="text-xs text-slate-400">Total Meters</p>
                                            <p className="text-2xl font-bold text-white">{waterMeters.length}</p>
                                        </div>
                                        {meterCounts.map(({ level, count }) => (
                                            <div key={level} className="p-3 rounded-lg bg-slate-700">
                                                <p className="text-xs text-slate-400">{level} {level === 'DC' ? '(Direct)' : level === 'L1' ? '(Main)' : level === 'L2' ? '(Zones)' : level === 'L3' ? '(Buildings)' : '(Units)'}</p>
                                                <p className={`text-2xl font-bold ${level === 'L1' ? 'text-mb-secondary' :
                                                    level === 'L2' ? 'text-mb-secondary-active' :
                                                        level === 'L3' ? 'text-mb-primary' :
                                                            level === 'L4' ? 'text-mb-primary-light' :
                                                                'text-mb-warning'
                                                    }`}>{count}</p>
                                            </div>
                                        ))}
                                        <div className="p-3 rounded-lg bg-slate-700">
                                            <p className="text-xs text-slate-400">Active Zones</p>
                                            <p className="text-2xl font-bold text-teal-400">{ZONE_CONFIG.length}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Full Database Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Water Meter Database</CardTitle>
                                    <p className="text-sm text-slate-500">Complete meter inventory with consumption data ({startMonth} to {endMonth})</p>
                                </CardHeader>
                                <CardContent>
                                    <MeterTable meters={waterMeters} months={AVAILABLE_MONTHS} pageSize={20} />
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}

            {/* Daily Analysis View */}
            {dashboardView === 'daily' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <p className="text-sm text-slate-500">Daily consumption patterns and zone comparison</p>

                    {/* Zone Selection */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Zones</label>
                                    <ZoneTabs
                                        zones={ZONE_CONFIG.map(z => ({ code: z.code, name: z.name }))}
                                        selectedZone={selectedZone}
                                        onZoneChange={setSelectedZone}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Zone Analysis Header */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            {ZONE_CONFIG.find(z => z.code === selectedZone)?.name} Analysis
                        </h2>
                        <p className="text-sm text-slate-500">Showing data for {endMonth}</p>
                    </div>

                    {/* Circular Gauges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <LiquidProgressRing
                            value={zoneAnalysis.bulkMeterReading}
                            max={Math.max(zoneAnalysis.bulkMeterReading, zoneAnalysis.individualTotal) * 1.2}
                            label="Zone Bulk Meter Total"
                            sublabel="Total water entering selected zone(s)"
                            color="#5BA88B"
                            size={160}
                            showPercentage={true}
                            elementId="d-gauge-1"
                        />
                        <LiquidProgressRing
                            value={zoneAnalysis.individualTotal}
                            max={Math.max(zoneAnalysis.bulkMeterReading, zoneAnalysis.individualTotal) * 1.2}
                            label="Individual Meters Sum Total"
                            sublabel="Successfully recorded by individual meters"
                            color="#4E4456"
                            size={160}
                            showPercentage={true}
                            elementId="d-gauge-2"
                        />
                        <LiquidProgressRing
                            value={Math.abs(zoneAnalysis.loss)}
                            max={zoneAnalysis.bulkMeterReading || 100}
                            label="Water Loss Distribution"
                            sublabel="Unaccounted for water"
                            color={zoneAnalysis.loss > 0 ? '#C95D63' : '#5BA88B'}
                            size={160}
                            showPercentage={true}
                            elementId="d-gauge-3"
                        />
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <Card>
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-2">
                                    <Gauge className="w-5 h-5 text-mb-secondary" />
                                    <div>
                                        <p className="text-xs text-slate-500">ZONE BULK METER</p>
                                        <p className="text-lg font-bold">{zoneAnalysis.bulkMeterReading.toLocaleString()} m³</p>
                                        <p className="text-xs text-slate-400">Total input</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-mb-success" />
                                    <div>
                                        <p className="text-xs text-slate-500">INDIVIDUAL METERS TOTAL</p>
                                        <p className="text-lg font-bold">{zoneAnalysis.individualTotal.toLocaleString()} m³</p>
                                        <p className="text-xs text-slate-400">Total distributed for consumption</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-2">
                                    <Minus className="w-5 h-5 text-mb-danger" />
                                    <div>
                                        <p className="text-xs text-slate-500">WATER LOSS/VARIANCE</p>
                                        <p className="text-lg font-bold">{zoneAnalysis.loss.toLocaleString()} m³</p>
                                        <p className="text-xs text-slate-400">{zoneAnalysis.lossPercentage}% of bulk total</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-mb-primary" />
                                    <div>
                                        <p className="text-xs text-slate-500">METER COUNT</p>
                                        <p className="text-lg font-bold">{zoneAnalysis.meterCount}</p>
                                        <p className="text-xs text-slate-400">In this zone</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-2">
                                    <ArrowRightLeft className="w-5 h-5 text-mb-success" />
                                    <div>
                                        <p className="text-xs text-slate-500">ZONE EFFICIENCY</p>
                                        <p className="text-lg font-bold">{zoneAnalysis.efficiency}%</p>
                                        <p className="text-xs text-slate-400">Individual / Bulk ratio</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Anomaly Detection Report */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Anomaly Detection Report</CardTitle>
                            <p className="text-sm text-slate-500">Automated analysis of unusual patterns in {ZONE_CONFIG.find(z => z.code === selectedZone)?.name}</p>
                        </CardHeader>
                        <CardContent>
                            <AnomalyAlerts anomalies={anomalies} />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Water Hierarchy View */}
            {dashboardView === 'hierarchy' && (
                <WaterNetworkHierarchy />
            )}
        </div>
    );
}
