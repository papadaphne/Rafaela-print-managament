import React from 'react';
import { ViewName } from '../types';

interface SidebarProps {
  activeView: ViewName;
  setActiveView: (view: ViewName) => void;
  isOpen: boolean;
}

const NavButton: React.FC<{
  viewName: ViewName;
  title: string;
  iconClass: string;
  activeView: ViewName;
  onClick: (view: ViewName) => void;
}> = ({ viewName, title, iconClass, activeView, onClick }) => (
  <button
    onClick={() => onClick(viewName)}
    className={`p-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-700 hover:scale-110 ${
      activeView === viewName ? 'bg-gray-700' : ''
    }`}
    title={title}
  >
    <i className={`${iconClass} fa-lg`}></i>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen }) => {
  return (
    <aside
      id="sidebar"
      className={`w-20 bg-gray-800 text-white flex-col items-center py-6 space-y-8 md:flex fixed top-0 left-0 h-full z-50 md:z-auto transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <div className="text-2xl font-bold">RP</div>
      <nav className="flex flex-col items-center space-y-6">
        <NavButton
          viewName="dashboard"
          title="Dashboard"
          iconClass="fas fa-tachometer-alt"
          activeView={activeView}
          onClick={setActiveView}
        />
        <NavButton
          viewName="pesanan"
          title="Manajemen Pesanan"
          iconClass="fas fa-box-open"
          activeView={activeView}
          onClick={setActiveView}
        />
        <NavButton
          viewName="karyawan"
          title="Manajemen Karyawan"
          iconClass="fas fa-users"
          activeView={activeView}
          onClick={setActiveView}
        />
        <NavButton
          viewName="laporan"
          title="Laporan"
          iconClass="fas fa-chart-pie"
          activeView={activeView}
          onClick={setActiveView}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
