import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart2, TrendingUp, Activity, PieChart as PieChartIcon, ArrowUpRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const COLORS = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#f43f5e', '#ec4899'];

export default function ClinicalStatsPage() {
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const trnds = await api.getTrends();
      // Inject mock intake channels data
      const enrichedTrends = {
        ...trnds,
        intakeChannels: [
          { name: 'Medlink App', count: 65 },
          { name: 'Phone Calls', count: 20 },
          { name: 'SMS Bot', count: 15 },
        ]
      };
      setTrends(enrichedTrends);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-mono italic">CALCULATING CLINICAL METRICS...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1a202c]">Clinical Analytics</h1>
          <p className="text-xs text-[#718096] font-bold uppercase tracking-widest font-mono">Decision Support Intelligence</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Disease Distribution */}
        <div className="col-span-12 lg:col-span-8 bento-card">
          <div className="bento-card-title uppercase">
            <BarChart2 className="w-4 h-4 text-blue-600" /> Disease Prevalence Index
          </div>
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.diagnoses || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: 'none' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Symptoms Pie Chart */}
        <div className="col-span-12 lg:col-span-4 bento-card">
          <div className="bento-card-title uppercase">
            <PieChartIcon className="w-4 h-4 text-purple-600" /> Symptom Clusters
          </div>
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trends?.commonSymptoms || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {trends?.commonSymptoms.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {trends?.commonSymptoms.map((entry: any, index: number) => (
              <div key={entry.name} className="flex justify-between items-center text-[11px] font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[#4a5568]">{entry.name}</span>
                </div>
                <span className="text-[#1a202c] font-mono">{entry.count}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="col-span-12 lg:col-span-4 bento-card">
          <div className="bento-card-title uppercase">
            <Zap className="w-4 h-4 text-emerald-600" /> Intake Channels
          </div>
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trends?.intakeChannels || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {trends?.intakeChannels.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {trends?.intakeChannels.map((entry: any, index: number) => (
              <div key={entry.name} className="flex justify-between items-center text-[11px] font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[(index + 3) % COLORS.length] }} />
                  <span className="text-[#4a5568]">{entry.name}</span>
                </div>
                <span className="text-[#1a202c] font-mono">{entry.count}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Summary Metrics */}
        <div className="col-span-12 grid grid-cols-4 gap-6">
          {[
            { label: 'Avg Recovery Rate', value: '88.4%', trend: '+2.1%', icon: TrendingUp, color: 'emerald' },
            { label: 'Consultation Efficiency', value: '14m', trend: '-1m', icon: Activity, color: 'blue' },
            { label: 'Diagnostic Precision', value: '96.8%', trend: '+0.5%', icon: ArrowUpRight, color: 'purple' },
            { label: 'Chronic Adherence', value: '74%', trend: '-4%', icon: Activity, color: 'red' },
          ].map((m) => (
            <div key={m.label} className="bento-card group hover:border-gray-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  m.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                  m.color === 'blue' && "bg-blue-50 text-blue-600",
                  m.color === 'purple' && "bg-purple-50 text-purple-600",
                  m.color === 'red' && "bg-red-50 text-red-600",
                )}>
                  <m.icon className="w-3.5 h-3.5" />
                </div>
                <span className={cn(
                  "text-[10px] font-black px-1.5 py-0.5 rounded",
                  m.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {m.trend}
                </span>
              </div>
              <div className="text-xl font-black text-[#1a202c] tracking-tighter">{m.value}</div>
              <div className="text-[10px] font-bold text-[#718096] uppercase tracking-widest">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
