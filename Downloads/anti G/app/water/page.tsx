'use client';

import { useState, useMemo } from 'react';
import { Droplets, TrendingDown, Map, Tag, Database, ChevronDown } from 'lucide-react';
import {
  AVAILABLE_MONTHS,
  WATER_METERS,
  ZONE_CONFIG,
  calculateRangeAnalysis,
  calculateMonthlyAnalysis,
  getMonthlyTrends,
  getAllZonesAnalysis,
  getConsumptionByType,
  getPerformanceRating,
  formatNumber,
  getMetersByLevel,
} from '@/lib/water-data';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Droplets },
  { id: 'loss', label: 'Water Loss Analysis', icon: TrendingDown },
  { id: 'zone', label: 'Zone Analysis', icon: Map },
  { id: 'type', label: 'Consumption by Type', icon: Tag },
  { id: 'database', label: 'Main Database', icon: Database },
];

const LEVEL_COLORS = {
  L1: '#EF4444',
  L2: '#F59E0B',
  L3: '#10B981',
  L4: '#3B82F6',
  DC: '#8B5CF6',
};

export default function WaterPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [startMonth, setStartMonth] = useState('Jan-25');
  const [endMonth, setEndMonth] = useState('Nov-25');
  const [selectedZone, setSelectedZone] = useState('Zone_03_(A)');
  const [selectedType, setSelectedType] = useState('Commercial');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const rangeAnalysis = useMemo(() => calculateRangeAnalysis(startMonth, endMonth), [startMonth, endMonth]);
  const monthlyTrends = useMemo(() => getMonthlyTrends(startMonth, endMonth), [startMonth, endMonth]);
  const zonesAnalysis = useMemo(() => getAllZonesAnalysis(endMonth), [endMonth]);
  const typeAnalysis = useMemo(() => getConsumptionByType(endMonth), [endMonth]);
  const performanceRating = getPerformanceRating(rangeAnalysis.lossPercentage);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <select
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            {AVAILABLE_MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <span className="text-muted-foreground">to</span>
          <select
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            {AVAILABLE_MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <button className="px-4 py-2 text-sm border rounded-md hover:bg-muted">
          Reset Range
        </button>
      </div>

      {/* 4-Level Distribution Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">4-Level Water Distribution Totals for {startMonth} to {endMonth}</h3>
        <div className="grid gap-3">
          {[
            { label: 'A1 - MAIN SOURCE (L1)', value: rangeAnalysis.A1, desc: 'Main Bulk (NAMA)', color: '#EF4444', icon: '💧' },
            { label: 'A2 - ZONE DISTRIBUTION', value: rangeAnalysis.A2, desc: 'L2 Zone Bulk + Direct', color: '#F59E0B', icon: '🔶' },
            { label: 'A3 - BUILDING LEVEL', value: rangeAnalysis.A3Bulk, desc: 'L3 Buildings + Villas', color: '#10B981', icon: '🏠' },
            { label: 'A4 - END USERS', value: rangeAnalysis.A3Individual, desc: 'L4 Apartments + L3 End', color: '#3B82F6', icon: '👥' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: `${item.color}15` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: item.color }}>
                <span className="text-white">{item.icon}</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <div className="text-2xl font-bold">{formatNumber(item.value)} <span className="text-sm font-normal">m³</span></div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage Loss Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Multi-Stage Water Loss Totals for {startMonth} to {endMonth}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'STAGE 1 LOSS (A1→A2)', value: rangeAnalysis.stage1Loss, pct: ((rangeAnalysis.stage1Loss / rangeAnalysis.A1) * 100).toFixed(1), desc: 'Main Distribution', color: '#EF4444' },
            { label: 'STAGE 2 LOSS (L2→L3)', value: rangeAnalysis.stage2Loss, pct: ((rangeAnalysis.stage2Loss / rangeAnalysis.A2) * 100).toFixed(1), desc: 'Zone Networks', color: '#F59E0B' },
            { label: 'STAGE 3 LOSS (A3→A4)', value: rangeAnalysis.stage3Loss, pct: ((rangeAnalysis.stage3Loss / rangeAnalysis.A3Bulk) * 100).toFixed(1), desc: 'Building Networks', color: '#10B981' },
            { label: 'TOTAL SYSTEM LOSS', value: rangeAnalysis.totalLoss, pct: rangeAnalysis.lossPercentage.toFixed(1), desc: 'Overall', color: '#8B5CF6' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                  <TrendingDown className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </div>
              <div className="text-xl font-bold">{formatNumber(item.value)} <span className="text-sm font-normal">m³</span></div>
              <div className="text-xs text-muted-foreground">{item.desc}: {item.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="text-lg font-semibold mb-4">Monthly Consumption Trend</h3>
        <p className="text-sm text-muted-foreground mb-4">L1 Supply vs. L2 & L3 Meter Totals</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(value as number) + ' m³'} />
              <Legend />
              <Line type="monotone" dataKey="A1" name="L1 - Main Source" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="A2" name="L2 - Zone Bulk Meters" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="A3Individual" name="L3 - Building/Villa Meters" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Loss Trend */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="text-lg font-semibold mb-4">Monthly Water Loss Trend</h3>
        <p className="text-sm text-muted-foreground mb-4">Comparing loss at different stages of distribution</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(value as number) + ' m³'} />
              <Legend />
              <Line type="monotone" dataKey="stage1Loss" name="Stage 1 Loss" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="stage2Loss" name="Stage 2 Loss" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="stage3Loss" name="Stage 3 Loss" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderLossAnalysis = () => (
    <div className="space-y-6">
      {/* System Efficiency Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-lg border bg-card col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">System Efficiency Rating</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle
                  cx="64" cy="64" r="56"
                  stroke={performanceRating.color}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${rangeAnalysis.efficiency * 3.52} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{rangeAnalysis.efficiency.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xl font-semibold">
                <span>{performanceRating.emoji}</span>
                <span style={{ color: performanceRating.color }}>{performanceRating.status}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Target: 85% efficiency (≤15% loss)
              </p>
              <p className="text-sm mt-2">
                Current loss: <span className="font-semibold">{rangeAnalysis.lossPercentage.toFixed(1)}%</span>
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="text-lg font-semibold mb-4">Loss Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Input (A1)</span>
              <span className="font-semibold">{formatNumber(rangeAnalysis.A1)} m³</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Output (A4)</span>
              <span className="font-semibold">{formatNumber(rangeAnalysis.A3Individual)} m³</span>
            </div>
            <hr />
            <div className="flex justify-between text-destructive">
              <span>Total Loss</span>
              <span className="font-semibold">{formatNumber(rangeAnalysis.totalLoss)} m³</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage by Stage Breakdown */}
      <div className="p-6 rounded-lg border bg-card">
        <h3 className="text-lg font-semibold mb-4">Stage-by-Stage Loss Breakdown</h3>
        <div className="space-y-4">
          {[
            { stage: 'Stage 1', label: 'Main Distribution (A1 → A2)', from: rangeAnalysis.A1, to: rangeAnalysis.A2, loss: rangeAnalysis.stage1Loss, color: '#EF4444' },
            { stage: 'Stage 2', label: 'Zone Networks (A2 → A4)', from: rangeAnalysis.A2, to: rangeAnalysis.A3Individual, loss: rangeAnalysis.stage2Loss, color: '#F59E0B' },
            { stage: 'Stage 3', label: 'Building Internal (A3 → A4)', from: rangeAnalysis.A3Bulk, to: rangeAnalysis.A3Individual, loss: rangeAnalysis.stage3Loss, color: '#10B981' },
          ].map((item) => {
            const pct = item.from > 0 ? (item.loss / item.from) * 100 : 0;
            return (
              <div key={item.stage} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{item.stage}</span>
                    <span className="text-sm text-muted-foreground ml-2">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{formatNumber(item.loss)} m³</span>
                    <span className="text-sm text-muted-foreground ml-2">({pct.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: item.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Efficiency Trend Chart */}
      <div className="p-6 rounded-lg border bg-card">
        <h3 className="text-lg font-semibold mb-4">Monthly Efficiency Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => (value as number).toFixed(1) + '%'} />
              <Legend />
              <Area type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#10B981" fill="#10B98130" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderZoneAnalysis = () => {
    const selectedZoneData = zonesAnalysis.find((z) => z.zone === selectedZone);
    return (
      <div className="space-y-6">
        {/* Zone Selector */}
        <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
          <label className="font-medium">Select Zone:</label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background flex-1 max-w-xs"
          >
            {ZONE_CONFIG.map((z) => (
              <option key={z.code} value={z.code}>{z.name}</option>
            ))}
          </select>
          <label className="font-medium ml-4">Month:</label>
          <select
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            {AVAILABLE_MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {selectedZoneData && (
          <>
            {/* Zone Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Zone Bulk Meter', value: selectedZoneData.bulkMeterReading, unit: 'm³', color: '#3B82F6', pct: '100%' },
                { label: 'Individual Meters Sum', value: selectedZoneData.individualTotal, unit: 'm³', color: '#10B981', pct: ((selectedZoneData.individualTotal / Math.max(selectedZoneData.bulkMeterReading, 1)) * 100).toFixed(0) + '%' },
                { label: 'Water Loss', value: selectedZoneData.loss, unit: 'm³', color: selectedZoneData.lossPercentage > 30 ? '#EF4444' : '#F59E0B', pct: selectedZoneData.lossPercentage.toFixed(1) + '%' },
                { label: 'Zone Efficiency', value: 100 - selectedZoneData.lossPercentage, unit: '%', color: selectedZoneData.lossPercentage < 15 ? '#10B981' : '#F59E0B', pct: 'Coverage' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-card">
                  <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
                  <div className="text-2xl font-bold" style={{ color: idx === 2 || idx === 3 ? item.color : undefined }}>
                    {typeof item.value === 'number' ? (idx === 3 ? item.value.toFixed(1) : formatNumber(item.value)) : item.value}
                    <span className="text-sm font-normal ml-1">{item.unit}</span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: item.color }}>{item.pct}</div>
                </div>
              ))}
            </div>

            {/* Zone Performance Gauge */}
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-4">Zone Performance: {selectedZoneData.zone}</h3>
              <div className="flex items-center justify-center gap-8">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="14" fill="none" />
                    <circle
                      cx="80" cy="80" r="70"
                      stroke={selectedZoneData.lossPercentage < 15 ? '#10B981' : selectedZoneData.lossPercentage < 30 ? '#F59E0B' : '#EF4444'}
                      strokeWidth="14"
                      fill="none"
                      strokeDasharray={`${(100 - selectedZoneData.lossPercentage) * 4.4} 440`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{(100 - selectedZoneData.lossPercentage).toFixed(1)}%</span>
                    <span className="text-sm text-muted-foreground">Efficiency</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Input: {formatNumber(selectedZoneData.bulkMeterReading)} m³</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Output: {formatNumber(selectedZoneData.individualTotal)} m³</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Loss: {formatNumber(selectedZoneData.loss)} m³</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* All Zones Comparison */}
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="text-lg font-semibold mb-4">All Zones Comparison - {endMonth}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zonesAnalysis} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="zone" type="category" width={100} />
                <Tooltip formatter={(value) => formatNumber(value as number) + ' m³'} />
                <Legend />
                <Bar dataKey="bulkMeterReading" name="Zone Bulk" fill="#3B82F6" />
                <Bar dataKey="individualTotal" name="Individual Total" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Loss Ranking */}
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="text-lg font-semibold mb-4">Zone Loss Ranking</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Zone</th>
                  <th className="text-right p-2">Bulk (m³)</th>
                  <th className="text-right p-2">Individual (m³)</th>
                  <th className="text-right p-2">Loss (m³)</th>
                  <th className="text-right p-2">Loss %</th>
                  <th className="text-center p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...zonesAnalysis].sort((a, b) => b.lossPercentage - a.lossPercentage).map((z) => {
                  const rating = getPerformanceRating(z.lossPercentage);
                  return (
                    <tr key={z.zone} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{z.zone}</td>
                      <td className="p-2 text-right">{formatNumber(z.bulkMeterReading)}</td>
                      <td className="p-2 text-right">{formatNumber(z.individualTotal)}</td>
                      <td className="p-2 text-right">{formatNumber(z.loss)}</td>
                      <td className="p-2 text-right font-semibold" style={{ color: rating.color }}>{z.lossPercentage.toFixed(1)}%</td>
                      <td className="p-2 text-center">{rating.emoji}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTypeAnalysis = () => {
    const typeData = typeAnalysis;
    const totalConsumption = typeData.reduce((sum, t) => sum + t.total, 0);
    const selectedTypeData = typeData.find((t) => t.type === selectedType);

    return (
      <div className="space-y-6">
        {/* Type Selector */}
        <div className="flex flex-wrap items-center gap-2 p-4 bg-card rounded-lg border">
          {typeData.map((t) => (
            <button
              key={t.type}
              onClick={() => setSelectedType(t.type)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedType === t.type
                ? 'text-white'
                : 'bg-muted hover:bg-muted/80'
                }`}
              style={selectedType === t.type ? { backgroundColor: t.color } : {}}
            >
              {t.type}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Consumption', value: selectedTypeData?.total || 0, sub: `${selectedType} total for period`, color: selectedTypeData?.color },
            { label: 'Monthly Average', value: Math.round((selectedTypeData?.total || 0) / 11), sub: 'Average across 11 months', color: '#F59E0B' },
            { label: 'Peak Month', value: 'Nov-25', sub: 'Highest consumption', color: '#EF4444', isText: true },
            { label: '% of L1 Supply', value: selectedTypeData?.percentage || 0, sub: `${selectedType} share of total`, color: '#10B981', isPct: true },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                  <Tag className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase">{item.label}</span>
              </div>
              <div className="text-2xl font-bold">
                {item.isText ? item.value : item.isPct ? `${item.value}%` : `${formatNumber(item.value as number)}`}
                {!item.isText && !item.isPct && <span className="text-sm font-normal ml-1">m³</span>}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Pie Chart and Bar Chart Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">Type Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    dataKey="total"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(value as number) + ' m³'} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">Consumption by Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(value as number) + ' m³'} />
                  <Bar dataKey="total" name="Consumption">
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Type Details Table */}
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="text-lg font-semibold mb-4">Consumption by Type Summary - {endMonth}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Type</th>
                  <th className="text-right p-3">Consumption (m³)</th>
                  <th className="text-right p-3">% of Total</th>
                  <th className="p-3">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {typeData.map((t) => (
                  <tr key={t.type} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="font-medium">{t.type}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold">{formatNumber(t.total)}</td>
                    <td className="p-3 text-right">{t.percentage}%</td>
                    <td className="p-3">
                      <div className="h-2 bg-muted rounded-full overflow-hidden w-32">
                        <div className="h-full rounded-full" style={{ width: `${t.percentage}%`, backgroundColor: t.color }} />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-muted/30">
                  <td className="p-3">Total</td>
                  <td className="p-3 text-right">{formatNumber(totalConsumption)}</td>
                  <td className="p-3 text-right">100%</td>
                  <td className="p-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderDatabase = () => {
    const itemsPerPage = 15;

    const filteredMeters = WATER_METERS.filter((m) => {
      const matchesSearch = m.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.accountNumber.includes(searchTerm) ||
        m.zone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === 'All' || m.level === levelFilter;
      return matchesSearch && matchesLevel;
    });

    const totalPages = Math.ceil(filteredMeters.length / itemsPerPage);
    const paginatedMeters = filteredMeters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const meterCounts = {
      L1: getMetersByLevel('L1').length,
      L2: getMetersByLevel('L2').length,
      L3: getMetersByLevel('L3').length,
      L4: getMetersByLevel('L4').length,
      DC: getMetersByLevel('DC').length,
    };

    return (
      <div className="space-y-6">
        {/* Meter Count Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Meters', count: WATER_METERS.length, sub: 'All levels', color: '#6B7280' },
            { label: 'L1 Meters', count: meterCounts.L1, sub: 'Main source', color: '#EF4444' },
            { label: 'L2 Meters', count: meterCounts.L2, sub: 'Zone bulk', color: '#F59E0B' },
            { label: 'L3 Meters', count: meterCounts.L3, sub: 'Buildings/Villas', color: '#10B981' },
            { label: 'L4 Meters', count: meterCounts.L4, sub: 'Apartments', color: '#3B82F6' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="text-xs text-muted-foreground">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
          <input
            type="text"
            placeholder="Search meters..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border rounded-md bg-background flex-1 min-w-[200px]"
          />
          <select
            value={levelFilter}
            onChange={(e) => { setLevelFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="All">All Levels</option>
            <option value="L1">L1 - Main</option>
            <option value="L2">L2 - Zone Bulk</option>
            <option value="L3">L3 - Building</option>
            <option value="L4">L4 - Apartment</option>
            <option value="DC">DC - Direct</option>
          </select>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Export to CSV
          </button>
        </div>

        {/* Data Table */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3">Meter Label</th>
                  <th className="text-left p-3">Account #</th>
                  <th className="text-left p-3">Zone</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-center p-3">Level</th>
                  {AVAILABLE_MONTHS.slice(-6).map((m) => (
                    <th key={m} className="text-right p-3">{m}</th>
                  ))}
                  <th className="text-right p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMeters.map((meter) => {
                  const total = AVAILABLE_MONTHS.reduce((sum, m) => sum + (meter.consumption[m] || 0), 0);
                  const levelColor = LEVEL_COLORS[meter.level as keyof typeof LEVEL_COLORS] || '#6B7280';
                  return (
                    <tr key={meter.accountNumber} className="border-t hover:bg-muted/30">
                      <td className="p-3 font-medium">{meter.label}</td>
                      <td className="p-3 text-muted-foreground">{meter.accountNumber}</td>
                      <td className="p-3">{meter.zone}</td>
                      <td className="p-3 text-xs">{meter.type}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-1 rounded text-xs font-medium text-white" style={{ backgroundColor: levelColor }}>
                          {meter.level}
                        </span>
                      </td>
                      {AVAILABLE_MONTHS.slice(-6).map((m) => (
                        <td key={m} className="p-3 text-right">{meter.consumption[m]?.toLocaleString() || '-'}</td>
                      ))}
                      <td className="p-3 text-right font-semibold">{total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMeters.length)} of {filteredMeters.length} meters
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-muted"
              >
                Previous
              </button>
              <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-muted"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Water System Analysis</h1>
          <p className="text-sm text-muted-foreground">Muscat Bay Resource Management</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'loss' && renderLossAnalysis()}
        {activeTab === 'zone' && renderZoneAnalysis()}
        {activeTab === 'type' && renderTypeAnalysis()}
        {activeTab === 'database' && renderDatabase()}
      </div>
    </div>
  );
}

