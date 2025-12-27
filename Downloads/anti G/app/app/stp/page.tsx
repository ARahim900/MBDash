
"use client";

import { useEffect, useState, useMemo } from "react";
import { getSTPOperations, STPOperation } from "@/lib/mock-data";
import { getSTPOperationsFromSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ScrollAnimation } from "@/components/shared/scroll-animation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
    Droplets,
    Recycle,
    Truck,
    DollarSign,
    PiggyBank,
    TrendingUp,
    Gauge,
    Activity,
    Database,
    CalendarDays,
    Wifi,
    WifiOff,
    RotateCcw
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line, Legend } from "recharts";
import { LiquidTooltip } from "../../components/charts/liquid-tooltip";
import { format } from "date-fns";

export default function STPPage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [allOperations, setAllOperations] = useState<STPOperation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLiveData, setIsLiveData] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<string>("");

    // Date range filter state
    const [dateRangeIndex, setDateRangeIndex] = useState<[number, number]>([0, 100]);

    const TANKER_FEE = 4.50;
    const TSE_SAVING_RATE = 1.32;

    useEffect(() => {
        async function loadData() {
            try {
                if (isSupabaseConfigured()) {
                    const supabaseData = await getSTPOperationsFromSupabase();
                    if (supabaseData.length > 0) {
                        setAllOperations(supabaseData);
                        setIsLiveData(true);
                        setLoading(false);
                        return;
                    }
                }
                const result = await getSTPOperations();
                setAllOperations(result);
                setIsLiveData(false);
            } catch (e) {
                // Silent fallback to mock data
                const result = await getSTPOperations();
                setAllOperations(result);
                setIsLiveData(false);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Get all unique months for the slider
    const allMonths = useMemo(() => {
        const monthsSet = new Set<string>();
        allOperations.forEach(op => {
            monthsSet.add(format(new Date(op.date), "yyyy-MM"));
        });
        return Array.from(monthsSet).sort();
    }, [allOperations]);

    // Calculate filtered operations based on date range slider
    const operations = useMemo(() => {
        if (allMonths.length === 0) return allOperations;

        const startIdx = Math.floor((dateRangeIndex[0] / 100) * (allMonths.length - 1));
        const endIdx = Math.floor((dateRangeIndex[1] / 100) * (allMonths.length - 1));

        const startMonth = allMonths[startIdx];
        const endMonth = allMonths[endIdx];

        return allOperations.filter(op => {
            const opMonth = format(new Date(op.date), "yyyy-MM");
            return opMonth >= startMonth && opMonth <= endMonth;
        });
    }, [allOperations, allMonths, dateRangeIndex]);

    // Get selected date range display
    const selectedDateRange = useMemo(() => {
        if (allMonths.length === 0) return { start: "", end: "", startMonth: "", endMonth: "" };

        const startIdx = Math.floor((dateRangeIndex[0] / 100) * (allMonths.length - 1));
        const endIdx = Math.floor((dateRangeIndex[1] / 100) * (allMonths.length - 1));

        const startMonth = allMonths[startIdx];
        const endMonth = allMonths[endIdx];

        return {
            start: format(new Date(`${startMonth}-01`), "MMM yyyy"),
            end: format(new Date(`${endMonth}-01`), "MMM yyyy"),
            startMonth,
            endMonth
        };
    }, [allMonths, dateRangeIndex]);

    // Set default month for daily log once operations load
    useEffect(() => {
        if (operations.length > 0 && !selectedMonth) {
            const latestDate = operations[operations.length - 1]?.date;
            if (latestDate) {
                setSelectedMonth(format(new Date(latestDate), "yyyy-MM"));
            }
        }
    }, [operations, selectedMonth]);

    // Calculate statistics from filtered operations
    const stats = useMemo(() => {
        const totalInlet = operations.reduce((sum, op) => sum + op.inlet_sewage, 0);
        const totalTSE = operations.reduce((sum, op) => sum + op.tse_for_irrigation, 0);
        const totalTrips = operations.reduce((sum, op) => sum + op.tanker_trips, 0);
        const generatedIncome = totalTrips * TANKER_FEE;
        const waterSavings = totalTSE * TSE_SAVING_RATE;
        const totalEconomicImpact = generatedIncome + waterSavings;
        const treatmentEfficiency = totalInlet > 0 ? (totalTSE / totalInlet) * 100 : 0;
        const dailyAverageInlet = operations.length > 0 ? totalInlet / operations.length : 0;

        return {
            totalInlet,
            totalTSE,
            totalTrips,
            generatedIncome,
            waterSavings,
            totalEconomicImpact,
            treatmentEfficiency,
            dailyAverageInlet
        };
    }, [operations]);

    // Monthly chart data from filtered operations
    const monthlyChartData = useMemo(() => {
        const monthly: Record<string, { month: string; inlet: number; tse: number; income: number; savings: number; trips: number }> = {};

        operations.forEach(op => {
            const monthKey = format(new Date(op.date), "MMM-yy");
            if (!monthly[monthKey]) {
                monthly[monthKey] = { month: monthKey, inlet: 0, tse: 0, income: 0, savings: 0, trips: 0 };
            }
            monthly[monthKey].inlet += op.inlet_sewage;
            monthly[monthKey].tse += op.tse_for_irrigation;
            monthly[monthKey].income += (op.tanker_trips * TANKER_FEE);
            monthly[monthKey].savings += (op.tse_for_irrigation * TSE_SAVING_RATE);
            monthly[monthKey].trips += op.tanker_trips;
        });

        return Object.values(monthly);
    }, [operations]);

    // Get available months for daily log dropdown (from filtered data)
    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        operations.forEach(op => {
            months.add(format(new Date(op.date), "yyyy-MM"));
        });
        return Array.from(months).sort().reverse();
    }, [operations]);

    // Daily operations for selected month
    const dailyOperations = useMemo(() => {
        if (!selectedMonth) return [];
        return operations.filter(op => {
            const opMonth = format(new Date(op.date), "yyyy-MM");
            return opMonth === selectedMonth;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [operations, selectedMonth]);

    // Reset date range to full
    const handleResetRange = () => {
        setDateRangeIndex([0, 100]);
    };

    // Handle slider change
    const handleSliderChange = (value: number[]) => {
        setDateRangeIndex([value[0], value[1]]);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <PageHeader
                    title="STP Plant"
                    description="Water Treatment Management"
                />
                <Badge variant={isLiveData ? "default" : "secondary"} className="flex items-center gap-1.5 bg-mb-primary text-white hover:bg-mb-primary-hover">
                    {isLiveData ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                    {isLiveData ? "Live Data" : "Demo Mode"}
                </Badge>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "dashboard"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        }`}
                >
                    <Activity className="w-4 h-4 inline-block mr-2" />
                    Dashboard
                </button>
                <button
                    onClick={() => setActiveTab("details")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "details"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        }`}
                >
                    <Database className="w-4 h-4 inline-block mr-2" />
                    Details Data
                </button>
            </div>

            {activeTab === "dashboard" && (
                <div className="space-y-6">
                    {/* Date Range Filter Card */}
                    <ScrollAnimation>
                        <Card className="glass-card mb-6">
                            <CardContent className="p-4 space-y-4">
                                {/* Date Range Header */}
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-semibold text-mb-primary">{selectedDateRange.start}</span>
                                            <span className="text-muted-foreground">to</span>
                                            <span className="font-semibold text-mb-primary">{selectedDateRange.end}</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleResetRange} className="flex items-center gap-2 border-mb-secondary/50 hover:bg-mb-secondary-light/20 hover:text-mb-primary">
                                        <RotateCcw className="h-3 w-3" />
                                        Reset Range
                                    </Button>
                                </div>

                                {/* Date Range Slider */}
                                <div className="px-2">
                                    <Slider
                                        value={dateRangeIndex}
                                        onValueChange={handleSliderChange}
                                        max={100}
                                        min={0}
                                        step={1}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                        <span>{allMonths.length > 0 ? format(new Date(`${allMonths[0]}-01`), "MMM yyyy") : ""}</span>
                                        <span>{allMonths.length > 0 ? format(new Date(`${allMonths[allMonths.length - 1]}-01`), "MMM yyyy") : ""}</span>
                                    </div>
                                </div>

                                {/* Formula Info */}
                                <div className="text-xs text-muted-foreground border-t border-mb-primary/10 pt-3">
                                    Current STP economic rates applied when calculating financial impact: <span className="font-medium text-mb-primary">Discharge Fee = {TANKER_FEE} OMR/trip</span> | <span className="font-medium text-mb-primary">TSE Saving = {TSE_SAVING_RATE} OMR per m³</span> | TSE (Treated Sewage Effluent) water is reused for irrigation, offsetting freshwater costs.
                                </div>
                            </CardContent>
                        </Card>
                    </ScrollAnimation>

                    {/* Stats Cards - Row 1 */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <ScrollAnimation delay={100} className="h-full">
                            <Card className="glass-card border-l-4 border-l-mb-primary h-full">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Inlet Sewage</p>
                                            <p className="text-2xl font-bold mt-1 text-mb-primary dark:text-mb-primary-light">{stats.totalInlet.toLocaleString('en-US')} m³</p>
                                            <p className="text-xs text-muted-foreground mt-1">Range: {selectedDateRange.start} - {selectedDateRange.end}</p>
                                        </div>
                                        <div className="p-2 bg-mb-primary-light/20 rounded-xl backdrop-blur-sm">
                                            <Droplets className="h-6 w-6 text-mb-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>

                        <ScrollAnimation delay={200} className="h-full">
                            <Card className="glass-card border-l-4 border-l-mb-secondary h-full">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">TSE for Irrigation</p>
                                            <p className="text-2xl font-bold mt-1 text-mb-primary dark:text-mb-primary-light">{stats.totalTSE.toLocaleString('en-US')} m³</p>
                                            <p className="text-xs text-muted-foreground mt-1">Recycled Water Output</p>
                                        </div>
                                        <div className="p-2 bg-mb-secondary-light/30 rounded-xl backdrop-blur-sm">
                                            <Recycle className="h-6 w-6 text-mb-secondary-active" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>

                        <ScrollAnimation delay={300} className="h-full">
                            <Card className="glass-card border-l-4 border-l-mb-warning h-full">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tanker Trips</p>
                                            <p className="text-2xl font-bold mt-1 text-mb-primary dark:text-mb-primary-light">{stats.totalTrips.toLocaleString('en-US')} trips</p>
                                            <p className="text-xs text-muted-foreground mt-1">at {TANKER_FEE} OMR / trip</p>
                                        </div>
                                        <div className="p-2 bg-mb-warning-light/30 rounded-xl backdrop-blur-sm">
                                            <Truck className="h-6 w-6 text-mb-warning" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>

                        <ScrollAnimation delay={400} className="h-full">
                            <Card className="glass-card border-l-4 border-l-mb-success h-full">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Generated Income</p>
                                            <p className="text-2xl font-bold mt-1 text-mb-primary dark:text-mb-primary-light">{stats.generatedIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })} OMR</p>
                                            <p className="text-xs text-muted-foreground mt-1">from discharge fees</p>
                                        </div>
                                        <div className="p-2 bg-mb-success-light/30 rounded-xl backdrop-blur-sm">
                                            <DollarSign className="h-6 w-6 text-mb-success" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>
                    </div>

                    {/* Stats Cards - Row 2 */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <ScrollAnimation delay={500} className="h-full">
                            <Card className="glass-card border-l-4 border-l-mb-primary h-full">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Water Savings</p>
                                            <p className="text-2xl font-bold mt-1 text-mb-primary dark:text-mb-primary-light">{stats.waterSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })} OMR</p>
                                            <p className="text-xs text-muted-foreground mt-1">{TSE_SAVING_RATE} OMR per m³</p>
                                        </div>
                                        <div className="p-2 bg-mb-primary-light/20 rounded-xl backdrop-blur-sm">
                                            <PiggyBank className="h-6 w-6 text-mb-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>

                        <ScrollAnimation delay={600} className="h-full">
                            <Card className="glass-card border-l-4 border-l-mb-success h-full">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Economic Impact</p>
                                            <p className="text-2xl font-bold mt-1 text-mb-primary dark:text-mb-primary-light">{stats.totalEconomicImpact.toLocaleString('en-US', { minimumFractionDigits: 2 })} OMR</p>
                                            <p className="text-xs text-muted-foreground mt-1">Income + Savings</p>
                                        </div>
                                        <div className="p-2 bg-mb-success-light/30 rounded-xl backdrop-blur-sm">
                                            <TrendingUp className="h-6 w-6 text-mb-success" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>

                        <ScrollAnimation delay={700} className="h-full">
                            <Card className="glass-card border-l-4 border-l-mb-secondary h-full">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Treatment Efficiency</p>
                                            <p className="text-2xl font-bold mt-1 text-mb-primary dark:text-mb-primary-light">{stats.treatmentEfficiency.toFixed(1)}%</p>
                                            <p className="text-xs text-muted-foreground mt-1">TSE Output to Inlet Ratio</p>
                                        </div>
                                        <div className="p-2 bg-mb-secondary-light/30 rounded-xl backdrop-blur-sm">
                                            <Gauge className="h-6 w-6 text-mb-secondary-active" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>

                        <ScrollAnimation delay={800} className="h-full">
                            <Card className="glass-card border-l-4 border-l-mb-primary h-full">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Daily Average Inlet</p>
                                            <p className="text-2xl font-bold mt-1 text-mb-primary dark:text-mb-primary-light">{Math.round(stats.dailyAverageInlet).toLocaleString('en-US')} m³</p>
                                            <p className="text-xs text-muted-foreground mt-1">Average Daily Input</p>
                                        </div>
                                        <div className="p-2 bg-mb-primary-light/20 rounded-xl backdrop-blur-sm">
                                            <Activity className="h-6 w-6 text-mb-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>
                    </div>

                    {/* Monthly Water Treatment Volumes Chart */}
                    <ScrollAnimation delay={200}>
                        <Card className="glass-card">
                            <CardHeader className="glass-card-header">
                                <CardTitle className="text-lg">Monthly Water Treatment Volumes (m³)</CardTitle>
                                <p className="text-sm text-muted-foreground">Sewage Inlet vs TSE Output comparison</p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="gradInlet" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4E4456" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#4E4456" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gradTSE" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#81D8D0" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#81D8D0" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis className="text-xs" tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                                            <Tooltip content={<LiquidTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }} />
                                            <Legend iconType="circle" />
                                            <Area type="monotone" dataKey="inlet" name="Sewage Inlet" stroke="#4E4456" fill="url(#gradInlet)" strokeWidth={3} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
                                            <Area type="monotone" dataKey="tse" name="TSE Output" stroke="#81D8D0" fill="url(#gradTSE)" strokeWidth={3} animationDuration={1500} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </ScrollAnimation>

                    {/* Two Charts Side by Side */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Monthly Economic Impact */}
                        <ScrollAnimation delay={300} className="h-full">
                            <Card className="glass-card h-full">
                                <CardHeader className="glass-card-header">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-mb-success" />
                                        Monthly Economic Impact (OMR)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[280px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} dy={10} />
                                                <YAxis className="text-xs" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<LiquidTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 6 }} />
                                                <Bar dataKey="income" name="Income" fill="#5BA88B" radius={[6, 6, 0, 0]} animationDuration={1500} />
                                                <Bar dataKey="savings" name="Savings" fill="#4E4456" radius={[6, 6, 0, 0]} animationDuration={1500} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>

                        {/* Monthly Tanker Operations */}
                        <ScrollAnimation delay={400} className="h-full">
                            <Card className="glass-card h-full">
                                <CardHeader className="glass-card-header">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Truck className="h-5 w-5 text-mb-warning" />
                                        Monthly Tanker Operations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[280px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} dy={10} />
                                                <YAxis className="text-xs" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<LiquidTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="trips"
                                                    name="Tanker Trips"
                                                    stroke="#E8A838"
                                                    strokeWidth={3}
                                                    dot={{ r: 5, fill: "#E8A838", strokeWidth: 2, stroke: "#fff" }}
                                                    activeDot={{ r: 7, strokeWidth: 2, stroke: "#fff" }}
                                                    animationDuration={1500}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>
                    </div>

                    {/* Daily Operations Log */}
                    <ScrollAnimation delay={500}>
                        <Card className="glass-card">
                            <CardHeader className="glass-card-header">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                        <CardTitle className="text-lg">Daily Operations Log</CardTitle>
                                        <p className="text-sm text-muted-foreground">Detailed daily STP operation records</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Select Month for Daily View</span>
                                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue>Select month</SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableMonths.map(month => (
                                                    <SelectItem key={month} value={month}>
                                                        {format(new Date(`${month}-01`), "MMMM yyyy")}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-mb-primary/10 bg-mb-primary/5">
                                                <th className="text-left p-3 font-medium text-mb-primary">Date</th>
                                                <th className="text-right p-3 font-medium text-mb-primary">Inlet (m³)</th>
                                                <th className="text-right p-3 font-medium text-mb-primary">TSE Output (m³)</th>
                                                <th className="text-right p-3 font-medium text-mb-primary">Efficiency %</th>
                                                <th className="text-right p-3 font-medium text-mb-primary">Tanker Trips</th>
                                                <th className="text-right p-3 font-medium text-mb-primary">Income (OMR)</th>
                                                <th className="text-right p-3 font-medium text-mb-primary">Savings (OMR)</th>
                                                <th className="text-right p-3 font-medium text-mb-primary">Total Impact (OMR)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dailyOperations.map((op, idx) => {
                                                const efficiency = op.inlet_sewage > 0 ? (op.tse_for_irrigation / op.inlet_sewage) * 100 : 0;
                                                const income = op.tanker_trips * TANKER_FEE;
                                                const savings = op.tse_for_irrigation * TSE_SAVING_RATE;
                                                const totalImpact = income + savings;
                                                const efficiencyColor = efficiency >= 95 ? "text-mb-success" : efficiency >= 90 ? "text-mb-warning" : "text-mb-danger";

                                                return (
                                                    <tr key={op.id} className={`border-b border-mb-primary/5 hover:bg-mb-primary/5 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-mb-primary/5'}`}>
                                                        <td className="p-3 text-muted-foreground">{format(new Date(op.date), "dd/MM/yyyy")}</td>
                                                        <td className="p-3 text-right text-mb-primary font-medium">{op.inlet_sewage.toLocaleString()}</td>
                                                        <td className="p-3 text-right text-mb-secondary-active font-medium">{op.tse_for_irrigation.toLocaleString()}</td>
                                                        <td className={`p-3 text-right font-medium ${efficiencyColor}`}>{efficiency.toFixed(1)}%</td>
                                                        <td className="p-3 text-right text-mb-warning">{op.tanker_trips}</td>
                                                        <td className="p-3 text-right text-mb-success">{income.toFixed(2)}</td>
                                                        <td className="p-3 text-right text-mb-primary">{savings.toFixed(2)}</td>
                                                        <td className="p-3 text-right font-semibold text-mb-success">{totalImpact.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {dailyOperations.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No data available for the selected month
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </ScrollAnimation>
                </div>
            )}

            {activeTab === "details" && (
                <Card className="h-[800px] animate-in fade-in duration-500">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Database className="w-6 h-6 text-primary" />
                            <div>
                                <CardTitle>STP Operations Database</CardTitle>
                                <p className="text-sm text-muted-foreground">Detailed logs via Airtable</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-full p-0 overflow-hidden">
                        <iframe
                            src="https://aitable.ai/share/shrdXgjQnQar66QJXXADh"
                            className="w-full h-full border-none"
                            title="STP Operations Database"
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
