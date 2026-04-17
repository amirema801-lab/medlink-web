import { Patient, MedicalRecord, Appointment, Attachment, CallLog, ChatMessage } from '../types';

export const api = {
  async getPatients(): Promise<Patient[]> {
    const res = await fetch('/api/patients');
    return res.json();
  },
  async getPatient(id: string): Promise<Patient> {
    const res = await fetch(`/api/patients/${id}`);
    return res.json();
  },
  async getRecords(patientId: string): Promise<MedicalRecord[]> {
    const res = await fetch(`/api/records/${patientId}`);
    return res.json();
  },
  async getAttachments(patientId: string): Promise<Attachment[]> {
    const res = await fetch(`/api/attachments/${patientId}`);
    return res.json();
  },
  async getCalls(patientId: string): Promise<CallLog[]> {
    const res = await fetch(`/api/calls/${patientId}`);
    return res.json();
  },
  async getChats(patientId: string): Promise<ChatMessage[]> {
    const res = await fetch(`/api/chats/${patientId}`);
    return res.json();
  },
  async getAppointments(): Promise<Appointment[]> {
    const res = await fetch('/api/appointments');
    return res.json();
  },
  async getTrends(): Promise<any> {
    const res = await fetch('/api/stats/trends');
    return res.json();
  }
};

