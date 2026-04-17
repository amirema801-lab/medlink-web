import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { generatePatientSummary } from '../services/geminiService';
import { Patient, MedicalRecord, AISummary, Attachment, CallLog, ChatMessage } from '../types';
import { 
  ArrowLeft, FileText, Activity, AlertTriangle, 
  MessageSquare, Mic, Send, Calendar, 
  ArrowUpRight, Clock, Pill, User, Phone, Download, Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'records' | 'attachments' | 'calls' | 'chat'>('records');
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    async function loadPatientData() {
      if (!id) return;
      setLoading(true);
      try {
        const [p, r, a, c, ch] = await Promise.all([
          api.getPatient(id),
          api.getRecords(id),
          api.getAttachments(id),
          api.getCalls(id),
          api.getChats(id)
        ]);
        setPatient(p);
        setRecords(r);
        setAttachments(a);
        setCalls(c);
        setChats(ch);
        
        // Generate AI Summary
        setAiGenerating(true);
        const summary = await generatePatientSummary(p, r, c);
        setAiSummary(summary);
        setAiGenerating(false);
      } catch (err) {
        console.error("Failed to load patient data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPatientData();
  }, [id]);

  if (loading || !patient) return <div className="p-8 text-center text-gray-500 font-mono italic">RETRIEVING CLINICAL PROFILE...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-h-screen overflow-hidden flex flex-col bg-[#f8fafc]"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#e2e8f0] shadow-sm relative z-10">
        <Link to="/patients" className="flex items-center gap-2 text-[#718096] hover:text-[#1a202c] transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider">Patient Registry</span>
        </Link>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[10px] font-bold text-[#4a5568] hover:bg-gray-50 transition-colors uppercase">
            <Download className="w-3.5 h-3.5" /> Export EMR
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#2563eb] text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 uppercase">
            <Video className="w-3.5 h-3.5" /> Start Tele-Consult
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-[300px_1fr_300px] grid-rows-[repeat(12,minmax(0,1fr))] gap-4 overflow-hidden">
        
        {/* Profile Column (Left) */}
        <div className="flex flex-col gap-4 row-span-12">
          {/* Patient Card */}
          <div className="bento-card p-0 overflow-hidden">
            <div className="bg-[#1a202c] p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
              <div className="w-16 h-16 bg-[#2d3748] rounded-2xl mx-auto flex items-center justify-center mb-3 ring-4 ring-[#2d3748]/50">
                <User className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-lg font-extrabold tracking-tight">{patient.name}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                {patient.gender} • {patient.age}Y • <span className="text-blue-400">ID: {patient.id.toUpperCase()}</span>
              </p>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3 text-[#4a5568]">
                <Phone className="w-4 h-4 text-[#a0aec0]" />
                <span className="text-xs font-bold font-mono">{patient.phone}</span>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest border-b border-[#f1f5f9] pb-1">Primary Symptoms</div>
                <div className="flex flex-wrap gap-1.5">
                  {patient.symptoms.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-blue-50 text-[#2563eb] rounded text-[9px] font-extrabold uppercase">{s}</span>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl italic">
                <div className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Active Alert
                </div>
                <p className="text-[11px] text-[#1a202c] font-medium">"{patient.recentComplaints}"</p>
              </div>
            </div>
          </div>

          {/* Chronic Management Card */}
          <div className="bento-card">
            <div className="bento-card-title uppercase">
              <Activity className="w-3.5 h-3.5 text-blue-600" /> Chronic Mgmt
            </div>
            <div className="space-y-2 mt-2">
              {patient.conditions.map(c => (
                <div key={c} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group hover:bg-white hover:border-[#e2e8f0] border border-transparent transition-all">
                  <span className="text-[10px] font-bold text-[#4a5568]">{c}</span>
                  <Activity className="w-3 h-3 text-[#a0aec0]" />
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Summary */}
          <div className="bento-card mt-auto shadow-indigo-100 shadow-sm border-indigo-100 bg-indigo-50/10">
            <div className="bento-card-title text-indigo-600 uppercase">
              <Calendar className="w-3.5 h-3.5" /> Next Consultation
            </div>
            <div className="mt-2 p-2.5 bg-white border border-indigo-100 rounded-xl">
              <div className="text-xs font-extrabold text-[#1a202c]">Follow-up Assessment</div>
              <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-bold font-mono mt-1">
                <Clock className="w-3 h-3" /> Oct 24, 10:45 AM
              </div>
            </div>
          </div>
        </div>

        {/* Central Content (Mini-OS Modules) */}
        <div className="flex flex-col gap-4 row-span-12 overflow-hidden">
          {/* AI Clinical Summary (Modern Bento Style) */}
          <div className="bento-card bg-[#1a202c] text-white border-none shadow-xl min-h-[160px] relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Activity className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Clinical Trajectory Insight</h3>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Synthesized via Midlink AI</p>
                </div>
                {aiGenerating && (
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-auto text-[10px] text-blue-400 font-bold font-mono"
                  >
                    SYNCING_SENSORS...
                  </motion.div>
                )}
              </div>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <p className="text-[15px] font-medium leading-relaxed italic text-gray-200">
                    {aiSummary?.summary || "Analyzing recent symptoms and medication adherence..."}
                  </p>
                </div>
                <div className="col-span-4 border-l border-white/10 pl-6">
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Automated Next Step</div>
                  <p className="text-xs font-bold text-emerald-400 mb-4">{aiSummary?.recommendation || "Processing recommendations..."}</p>
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest transition-all">
                    Authorize Pathway
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Module Tabs & Content */}
          <div className="flex-1 bento-card p-0 overflow-hidden flex flex-col bg-white">
            <div className="flex border-b border-[#e2e8f0]">
              {(['records', 'attachments', 'calls', 'chat'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest relative group transition-all",
                    activeTab === tab ? "text-[#2563eb] bg-blue-50/20" : "text-[#718096] hover:text-[#1a202c]"
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {tab === 'records' && <FileText className="w-3 h-3" />}
                    {tab === 'attachments' && <Download className="w-3 h-3" />}
                    {tab === 'calls' && <Phone className="w-3 h-3" />}
                    {tab === 'chat' && <MessageSquare className="w-3 h-3" />}
                    {tab}
                  </span>
                  {activeTab === tab && (
                    <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] z-20" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'records' && (
                  <motion.div 
                    key="records" 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-1.5"
                  >
                    {records.map(record => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-blue-50/50 rounded-xl border border-transparent hover:border-blue-100 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            record.type === 'Lab' ? "bg-purple-50 text-purple-600" :
                            record.type === 'Imaging' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                          )}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#1a202c] group-hover:text-blue-700">{record.title}</div>
                            <div className="text-[9px] text-[#718096] font-bold uppercase font-mono">{record.date} • {record.type}</div>
                          </div>
                        </div>
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight",
                          record.status === 'Critical' ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"
                        )}>
                          {record.status}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'attachments' && (
                  <motion.div 
                    key="attachments" 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 10 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {attachments.map(at => (
                      <div key={at.id} className="p-3 border border-[#e2e8f0] rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group relative">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-blue-500 transition-colors">
                            <Download className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-[#1a202c] truncate">{at.name}</div>
                            <div className="text-[9px] text-gray-400 font-mono font-bold uppercase">{at.type} • {at.date}</div>
                          </div>
                        </div>
                        <a href={at.url} className="absolute inset-0 opacity-0" />
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'calls' && (
                  <motion.div 
                    key="calls" 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    {calls.map(call => (
                      <div key={call.id} className="bento-card bg-[#f8fafc] border-[#e2e8f0]">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                              <Phone className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-[#1a202c]">{call.date}</div>
                              <div className="text-[9px] text-[#718096] font-bold uppercase font-mono">Duration: {call.duration}</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#f1f5f9] relative">
                          <div className="text-[9px] font-bold text-blue-900/50 uppercase tracking-widest mb-1 italic">AI Summary</div>
                          <p className="text-xs text-[#1e3a8a] font-medium leading-relaxed italic">{call.summary}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'chat' && (
                  <motion.div 
                    key="chat" 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex-1 space-y-4 mb-4 overflow-y-auto pr-2 custom-scrollbar min-h-[300px]">
                      {chats.map(msg => (
                        <div key={msg.id} className={cn(
                          "flex flex-col max-w-[80%]",
                          msg.sender === 'doctor' ? "ml-auto items-end" : "items-start"
                        )}>
                          <div className={cn(
                            "px-4 py-2.5 rounded-2xl text-[13px] font-medium shadow-sm",
                            msg.sender === 'doctor' 
                              ? "bg-blue-600 text-white rounded-tr-none" 
                              : "bg-white border border-[#e2e8f0] text-[#1a202c] rounded-tl-none"
                          )}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] font-bold text-[#a0aec0] mt-1 uppercase font-mono">
                            {format(new Date(msg.timestamp), 'HH:mm')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {activeTab === 'chat' && (
              <div className="p-4 border-t border-[#e2e8f0] bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-2 bg-white border border-[#e2e8f0] rounded-xl flex items-center shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type instructions or chat message..." 
                      className="bg-transparent border-none outline-none w-full text-xs font-medium placeholder-[#a0aec0]"
                    />
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#718096] hover:bg-gray-200 transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button className="bg-blue-600 text-white px-5 h-10 rounded-xl text-[10px] font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
                    SEND <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline & Actions Column (Right) */}
        <div className="flex flex-col gap-4 row-span-12">
          {/* Clinical History Timeline */}
          <div className="bento-card flex-1 flex flex-col min-h-0">
            <div className="bento-card-title uppercase">
              <Activity className="w-3.5 h-3.5 text-blue-500" /> Patient Evolution
            </div>
            <div className="flex-1 overflow-y-auto mt-4 space-y-6 relative border-l border-[#f1f5f9] ml-2 pl-6">
              {[
                { date: 'Oct 15', event: 'Audio Complaint', details: 'Chest pain during exertion', type: 'critical' },
                { date: 'Oct 10', event: 'Lab Verified', details: 'Lipid profile abnormal', type: 'info' },
                { date: 'Sep 24', event: 'Prescription', details: 'Lisinopril 10mg started', type: 'success' },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className={cn(
                    "absolute -left-[30px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                    item.type === 'critical' ? "bg-red-500" : item.type === 'success' ? "bg-emerald-500" : "bg-blue-500"
                  )} />
                  <div className="text-[10px] font-extrabold font-mono text-[#a0aec0] uppercase mb-1">{item.date}</div>
                  <div className="text-xs font-extrabold text-[#1a202c] group-hover:text-blue-600 transition-colors">{item.event}</div>
                  <p className="text-[10px] text-[#718096] font-medium italic leading-relaxed mt-0.5">{item.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bento-card shrink-0">
            <div className="bento-card-title uppercase">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> Clinical Directives
            </div>
            <div className="space-y-2 mt-2">
              <button className="w-full text-left p-2.5 bg-gray-50 hover:bg-white border border-transparent hover:border-[#e2e8f0] rounded-xl transition-all">
                <div className="text-[10px] font-extrabold text-[#1a202c]">Authorize Lab Work</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Full Metabolic Panel</div>
              </button>
              <button className="w-full text-left p-2.5 bg-gray-50 hover:bg-white border border-transparent hover:border-[#e2e8f0] rounded-xl transition-all">
                <div className="text-[10px] font-extrabold text-[#1a202c]">Update Prescription</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Modify dosage / Review intake</div>
              </button>
            </div>
          </div>

          <div className="bento-card p-3 bg-red-600 text-white border-none shadow-lg shadow-red-200">
            <button className="w-full flex items-center justify-between group">
              <div className="text-left">
                <div className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">Final Lockdown</div>
                <div className="text-[11px] font-extrabold">CLOSE CLINICAL SESSION</div>
              </div>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
