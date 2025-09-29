import React, { useState, useMemo, useEffect } from 'react';
import { Pesanan, ItemPesanan } from '../types';
import { formatRupiah, generateInvoicePDF, getAvailableMonths } from '../utils/helpers';

// Sub-component for a single item in the order form
const OrderItemForm: React.FC<{
    item: Partial<ItemPesanan> & { id: number };
    index: number;
    updateItem: (index: number, field: keyof ItemPesanan, value: any) => void;
    removeItem: (index: number) => void;
    canRemove: boolean;
}> = ({ item, index, updateItem, removeItem, canRemove }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h4 className="font-bold text-gray-700">Item #{index + 1}</h4>
                {canRemove && (
                    <button type="button" onClick={() => removeItem(index)} className="text-sm text-red-600 font-semibold hover:text-red-800">
                        <i className="fas fa-trash-alt mr-1"></i>Hapus Item
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div className="mb-3 md:col-span-2">
                    <label htmlFor={`produk-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Produk / Jasa</label>
                    <input type="text" id={`produk-${index}`} value={item.produk || ''} onChange={(e) => updateItem(index, 'produk', e.target.value)} placeholder="Contoh: Kaos Polos Lengan Panjang" className="w-full p-2 border rounded-md" required />
                </div>
                <div className="mb-3">
                    <label htmlFor={`ukuran-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Ukuran (Opsional)</label>
                    <input type="text" id={`ukuran-${index}`} value={item.ukuran || ''} onChange={(e) => updateItem(index, 'ukuran', e.target.value)} placeholder="Contoh: XL" className="w-full p-2 border rounded-md" />
                </div>
                <div className="mb-3">
                    <label htmlFor={`jumlah-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                    <input type="number" id={`jumlah-${index}`} value={item.jumlah || 1} onChange={(e) => updateItem(index, 'jumlah', parseFloat(e.target.value))} min="1" className="w-full p-2 border rounded-md" />
                </div>
                <div className="mb-3 md:col-span-2">
                    <label htmlFor={`harga-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Harga Satuan</label>
                    <input type="number" id={`harga-${index}`} value={item.harga || ''} onChange={(e) => updateItem(index, 'harga', parseFloat(e.target.value))} placeholder="Contoh: 50000" className="w-full p-2 border rounded-md" required />
                </div>
            </div>
        </div>
    );
};

interface PesananViewProps {
    pesanan: Pesanan[];
    addPesanan: (newPesanan: Omit<Pesanan, 'id' | 'invoice' | 'tanggal' | 'status'>) => void;
    updatePesananStatus: (id: number, status: Pesanan['status']) => void;
    deletePesanan: (id: number) => void;
    showNotification: (message: string, isSuccess?: boolean) => void;
}

const PesananView: React.FC<PesananViewProps> = ({ pesanan, addPesanan, updatePesananStatus, deletePesanan, showNotification }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pelanggan, setPelanggan] = useState('');
    const [hp, setHp] = useState('');
    const [items, setItems] = useState<(Partial<ItemPesanan> & {id: number})[]>([{ id: Date.now(), jumlah: 1, harga: 0, produk: '' }]);
    const [biayaBahan, setBiayaBahan] = useState<number | ''>('');
    const [biayaTenagaKerja, setBiayaTenagaKerja] = useState<number | ''>('');

    const availableMonths = useMemo(() => getAvailableMonths(pesanan), [pesanan]);
    const [filterBulan, setFilterBulan] = useState('semua');
    
    useEffect(() => {
        if (!isModalOpen) {
            // Reset form on modal close
            setPelanggan('');
            setHp('');
            setItems([{ id: Date.now(), jumlah: 1, harga: 0, produk: '' }]);
            setBiayaBahan('');
            setBiayaTenagaKerja('');
        }
    }, [isModalOpen]);

    const filteredPesanan = useMemo(() => {
        if (filterBulan === 'semua') return pesanan;
        return pesanan.filter(p => p.tanggal.startsWith(filterBulan));
    }, [pesanan, filterBulan]);

    const totalInvoice = useMemo(() => items.reduce((sum, item) => sum + (item.jumlah || 0) * (item.harga || 0), 0), [items]);

    const addItem = () => setItems([...items, { id: Date.now(), jumlah: 1, harga: 0, produk: '' }]);
    const updateItem = (index: number, field: keyof ItemPesanan, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };
    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        } else {
            showNotification('Minimal harus ada satu item dalam pesanan.', false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalItems = items.filter(item => item.produk) as ItemPesanan[];
        if (finalItems.length === 0) {
            showNotification('Pesanan harus memiliki minimal satu item.', false);
            return;
        }

        addPesanan({
            pelanggan,
            hp,
            items: finalItems,
            hargaJual: totalInvoice,
            hpp: (Number(biayaBahan) || 0) + (Number(biayaTenagaKerja) || 0),
        });
        setIsModalOpen(false);
    };
    
    const handlePrintInvoice = async (pesananId: number) => {
        const orderToPrint = pesanan.find(p => p.id === pesananId);
        if (orderToPrint) {
            try {
                await generateInvoicePDF(orderToPrint);
                showNotification(`Invoice ${orderToPrint.invoice} berhasil diunduh!`);
            } catch {
                showNotification('Gagal membuat invoice PDF.', false);
            }
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Manajemen Pesanan</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <select
                        value={filterBulan}
                        onChange={(e) => setFilterBulan(e.target.value)}
                        className="w-full sm:w-auto p-2 border rounded-lg bg-white shadow-sm"
                    >
                        <option value="semua">Semua Bulan</option>
                        {availableMonths.map(month => (
                           <option key={month.value} value={month.value}>{month.label}</option> 
                        ))}
                    </select>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors whitespace-nowrap">
                        <i className="fas fa-plus mr-0 sm:mr-2"></i><span className="hidden sm:inline">Tambah</span>
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4">Invoice</th>
                            <th className="p-4">Pelanggan</th>
                            <th className="p-4">Total Harga</th>
                            <th className="p-4">HPP</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPesanan.length > 0 ? filteredPesanan.map(p => (
                            <tr key={p.id} className="border-b">
                                <td className="p-4 font-mono text-sm">{p.invoice}</td>
                                <td className="p-4">{p.pelanggan}</td>
                                <td className="p-4">{formatRupiah(p.hargaJual)}</td>
                                <td className="p-4">{formatRupiah(p.hpp)}</td>
                                <td className="p-4">
                                    <select value={p.status} onChange={(e) => updatePesananStatus(p.id, e.target.value as Pesanan['status'])} className="p-1 border rounded-md text-sm">
                                        <option value="Baru">Baru</option>
                                        <option value="Diproses">Diproses</option>
                                        <option value="Selesai">Selesai</option>
                                        <option value="Batal">Batal</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => handlePrintInvoice(p.id)} className="text-blue-500 hover:text-blue-700 p-1" title="Cetak Invoice"><i className="fas fa-print"></i></button>
                                        <button onClick={() => deletePesanan(p.id)} className="text-red-500 hover:text-red-700 p-1" title="Hapus Pesanan"><i className="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={6} className="text-center p-8 text-gray-500">Tidak ada data pesanan untuk periode yang dipilih.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] flex flex-col">
                        <h2 className="text-2xl font-bold mb-6">Tambah Pesanan Baru</h2>
                        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-4 -mr-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="nama-pelanggan" className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan</label>
                                    <input type="text" id="nama-pelanggan" value={pelanggan} onChange={(e) => setPelanggan(e.target.value)} placeholder="Nama Pelanggan" className="w-full p-3 border rounded-lg" required />
                                </div>
                                <div>
                                    <label htmlFor="hp-pelanggan" className="block text-sm font-medium text-gray-700 mb-1">No. HP / WA</label>
                                    <input type="tel" id="hp-pelanggan" value={hp} onChange={(e) => setHp(e.target.value)} placeholder="081234567890" className="w-full p-3 border rounded-lg" />
                                </div>
                            </div>
                            <hr className="my-6" />
                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <OrderItemForm key={item.id} item={item} index={index} updateItem={updateItem} removeItem={removeItem} canRemove={items.length > 1}/>
                                ))}
                            </div>
                            <button type="button" onClick={addItem} className="mt-2 text-blue-600 font-semibold hover:text-blue-800">
                                <i className="fas fa-plus mr-2"></i>Tambah Item Pesanan
                            </button>
                            <div className="mt-6 text-right text-xl font-bold">Total: <span>{formatRupiah(totalInvoice)}</span></div>
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-bold mb-2">Hitung Harga Pokok Penjualan (HPP)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="number" value={biayaBahan} onChange={(e) => setBiayaBahan(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="Biaya Bahan (Rp)" className="w-full p-3 border rounded-lg" required />
                                    <input type="number" value={biayaTenagaKerja} onChange={(e) => setBiayaTenagaKerja(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="Biaya Tenaga Kerja (Rp)" className="w-full p-3 border rounded-lg" required />
                                </div>
                            </div>
                        </form>
                        <div className="flex justify-end mt-6 space-x-4 pt-4 border-t">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
                            <button type="submit" form="pesanan-form" onClick={handleSubmit} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PesananView;
