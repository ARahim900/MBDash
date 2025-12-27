/**
 * Export Utilities
 * CSV export functionality for reports
 */

/**
 * Escape CSV field values properly
 */
function escapeCSVField(value: any): string {
    if (value === null || value === undefined) {
        return '';
    }
    const stringValue = String(value);
    // If the value contains comma, newline, or double quote, wrap in quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
}

/**
 * Convert an array of objects to CSV string
 */
export function objectsToCSV<T extends Record<string, any>>(
    data: T[],
    columns?: { key: keyof T; header: string }[]
): string {
    if (data.length === 0) {
        return '';
    }

    // Determine columns - use provided or extract from first object
    const cols = columns || Object.keys(data[0]).map(key => ({ key: key as keyof T, header: String(key) }));

    // Create header row
    const headerRow = cols.map(col => escapeCSVField(col.header)).join(',');

    // Create data rows
    const dataRows = data.map(row =>
        cols.map(col => escapeCSVField(row[col.key])).join(',')
    );

    return [headerRow, ...dataRows].join('\n');
}

/**
 * Trigger a file download in the browser
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/csv'): void {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
}

/**
 * Export data to CSV file and trigger download
 */
export function exportToCSV<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: { key: keyof T; header: string }[]
): void {
    const csv = objectsToCSV(data, columns);
    const filenameWithExt = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    downloadFile(csv, filenameWithExt, 'text/csv');
}

/**
 * Format a date for filename (YYYY-MM-DD)
 */
export function getDateForFilename(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
}
