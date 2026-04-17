import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, Bell, Search, Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';
import DashboardPage from './components/DashboardPage';
import PatientDetails from './components/PatientDetails';
import PatientsListPage from './components/PatientsListPage';
import SchedulePage from './components/SchedulePage';
import ClinicalStatsPage from './components/ClinicalStatsPage';
import SettingsPage from './components/SettingsPage';
import { cn } from './lib/utils';
import { AnimatePresence, motion } from 'motion/react';

function Sidebar() {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: Users, label: 'Patients', path: '/patients' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Activity, label: 'Clinical Stats', path: '/stats' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
          <Activity className="text-white w-6 h-6" />
        </div>
        <span className="font-extrabold text-xl tracking-tighter text-[#1a202c]">MIDLINK</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-[#edf2f7] text-[#2563eb] shadow-sm" 
                  : "text-[#718096] hover:bg-gray-50 hover:text-[#1a202c]"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-[#2563eb]" : "text-[#a0aec0] group-hover:text-[#4a5568]")} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-[#e2e8f0] bg-gray-50/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e2e8f0] flex items-center justify-center text-[#4a5568] text-xs font-bold ring-2 ring-white">
            SC
          </div>
          <div>
            <div className="font-bold text-[13px] text-[#1a202c]">Dr. Sarah Chen</div>
            <div className="text-[11px] text-[#718096] font-medium">Cardiology Unit</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="h-[60px] bg-white border-b border-[#e2e8f0] sticky top-0 z-10 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 bg-[#f4f7fa] px-4 py-2 rounded-lg w-96 ml-4 border border-[#e2e8f0]">
        <Search className="w-4 h-4 text-[#a0aec0]" />
        <input 
          type="text" 
          placeholder="Quick find patients..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder-[#a0aec0]"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-[#a0aec0] hover:text-[#4a5568] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-6 w-px bg-[#e2e8f0]"></div>
        <button className="bg-[#2563eb] text-white px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
          New Entry
        </button>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#f4f7fa] text-[#1a202c]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/patients" element={<PatientsListPage />} />
                <Route path="/patients/:id" element={<PatientDetails />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/stats" element={<ClinicalStatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* Fallback routes */}
                <Route path="*" element={<DashboardPage />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Router>
  );
}

