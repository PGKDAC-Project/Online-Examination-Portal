import jsPDF from 'jspdf';
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
    // columns is array of strings (headers) matching keys or simple strings
    // data is array of objects. We usually need to map keys to columns implicitly or explicitly.
    // For simplicity, we assume 'data' is already mapped or we use Object.values if no explicit column mapping provided, 
    // but better to pass array of arrays for body.

    // Convert array of objects to array of arrays based on columns if necessary, 
    // but autotable supports array of objects if columns are specified properly.
    // Usage: exportToPDF(dataOfObjects, ["Col1", "Col2"], "Title", "filename")
    // If we assume columns match keys:

    const tableBody = data.map(obj => Object.values(obj));
    // Or if data is already formatted. 

    // Let's use autoTable
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
