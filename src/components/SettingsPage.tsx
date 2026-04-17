import { useState } from 'react';
import { 
  User, Bell, Shield, Database, Sparkles, LogOut, ChevronRight, 
  Moon, Sun, Globe, Lock, Cpu, Eye, BellRing, Smartphone, 
  Volume2, Braces, BrainCircuit, Mic, MessageSquare, Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const Toggle = ({ enabled }: { enabled: boolean }) => (
    <div className={cn(
      "w-8 h-4 rounded-full transition-colors relative",
      enabled ? "bg-blue-600" : "bg-gray-200"
    )}>
      <div className={cn(
        "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform",
        enabled ? "left-[18px]" : "left-0.5"
      )} />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 h-screen flex flex-col gap-6 overflow-hidden"
    >
      <div className="shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1a202c]">Control Center</h1>
          <p className="text-xs text-[#718096] font-bold uppercase tracking-widest font-mono">System Configuration & Identity</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-xs font-bold text-blue-600 uppercase tracking-widest">Active Station</button>
          <button className="px-4 py-2 text-gray-400 text-xs font-bold uppercase tracking-widest">Logs</button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden min-h-0">
        {/* Navigation Sidebar */}
        <div className="col-span-3 bento-card flex flex-col gap-1 p-2 bg-gray-50/50">
          {[
            { id: 'profile', label: 'Doctor Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Access', icon: Shield },
            { id: 'system', label: 'System Config', icon: Database },
            { id: 'ai', label: 'AI Intel Settings', icon: Sparkles },
            { id: 'ui', label: 'Dashboard UI', icon: Eye },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wide",
                activeTab === item.id 
                  ? "bg-white text-blue-600 shadow-sm border border-blue-100" 
                  : "text-gray-500 hover:text-[#1a202c] hover:bg-white/50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-3 p-3 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-red-50 transition-all">
              <LogOut className="w-4 h-4" /> Terminate Session
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-9 bento-card overflow-y-auto custom-scrollbar p-0 flex flex-col">
          {activeTab === 'profile' && (
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-black text-[#1a202c] mb-1">Doctor Identity</h3>
                <p className="text-xs text-gray-500">How you are identified across the Med-Link ecosystem.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" defaultValue="Sarah Chen, MD" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medical Specialty</label>
                  <select className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs font-bold outline-none">
                    <option>General Medicine</option>
                    <option selected>Cardiology</option>
                    <option>Neurology</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">License ID (HIPAA Verified)</label>
                  <input type="text" defaultValue="MD-9920-X88" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs font-mono font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Hospital</label>
                  <input type="text" defaultValue="Greater Mercy Medical Center" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs font-bold outline-none" />
                </div>
              </div>
              <div className="pt-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                  Synchronize Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-lg font-black text-[#1a202c] mb-1">Clinic Alerts</h3>
                <p className="text-xs text-gray-500">Real-time stimulus control for clinical emergencies.</p>
              </div>
              <div className="space-y-1">
                {[
                  { label: 'Emergency Bypass Alerts', icon: BellRing, desc: 'Highest priority sound override for critical triage.', enabled: true },
                  { label: 'Patient Direct Messages', icon: MessageSquare, desc: 'Notifications for new clinical chat entries.', enabled: true },
                  { label: 'Appointment Reminders', icon: CalendarIcon, desc: 'Advance warnings for Med-Link video calls.', enabled: false },
                  { label: 'Audio Complaint Sounds', icon: Volume2, desc: 'Immediate notification when patient uploads audio.', enabled: true },
                  { label: 'Push Device Sync', icon: Smartphone, desc: 'Sync alerts to connected mobile devices.', enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#1a202c]">{item.label}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{item.desc}</div>
                      </div>
                    </div>
                    <Toggle enabled={item.enabled} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-black text-[#1a202c] mb-1">Security & Protocol</h3>
                <p className="text-xs text-gray-500">Access control and encrypted session management.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bento-card bg-gray-50 border-gray-100 p-6 space-y-4">
                  <div className="flex items-center gap-3 text-xs font-black text-[#1a202c] uppercase">
                    <Lock className="w-4 h-4 text-blue-600" /> Password Control
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Last changed 42 days ago</p>
                  <button className="w-full py-3 border border-blue-200 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                    Update Credentials
                  </button>
                </div>
                <div className="bento-card bg-gray-50 border-gray-100 p-6 space-y-4">
                  <div className="flex items-center gap-3 text-xs font-black text-[#1a202c] uppercase">
                    <Clock className="w-4 h-4 text-purple-600" /> Session Expiry
                  </div>
                  <select className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs font-bold outline-none">
                    <option>15 Minutes Activity</option>
                    <option selected>1 Hour Activity</option>
                    <option>End of Shift (Manual)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-black text-[#1a202c] mb-1">Infrastructure Config</h3>
                <p className="text-xs text-gray-500">Backend engine (Firebase + Decision Logic) settings.</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600">
                      <Braces className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Firebase Project ID</div>
                      <div className="text-xs font-mono font-black text-blue-900">midlink-hospital-os-prod</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded uppercase">Connected</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-100 rounded-2xl">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Database Type</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1a202c]">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Firestore Enterprise
                    </div>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-2xl">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Auto-Triage Status</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                      Active (Real-time)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-black text-[#1a202c] mb-1">GenAI Intel</h3>
                <p className="text-xs text-gray-500">Decision support and synthesis level controls.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-white border border-blue-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <BrainCircuit className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#1a202c]">Patient summary synthesis</div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Powered by Gemini 1.5</p>
                    </div>
                  </div>
                  <Toggle enabled={true} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                      <span className="text-xs font-bold text-[#1a202c]">Call transcription</span>
                      <Toggle enabled={true} />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                      <span className="text-xs font-bold text-[#1a202c]">Note generation</span>
                      <Toggle enabled={false} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Triage Sensitivity</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Low', 'Mid', 'High'].map(s => (
                        <button key={s} className={cn(
                          "py-2 rounded-lg text-[10px] font-black uppercase",
                          s === 'Mid' ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-400"
                        )}>{s}</button>
                      ))}
                    </div>
                    <p className="text-[9px] text-gray-400 italic">Adjusts how aggressively the AI flags "Abnormal" symptoms.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ui' && (
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-black text-[#1a202c] mb-1">Interface Customization</h3>
                <p className="text-xs text-gray-500">Visual ergonomics for clinical environments.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-[#1a202c]">Theme preference</div>
                  </div>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button className="px-3 py-1.5 bg-white rounded shadow-sm text-[10px] font-black uppercase">Light</button>
                    <button className="px-3 py-1.5 text-gray-400 text-[10px] font-black uppercase">Dark</button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-[#1a202c]">Clinical language</div>
                  </div>
                  <select className="bg-gray-50 text-xs font-bold p-1 outline-none uppercase">
                    <option>English (US)</option>
                    <option>French (FR)</option>
                    <option>Spanish (ES)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
