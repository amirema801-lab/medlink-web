import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Patient } from '../types';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronRight, User, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function PatientsListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'All' | 'New' | 'Critical' | 'Chronic'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      const data = await api.getPatients();
      setPatients(data);
      setLoading(false);
    }
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.phone.includes(searchTerm);
    const matchesFilter = filter === 'All' || p.tags.includes(filter as any);
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="p-8 text-center text-gray-500 font-mono">RETRIEVING PATIENT REGISTRY...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1a202c]">Patient Registry</h1>
          <p className="text-xs text-[#718096] font-bold uppercase tracking-widest font-mono">Central Database Access</p>
        </div>
        <div className="flex gap-2">
          {['All', 'New', 'Critical', 'Chronic'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-tight transition-all",
                filter === f 
                  ? "bg-[#2563eb] text-white shadow-lg shadow-blue-100" 
                  : "bg-white border border-[#e2e8f0] text-[#718096] hover:bg-gray-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#e2e8f0] shadow-sm">
        <Search className="w-5 h-5 text-[#a0aec0]" />
        <input 
          type="text" 
          placeholder="Search by Name, Clinical ID, or Phone Number..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-sm font-medium placeholder-[#a0aec0]"
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredPatients.map((patient) => (
          <Link 
            key={patient.id}
            to={`/patients/${patient.id}`}
            className="bento-card group hover:border-[#2563eb]/30 transition-all flex items-center gap-6"
          >
            <div className="w-12 h-12 bg-[#f8fafc] rounded-xl flex items-center justify-center text-[#a0aec0] group-hover:bg-blue-50 group-hover:text-[#2563eb] transition-colors">
              <User className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-extrabold text-[#1a202c] group-hover:text-[#2563eb] transition-colors">{patient.name}</span>
                <span className="text-[10px] font-bold font-mono text-[#a0aec0] bg-gray-50 px-1.5 py-0.5 rounded leading-none">#{patient.id.toUpperCase()}</span>
                <div className="flex gap-1">
                  {patient.tags.map(tag => (
                    <span key={tag} className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
                      tag === 'Critical' ? "bg-red-50 text-red-600" :
                      tag === 'New' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-[#718096] font-medium font-mono">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {patient.phone}</span>
                <span>• {patient.age}Y • {patient.gender}</span>
              </div>
            </div>

            <div className="text-right shrink-0 px-4 border-l border-[#f1f5f9]">
              <div className="text-[10px] font-bold text-[#a0aec0] uppercase tracking-widest mb-1">Last Interaction</div>
              <div className="text-xs font-extrabold text-[#1a202c] font-mono">{patient.lastVisit}</div>
            </div>

            <ChevronRight className="w-5 h-5 text-[#e2e8f0] group-hover:text-[#2563eb] transition-colors" />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
