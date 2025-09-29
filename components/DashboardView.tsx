import React, { useState, useMemo, useEffect } from 'react';
import { Pesanan } from '../types';
import { formatRupiah, getAvailableMonths } from '../utils/helpers';

interface DashboardCardProps {
    icon: string;
    iconBgColor: string;
    iconColor: string;
    title: string;
    value: string | number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, iconBgColor, iconColor, title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-200 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center">
            <div className={`p-4 ${iconBgColor} rounded-full`}>
                <i className={`${icon} ${iconColor} text-2xl`}></i>
            </div>
            <div className="ml-4">
                <p className="text-gray-500">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    </div>
);

interface DashboardViewProps {
    pesanan: Pesanan[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ pesanan }) => {
    const availableMonths = useMemo(() => getAvailableMonths(pesanan), [pesanan]);
    const [filterBulan, setFilterBulan] = useState<string>(new Date().toISOString().substring(0, 7));
    
    useEffect(() => {
        if (availableMonths.length > 0 && !availableMonths.find(m => m.value === filterBulan)) {
            setFilterBulan(availableMonths[0].value);
        }
    }, [availableMonths, filterBulan]);

    const filteredPesanan = useMemo(() => {
        if (filterBulan === 'semua') return pesanan;
        return pesanan.filter(p => p.tanggal.startsWith(filterBulan));
    }, [pesanan, filterBulan]);

    const totalPesanan = filteredPesanan.length;
    const totalPenjualan = filteredPesanan.reduce((sum, p) => sum + p.hargaJual, 0);
    const totalHpp = filteredPesanan.reduce((sum, p) => sum + p.hpp, 0);
    const labaKotor = totalPenjualan - totalHpp;
    const pesananTerbaru = filteredPesanan.slice(-5).reverse();

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <select
                        id="filter-bulan-dashboard"
                        value={filterBulan}
                        onChange={(e) => setFilterBulan(e.target.value)}
                        className="w-full sm:w-auto p-2 border rounded-lg bg-white shadow-sm"
                    >
                        <option value="semua">Semua Bulan</option>
                        {availableMonths.map(month => (
                           <option key={month.value} value={month.value}>{month.label}</option> 
                        ))}
                    </select>
                </div>
            </div>
            <p className="text-gray-500 mb-8">Ringkasan bisnis Anda berdasarkan periode yang dipilih.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard icon="fas fa-box-open" iconBgColor="bg-blue-100" iconColor="text-blue-500" title="Total Pesanan" value={totalPesanan} />
                <DashboardCard icon="fas fa-dollar-sign" iconBgColor="bg-green-100" iconColor="text-green-500" title="Total Penjualan" value={formatRupiah(totalPenjualan)} />
                <DashboardCard icon="fas fa-receipt" iconBgColor="bg-red-100" iconColor="text-red-500" title="Total HPP" value={formatRupiah(totalHpp)} />
                <DashboardCard icon="fas fa-money-bill-wave" iconBgColor="bg-yellow-100" iconColor="text-yellow-500" title="Laba Kotor" value={formatRupiah(labaKotor)} />
            </div>
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">Pesanan Terbaru di Periode Ini</h2>
                <div className="space-y-2">
                    {pesananTerbaru.length > 0 ? (
                        pesananTerbaru.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-bold">{p.pelanggan}</p>
                                    <p className="text-sm text-gray-500">#{p.invoice}</p>
                                </div>
                                <span className="font-semibold">{formatRupiah(p.hargaJual)}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Belum ada pesanan di periode ini.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
