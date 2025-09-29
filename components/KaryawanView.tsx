import React, { useState, useEffect } from 'react';
import { Karyawan } from '../types';
import { formatRupiah } from '../utils/helpers';

interface KaryawanViewProps {
    karyawan: Karyawan[];
    addKaryawan: (newKaryawan: Omit<Karyawan, 'id'>) => void;
    deleteKaryawan: (id: number) => void;
    addPayroll: (karyawan: Karyawan, hariKerja: number) => void;
    showNotification: (message: string, isSuccess?: boolean) => void;
}

const KaryawanView: React.FC<KaryawanViewProps> = ({ karyawan, addKaryawan, deleteKaryawan, addPayroll, showNotification }) => {
    const [isKaryawanModalOpen, setIsKaryawanModalOpen] = useState(false);
    const [isGajiModalOpen, setIsGajiModalOpen] = useState(false);
    const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(null);

    // Karyawan Modal State
    const [nama, setNama] = useState('');
    const [posisi, setPosisi] = useState('');
    const [gajiHarian, setGajiHarian] = useState<number | ''>('');

    // Gaji Modal State
    const [hariKerja, setHariKerja] = useState<number | ''>('');
    const totalGaji = selectedKaryawan && hariKerja ? selectedKaryawan.gajiHarian * Number(hariKerja) : 0;
    
    useEffect(() => {
        if (!isKaryawanModalOpen) {
            setNama('');
            setPosisi('');
            setGajiHarian('');
        }
    }, [isKaryawanModalOpen]);

    useEffect(() => {
        if (!isGajiModalOpen) {
            setSelectedKaryawan(null);
            setHariKerja('');
        }
    }, [isGajiModalOpen]);

    const handleAddKaryawan = (e: React.FormEvent) => {
        e.preventDefault();
        if (gajiHarian) {
            addKaryawan({ nama, posisi, gajiHarian: Number(gajiHarian) });
            setIsKaryawanModalOpen(false);
        }
    };
    
    const openGajiModal = (k: Karyawan) => {
        setSelectedKaryawan(k);
        setIsGajiModalOpen(true);
    };

    const handleAddPayroll = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedKaryawan && hariKerja && Number(hariKerja) > 0) {
            addPayroll(selectedKaryawan, Number(hariKerja));
            setIsGajiModalOpen(false);
        } else {
            showNotification('Jumlah hari kerja harus diisi.', false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manajemen Karyawan & Payroll</h1>
                <button onClick={() => setIsKaryawanModalOpen(true)} className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition-colors">
                    <i className="fas fa-user-plus mr-2"></i>Tambah Karyawan
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4">Nama Karyawan</th>
                            <th className="p-4">Posisi</th>
                            <th className="p-4">Gaji per Hari</th>
                            <th className="p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {karyawan.length > 0 ? karyawan.map(k => (
                            <tr key={k.id} className="border-b">
                                <td className="p-4">{k.nama}</td>
                                <td className="p-4">{k.posisi}</td>
                                <td className="p-4">{formatRupiah(k.gajiHarian)}</td>
                                <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => openGajiModal(k)} className="bg-yellow-400 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-500">
                                            <i className="fas fa-calculator mr-1"></i> Hitung Gaji
                                        </button>
                                        <button onClick={() => deleteKaryawan(k.id)} className="text-red-500 hover:text-red-700 ml-2 p-1"><i className="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} className="text-center p-8 text-gray-500">Belum ada data karyawan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Karyawan Modal */}
            {isKaryawanModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">Tambah Karyawan Baru</h2>
                        <form onSubmit={handleAddKaryawan}>
                            <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Karyawan" className="w-full p-3 border rounded-lg mb-4" required />
                            <input type="text" value={posisi} onChange={(e) => setPosisi(e.target.value)} placeholder="Posisi (e.g., Penjahit)" className="w-full p-3 border rounded-lg mb-4" required />
                            <input type="number" value={gajiHarian} onChange={(e) => setGajiHarian(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="Gaji per Hari (Rp)" className="w-full p-3 border rounded-lg" required />
                            <div className="flex justify-end mt-6 space-x-4">
                                <button type="button" onClick={() => setIsKaryawanModalOpen(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
                                <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Gaji Modal */}
            {isGajiModalOpen && selectedKaryawan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Hitung Gaji Karyawan</h2>
                        <p className="mb-6">Karyawan: <span className="font-bold">{selectedKaryawan.nama}</span></p>
                        <form onSubmit={handleAddPayroll}>
                            <input type="number" value={hariKerja} onChange={(e) => setHariKerja(e.target.value === '' ? '' : parseInt(e.target.value))} placeholder="Jumlah Hari Kerja Bulan Ini" className="w-full p-3 border rounded-lg mb-4" required />
                            <div className="text-right text-xl font-bold mb-6">
                                Total Gaji: <span>{formatRupiah(totalGaji)}</span>
                            </div>
                            <div className="flex justify-end mt-6 space-x-4">
                                <button type="button" onClick={() => setIsGajiModalOpen(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
                                <button type="submit" className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Catat Pembayaran Gaji</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KaryawanView;
