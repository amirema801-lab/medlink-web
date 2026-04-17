import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Appointment, Patient } from '../types';
import { 
  Calendar as CalendarIcon, Clock, Users, ChevronRight, 
  MoreVertical, Plus, AlertCircle, Video, MessageSquare, 
  MapPin, CheckCircle, XCircle, Zap, ShieldAlert,
  Smartphone, Phone as PhoneIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [apps, pts] = await Promise.all([
        api.getAppointments(),
        api.getPatients()
      ]);
      setAppointments(apps);
      setPatients(pts);
      setLoading(false);
    }
    loadData();
  }, []);

  const getPatient = (id: string) => patients.find(p => p.id === id);

  const emergencyQueue = appointments.filter(a => a.type === 'emergency' && a.status === 'pending');
  const onlineQueue = appointments.filter(a => a.type === 'online' && a.status === 'pending');
  const hospitalQueue = appointments.filter(a => a.type === 'hospital' && a.status === 'pending');

  const SourceIcon = ({ source }: { source: Appointment['source'] }) => {
    switch(source) {
      case 'app': return <Smartphone className="w-3 h-3 text-blue-500" />;
      case 'phone': return <PhoneIcon className="w-3 h-3 text-purple-500" />;
      case 'sms': return <MessageSquare className="w-3 h-3 text-emerald-500" />;
      default: return null;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-mono italic">SYNCING TRIAGE ENGINE...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 h-screen flex flex-col gap-6 overflow-hidden"
    >
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1a202c]">Triage & Clinical Queue</h1>
          <p className="text-xs text-[#718096] font-bold uppercase tracking-widest font-mono">Unified Multi-Channel Intake</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 italic">
            <span className="flex items-center gap-1.5"><Smartphone className="w-3 h-3" /> App</span>
            <span className="flex items-center gap-1.5"><PhoneIcon className="w-3 h-3" /> Call</span>
            <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> SMS</span>
          </div>
          <button className="bg-[#2563eb] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Entry
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden min-h-0">
        {/* Lane 1: EMERGENCY (Critical) */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black text-red-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> 1. Emergency Lane
            </h3>
            <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{emergencyQueue.length}</span>
          </div>
          <div className="flex-1 bg-red-50/20 border border-red-100 rounded-2xl p-4 overflow-y-auto space-y-3 custom-scrollbar">
            <AnimatePresence>
              {emergencyQueue.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bento-card border-red-200 shadow-lg shadow-red-100/50 bg-white relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500" />
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-extrabold text-[#1a202c]">{getPatient(app.patientId)?.name}</div>
                          <SourceIcon source={app.source} />
                        </div>
                        <div className="text-[9px] font-bold text-red-500 uppercase font-mono">{app.time}</div>
                      </div>
                    </div>
                    <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                  </div>
                  <p className="text-[11px] font-bold text-[#4a5568] mb-3 p-2 bg-red-50 rounded-lg italic border border-red-100">
                    "{app.reason}"
                  </p>
                  <button className="w-full py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-100">
                    ACCEPT IMMEDIATELY
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Lane 2: MED-LINK (Online) */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <Zap className="w-4 h-4" /> 2. Med-Link Queue
            </h3>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{onlineQueue.length}</span>
          </div>
          <div className="flex-1 bg-blue-50/20 border border-blue-100 rounded-2xl p-4 overflow-y-auto space-y-3 custom-scrollbar">
            {onlineQueue.map((app) => (
              <div key={app.id} className="bento-card border-blue-200 hover:border-blue-400 transition-colors bg-white relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      {app.channel === 'video' ? <Video className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-extrabold text-[#1a202c]">{getPatient(app.patientId)?.name}</div>
                        <SourceIcon source={app.source} />
                      </div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase font-mono">{app.time} • {app.channel}</div>
                    </div>
                  </div>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                    app.priority === 'high' ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                  )}>
                    {app.priority}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest rounded transition-all hover:bg-blue-700">
                    JOIN CALL
                  </button>
                  <button className="px-2 py-1.5 border border-gray-200 rounded text-gray-400 hover:text-red-500 transition-colors">
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lane 3: HOSPITAL (In-Person) */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 3. Hospital Visits
            </h3>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">{hospitalQueue.length}</span>
          </div>
          <div className="flex-1 bg-emerald-50/20 border border-emerald-100 rounded-2xl p-4 overflow-y-auto space-y-3 custom-scrollbar">
            {hospitalQueue.map((app) => (
              <div key={app.id} className="bento-card border-emerald-100 hover:border-emerald-300 transition-colors bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-extrabold text-[#1a202c]">{getPatient(app.patientId)?.name}</div>
                      <SourceIcon source={app.source} />
                    </div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase font-mono">{app.time}</div>
                  </div>
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-50 mb-3">
                  <div className="text-[8px] font-bold text-emerald-900/50 uppercase tracking-widest mb-0.5">LOCATION</div>
                  <div className="text-[10px] font-bold text-emerald-900">{app.location}</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{app.reason}</span>
                  <div className="flex h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Stats bar */}
      <div className="shrink-0 bento-card flex items-center justify-between bg-white/50 backdrop-blur-sm">
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#1a202c]">09:12 AM</div>
              <div className="text-[9px] font-bold text-[#718096] uppercase tracking-widest">Global Sync Time</div>
            </div>
          </div>
          <div className="flex items-center gap-3 border-l border-gray-200 pl-8">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#1a202c]">14 Patients</div>
              <div className="text-[9px] font-bold text-[#718096] uppercase tracking-widest">Active In Queue</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[9px] font-bold text-[#a0aec0] uppercase tracking-[0.2em] mb-0.5">Clinic Load Index</div>
            <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[65%]" />
            </div>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors">
            Manage Shifts <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
