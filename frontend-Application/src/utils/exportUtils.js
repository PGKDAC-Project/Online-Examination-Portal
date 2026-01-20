import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export data to CSV
 * @param {Array<Object>} data - Array of objects to export
 * @param {string} filename - Filename without extension
 */
export const exportToCSV = (data, filename) => {
    if (!data || !data.length) {
        console.warn("No data to export");
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const val = row[header] ? String(row[header]).replace(/"/g, '""') : '';
            return `"${val}"`;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

/**
 * Export data to PDF
 * @param {Array<Object>} data - Array of objects to export
 * @param {Array<string>} columns - Array of column headers
 * @param {string} title - Title of the PDF
 * @param {string} filename - Filename without extension
 */
export const exportToPDF = (data, columns, title, filename) => {
    if (!data || !data.length) {
        console.warn("No data to export");
        return;
    }

    const doc = new jsPDF('landscape');
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table body
    // If data is array of objects, map to array of values based on columns
    // Assuming columns are keys. If columns are human readable, we need a mapping.
    // For simplicity, assuming data keys match desired output or caller formats data.
    // But autoTable expects body as array of arrays or array of objects.
    // Let's assume data is ready for autoTable (array of objects is fine if columns match keys).
    
    // However, to ensure order, let's map it to array of arrays if columns are provided as keys.
    const tableBody = data.map(row => Object.values(row));
    const tableHead = [Object.keys(data[0])]; 
    // Wait, if caller provides columns (headers), we should use them.
    // But we need to know which key corresponds to which column if we change headers.
    // To keep it simple and reusable: 
    // expect data to be an array of objects where keys are the headers we want to show, OR
    // expect columns to be the headers and data to be array of arrays.
    // Let's stick to: data is array of objects. columns is array of keys (or headers).
    
    // Better approach for autoTable with array of objects:
    // columns: [{header: 'Name', dataKey: 'name'}, ...]
    
    // But to match the requirement "columns" argument:
    // Let's assume 'columns' is just an array of strings for headers, and data is array of arrays?
    // Or 'columns' is array of keys.
    
    // Let's refine the implementation to be robust.
    // If columns is not provided, use keys from first object.
    
    let head = [];
    let body = [];
    
    if (data.length > 0) {
        const keys = Object.keys(data[0]);
        head = [columns || keys];
        body = data.map(row => Object.values(row));
    }

    doc.autoTable({
        startY: 40,
        head: head,
        body: body,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [66, 66, 66] }
    });

    doc.save(`${filename}.pdf`);
};
