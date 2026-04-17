import { GoogleGenAI, Type } from "@google/genai";
import { Patient, MedicalRecord, CallLog } from "../types";

// Always use process.env.GEMINI_API_KEY for the Gemini API.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePatientSummary(patient: Patient, records: MedicalRecord[], calls: CallLog[] = []) {
  const prompt = `
    Analyze the following patient data, medical records, and recent phone call transcripts/logs. 
    Provide a concise clinical summary for a doctor.

    Patient Profile:
    - Name: ${patient.name} (${patient.age}y, ${patient.gender})
    - Established Conditions: ${patient.conditions.join(", ")}
    - Main Symptoms: ${patient.symptoms.join(", ")}
    - Current Chief Complaint: "${patient.recentComplaints}"

    Recent Medical Records:
    ${records.map(r => `- ${r.date}: ${r.title} [${r.type}] -> Result: ${r.status}`).join("\n")}

    Communication History (Phone/Call Logs):
    ${calls.map(c => `- ${c.date}: ${c.summary} (Duration: ${c.duration})`).join("\n")}

    GOAL: Synthesize these sources into a "Decision Support" summary. 
    Be direct. Use medical terminology correctly. 
    If phone call logs indicate worsening symptoms despite normal lab results, flag a "Clinical Discordance" alert.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [prompt], // Should be an array
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A high-density clinical narrative (1-2 sentences)" },
            flags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific clinical risks or red flags" },
            recommendation: { type: Type.STRING, description: "Clear next diagnostic or treatment step" }
          },
          required: ["summary", "flags", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (error) {
    console.error("Gemini summary error:", error);
    return {
      summary: "Protocol failure: Machine synthesis unavailable for this profile.",
      flags: ["Integrity Check Needed"],
      recommendation: "Perform comprehensive manual EMR audit."
    };
  }
}

