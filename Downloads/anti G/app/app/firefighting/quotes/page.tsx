
"use client";

import { useEffect, useState, useMemo } from "react";
import { getFireQuotations, FireQuotation, FireQuotationItem } from "@/lib/mock-data";
import { StatsGrid } from "@/components/shared/stats-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function FireQuotesPage() {
    const [data, setData] = useState<{ quotes: FireQuotation[], items: FireQuotationItem[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const result = await getFireQuotations();
                setData(result);
            } catch (e) {
                // console.error("Failed to load fire quotes", e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const stats = useMemo(() => {
        if (!data) return [];

        const { quotes, items } = data;
        const grandTotal = quotes.reduce((sum, q) => sum + (q.total_omr || 0), 0);
        const criticalCost = items.filter(i => i.category === 'Critical Repairs').reduce((sum, i) => sum + i.cost_omr, 0);
        const approvedCount = quotes.filter(q => q.status === 'approved').length;
        const pendingCount = quotes.filter(q => q.status === 'pending_approval').length;

        return [
            {
                label: "GRAND TOTAL",
                value: `OMR ${grandTotal.toLocaleString('en-US')}`,
                subtitle: "All Quotations",
                icon: FileText,
                color: "text-emerald-500",
                bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
            },
            {
                label: "CRITICAL REPAIRS",
                value: `OMR ${criticalCost.toLocaleString('en-US')}`,
                subtitle: "Urgent Maintenance",
                icon: AlertTriangle,
                color: "text-red-500",
                bgColor: "bg-red-50 dark:bg-red-900/20"
            },
            {
                label: "APPROVED QUOTES",
                value: approvedCount.toString(),
                subtitle: "Ready to proceed",
                icon: CheckCircle2,
                color: "text-green-500",
                bgColor: "bg-green-50 dark:bg-green-900/20"
            },
            {
                label: "PENDING APPROVAL",
                value: pendingCount.toString(),
                subtitle: "Awaiting Action",
                icon: FileText,
                color: "text-yellow-500",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
            }
        ];
    }, [data]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'pending_approval': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    if (loading || !data) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>
            </div>
        );
    }

    // Group items by quote
    const quotesWithItems = data.quotes.map(quote => ({
        ...quote,
        items: data.items.filter(item => item.quote_code === quote.quote_code)
    }));

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center gap-4">
                <Link href="/firefighting">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quotes & Repairs</h2>
                    <p className="text-muted-foreground">Track vendor quotations and maintenance costs.</p>
                </div>
            </div>

            <StatsGrid stats={stats} />

            <div className="space-y-6">
                {quotesWithItems.map(quote => (
                    <Card key={quote.id}>
                        <CardHeader className="flex flex-row items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                            <div className="space-y-1">
                                <CardTitle className="text-lg flex items-center gap-3">
                                    {quote.quote_code}
                                    <Badge variant="secondary" className={getStatusBadge(quote.status)}>
                                        {quote.status.replace('_', ' ')}
                                    </Badge>
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    {quote.provider} • {format(new Date(quote.date), "MMMM d, yyyy")}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    OMR {quote.total_omr.toLocaleString('en-US')}
                                </div>
                                <div className="text-xs text-muted-foreground">Incl. VAT: OMR {quote.vat_omr}</div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead className="text-right">Cost (OMR)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quote.items.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.location}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.category}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`capitalize ${item.priority === 'high' ? 'text-red-500 font-medium' : ''}`}>
                                                    {item.priority}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {item.cost_omr.toLocaleString('en-US')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
