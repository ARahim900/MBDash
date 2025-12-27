
"use client";

import { useEffect, useState, useMemo } from "react";
import { getAssets, Asset } from "@/lib/mock-data";
import { getAssetsFromSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { StatsGrid } from "@/components/shared/stats-grid";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Boxes, MapPin, DollarSign, Wrench, Search, Plus, Filter, Database, AlertCircle, Info } from "lucide-react";
import { format } from "date-fns";

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [dataSource, setDataSource] = useState<'supabase' | 'mock'>('mock');
    const [error, setError] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    async function loadData() {
        setLoading(true);
        try {
            if (!isSupabaseConfigured()) {
                const mockData = await getAssets();
                setAssets(mockData);
                setDataSource('mock');
                setError("Supabase not configured. Using demo data.");
                setLoading(false);
                return;
            }

            // Supabase with pagination
            const { data, count } = await getAssetsFromSupabase(currentPage, pageSize, debouncedSearch);

            if (data) {
                setAssets(data);
                setTotalCount(count);
                setDataSource('supabase');
            } else {
                setAssets([]);
                setTotalCount(0);
            }
        } catch (e) {
            // console.error("Supabase fetch failed, using mock data:", e);
            setError("Supabase connection failed. Using demo data.");
            const mockData = await getAssets();
            setAssets(mockData);
            setDataSource('mock');
        } finally {
            setLoading(false);
        }
    }

    // Reload when page, size, or search changes
    useEffect(() => {
        loadData();
    }, [currentPage, pageSize, debouncedSearch]);

    // Client-side status filtering for the current page (Note: ideally this should be server-side too)
    const filteredAssets = assets.filter(item => {
        // Search is already applied server-side for Supabase, but we verify here for Mock
        if (dataSource === 'mock') {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.location.toLowerCase().includes(search.toLowerCase()) ||
                item.serialNumber.toLowerCase().includes(search.toLowerCase());
            if (!matchesSearch) return false;
        }
        return statusFilter === 'All' || item.status === statusFilter;
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    const stats = useMemo(() => {
        // Note: These stats calculate based on the CURRENT PAGE data. 
        // For full DB stats, we would need a separate API call.
        const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
        const activeCount = assets.filter(a => a.status === 'Active').length;
        const maintenanceCount = assets.filter(a => a.status === 'Under Maintenance').length;
        const totalItems = totalCount > 0 ? totalCount : assets.length;

        return [
            {
                label: "TOTAL ASSETS",
                value: totalItems.toString(),
                subtitle: dataSource === 'supabase' ? "Across all pages" : "All Items",
                icon: Boxes,
                variant: "water" as const
            },
            {
                label: "TOTAL VALUE",
                value: totalValue > 0 ? `OMR ${totalValue.toLocaleString('en-US')}` : 'N/A',
                subtitle: dataSource === 'supabase' && totalValue === 0 ? "Not in database" : "On this page",
                icon: DollarSign,
                variant: "success" as const
            },
            {
                label: "ACTIVE ASSETS",
                value: activeCount.toString(),
                subtitle: "On this page",
                icon: MapPin,
                variant: "success" as const
            },
            {
                label: "IN MAINTENANCE",
                value: maintenanceCount.toString(),
                subtitle: "On this page",
                icon: Wrench,
                variant: "warning" as const
            }
        ];
    }, [assets, totalCount, dataSource]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-mb-success-light text-mb-success dark:bg-mb-success-light/20 dark:text-mb-success-hover';
            case 'Under Maintenance': return 'bg-mb-warning-light text-mb-warning dark:bg-mb-warning-light/20 dark:text-mb-warning';
            case 'Decommissioned': return 'bg-mb-danger-light text-mb-danger dark:bg-mb-danger-light/20 dark:text-mb-danger-hover';
            case 'In Storage': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <PageHeader
                title="Assets Management"
                description="Track and manage all company assets and equipment"
                action={{ label: "Register Asset", icon: Plus }}
            />

            {/* Data source indicator */}
            <div className="flex items-center gap-2 text-sm">
                <Database className="w-4 h-4" />
                <span className="text-muted-foreground">Data source:</span>
                <Badge variant={dataSource === 'supabase' ? 'default' : 'secondary'} className="gap-2 pl-2">
                    {dataSource === 'supabase' ? (
                        <>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mb-success opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-mb-success"></span>
                            </span>
                            Supabase (Live)
                        </>
                    ) : (
                        <>
                            <span className="relative flex h-2 w-2">
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-mb-danger"></span>
                            </span>
                            Demo Data
                        </>
                    )}
                </Badge>
                {error && (
                    <span className="text-mb-warning flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </span>
                )}
            </div>

            <StatsGrid stats={stats} />

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, location or serial..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                            {['All', 'Active', 'Under Maintenance', 'In Storage'].map(status => (
                                <Button
                                    key={status}
                                    variant={statusFilter === status ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setStatusFilter(status)}
                                    className="whitespace-nowrap"
                                >
                                    {status}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset Name</TableHead>
                                <TableHead>Serial Number</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Service</TableHead>
                                <TableHead className="text-right">Value (OMR)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">Loading assets...</TableCell>
                                </TableRow>
                            ) : filteredAssets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No assets found</TableCell>
                                </TableRow>
                            ) : (
                                filteredAssets.map(asset => (
                                    <TableRow key={asset.id}>
                                        <TableCell className="font-medium">{asset.name}</TableCell>
                                        <TableCell className="font-mono text-xs">{asset.serialNumber}</TableCell>
                                        <TableCell>{asset.type}</TableCell>
                                        <TableCell>{asset.location}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${getStatusBadge(asset.status)} border-transparent`}>
                                                {asset.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {asset.lastService && !isNaN(new Date(asset.lastService).getTime())
                                                ? format(new Date(asset.lastService), "MMM d, yyyy")
                                                : <span className="text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">{asset.value.toLocaleString('en-US')}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            {totalCount > 0 ? (
                                <>
                                    Showing <strong>{Math.min((currentPage - 1) * pageSize + 1, totalCount)}</strong> to <strong>{Math.min(currentPage * pageSize, totalCount)}</strong> of <strong>{totalCount}</strong> results
                                </>
                            ) : (
                                "No results"
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || loading}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || loading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
