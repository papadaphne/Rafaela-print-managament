export interface ItemPesanan {
  produk: string;
  ukuran: string;
  jumlah: number;
  harga: number;
}

export interface Pesanan {
  id: number;
  invoice: string;
  pelanggan: string;
  hp: string;
  hargaJual: number;
  items: ItemPesanan[];
  hpp: number;
  status: 'Baru' | 'Diproses' | 'Selesai' | 'Batal';
  tanggal: string;
}

export interface Karyawan {
  id: number;
  nama: string;
  posisi: string;
  gajiHarian: number;
}

export interface Payroll {
  id: number;
  karyawanId: number;
  namaKaryawan: string;
  periode: string;
  totalGaji: number;
  tanggal: string;
}

export interface Database {
  pesanan: Pesanan[];
  karyawan: Karyawan[];
  payroll: Payroll[];
}

export type ViewName = 'dashboard' | 'pesanan' | 'karyawan' | 'laporan';
