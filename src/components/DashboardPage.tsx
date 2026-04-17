import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Patient, Appointment } from '../types';
import { Activity, Clock, Users, AlertCircle, ChevronRight, TrendingUp, Filter, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [pts, apps, trnds] = await Promise.all([
        api.getPatients(),
        api.getAppointments(),
        api.getTrends()
      ]);
      setPatients(pts);
      setAppointments(apps);
      setTrends(trnds);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="text-blue-600"
      >
        <Activity className="w-10 h-10" />
      </motion.div>
    </div>
  );

  const snapshot = [
    { label: 'Total Patients', value: patients.length, color: 'blue', icon: Users },
    { label: 'New Today', value: patients.filter(p => p.tags.includes('New')).length, color: 'emerald', icon: TrendingUp },
    { label: 'Scheduled', value: appointments.filter(a => a.type !== 'emergency').length, color: 'purple', icon: Clock },
    { label: 'Triage Alerts', value: appointments.filter(a => a.type === 'emergency' && a.status === 'pending').length, color: 'red', icon: AlertCircle },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-4"
    >
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#1a202c]">Clinical Snapshot</h1>
          <p className="text-[10px] text-[#718096] font-bold uppercase tracking-widest font-mono">Live Clinic Status • Apr 17</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[11px] font-bold text-[#4a5568] hover:bg-gray-50 uppercase tracking-tight">
            <Filter className="w-3.5 h-3.5" /> Department filter
          </button>
        </div>
      </div>

      {/* A. Today's Clinical Snapshot */}
      <div className="grid grid-cols-4 gap-4">
        {snapshot.map((item) => (
          <div key={item.label} className="bento-card group hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className={cn(
                "p-1.5 rounded-lg",
                item.color === 'blue' && "bg-blue-50 text-blue-600",
                item.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                item.color === 'purple' && "bg-purple-50 text-purple-600",
                item.color === 'red' && "bg-red-50 text-red-600",
              )}>
                <item.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-extrabold text-[#1a202c] mb-0.5">{item.value}</div>
            <div className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* B. Alerts Panel */}
        <div className="col-span-4 bento-card border-red-100 bg-red-50/20">
          <div className="bento-card-title text-red-600 uppercase">
            <AlertCircle className="w-3.5 h-3.5" /> Clinical Alerts
          </div>
          <div className="space-y-2 mt-2">
            {patients.filter(p => p.riskLevel === 'High').map(p => (
              <div key={p.id} className="p-2.5 bg-white border border-red-100 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-red-50 transition-colors">
                <div>
                  <div className="text-xs font-bold text-[#1a202c]">{p.name}</div>
                  <div className="text-[9px] text-red-500 font-bold uppercase">{p.recentComplaints}</div>
                </div>
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              </div>
            ))}
            <div className="p-2.5 bg-orange-50/50 border border-orange-100 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#1a202c]">Pending Notes</div>
                <div className="text-[9px] text-orange-600 font-bold uppercase tracking-widest">3 Records need verification</div>
              </div>
              <Clock className="w-3.5 h-3.5 text-orange-400" />
            </div>
          </div>
        </div>

        {/* C. Active Patients Now */}
        <div className="col-span-4 bento-card">
          <div className="bento-card-title italic uppercase">
            <Activity className="w-3.5 h-3.5 text-blue-500" /> Active Patients
          </div>
          <div className="space-y-3 mt-2">
            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white relative">
                <Users className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#1a202c]">Robert Brown</div>
                <div className="text-[9px] text-blue-600 font-bold uppercase">In Consultation</div>
              </div>
              <Link to="/patients/p3" className="ml-auto p-1.5 hover:bg-blue-100 rounded transition-colors text-blue-600">
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#1a202c]">John Doe</div>
                <div className="text-[9px] text-[#718096] font-bold uppercase">Call Log Pending</div>
              </div>
              <Link to="/patients/p1" className="ml-auto p-1.5 hover:bg-gray-50 rounded transition-colors text-gray-400">
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* D. Quick Clinical Trend */}
        <div className="col-span-4 bento-card">
          <div className="bento-card-title uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Diagnostic Trends
          </div>
          <div className="h-[180px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.commonSymptoms || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '10px' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-between items-center px-1">
            <div className="text-[9px] font-bold text-[#718096] uppercase tracking-widest">Weekly Diagnosis Alpha</div>
            <div className="text-[10px] font-extrabold text-[#1a202c]">94% Precision</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
