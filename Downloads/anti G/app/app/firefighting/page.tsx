
"use client";

import { useEffect, useState, useMemo } from "react";
import { getFireSafetyEquipment, FireSafetyEquipment } from "@/lib/mock-data";
import { StatsGrid } from "@/components/shared/stats-grid";
import { TabNavigation } from "@/components/shared/tab-navigation";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, HardHat, AlertTriangle, Wrench, Search, MapPin, Battery, Signal, Plus, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { format } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FirefightingPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [equipment, setEquipment] = useState<FireSafetyEquipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const result = await getFireSafetyEquipment();
                setEquipment(result);
            } catch (e) {
                // console.error("Failed to load firefighting data", e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Handle Tab Change to navigate for Quotes
    const handleTabChange = (key: string) => {
        if (key === 'quotes') {
            router.push('/firefighting/quotes');
        } else {
            setActiveTab(key);
        }
    };

    const filteredEquipment = equipment.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase())
    );

    const stats = useMemo(() => {
        const total = equipment.length;
        const operational = equipment.filter(e => e.status === "Operational").length;
        const critical = equipment.filter(e => e.priority === "Critical").length;
        const maintenanceDue = equipment.filter(e => e.status === "Maintenance Due").length;

        return [
            {
                label: "TOTAL EQUIPMENT",
                value: total.toString(),
                subtitle: "All Operations",
                icon: HardHat,
                variant: "water" as const
            },
            {
                label: "OPERATIONAL",
                value: operational.toString(),
                subtitle: "Working Properly",
                icon: ShieldCheck,
                variant: "success" as const
            },
            {
                label: "CRITICAL ISSUES",
                value: critical.toString(),
                subtitle: "Requires Attention",
                icon: AlertTriangle,
                variant: "danger" as const
            },
            {
                label: "MAINTENANCE DUE",
                value: maintenanceDue.toString(),
                subtitle: "Service Required",
                icon: Wrench,
                variant: "warning" as const
            }
        ];
    }, [equipment]);

    const chartData = useMemo(() => {
        const statusCounts: Record<string, number> = {};
        equipment.forEach(e => {
            statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
        });
        const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

        const typeCounts: Record<string, number> = {};
        equipment.forEach(e => {
            typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
        });
        const barData = Object.entries(typeCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

        return { pieData, barData };
    }, [equipment]);

    const COLORS = ["#5BA88B", "#E8A838", "#C95D63", "#81D8D0"]; // Success, Warning, Danger, Secondary

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Operational": return "bg-mb-success-light text-mb-success dark:bg-mb-success-light/20 dark:text-mb-success-hover";
            case "Needs Attention": return "bg-mb-warning-light text-mb-warning dark:bg-mb-warning-light/20 dark:text-mb-warning";
            case "Expired": return "bg-mb-danger-light text-mb-danger dark:bg-mb-danger-light/20 dark:text-mb-danger-hover";
            case "Maintenance Due": return "bg-mb-warning-light text-mb-warning dark:bg-mb-warning-light/20 dark:text-mb-warning";
            default: return "bg-slate-100 text-slate-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Critical": return "bg-mb-danger text-white";
            case "High": return "bg-mb-warning text-white";
            case "Medium": return "bg-mb-warning-light/80 text-mb-warning-dark";
            case "Low": return "bg-mb-success text-white";
            default: return "bg-slate-500 text-white";
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <PageHeader
                title="Firefighting & Alarm System"
                description="Equipment inventory and maintenance tracking"
                action={{ label: "Add Equipment", icon: Plus }}
            />

            <TabNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={[
                    { key: "dashboard", label: "Dashboard", icon: ShieldCheck },
                    { key: "equipment", label: "Equipment Records", icon: HardHat },
                    { key: "quotes", label: "Quotes & Repairs", icon: FileText },
                ]}
            />

            {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <StatsGrid stats={stats} />

                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>System Status Distribution</CardTitle></CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={chartData.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5}>
                                            {chartData.pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-slate-900 dark:fill-slate-100">
                                            {equipment.length}
                                        </text>
                                        <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-slate-500">
                                            Total Units
                                        </text>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Equipment by Type</CardTitle></CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData.barData} layout="vertical" margin={{ left: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" width={100} className="text-xs" />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#81D8D0" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'equipment' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <Card>
                        <CardContent className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search equipment by name, location, or type..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEquipment.map(item => (
                            <Card key={item.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-0">
                                    <div className="p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className={`${getStatusColor(item.status)} border-transparent`}>
                                                {item.status}
                                            </Badge>
                                            <Badge className={`${getPriorityColor(item.priority)} border-transparent ml-2`}>
                                                {item.priority}
                                            </Badge>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                                <HardHat className="w-4 h-4 text-muted-foreground" />
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.location} • {item.type}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Zone: {item.zone}</p>
                                        </div>

                                        {(item.battery !== null || item.signal !== null) && (
                                            <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                {item.battery !== null && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Battery className="w-3 h-3 text-slate-500" />
                                                        <span>Batt: {item.battery}%</span>
                                                    </div>
                                                )}
                                                {item.signal !== null && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Signal className="w-3 h-3 text-slate-500" />
                                                        <span>Sig: {item.signal}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-3 flex justify-between items-center rounded-b-lg border-t border-slate-100 dark:border-slate-700">
                                        <span className="text-xs text-muted-foreground">Maintained by: {item.inspector}</span>
                                        <span className="text-xs font-medium text-mb-secondary-active">Due: {format(new Date(item.next_maintenance), "MMM d, yyyy")}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {filteredEquipment.length === 0 && (
                            <div className="col-span-full text-center p-12 text-muted-foreground">
                                No equipment found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
