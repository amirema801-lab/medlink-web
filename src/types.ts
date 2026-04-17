export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  conditions: string[];
  medications: string[];
  recentComplaints: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  tags: ('New' | 'Chronic' | 'Critical')[];
  lastVisit: string;
  symptoms: string[];
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: 'Lab' | 'Imaging' | 'Prescription' | 'Note';
  date: string;
  title: string;
  status: string;
}

export interface Attachment {
  id: string;
  patientId: string;
  name: string;
  type: 'PDF' | 'XRAY' | 'LAB';
  url: string;
  date: string;
}

export interface CallLog {
  id: string;
  patientId: string;
  date: string;
  duration: string;
  notes: string;
  summary: string;
}

export interface ChatMessage {
  id: string;
  patientId: string;
  sender: 'doctor' | 'patient';
  text: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  type: 'emergency' | 'online' | 'hospital';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'active' | 'completed';
  channel?: 'video' | 'chat' | 'call' | 'in-person';
  source: 'app' | 'phone' | 'sms';
  location?: string;
  reason?: string;
}

export interface AISummary {
  summary: string;
  flags: string[];
  recommendation: string;
}

