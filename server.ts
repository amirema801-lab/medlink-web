import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data
  const patients = [
    {
      id: "p1",
      name: "John Doe",
      phone: "+1 555-0101",
      age: 45,
      gender: "Male",
      conditions: ["Hypertension", "Type 2 Diabetes"],
      medications: ["Lisinopril 10mg", "Metformin 500mg"],
      recentComplaints: "Chest pain (2 days), pain level 7/10",
      riskLevel: "High",
      tags: ["Critical", "Chronic"],
      lastVisit: "2026-04-10",
      symptoms: ["Chest Pain", "Fatigue"]
    },
    {
      id: "p2",
      name: "Jane Smith",
      phone: "+1 555-0102",
      age: 32,
      gender: "Female",
      conditions: ["Asthma"],
      medications: ["Albuterol inhaler"],
      recentComplaints: "Shortness of breath after exercise",
      riskLevel: "Low",
      tags: ["New"],
      lastVisit: "2026-03-25",
      symptoms: ["Shortness of breath"]
    },
    {
      id: "p3",
      name: "Robert Brown",
      phone: "+1 555-0103",
      age: 68,
      gender: "Male",
      conditions: ["Arthritis", "CAD"],
      medications: ["Aspirin 81mg", "Celecoxib"],
      recentComplaints: "Joint pain in knees",
      riskLevel: "Medium",
      tags: ["Chronic"],
      lastVisit: "2026-04-15",
      symptoms: ["Joint Pain"]
    }
  ];

  const records = [
    { id: "r1", patientId: "p1", type: "Lab", date: "2026-04-05", title: "Blood Panel", status: "Critical" },
    { id: "r2", patientId: "p1", type: "Imaging", date: "2026-04-10", title: "ECG", status: "Abnormal" },
    { id: "r3", patientId: "p2", type: "Prescription", date: "2026-03-25", title: "Inhaler Refill", status: "Filled" },
  ];

  const attachments = [
    { id: "at1", patientId: "p1", name: "Cardiac_Stress_Test.pdf", type: "PDF", date: "2026-04-01", url: "#" },
    { id: "at2", patientId: "p1", name: "Chest_XRay_Side.jpg", type: "XRAY", date: "2026-03-15", url: "#" },
    { id: "at3", patientId: "p3", name: "Knee_MRI.pdf", type: "LAB", date: "2026-04-02", url: "#" },
  ];

  const callHistory = [
    { id: "c1", patientId: "p1", date: "2026-04-16", duration: "5:20", notes: "Patient reported sharp pain.", summary: "Follow-up required for palpitations." },
    { id: "c2", patientId: "p2", date: "2026-04-15", duration: "3:45", notes: "Routine check on inhaler usage.", summary: "Adherence is good." },
  ];

  const chats = [
    { id: "m1", patientId: "p1", sender: "patient", text: "I'm feeling dizzy after taking the new pill.", timestamp: "2026-04-17T10:00:00Z" },
    { id: "m2", patientId: "p1", sender: "doctor", text: "Please rest and monitor your blood pressure.", timestamp: "2026-04-17T10:05:00Z" },
  ];

  const appointments = [
    { id: 'a1', patientId: 'p1', date: '2026-04-18', time: '08:45 AM', type: 'emergency', priority: 'critical', status: 'pending', channel: 'call', source: 'phone', reason: 'Severe Chest Pain' },
    { id: 'a2', patientId: 'p2', date: '2026-04-18', time: '10:30 AM', type: 'online', priority: 'medium', status: 'pending', channel: 'video', source: 'app', reason: 'Follow-up hypertension' },
    { id: 'a3', patientId: 'p3', date: '2026-04-18', time: '11:15 AM', type: 'hospital', priority: 'low', status: 'pending', channel: 'in-person', source: 'sms', location: 'St. Mary - Wing B', reason: 'Annual Checkup' },
    { id: 'a4', patientId: 'p1', date: '2026-04-19', time: '02:00 PM', type: 'online', priority: 'high', status: 'pending', channel: 'chat', source: 'app', reason: 'Medication reaction query' }
  ];

  // API Routes
  app.get("/api/patients", (req, res) => {
    res.json(patients);
  });

  app.get("/api/patients/:id", (req, res) => {
    const patient = patients.find(p => p.id === req.params.id);
    if (patient) res.json(patient);
    else res.status(404).json({ error: "Patient not found" });
  });

  app.get("/api/records/:patientId", (req, res) => {
    res.json(records.filter(r => r.patientId === req.params.patientId));
  });

  app.get("/api/attachments/:patientId", (req, res) => {
    res.json(attachments.filter(a => a.patientId === req.params.patientId));
  });

  app.get("/api/calls/:patientId", (req, res) => {
    res.json(callHistory.filter(c => c.patientId === req.params.patientId));
  });

  app.get("/api/chats/:patientId", (req, res) => {
    res.json(chats.filter(c => c.patientId === req.params.patientId));
  });

  app.get("/api/appointments", (req, res) => {
    res.json(appointments);
  });

  app.get("/api/stats/trends", (req, res) => {
    res.json({
      commonSymptoms: [
        { name: "Chest Pain", count: 12 },
        { name: "Fatigue", count: 8 },
        { name: "Joint Pain", count: 5 }
      ],
      avgPainLevel: 6.5,
      diagnoses: [
        { name: "Hypertension", count: 45 },
        { name: "Diabetes", count: 32 },
        { name: "Asthma", count: 20 }
      ]
    });
  });

  app.post("/api/appointments", (req, res) => {
    const newAppointment = { id: `a${Date.now()}`, ...req.body };
    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
