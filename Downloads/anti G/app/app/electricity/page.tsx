
"use client";

import { useEffect, useState, useMemo } from "react";
import { getElectricityMeters, MeterReading } from "@/lib/mock-data";
import { getElectricityMetersFromSupabase } from "@/lib/supabase";
import { StatsGrid } from "@/components/shared/stats-grid";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, DollarSign, MapPin, TrendingUp, BarChart3, Database, Wifi, WifiOff, CalendarDays, RotateCcw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, Legend } from "recharts";
import { LiquidTooltip } from "../../components/charts/liquid-tooltip";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parse, startOfMonth, endOfMonth } from "date-fns";

export default function ElectricityPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [meters, setMeters] = useState<MeterReading[]>([]);
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState<"supabase" | "mock">("mock");
    const [analysisType, setAnalysisType] = useState<string>("All");
    const [dateRangeIndex, setDateRangeIndex] = useState<[number, number]>([0, 100]);
    const ratePerKWh = 0.025; // OMR

    useEffect(() => {
        async function loadData() {
            try {
                // Try to fetch from Supabase first
                const supabaseData = await getElectricityMetersFromSupabase();
                if (supabaseData && supabaseData.length > 0) {
                    setMeters(supabaseData);
                    setDataSource("supabase");
                    // console.log("Electricity data loaded from Supabase");
                } else {
                    // Fall back to mock data
                    const mockData = await getElectricityMeters();
                    setMeters(mockData);
                    setDataSource("mock");
                    // console.log("Electricity data loaded from mock (Supabase empty or unavailable)");
                }
            } catch (e) {
                // console.error("Failed to load electricity data from Supabase, using mock", e);
                try {
                    const mockData = await getElectricityMeters();
                    setMeters(mockData);
                    setDataSource("mock");
                } catch (mockError) {
                    // console.error("Failed to load mock data as well", mockError);
                }
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);


    const stats = useMemo(() => {
        // Calculate totals across all months
        const totalConsumption = meters.reduce((sum, meter) => {
            return sum + Object.values(meter.readings).reduce((mSum, val) => mSum + val, 0);
        }, 0);

        // Average monthly cost
        const totalCost = totalConsumption * ratePerKWh;

        // Highest consumer
        const highest = meters.reduce((max, meter) => {
            const c = Object.values(meter.readings).reduce((s, v) => s + v, 0);
            return c > max.val ? { name: meter.name, val: c } : max;
        }, { name: "N/A", val: 0 });

        return [
            {
                label: "TOTAL CONSUMPTION",
                value: `${(totalConsumption / 1000).toFixed(1)} MWh`,
                subtitle: "Jan-Oct 2025",
                icon: Zap,
                variant: "warning" as const
            },
            {
                label: "TOTAL COST",
                value: `${totalCost.toLocaleString('en-US')} OMR`,
                subtitle: `@ ${ratePerKWh} OMR/kWh`,
                icon: DollarSign,
                variant: "success" as const
            },
            {
                label: "METER COUNT",
                value: meters.length.toString(),
                subtitle: "Active Meters",
                icon: MapPin,
                variant: "water" as const
            },
            {
                label: "HIGHEST CONSUMER",
                value: highest.name,
                subtitle: `${Math.round(highest.val).toLocaleString('en-US')} kWh`,
                icon: TrendingUp,
                variant: "danger" as const
            }
        ];
    }, [meters]);

    const monthlyData = useMemo(() => {
        // Get all unique months from the data
        const allMonths = new Set<string>();
        meters.forEach(m => Object.keys(m.readings).forEach(month => allMonths.add(month)));

        // Sort months chronologically (Apr-24 format)
        const sortedMonths = Array.from(allMonths).sort((a, b) => {
            const [aMonth, aYear] = a.split('-');
            const [bMonth, bYear] = b.split('-');
            const monthOrder: Record<string, number> = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };
            const yearA = parseInt('20' + aYear);
            const yearB = parseInt('20' + bYear);
            if (yearA !== yearB) return yearA - yearB;
            return (monthOrder[aMonth] || 0) - (monthOrder[bMonth] || 0);
        });

        return sortedMonths.map(month => {
            const total = meters.reduce((sum, m) => sum + (m.readings[month] || 0), 0);
            return { month, consumption: total };
        });
    }, [meters]);

    // --- Consumption By Type (for Overview) ---
    const consumptionByType = useMemo(() => {
        const grouped: Record<string, number> = {};
        meters.forEach(m => {
            const type = m.type || "Unknown";
            const c = Object.values(m.readings).reduce((s, v) => s + v, 0);
            grouped[type] = (grouped[type] || 0) + c;
        });

        return Object.entries(grouped).map(([type, val], i) => ({
            type,
            value: val,
            color: ["#E8A838", "#5BA88B", "#81D8D0", "#6B5F73", "#C95D63"][i % 5]
        })).sort((a, b) => b.value - a.value);

    }, [meters]);

    // --- Analysis Tab Logic ---

    // 1. Get all unique months and sort them
    const allMonths = useMemo(() => {
        const monthsSet = new Set<string>();
        meters.forEach(m => Object.keys(m.readings).forEach(month => monthsSet.add(month)));

        // Sort chronologically
        return Array.from(monthsSet).sort((a, b) => {
            const [aMonth, aYear] = a.split('-');
            const [bMonth, bYear] = b.split('-');
            const monthOrder: Record<string, number> = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };
            const yearA = parseInt('20' + aYear);
            const yearB = parseInt('20' + bYear);
            if (yearA !== yearB) return yearA - yearB;
            return (monthOrder[aMonth] || 0) - (monthOrder[bMonth] || 0);
        });
    }, [meters]);

    // 2. Get available types and their counts
    const meterTypes = useMemo(() => {
        const types = new Map<string, number>();
        meters.forEach(m => {
            const t = m.type || "Unknown";
            types.set(t, (types.get(t) || 0) + 1);
        });
        return Array.from(types.entries()).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
    }, [meters]);

    // 3. Filtered Data Provider
    const analysisData = useMemo(() => {
        if (allMonths.length === 0) return { stats: [], chartData: [], tableData: [], dateRangeLabel: "" };

        // Determine Index Range
        const startIdx = Math.floor((dateRangeIndex[0] / 100) * (allMonths.length - 1));
        const endIdx = Math.floor((dateRangeIndex[1] / 100) * (allMonths.length - 1));
        const selectedMonths = allMonths.slice(startIdx, endIdx + 1);

        // Filter Meters by Type
        const filteredMeters = analysisType === "All"
            ? meters
            : meters.filter(m => m.type === analysisType);

        // Aggregate Data
        let totalConsumption = 0;
        let totalCost = 0;
        let highestConsumer = { name: "N/A", val: 0 };
        const chartMap: Record<string, number> = {};

        // Initialize chart map for selected months
        selectedMonths.forEach(m => chartMap[m] = 0);

        const tableRows = filteredMeters.map(meter => {
            let meterConsumption = 0;
            selectedMonths.forEach(month => {
                const val = meter.readings[month] || 0;
                meterConsumption += val;
                chartMap[month] = (chartMap[month] || 0) + val;
            });
            totalConsumption += meterConsumption;

            if (meterConsumption > highestConsumer.val) {
                highestConsumer = { name: meter.name, val: meterConsumption };
            }

            return {
                ...meter,
                rangeConsumption: meterConsumption,
                rangeCost: meterConsumption * ratePerKWh
            };
        }).sort((a, b) => b.rangeConsumption - a.rangeConsumption);

        totalCost = totalConsumption * ratePerKWh;

        // Formats for Chart
        const chartData = selectedMonths.map(month => ({
            month,
            consumption: chartMap[month],
        }));

        // Stats Cards Data
        const stats = [
            {
                label: "TOTAL CONSUMPTION",
                value: `${(totalConsumption / 1000).toFixed(2)} MWh`,
                subtitle: "in selected period",
                icon: Zap,
                variant: "primary" as const
            },
            {
                label: "TOTAL COST",
                value: `${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} OMR`,
                subtitle: `at ${ratePerKWh} OMR/kWh`,
                icon: DollarSign,
                variant: "success" as const
            },
            {
                label: "METER COUNT",
                value: filteredMeters.length.toString(),
                subtitle: analysisType === "All" ? "Total Meters" : `${analysisType} Meters`,
                icon: MapPin,
                variant: "warning" as const
            },
            {
                label: "HIGHEST CONSUMER",
                value: highestConsumer.name,
                subtitle: `${(highestConsumer.val / 1000).toFixed(1)} MWh`,
                icon: TrendingUp,
                variant: "danger" as const
            }
        ];

        const startMonthStr = selectedMonths[0];
        const endMonthStr = selectedMonths[selectedMonths.length - 1];

        return {
            stats,
            chartData,
            tableData: tableRows,
            dateRangeLabel: `${startMonthStr} - ${endMonthStr}`
        };

    }, [meters, allMonths, analysisType, dateRangeIndex]);

    const handleReset = () => {
        setDateRangeIndex([0, 100]);
        setAnalysisType("All");
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Electricity Monitoring"
                    description="Track power consumption and costs across all meters"
                />
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${dataSource === 'supabase' ? 'bg-mb-success-light text-mb-success dark:bg-mb-success-light/20 dark:text-mb-success-hover' : 'bg-mb-warning-light text-mb-warning dark:bg-mb-warning-light/20 dark:text-mb-warning'}`}>
                    {dataSource === 'supabase' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                    {dataSource === 'supabase' ? 'Live Data' : 'Demo Data'}
                </div>
            </div>

            <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={[
                    { key: "overview", label: "Overview", icon: BarChart3 },
                    { key: "analysis", label: "Analysis by Type", icon: TrendingUp },
                    { key: "database", label: "Database", icon: Database },
                ]}
            />

            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <StatsGrid stats={stats} />

                    <div className="grid gap-6 lg:grid-cols-5">
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Monthly Consumption Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#E8A838" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#E8A838" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" className="text-xs" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} dy={10} />
                                            <YAxis className="text-xs" tickFormatter={(v) => `${v / 1000}k`} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                                            <Tooltip content={<LiquidTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }} />
                                            <Area type="natural" dataKey="consumption" stroke="#E8A838" fill="url(#elecGrad)" strokeWidth={3} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Consumption by Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={consumptionByType} layout="vertical" margin={{ left: 10 }}>
                                            <XAxis type="number" hide />
                                            <YAxis type="category" dataKey="type" width={100} className="text-xs" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                                            <Tooltip content={<LiquidTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 6 }} />
                                            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1500}>
                                                {consumptionByType.map((entry, index) => (
                                                    <Cell key={`c-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'analysis' && (
                <div className="space-y-6 animate-in fade-in duration-500">

                    {/* Controls Card */}
                    <Card className="glass-card">
                        <CardContent className="p-4 space-y-6">
                            {/* Top Row: Dropdown, Date Range */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md border text-sm font-medium">
                                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                        <span>{analysisData.dateRangeLabel}</span>
                                    </div>
                                    <Badge variant="outline" className="px-3 py-1.5 text-sm font-normal">
                                        {analysisData.tableData.length} Meters Found
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleReset}
                                    className="h-8 text-muted-foreground hover:text-foreground"
                                >
                                    <RotateCcw className="mr-2 h-3.5 w-3.5" />
                                    Reset Filters
                                </Button>
                            </div>

                            {/* Slider */}
                            <div className="px-2 pt-2">
                                <Slider
                                    value={dateRangeIndex}
                                    onValueChange={(val) => setDateRangeIndex([val[0], val[1]])} // force tuple type
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between mt-2 text-xs text-muted-foreground uppercase tracking-wider">
                                    <span>{allMonths[0]}</span>
                                    <span>{allMonths[allMonths.length - 1]}</span>
                                </div>
                            </div>

                            {/* Type Chips */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                                <Button
                                    variant={analysisType === "All" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setAnalysisType("All")}
                                    className={`rounded-full h-8 ${analysisType === "All" ? "bg-mb-primary hover:bg-mb-primary/90" : "border-slate-200 dark:border-slate-700"}`}
                                >
                                    All <span className="ml-1.5 opacity-70 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{meters.length}</span>
                                </Button>
                                {meterTypes.map((t) => (
                                    <Button
                                        key={t.type}
                                        variant={analysisType === t.type ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setAnalysisType(t.type)}
                                        className={`rounded-full h-8 ${analysisType === t.type ? "bg-mb-secondary-active hover:bg-mb-secondary-active/90 border-transparent text-white" : "border-slate-200 dark:border-slate-700"}`}
                                    >
                                        {t.type} <span className="ml-1.5 opacity-70 bg-black/10 dark:bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{t.count}</span>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Filtered Stats Grid */}
                    <StatsGrid stats={analysisData.stats} />

                    {/* Chart & Table */}
                    <Card className="glass-card">
                        <CardHeader className="glass-card-header">
                            <CardTitle className="text-lg">Monthly Trend for {analysisType === "All" ? "All Types (Total)" : analysisType}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analysisData.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="anlGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#81D8D0" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#81D8D0" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                                        <Tooltip content={<LiquidTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }} />
                                        <Area type="monotone" dataKey="consumption" stroke="#81D8D0" fill="url(#anlGrad)" strokeWidth={3} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Table */}
                    <Card className="glass-card">
                        <CardHeader className="glass-card-header">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Meter Details</CardTitle>
                                <div className="text-xs text-muted-foreground">Showing {analysisData.tableData.length} of {meters.length} meters</div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-auto max-h-[600px] rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 sticky top-0 backdrop-blur-sm z-10">
                                        <tr className="border-b">
                                            <th className="p-4 text-left font-medium text-muted-foreground w-[250px]">Name</th>
                                            <th className="p-4 text-left font-medium text-muted-foreground">Account #</th>
                                            <th className="p-4 text-left font-medium text-muted-foreground">Type</th>
                                            <th className="p-4 text-right font-medium text-muted-foreground">Consumption (Range)</th>
                                            <th className="p-4 text-right font-medium text-muted-foreground">Cost (Range)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {analysisData.tableData.map((meter) => (
                                            <tr key={meter.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-4 font-medium text-foreground">{meter.name}</td>
                                                <td className="p-4 text-muted-foreground text-xs font-mono">{meter.account_number}</td>
                                                <td className="p-4">
                                                    <Badge variant="secondary" className="font-normal text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                        {meter.type}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-right font-mono font-medium">
                                                    {meter.rangeConsumption.toLocaleString()} <span className="text-xs text-muted-foreground">kWh</span>
                                                </td>
                                                <td className="p-4 text-right font-mono font-medium text-mb-success dark:text-mb-success-hover">
                                                    {meter.rangeCost.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs text-muted-foreground">OMR</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
            }

            {
                activeTab === 'database' && (
                    <div className="animate-in fade-in duration-500">
                        <Card>
                            <CardHeader><CardTitle>Meter Database</CardTitle></CardHeader>
                            <CardContent>
                                <div className="overflow-auto max-h-[500px]">
                                    <table className="w-full text-sm">
                                        <thead className="text-left bg-slate-50 dark:bg-slate-800">
                                            <tr>
                                                <th className="p-3 font-medium">Name</th>
                                                <th className="p-3 font-medium">Account</th>
                                                <th className="p-3 font-medium">Type</th>
                                                <th className="p-3 font-medium text-right">Total (kWh)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {meters.map(meter => {
                                                const sum = Object.values(meter.readings).reduce((a, b) => a + b, 0);
                                                return (
                                                    <tr key={meter.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                        <td className="p-3">{meter.name}</td>
                                                        <td className="p-3 text-muted-foreground">{meter.account_number}</td>
                                                        <td className="p-3">
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800">
                                                                {meter.type}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-right font-mono">{sum.toLocaleString('en-US')}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
            }
        </div >
    );
}
