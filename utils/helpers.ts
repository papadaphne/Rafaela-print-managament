import { Database, Pesanan, Payroll } from '../types';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAXVBMVEX////AAD/Lyz/AAD/Pj7/ERH/ICD/yMj/UVH/mJj/Zmb/paX/dnb/X1//srL/h4f/fn7/1tb/zs7/o6P/TU3/Kir/rq7/bGz/SEj/QED/ubn/n5//eXn/ior/LS2rQk22AAACwElEQVR4nO3c63KqMBRAYYIAgiCoqKj6/s85bY4txVmLmG2n3V96DgaTjMkEk2YDAAAAAAAAAAAAAAAAAAAAAAAAYCnpvC/tY60NW9lP2tsA1Rba63B9QBO0n0EP8O1W2g+6g6A1X+rQGgMo/bi2D+0YQK0f1g7tDYBaP6wZ2hOAmn/sHbofAK3+sWnofgDU+seood8JoNaP6IbeC0Ctf0QG+l4AVv9wQ99HAKz+4YZ+CIC1f2i236sFrP6h2X4tAOv90W6/dgDW+6Pdfg4A6/3Rbr8EgPX+aLcfAkD7R7v9GgDaP9rtNwDQ/tFuvwSA9g9s+zUA1P7Btj8EgPYPbPsNAFT7B9v+EwDaP7DtVwDQ/oFtfwUA7R/Y9msAaP/Atj8EgPYPbPsNAFT7B9v+EwDaP7DtVwDQ/oFtfwUA7R/Y9msAaP/Atj8EgPYPbPsNAFT7B9v+EwDaP7DtVwDQ/oFtfwUA7R/Y9msAaP/Atj8EgPYPbPsNAFT7B9v+EwDaP7DtVwDQ/oFtfwUA7R/Y9msAaP/Atj8EgPYPbPsNAFT7B9v+EwDaP7DtVwDQ/oFtfwUA7R/Y9msAaP/Atj8EgPYPbPsNAFT7B9v+EwDaP7DtVwDQ/oFtfwUA7R/Y9msAaP/Atj8EgPYPbPsNAFT7B9v+EwDaP7DtVwDQ/oFtfwUA7R/Y9msA6/2h3X45AOv9od1+DQDvD+32eQE4D9rtNwDndrv9GgDOrXb7xQBkbrfbLwUg4127/ZoAyLh2+6UAyLh2+6UAqLqj234dAKru6LYfA0DVHdrthyYgy/qP2u2XBiDr/qPb/h4A6f/Ibb8GgPQ/ctu/AVB+R7f9GgDq7uienwGo+6P3AdB+gLz/T6T9I+2vP9kHAAAAAAAAAAAAAAAAAAAAAAA43T/p0sS+v4nO6gAAAABJRU5ErkJggg==";
const qrisBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAASFBMVEX///8AAAD/AAD/MzP/ICD/ERH/Ly//Pz//KSn/d3f/o6P/f3//YWH/Skr/UFD/bW3/yMj/h4f/srL/n5//v7//1dX/19f/trb/wcH/ysqfOzswAAAEwUlEQVR4nO2d25KrMAxFJQIIgoKiKO7/gMcdg2ySlDaVfeyc79/UaQ9pml+vDAAAAAAAAAAAAAAAAAAAAAAAAACA49S72k/1e+9Kq46qL220v/XjX2n/6wWd1n5Kq2t53i/tS/XkPjW234n2s/q8r9aX+zJ/rZ36nO343pD2L72P/qj6s36v63q5X9Un68u+3P7zP0kP+kZ/1g/7M20f6t3rX+z/qL+wT/Vd/dm/o29Xv7FP1e/sT/V7+8P6Nf2R/gD/Sn+AP9C/3t/QH9qf4C/2r9d/wR/t3/F/yR/q3++/yJ/fH9/v74/1N/fr+5v7+/0t/fP+0P98/3B/vH+AH/g/+A/8L/0H+CP9A/3L/bH+mf6m/1T/Uv9A/w3/Tf+2/qf+g/0N/Sf8P/wX/F/93/2f+z/3X/5/7c/4f/9/7l/vD+/H5tf29/Z390f1h/YH9g/2D/YP+gf3B/aH9wf6B/b39v/8b++v5Q/57+PP8e/hz+Xv6u/rD+u/4G/4b+DP/e/gH/9f7e/pz+vP6E/pL+4P6s/oD+G/7t/vP+f/8H/h/94/2D/V/7+/un/T/8B/zz/fP90/39/uH+cP+s/5j+pP6//zP/y/7y/kD/2v7s/uD+fP+g/9z+7/70/uL+2v63/e/85f3x/vL+xP7E/sL+1P7U/qL+iv5N/wX/9f7l/gL/2f7B/l/++f49/4X+Uf8f/2H/3/7F/vf+4P7e/j/++v71/gn/5f7Z/rX+yf5Z/5b+Vf8X/rP+kf7v/sL+0/6f/rf+xf6/w/9X/x/+wf6n/uL++f5Y/w3/8f4d/w/+cf8f/yn/cf8n/5f+Tf93/13/Tv/n/lv+b/+/+t/5r/wP/7/w3/P//f9B//7/qP+G/5X/pv+H/2//J/+9/5z/k//N/8F/x3/Of81/xX/f//P/V/9X/0f/R/9X/wf/3/1P/d/8X/7v+7/2/+1//f+R/5//yf+n/1f/n/9v/5/+//1/+//yf/3/8//d/6//R/+v/tf/F/+X/0//L/6f/Z/+3/7P/9f/Z/1f/x/+n/y//3/x//b/5//7/6v/h/+X/8P/8P/8f+L/3f+3/9f+x/8n/7v/p/8H/7//3f/h/wP/n/8v/gP+p/+r/1/+f/wv/6/+3/6v/N/+f/G/+X/5v/5/5v/L/+//1/5//X/9v/5/+b/4//V/9v/5//L/5v/5/+H/7P/l/+P/6v/B/+v/9/9//2//r/7P/1f/3/7P/v/+r/6//7f9R/6/+3/6v/r//n/q/+f/2/+//7f/3/7f/P/6f/d/+H/9v/v//P/4f/F/9v/5/+//z//n/x//L/+v/rf+b/7v/l//3/y//3/+v/y//7f93/5//b/+v/zf/L/+//t/+H/wf/L/7//L/+//9/+n/zf/J/8v/pf/T/4//d/+X/w//v/3f/H/+P/t/+f/r/+f/2/+7/+H/7f/b//v/x/+//vf/X/+/+n/1f/F/8//N/+3/xf/9/9H/v//f/V/+P/q/+f/q/+P/i/+f/6/+f/+v/L/+//V/+v/t/+f/j/+f/1/5b/y/+b/2/+v/pv+//vf/D//f/V/+H/rf+f/3v/V/93/x//f/S/9X/x//f/N/+H/zf/R/9H/0f/p/+f/7v/3f/b/8v/t//v/t/+//v/+f/r/9n/+f/b/8v/p/+f/4//7f/J/+//p//f/+//r/2/+n/w//T/4f/R/+H/rf/d/8H/q/8bAAAAAAAAAAAAAAAAAAAAAAAAAJT4D5w701bF2Nf1AAAAAElFTkSuQmCC";

export const formatRupiah = (angka: number): string => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

export const setupPWA = () => {
  const manifestData = {
      "name": "Rafaela Print - Aplikasi Manajemen", "short_name": "RafaelaPrint", "start_url": ".",
      "display": "standalone", "background_color": "#ffffff", "theme_color": "#1f2937",
      "description": "Aplikasi untuk mengelola bisnis Rafaela Print.",
      "icons": [{"src": logoBase64, "sizes": "192x192", "type": "image/png"}, {"src": logoBase64, "sizes": "512x512", "type": "image/png"}]
  };
  const manifestBlob = new Blob([JSON.stringify(manifestData)], {type: 'application/json'});
  const manifestLink = document.getElementById('manifest-link');
  if(manifestLink) {
      manifestLink.setAttribute('href', URL.createObjectURL(manifestBlob));
  }

  if ('serviceWorker' in navigator) {
      const swCode = `
          const CACHE_NAME = 'rafaela-print-cache-v4';
          const URLS_TO_CACHE = ['./', 'https://cdn.tailwindcss.com', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];
          self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(URLS_TO_CACHE))));
          self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
          self.addEventListener('activate', e => e.waitUntil(caches.keys().then(cN => Promise.all(cN.map(c => c !== CACHE_NAME ? caches.delete(c) : null)))));
      `;
      const swBlob = new Blob([swCode], {type: 'application/javascript'});
      navigator.serviceWorker.register(URL.createObjectURL(swBlob))
          .then(reg => console.log('SW registered:', reg.scope))
          .catch(err => console.log('SW registration failed:', err));
  }
};

export const backupData = (db: Database) => {
    const dataStr = JSON.stringify(db, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Backup_RafaelaPrint_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const generateInvoicePDF = async (pesanan: Pesanan): Promise<void> => {
    const invoiceTemplate = document.createElement('div');
    invoiceTemplate.id = 'invoice-template-react';
    invoiceTemplate.style.display = 'block';
    invoiceTemplate.style.width = '80mm';
    invoiceTemplate.style.padding = '10mm';
    invoiceTemplate.style.boxSizing = 'border-box';
    invoiceTemplate.style.backgroundColor = 'white';
    invoiceTemplate.style.color = 'black';
    invoiceTemplate.style.fontFamily = "'Inter', sans-serif";
    invoiceTemplate.style.fontSize = '10pt';
    invoiceTemplate.style.lineHeight = '1.5';
    
    const invoiceDateTime = new Date(pesanan.tanggal);
    const formattedDate = invoiceDateTime.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const formattedTime = invoiceDateTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const itemsHtml = pesanan.items.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <div style="flex-grow: 1; text-align: left; padding-right: 10px;">${item.produk}${item.ukuran ? ` (${item.ukuran})` : ''} x${item.jumlah}</div>
            <div style="text-align: right; min-width: 30%;">${formatRupiah(item.jumlah * item.harga)}</div>
        </div>
    `).join('');

    invoiceTemplate.innerHTML = `
        <style>
            #invoice-template-react hr { border: 0; border-top: 1px dashed #ccc; margin: 8px 0; }
        </style>
        <div style="text-align: center; margin-bottom: 10px;">
            <img src="${logoBase64}" alt="Rafaela Print Logo" style="max-width: 25mm; margin: 0 auto 5px auto; display: block; height: auto; filter: grayscale(100%) brightness(0%);">
            <h2 style="font-size: 14pt; margin: 0; padding: 0; font-weight: bold;">RAFAELA PRINT</h2>
            <p style="font-size: 8pt; margin: 2px 0;">Jl. Kaumandowo X Genuk Semarang</p>
            <div style="font-size: 8pt;">
                <p style="display: flex; align-items: center; gap: 5px; margin: 2px 0; justify-content: center;"><i class="fab fa-whatsapp"></i> 08979012852</p>
                <p style="display: flex; align-items: center; gap: 5px; margin: 2px 0; justify-content: center;"><i class="fab fa-instagram"></i> @rafaelaprint</p>
                <p style="display: flex; align-items: center; gap: 5px; margin: 2px 0; justify-content: center;"><i class="fab fa-facebook-f"></i> Rafaela Print</p>
            </div>
        </div>
        <hr>
        <div>
            <div style="display: flex; justify-content: space-between; font-size: 9pt; padding: 2px 0;"><span style="width: 40%; text-align: left;">CUSTOMER</span><span style="width: 60%; text-align: right;">${pesanan.pelanggan}</span></div>
            <div style="display: flex; justify-content: space-between; font-size: 9pt; padding: 2px 0;"><span style="width: 40%; text-align: left;">NO. HP</span><span style="width: 60%; text-align: right;">${pesanan.hp || '-'}</span></div>
        </div>
        <hr>
        <div>
            <div style="display: flex; justify-content: space-between; font-size: 9pt; padding: 2px 0;"><span style="width: 40%; text-align: left;">NO. INVOICE</span><span style="width: 60%; text-align: right;">${pesanan.invoice}</span></div>
            <div style="display: flex; justify-content: space-between; font-size: 9pt; padding: 2px 0;"><span style="width: 40%; text-align: left;">DATE / TIME</span><span style="width: 60%; text-align: right;">${formattedDate} ${formattedTime}</span></div>
        </div>
        <hr>
        <div style="font-size: 9pt; padding: 5px 0;">${itemsHtml}</div>
        <hr>
        <div>
            <div style="display: flex; justify-content: space-between; font-size: 10pt; font-weight: bold; padding-top: 5px;"><span>TOTAL</span><span>${formatRupiah(pesanan.hargaJual)}</span></div>
        </div>
        <hr>
        <div style="text-align: center;">
            <p style="font-weight: bold; margin-bottom: 4px;">Pembayaran via QRIS</p>
            <img src="${qrisBase64}" alt="QRIS Rafaela Print" style="max-width:120px; margin:0 auto; display:block;">
            <p style="font-size: 8pt; margin-top: 4px;">Scan untuk bayar dengan semua e-wallet/bank</p>
        </div>
        <hr>
        <div style="text-align: center;">
            <p>Terima kasih atas kepercayaan anda</p>
            <p>#OneStopPrinting Solution</p>
            <p style="margin-top: 5px;">www.rafaelaprint.com</p>
        </div>
    `;

    document.body.appendChild(invoiceTemplate);

    try {
        const canvas = await window.html2canvas(invoiceTemplate, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        const pdf = new window.jspdf.jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [80, 297]
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        pdf.save(`Invoice_${pesanan.invoice}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    } finally {
        document.body.removeChild(invoiceTemplate);
    }
};


const formatCsvCell = (data: any): string => {
    let cell = data === null || data === undefined ? '' : String(data);
    cell = cell.replace(/"/g, '""');
    if (cell.search(/("|,|\n)/g) >= 0) {
        cell = `"${cell}"`;
    }
    return cell;
}

export const downloadLaporanBulanan = (pesanan: Pesanan[], payroll: Payroll[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const namaBulan = now.toLocaleString('id-ID', { month: 'long' });
    const fileName = `Laporan_Rafaela_Print_${namaBulan}_${currentYear}.csv`;

    const pesananBulanIni = pesanan.filter(p => {
        const tgl = new Date(p.tanggal);
        return tgl.getMonth() === currentMonth && tgl.getFullYear() === currentYear;
    });
    const payrollBulanIni = payroll.filter(p => {
        const tgl = new Date(p.tanggal);
        return tgl.getMonth() === currentMonth && tgl.getFullYear() === currentYear;
    });

    const totalPenjualan = pesananBulanIni.reduce((sum, p) => sum + p.hargaJual, 0);
    const totalHpp = pesananBulanIni.reduce((sum, p) => sum + p.hpp, 0);
    const totalGaji = payrollBulanIni.reduce((sum, p) => sum + p.totalGaji, 0);
    const labaBersih = totalPenjualan - totalHpp - totalGaji;
    
    const rows: (string | number)[][] = [];
    rows.push([`Laporan Keuangan Bulanan - Rafaela Print`]);
    rows.push([`Bulan: ${namaBulan} ${currentYear}`]);
    rows.push([]);

    rows.push(['Ringkasan Keuangan']);
    rows.push(['Kategori', 'Jumlah']);
    rows.push(['Total Pendapatan', totalPenjualan]);
    rows.push(['Total HPP', totalHpp]);
    rows.push(['Total Biaya Gaji', totalGaji]);
    rows.push(['Laba / Rugi Bersih', labaBersih]);
    rows.push([]);

    rows.push(['Detail Transaksi Pesanan']);
    rows.push(['Tanggal', 'Invoice', 'Pelanggan', 'No. HP', 'Harga Jual', 'HPP', 'Detail Item']);
    pesananBulanIni.forEach(p => {
        const tgl = new Date(p.tanggal).toLocaleDateString('id-ID');
        const itemDetails = p.items.map(item => {
            let detail = item.produk || '';
            if (item.ukuran) detail += ` (${item.ukuran})`;
            detail += ` x${item.jumlah} -> ${formatRupiah(item.jumlah * item.harga)}`;
            return detail;
        }).join(' | ');

        rows.push([tgl, p.invoice, p.pelanggan, p.hp, p.hargaJual, p.hpp, itemDetails]);
    });
    rows.push([]);

    rows.push(['Detail Pembayaran Gaji']);
    rows.push(['Tanggal', 'Nama Karyawan', 'Periode', 'Total Gaji Dibayar']);
    payrollBulanIni.forEach(p => {
        const tgl = new Date(p.tanggal).toLocaleDateString('id-ID');
        rows.push([tgl, p.namaKaryawan, p.periode, p.totalGaji]);
    });

    let csvContent = rows.map(row => row.map(formatCsvCell).join(',')).join('\n');
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const getAvailableMonths = (pesanan: Pesanan[]): { value: string; label: string }[] => {
    const monthsInDb = [...new Set(pesanan.map(p => p.tanggal.substring(0, 7)))];
    monthsInDb.sort().reverse();

    const now = new Date();
    const currentMonthYear = now.toISOString().substring(0, 7); // "YYYY-MM"
    if (!monthsInDb.includes(currentMonthYear)) {
        monthsInDb.unshift(currentMonthYear);
    }
    
    return monthsInDb.map(monthYear => {
        const [year, month] = monthYear.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        const monthName = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
        return { value: monthYear, label: monthName };
    });
};