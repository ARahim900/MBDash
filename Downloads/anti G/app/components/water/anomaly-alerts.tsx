"use client";

import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface Anomaly {
    id: string;
    type: 'high_loss' | 'high_consumption';
    title: string;
    description: string;
    date: string;
    severity: 'warning' | 'critical';
}

interface AnomalyAlertsProps {
    anomalies: Anomaly[];
}

export function AnomalyAlerts({ anomalies }: AnomalyAlertsProps) {
    if (anomalies.length === 0) {
        return (
            <div className="p-4 bg-mb-success-light dark:bg-mb-success-light/20 rounded-xl border border-mb-success-light/50 dark:border-mb-success-light/30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-mb-success-light/50 dark:bg-mb-success-light/30 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-mb-success dark:text-mb-success-hover" />
                    </div>
                    <div>
                        <p className="font-medium text-mb-success dark:text-mb-success-hover">No Anomalies Detected</p>
                        <p className="text-sm text-mb-success dark:text-mb-success-hover">System is operating within normal parameters</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {anomalies.map((anomaly) => {
                const isHighLoss = anomaly.type === 'high_loss';
                const isCritical = anomaly.severity === 'critical';

                return (
                    <div
                        key={anomaly.id}
                        className={`p-4 rounded-xl border ${isCritical
                            ? 'bg-mb-danger-light dark:bg-mb-danger-light/20 border-mb-danger-light/50 dark:border-mb-danger-light/30'
                            : 'bg-mb-warning-light dark:bg-mb-warning-light/20 border-mb-warning-light/50 dark:border-mb-warning-light/30'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCritical
                                ? 'bg-mb-danger-light/50 dark:bg-mb-danger-light/30'
                                : 'bg-mb-warning-light/50 dark:bg-mb-warning-light/30'
                                }`}>
                                <AlertTriangle className={`w-4 h-4 ${isCritical
                                    ? 'text-mb-danger dark:text-mb-danger-hover'
                                    : 'text-mb-warning dark:text-mb-warning'
                                    }`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className={`font-medium ${isCritical
                                        ? 'text-mb-danger dark:text-mb-danger-hover'
                                        : 'text-mb-warning dark:text-mb-warning'
                                        }`}>
                                        {anomaly.title}
                                    </p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${isCritical
                                        ? 'bg-mb-danger text-white'
                                        : 'bg-mb-warning text-white'
                                        }`}>
                                        {anomaly.date}
                                    </span>
                                </div>
                                <p className={`text-sm mt-1 ${isCritical
                                    ? 'text-mb-danger dark:text-mb-danger-hover'
                                    : 'text-mb-warning dark:text-mb-warning'
                                    }`}>
                                    {anomaly.description}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
