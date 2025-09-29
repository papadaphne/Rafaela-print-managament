import React, { useMemo } from 'react';
import { Database } from '../types';
import { formatRupiah, backupData, downloadLaporanBulanan } from '../utils/helpers';

interface LaporanViewProps {
    db: Database;
    restoreData: (db: Database) => void;
    showNotification: (message: string, isSuccess?: boolean) => void;
}

const LaporanView: React.FC<LaporanViewProps> = ({ db, restoreData, showNotification }) => {
    const { pesanan, payroll } = db;
    
    const totalPenjualan = useMemo(() => pesanan.reduce((sum, p) => sum + p.hargaJual, 0), [pesanan]);
    const totalHpp = useMemo(() => pesanan.reduce((sum, p) => sum + p.hpp, 0), [pesanan]);
    const totalGaji = useMemo(() => payroll.reduce((sum, p) => sum + p.totalGaji, 0), [payroll]);
    const labaBersih = totalPenjualan - totalHpp - totalGaji;

    const handleBackup = () => {
        backupData(db);
        showNotification("Backup berhasil diunduh!");
    };
    
    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    const restoredDb: Database = JSON.parse(result);
                    // Basic validation
                    if ('pesanan' in restoredDb && 'karyawan' in restoredDb && 'payroll' in restoredDb) {
                        restoreData(restoredDb);
                        showNotification("Data berhasil dipulihkan!");
                    } else {
                         showNotification("File backup tidak valid.", false);
                    }
                }
            } catch (err) {
                showNotification("Gagal memulihkan data. Pastikan file backup benar.", false);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input so same file can be selected again
    };
    
    const handleDownloadLaporan = () => {
        downloadLaporanBulanan(db.pesanan, db.payroll);
        showNotification("Laporan bulanan berhasil diunduh!");
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Laporan Keuangan - Rafaela Print</h1>
                <button onClick={handleDownloadLaporan} className="bg-teal-500 text-white px-6 py-2 rounded-lg shadow hover:bg-teal-600 transition-colors">
                    <i className="fas fa-file-excel mr-2"></i>Download Laporan Bulan Ini
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="mt-6 flex space-x-4">
                    <button onClick={handleBackup} className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-600">
                        <i className="fas fa-download mr-2"></i> Backup Data
                    </button>
                    <label className="bg-purple-500 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-600 cursor-pointer">
                        <i className="fas fa-upload mr-2"></i> Restore Data
                        <input type="file" accept=".json" hidden onChange={handleRestore} />
                    </label>
                </div>

                <h2 className="text-xl font-bold mb-4 mt-8">Ringkasan Keuangan (Semua Waktu)</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-gray-600">Total Pendapatan (dari Penjualan)</span>
                        <span className="font-bold text-green-600">{formatRupiah(totalPenjualan)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-gray-600">Total Biaya Produksi (HPP)</span>
                        <span className="font-bold text-red-600">{formatRupiah(totalHpp)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-gray-600">Total Biaya Gaji</span>
                        <span className="font-bold text-red-600">{formatRupiah(totalGaji)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 text-lg">
                        <span className="font-bold">Laba / Rugi Bersih</span>
                        <span className={`font-bold ${labaBersih >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatRupiah(labaBersih)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaporanView;
