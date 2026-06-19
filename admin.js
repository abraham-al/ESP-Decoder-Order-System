const db = window.supabase.createClient(
    'https://umkfhmjzqvqlebwzrmea.supabase.co',
    'sb_publishable_gBbVKE0rmVIhYJH3HDLEYQ_twdbDuaQ'
);

let currentOrders = [];

const COLUMNS = [
    { key: 'order_date', label: 'Order Date' },
    { key: 'territory', label: 'Territory' },
    { key: 'esp_id', label: 'ESP ID' },
    { key: 'esp_name', label: 'ESP Name' },
    { key: 'esp_phone', label: 'Phone' },
    { key: 'sales_rep', label: 'Sales Rep' },
    { key: 'delivery_date', label: 'Delivery Date' },
    { key: 'decoder_qty', label: 'Qty' },
    { key: 'remarks', label: 'Remarks' }
];

function formatDate(value) {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleString();
}

function renderTable(orders) {
    const tbody = document.getElementById('ordersBody');
    tbody.innerHTML = '';

    if (!orders.length) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No orders found.</td></tr>';
        return;
    }

    orders.forEach(o => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(o.order_date)}</td>
            <td>${o.territory ?? ''}</td>
            <td>${o.esp_id ?? ''}</td>
            <td>${o.esp_name ?? ''}</td>
            <td>${o.esp_phone ?? ''}</td>
            <td>${o.sales_rep ?? ''}</td>
            <td>${o.delivery_date ?? ''}</td>
            <td>${o.decoder_qty ?? ''}</td>
            <td>${o.remarks ?? ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

async function loadOrders() {
    const statusMsg = document.getElementById('statusMsg');
    statusMsg.innerHTML = '';
    document.getElementById('ordersBody').innerHTML = '<tr><td colspan="9" class="text-center">Loading...</td></tr>';

    const pageSize = 1000;
    let from = 0;
    let allRows = [];

    while (true) {
        const { data, error } = await db
            .from('orders')
            .select('*')
            .order('order_date', { ascending: false })
            .range(from, from + pageSize - 1);

        if (error) {
            statusMsg.innerHTML = `<div class="alert alert-danger">Error loading orders: ${error.message}</div>`;
            currentOrders = [];
            renderTable([]);
            return;
        }

        allRows = allRows.concat(data || []);
        if (!data || data.length < pageSize) break; // last page reached
        from += pageSize;
    }

    currentOrders = allRows;
    renderTable(currentOrders);
}

function buildExportRows() {
    return currentOrders.map(o => {
        const row = {};
        COLUMNS.forEach(col => {
            let val = o[col.key] ?? '';
            if (col.key === 'order_date' && val) val = formatDate(val);
            row[col.label] = val;
        });
        return row;
    });
}

function exportCsv() {
    if (!currentOrders.length) return;
    const rows = buildExportRows();
    const headers = COLUMNS.map(c => c.label);

    const escapeCsv = (val) => {
        const str = String(val ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const lines = [
        headers.map(escapeCsv).join(','),
        ...rows.map(r => headers.map(h => escapeCsv(r[h])).join(','))
    ];

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `orders_${dateStamp()}.csv`);
}

function exportXlsx() {
    if (!currentOrders.length) return;
    const rows = buildExportRows();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, `orders_${dateStamp()}.xlsx`);
}

function dateStamp() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    document.getElementById('refreshBtn').addEventListener('click', loadOrders);
    document.getElementById('exportCsvBtn').addEventListener('click', exportCsv);
    document.getElementById('exportXlsxBtn').addEventListener('click', exportXlsx);
});
