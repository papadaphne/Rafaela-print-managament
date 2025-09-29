import React, { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import PesananView from './components/PesananView';
import KaryawanView from './components/KaryawanView';
import LaporanView from './components/LaporanView';
import { Database, ViewName, Pesanan, Karyawan } from './types';
import { setupPWA } from './utils/helpers';

const App: React.FC = () => {
    const [db, setDb] = useLocalStorage<Database>('aplikasiBisnisDb', {
        pesanan: [],
        karyawan: [],
        payroll: []
    });
    const [activeView, setActiveView] = useState<ViewName>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notification, setNotification] = useState<{ message: string, isSuccess: boolean, key: number } | null>(null);

    useEffect(() => {
        setupPWA();
    }, []);

    const showNotification = useCallback((message: string, isSuccess = true) => {
        setNotification({ message, isSuccess, key: Date.now() });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    }, []);

    const handleSetView = (view: ViewName) => {
        setActiveView(view);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };
    
    // --- Data Operations ---

    const addPesanan = (newPesananData: Omit<Pesanan, 'id' | 'invoice' | 'tanggal' | 'status'>) => {
        const pesananBaru: Pesanan = {
            ...newPesananData,
            id: Date.now(),
            invoice: `INV-${Date.now().toString().slice(-6)}`,
            status: 'Baru',
            tanggal: new Date().toISOString()
        };
        setDb(prevDb => ({ ...prevDb, pesanan: [...prevDb.pesanan, pesananBaru] }));
        showNotification('Pesanan baru berhasil ditambahkan!');
    };

    const updatePesananStatus = (id: number, status: Pesanan['status']) => {
        setDb(prevDb => ({
            ...prevDb,
            pesanan: prevDb.pesanan.map(p => p.id === id ? { ...p, status } : p)
        }));
        showNotification(`Status pesanan diubah menjadi ${status}`);
    };
    
    const deletePesanan = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
            setDb(prevDb => ({
                ...prevDb,
                pesanan: prevDb.pesanan.filter(p => p.id !== id)
            }));
            showNotification('Pesanan berhasil dihapus.');
        }
    };
    
    const addKaryawan = (newKaryawanData: Omit<Karyawan, 'id'>) => {
        const karyawanBaru: Karyawan = {
            ...newKaryawanData,
            id: Date.now()
        };
        setDb(prevDb => ({ ...prevDb, karyawan: [...prevDb.karyawan, karyawanBaru] }));
        showNotification('Karyawan baru berhasil ditambahkan!');
    };
    
    const deleteKaryawan = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
            setDb(prevDb => ({
                ...prevDb,
                karyawan: prevDb.karyawan.filter(k => k.id !== id)
            }));
            showNotification('Karyawan berhasil dihapus.');
        }
    };

    const addPayroll = (karyawan: Karyawan, hariKerja: number) => {
        const totalGaji = karyawan.gajiHarian * hariKerja;
        const payrollRecord = {
            id: Date.now(),
            karyawanId: karyawan.id,
            namaKaryawan: karyawan.nama,
            periode: new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
            totalGaji: totalGaji,
            tanggal: new Date().toISOString()
        };
        setDb(prevDb => ({ ...prevDb, payroll: [...prevDb.payroll, payrollRecord] }));
        showNotification(`Gaji untuk ${karyawan.nama} berhasil dicatat.`);
    };

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardView pesanan={db.pesanan} />;
            case 'pesanan':
                return <PesananView pesanan={db.pesanan} addPesanan={addPesanan} updatePesananStatus={updatePesananStatus} deletePesanan={deletePesanan} showNotification={showNotification} />;
            case 'karyawan':
                return <KaryawanView karyawan={db.karyawan} addKaryawan={addKaryawan} deleteKaryawan={deleteKaryawan} addPayroll={addPayroll} showNotification={showNotification}/>;
            case 'laporan':
                return <LaporanView db={db} restoreData={setDb} showNotification={showNotification} />;
            default:
                return <DashboardView pesanan={db.pesanan} />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
            
            <header className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center z-30">
                <button onClick={() => setIsSidebarOpen(true)} className="text-white focus:outline-none">
                    <i className="fas fa-bars fa-lg"></i>
                </button>
                <div className="text-xl font-bold">Rafaela Print</div>
                <div></div>
            </header>

            <Sidebar activeView={activeView} setActiveView={handleSetView} isOpen={isSidebarOpen} />

            <main className="flex-1 p-6 md:p-10 overflow-y-auto mt-16 md:mt-0 md:ml-20">
                {renderView()}
            </main>
            
            {notification && (
                 <div
                    key={notification.key}
                    className={`fixed bottom-5 right-5 text-white py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-300 ${notification ? 'translate-y-0' : 'translate-y-20'} ${notification.isSuccess ? 'bg-green-500' : 'bg-red-500'}`}
                 >
                    {notification.message}
                 </div>
            )}
        </div>
    );
};

export default App;
