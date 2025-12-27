
"use client";

import { useEffect, useState } from "react";
import { getWaterSystemData, getElectricityMeters, getSTPOperations, getContractors, getAssets, WaterSystemData } from "@/lib/mock-data";
import {
    getSTPOperationsFromSupabase,
    getContractorSummary,
    getAssetsFromSupabase,
    getElectricityMetersFromSupabase,
    isSupabaseConfigured
} from "@/lib/supabase";
import { StatsGrid } from "@/components/shared/stats-grid";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Zap, Users, AlertTriangle, ArrowUpRight, Boxes, Recycle, TrendingUp, Wifi, WifiOff } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { LiquidTooltip } from "../components/charts/liquid-tooltip";
import { format } from "date-fns";

export default function DashboardPage() {
    const [stats, setStats] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [stpChartData, setStpChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLiveData, setIsLiveData] = useState(false);
    const [activityFilter, setActivityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

    useEffect(() => {
        async function loadDashboardData() {
            try {
                let liveDataFetched = false;

                // Fetch water data (mock for now as no Supabase table)
                const water = await getWaterSystemData();
                const latestWater = water.monthlyTrends[water.monthlyTrends.length - 1];

                // Try to fetch live data from Supabase
                let stpData: any[] = [];
                let elecData: any[] = [];
                let contractorsCount = 0;
                let assetsCount = 0;
                let stpTotalInlet = 0;
                let stpTotalTSE = 0;
                let stpTotalIncome = 0;
                let elecTotal = 0;

                if (isSupabaseConfigured()) {
                    // Fetch STP data
                    try {
                        const stpResult = await getSTPOperationsFromSupabase();
                        if (stpResult.length > 0) {
                            stpData = stpResult;
                            liveDataFetched = true;
                        }
                    } catch (e) {
                        // console.log("STP fetch from Supabase failed, using mock");
                    }

                    // Fetch Electricity data
                    try {
                        const elecResult = await getElectricityMetersFromSupabase();
                        if (elecResult.length > 0) {
                            elecData = elecResult;
                            liveDataFetched = true;
                        }
                    } catch (e) {
                        // console.log("Electricity fetch from Supabase failed, using mock");
                    }

                    // Fetch Contractors count
                    try {
                        const contractorsSummary = await getContractorSummary();
                        if (contractorsSummary.length > 0) {
                            contractorsCount = contractorsSummary.filter(c => c.status === "Active").length;
                            liveDataFetched = true;
                        }
                    } catch (e) {
                        // console.log("Contractors fetch from Supabase failed, using mock");
                    }

                    // Fetch Assets count
                    try {
                        const assetsResult = await getAssetsFromSupabase(1, 1, '');
                        if (assetsResult.count > 0) {
                            assetsCount = assetsResult.count;
                            liveDataFetched = true;
                        }
                    } catch (e) {
                        // console.log("Assets fetch from Supabase failed, using mock");
                    }
                }

                // Fallback to mock data if no live data
                if (stpData.length === 0) {
                    stpData = await getSTPOperations();
                }
                if (elecData.length === 0) {
                    elecData = await getElectricityMeters();
                }
                if (contractorsCount === 0) {
                    const contractorsMock = await getContractors();
                    contractorsCount = contractorsMock.filter(c => c.status === "Active").length;
                }
                if (assetsCount === 0) {
                    const assetsMock = await getAssets();
                    assetsCount = assetsMock.length;
                }

                setIsLiveData(liveDataFetched);

                // Calculate STP Totals (all data)
                const TANKER_FEE = 4.50;
                const TSE_SAVING_RATE = 1.32;
                stpTotalInlet = stpData.reduce((acc, op) => acc + (op.inlet_sewage || 0), 0);
                stpTotalTSE = stpData.reduce((acc, op) => acc + (op.tse_for_irrigation || 0), 0);
                const totalTrips = stpData.reduce((acc, op) => acc + (op.tanker_trips || 0), 0);
                stpTotalIncome = (totalTrips * TANKER_FEE) + (stpTotalTSE * TSE_SAVING_RATE);

                // Calculate Electricity Totals
                // Sum all readings for the latest available month
                const allReadings: Record<string, number> = {};
                elecData.forEach(meter => {
                    Object.entries(meter.readings || {}).forEach(([month, value]) => {
                        allReadings[month] = (allReadings[month] || 0) + (value as number);
                    });
                });
                const sortedMonths = Object.keys(allReadings).sort();
                const latestMonth = sortedMonths[sortedMonths.length - 1] || "";
                elecTotal = allReadings[latestMonth] || 0;

                setStats([
                    {
                        label: "WATER PRODUCTION",
                        value: `${(latestWater.A1 / 1000).toFixed(1)}k m³`,
                        subtitle: `${latestWater.month}`,
                        icon: Droplets,
                        variant: "water" as const
                    },
                    {
                        label: "ELECTRICITY USAGE",
                        value: `${(elecTotal / 1000).toFixed(1)} MWh`,
                        subtitle: latestMonth || "Latest Month",
                        icon: Zap,
                        variant: "warning" as const
                    },
                    {
                        label: "STP INLET FLOW",
                        value: `${(stpTotalInlet / 1000).toFixed(1)}k m³`,
                        subtitle: "Total Processed",
                        icon: Activity,
                        variant: "success" as const
                    },
                    {
                        label: "TSE OUTPUT",
                        value: `${(stpTotalTSE / 1000).toFixed(1)}k m³`,
                        subtitle: "Recycled Water",
                        icon: Recycle,
                        variant: "primary" as const
                    },
                    {
                        label: "STP ECONOMIC IMPACT",
                        value: `${(stpTotalIncome / 1000).toFixed(1)}k OMR`,
                        subtitle: "Income + Savings",
                        icon: TrendingUp,
                        variant: "success" as const
                    },
                    {
                        label: "ACTIVE CONTRACTORS",
                        value: contractorsCount.toString(),
                        subtitle: "Service Providers",
                        icon: Users,
                        variant: "primary" as const
                    },
                    {
                        label: "TOTAL ASSETS",
                        value: assetsCount.toLocaleString('en-US'),
                        subtitle: "Registered Items",
                        icon: Boxes,
                        variant: "water" as const
                    }
                ]);

                // Chart Data: Water Trend
                const trendData = water.monthlyTrends.slice(-8).map(w => ({
                    month: w.month,
                    water: Math.round(w.A1 / 1000),
                    efficiency: w.efficiency
                }));
                setChartData(trendData);

                // STP Monthly Chart Data
                const stpMonthly: Record<string, { inlet: number; tse: number }> = {};
                stpData.forEach(op => {
                    if (op.date) {
                        try {
                            const monthKey = format(new Date(op.date), "MMM-yy");
                            if (!stpMonthly[monthKey]) {
                                stpMonthly[monthKey] = { inlet: 0, tse: 0 };
                            }
                            stpMonthly[monthKey].inlet += op.inlet_sewage || 0;
                            stpMonthly[monthKey].tse += op.tse_for_irrigation || 0;
                        } catch (e) {
                            // Skip invalid dates
                        }
                    }
                });
                const stpChartArr = Object.entries(stpMonthly)
                    .map(([month, data]) => ({
                        month,
                        inlet: Math.round(data.inlet / 1000),
                        tse: Math.round(data.tse / 1000)
                    }))
                    .slice(-8);
                setStpChartData(stpChartArr);

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Dashboard"
                    description="Overview of all operations and key metrics"
                />
                <Badge variant={isLiveData ? "default" : "secondary"} className="flex items-center gap-1.5">
                    {isLiveData ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                    {isLiveData ? "Live Data" : "Demo Mode"}
                </Badge>
            </div>

            <StatsGrid stats={stats} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Droplets className="h-5 w-5 text-mb-secondary" />
                            Water Production Trend
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Monthly water production in thousand m³</p>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#81D8D0" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#81D8D0" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" opacity={0.5} />
                                    <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis className="text-xs" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<LiquidTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }} />
                                    <Area type="monotone" dataKey="water" stroke="#81D8D0" fill="url(#colorWater)" name="Water (k m³)" strokeWidth={3} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Recycle className="h-5 w-5 text-mb-primary" />
                            STP Treatment Overview
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Monthly inlet vs TSE output (k m³)</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stpChartData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" opacity={0.5} />
                                    <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis className="text-xs" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<LiquidTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 4 }} />
                                    <Legend iconType="circle" />
                                    <Bar dataKey="inlet" name="Inlet" fill="#4E4456" radius={[4, 4, 0, 0]} animationDuration={1500} />
                                    <Bar dataKey="tse" name="TSE Output" fill="#81D8D0" radius={[4, 4, 0, 0]} animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Card */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <CardTitle>Recent Activity</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Latest operational alerts and logs
                            </p>
                        </div>
                        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                            {(['all', 'critical', 'warning', 'info'] as const).map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActivityFilter(filter)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${activityFilter === filter
                                        ? filter === 'critical' ? 'bg-mb-danger text-white'
                                            : filter === 'warning' ? 'bg-mb-warning text-white'
                                                : filter === 'info' ? 'bg-mb-info text-mb-info-foreground'
                                                    : 'bg-mb-primary text-white'
                                        : 'text-muted-foreground hover:bg-muted'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: "High Water Loss Detected", time: "2 hours ago", type: "critical" },
                            { title: "STP Pump Station Maintenance", time: "5 hours ago", type: "warning" },
                            { title: "New Contractor Onboarded", time: "1 day ago", type: "info" },
                            { title: "Monthly Reports Generated", time: "2 days ago", type: "info" },
                        ].filter(item => activityFilter === 'all' || item.type === activityFilter).map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className={`rounded-full p-2 ${item.type === 'critical' ? 'bg-mb-danger-light text-mb-danger' :
                                    item.type === 'warning' ? 'bg-mb-warning-light text-mb-warning' :
                                        'bg-mb-info-light text-mb-info-foreground' // Info/Normal items use Light Teal
                                    }`}>
                                    {item.type === 'critical' ? <AlertTriangle className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}