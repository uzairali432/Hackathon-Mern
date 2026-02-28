/**
 * Doctor Service
 * Handles doctor-specific operations for appointments, diagnoses, prescriptions, and patient management
 */

import Appointment from '../models/Appointment.js';
import Diagnosis from '../models/Diagnosis.js';
import Prescription from '../models/Prescription.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';
import axios from 'axios';

export class DoctorService {
  /**
   * Get doctor's appointments
   */
  static async getDoctorAppointments(doctorId, status = null) {
    const query = { doctorId };
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'firstName lastName email')
      .sort({ startTime: -1 });

    return appointments;
  }

  /**
   * Get patient medical history for a doctor
   */
  static async getPatientHistory(patientId, doctorId) {
    // Verify doctor has access to patient's records
    const patient = await User.findById(patientId);
    if (!patient) {
      throw new ApiError('Patient not found', 404);
    }

    // Get all appointments between doctor and patient
    const appointments = await Appointment.find({
      patientId,
      doctorId,
    }).sort({ startTime: -1 });

    // Get diagnoses
    const diagnoses = await Diagnosis.find({ patientId, doctorId }).sort({
      createdAt: -1,
    });

    // Get prescriptions
    const prescriptions = await Prescription.find({ patientId, doctorId }).sort({
      createdAt: -1,
    });

    return {
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
      },
      appointments: appointments.length,
      diagnoses,
      prescriptions,
      appointmentDetails: appointments.slice(0, 5), // Last 5 appointments
    };
  }

  /**
   * Add diagnosis to appointment
   */
  static async addDiagnosis(diagnosisData, doctorId) {
    const { appointmentId, patientId, condition, severity, description, aiSuggestion, notes } = diagnosisData;

    // Verify appointment exists and belongs to this doctor
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.doctorId.toString() !== doctorId) {
      throw new ApiError('Appointment not found or unauthorized', 404);
    }

    const diagnosis = new Diagnosis({
      appointmentId,
      patientId,
      doctorId,
      condition,
      severity,
      description,
      aiSuggestion,
      notes,
    });

    await diagnosis.save();
    return diagnosis;
  }

  /**
   * Write prescription for patient
   */
  static async writePrescription(prescriptionData, doctorId) {
    const { diagnosisId, patientId, medications, instructions, refillsAllowed, expiresAt } = prescriptionData;

    // Verify diagnosis exists if provided
    if (diagnosisId) {
      const diagnosis = await Diagnosis.findById(diagnosisId);
      if (!diagnosis || diagnosis.doctorId.toString() !== doctorId) {
        throw new ApiError('Diagnosis not found or unauthorized', 404);
      }
    }

    const prescription = new Prescription({
      diagnosisId,
      patientId,
      doctorId,
      medications,
      instructions,
      refillsAllowed: refillsAllowed || 0,
      expiresAt: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
      status: 'active',
    });

    await prescription.save();
    return prescription;
  }

  /**
   * Get AI assistance for diagnosis. If GEMINI_API_KEY is set in env, attempt real call,
   * otherwise return simulated suggestions.
   */
  static async getAIAssistance(symptoms, patientAge, patientGender) {
    const key = process.env.GEMINI_API_KEY;
    const url = process.env.GEMINI_API_URL;

    const symptomText = Array.isArray(symptoms) ? symptoms.join(', ') : String(symptoms || '');
    const prompt = `Patient symptoms: ${symptomText}\nAge: ${patientAge || 'unknown'}\nGender: ${patientGender || 'unknown'}\n\nProvide the top 3 likely diagnoses with an ICD code if available, a confidence estimate, and short recommendations for each. Return the result in plain text.`;

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

        const aiSuggestions = {
          suggestions: [
            {
              condition: text.slice(0, 800),
              confidence: 'N/A',
              icdCode: '',
              recommendations: [],
            },
          ],
          disclaimer: 'AI suggestions are for reference only. Clinical judgment and patient examination are required for diagnosis.',
          warnings: symptomText.includes('severe') ? ['Consider emergency consultation'] : [],
          raw: text,
        };

        return aiSuggestions;
      } catch (err) {
        // Log and continue to fallback
        // eslint-disable-next-line no-console
        console.error('Gemini/API request failed:', err.message || err);
      }
    }

    // Fallback: Simulated AI suggestions based on symptoms
    const aiSuggestions = {
      suggestions: [
        {
          condition: 'Common Cold/Upper Respiratory Infection',
          confidence: '65%',
          icdCode: 'J00',
          recommendations: ['Rest', 'Hydration', 'Over-the-counter pain relief'],
        },
        {
          condition: 'Mild Viral Infection',
          confidence: '45%',
          icdCode: 'B34.9',
          recommendations: ['Monitor symptoms', 'Supportive care', 'Rest'],
        },
        {
          condition: 'Allergic Reaction',
          confidence: '35%',
          icdCode: 'T78.4',
          recommendations: ['Identify allergen', 'Antihistamines', 'Avoid trigger'],
        },
      ],
      disclaimer: 'AI suggestions are for reference only. Clinical judgment and patient examination are required for diagnosis.',
      warnings: symptomText.includes('severe') ? ['Consider emergency consultation'] : [],
    };

    return aiSuggestions;
  }

  /**
   * Get doctor's statistics
   */
  static async getDoctorStats(doctorId) {
    const totalAppointments = await Appointment.countDocuments({ doctorId });
    const completedAppointments = await Appointment.countDocuments({
      doctorId,
      status: 'completed',
    });
    const scheduledAppointments = await Appointment.countDocuments({
      doctorId,
      status: 'scheduled',
    });
    const totalDiagnoses = await Diagnosis.countDocuments({ doctorId });
    const totalPrescriptions = await Prescription.countDocuments({ doctorId });

    // Get unique patients
    const patientsResult = await Appointment.aggregate([
      { $match: { doctorId: mongoose.Types.ObjectId(doctorId) } },
      { $group: { _id: '$patientId' } },
      { $count: 'total' },
    ]);
    const totalPatients = patientsResult[0]?.total || 0;

    // Calculate appointment completion rate
    const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;

    return {
      totalAppointments,
      completedAppointments,
      scheduledAppointments,
      completionRate,
      totalPatients,
      totalDiagnoses,
      totalPrescriptions,
      averageDiagnosesPerAppointment: totalAppointments > 0 ? (totalDiagnoses / totalAppointments).toFixed(2) : 0,
    };
  }

  /**
   * Update appointment status
   */
  static async updateAppointmentStatus(appointmentId, doctorId, status) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.doctorId.toString() !== doctorId) {
      throw new ApiError('Appointment not found or unauthorized', 404);
    }

    appointment.status = status;
    await appointment.save();
    return appointment;
  }

  /**
   * Get patient's recent prescriptions for a specific patient
   */
  static async getPatientPrescriptions(patientId, doctorId) {
    const prescriptions = await Prescription.find({
      patientId,
      doctorId,
      status: 'active',
    }).sort({ createdAt: -1 });

    return prescriptions;
  }
}
