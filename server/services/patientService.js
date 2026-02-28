/**
 * Patient Service
 * Handles patient-specific operations for viewing appointments, prescriptions, and getting AI explanations
 */

import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Diagnosis from '../models/Diagnosis.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import axios from 'axios';

export class PatientService {
  /**
   * Get patient's appointments
   */
  static async getPatientAppointments(patientId, status = null) {
    const query = { patientId };
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'firstName lastName email specialization')
      .sort({ startTime: -1 });

    return appointments;
  }

  /**
   * Get patient's prescriptions
   */
  static async getPatientPrescriptions(patientId, status = null) {
    const query = { patientId };
    if (status) {
      query.status = status;
    }

    const prescriptions = await Prescription.find(query)
      .populate('doctorId', 'firstName lastName email specialization')
      .populate('appointmentId', 'title startTime')
      .populate('diagnosisId', 'condition description')
      .sort({ createdAt: -1 });

    return prescriptions;
  }

  /**
   * Get single prescription by ID (for patient)
   */
  static async getPrescriptionById(prescriptionId, patientId) {
    const prescription = await Prescription.findOne({
      _id: prescriptionId,
      patientId,
    })
      .populate('doctorId', 'firstName lastName email specialization')
      .populate('appointmentId', 'title startTime')
      .populate('diagnosisId', 'condition description');

    if (!prescription) {
      throw new ApiError('Prescription not found', 404);
    }

    return prescription;
  }

  /**
   * Get AI-generated explanation for prescription
   */
  static async getPrescriptionExplanation(prescriptionId, patientId) {
    const prescription = await Prescription.findOne({
      _id: prescriptionId,
      patientId,
    })
      .populate('doctorId', 'firstName lastName')
      .populate('diagnosisId', 'condition description');

    if (!prescription) {
      throw new ApiError('Prescription not found', 404);
    }

    // Build medication list for AI
    const medicationsList = prescription.medications
      .map((med) => `${med.name} (${med.dosage}, ${med.frequency}, ${med.duration})`)
      .join(', ');

    const prompt = `Explain this prescription in simple, patient-friendly language:

Prescription Details:
- Condition: ${prescription.diagnosisId?.condition || 'Not specified'}
- Medications: ${medicationsList}
- Instructions: ${prescription.instructions}
- Duration: ${prescription.medications[0]?.duration || 'As prescribed'}

Please provide:
1. What each medication does
2. Why it was prescribed
3. Important things to remember when taking it
4. Potential side effects to watch for
5. When to contact the doctor

Keep the explanation clear, concise, and easy to understand for a patient.`;

    try {
      // Use OpenAI API or similar AI service
      // For now, we'll use a simple mock response or integrate with OpenAI
      const aiResponse = await this.callAIService(prompt);
      return {
        prescriptionId: prescription._id,
        explanation: aiResponse,
        generatedAt: new Date(),
      };
    } catch (error) {
      // Fallback explanation if AI service fails
      return {
        prescriptionId: prescription._id,
        explanation: this.generateFallbackExplanation(prescription),
        generatedAt: new Date(),
        note: 'AI service temporarily unavailable. Showing basic explanation.',
      };
    }
  }

  /**
   * Call AI service for explanation (using same Gemini API as doctor section)
   */
  static async callAIService(prompt) {
    const key = process.env.GEMINI_API_KEY;
    const url = process.env.GEMINI_API_URL;

    if (key && url) {
      try {
        const response = await axios.post(`${url}?key=${key}`, { prompt }, { timeout: 15000 });

        // Attempt to extract text from common response shapes
        let text = '';
        if (response.data) {
          if (response.data.candidates && response.data.candidates.length) {
            text = response.data.candidates[0].content || '';
          } else if (response.data.output && response.data.output[0] && response.data.output[0].content) {
            text = response.data.output[0].content;
          } else if (response.data.outputs && response.data.outputs.length && response.data.outputs[0].content) {
            text = response.data.outputs[0].content[0]?.text || response.data.outputs[0].content;
          } else if (typeof response.data === 'string') {
            text = response.data;
          } else {
            text = JSON.stringify(response.data);
          }
        }

        return text || 'Unable to generate explanation at this time.';
      } catch (err) {
        // Log and continue to fallback
        console.error('Gemini/API request failed:', err.message || err);
        throw new Error('AI service temporarily unavailable');
      }
    } else {
      // Use a simple rule-based explanation if no API key
      throw new Error('AI service not configured');
    }
  }

  /**
   * Generate fallback explanation when AI service is unavailable
   */
  static generateFallbackExplanation(prescription) {
    const meds = prescription.medications.map((med) => med.name).join(', ');
    return `This prescription includes the following medications: ${meds}.

Please follow the instructions provided by your doctor:
- ${prescription.instructions}

Important reminders:
- Take medications as prescribed
- Complete the full course unless advised otherwise
- Contact your doctor if you experience any unusual side effects
- Keep all medications out of reach of children

If you have questions about your prescription, please contact your healthcare provider.`;
  }
}

