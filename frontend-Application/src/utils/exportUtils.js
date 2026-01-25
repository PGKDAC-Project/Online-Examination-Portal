import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
        console.warn("No data to export");
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(","),
        ...data.map(row => headers.map(fieldName => {
            let val = row[fieldName];
            // Handle commas and quotes in values
            if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
                val = `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        }).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToPDF = (data, columns, title, filename) => {
    if (!data || data.length === 0) {
        console.warn("No data to export");
        return;
    }

    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    doc.text(title, 14, 22);

    // Add Timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Prepare table data
    // Robustly map data to array of arrays based on columns keys (assuming keys match column names or we map by index if provided)
    // Since input 'data' in ActivityLogs uses keys matching 'columns' names (e.g. "Time", "User"), we can use Object.values if ordered, but safer to keys.
    const tableBody = data.map(obj => columns.map(col => obj[col] || '-'));

    doc.autoTable({
        startY: 35,
        head: [columns],
        body: tableBody,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [99, 102, 241] } // Primary color
    });

    doc.save(`${filename}.pdf`);
};
