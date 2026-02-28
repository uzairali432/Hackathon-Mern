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
   * Get AI assistance for diagnosis (Enhanced Smart Symptom Checker)
   * Now includes patient history, risk levels, and suggested tests
   */
  static async getAIAssistance(symptoms, patientAge, patientGender, patientId = null) {
    // Get patient history if patientId is provided
    let patientHistory = null;
    if (patientId) {
      try {
        // Get all diagnoses and prescriptions for the patient (across all doctors)
        const diagnoses = await Diagnosis.find({ patientId }).sort({ createdAt: -1 }).limit(10);
        const prescriptions = await Prescription.find({ patientId }).sort({ createdAt: -1 }).limit(10);
        const appointments = await Appointment.find({ patientId }).sort({ startTime: -1 }).limit(10);
        
        patientHistory = {
          diagnoses,
          prescriptions,
          appointments: appointments.length,
        };
      } catch (error) {
        // Continue without history if fetch fails
        console.error('Failed to fetch patient history for AI:', error.message);
      }
    }

    // Use enhanced AI service
    const { AIService } = await import('./aiService.js');
    const result = await AIService.smartSymptomChecker(symptoms, patientAge, patientGender, patientHistory);

    // Format response to match existing structure
    const suggestions = result.conditions.map((condition, index) => {
      if (typeof condition === 'string') {
        return {
          condition: condition,
          confidence: 'N/A',
          icdCode: '',
          recommendations: result.recommendations || [],
        };
      }
      return condition;
    });

    return {
      suggestions: suggestions.length > 0 ? suggestions : [
        {
          condition: 'Symptom Evaluation Needed',
          confidence: 'N/A',
          icdCode: '',
          recommendations: result.recommendations || [],
        },
      ],
      riskLevel: result.riskLevel,
      suggestedTests: result.suggestedTests,
      disclaimer: result.disclaimer,
      warnings: result.riskLevel === 'High' || result.riskLevel === 'Critical' 
        ? ['Consider immediate consultation'] 
        : [],
      raw: result.rawResponse || '',
    };
  }

  /**
   * Analyze patient risk flags (repeated infections, chronic symptoms)
   */
  static async analyzePatientRiskFlags(patientId) {
    // Get all patient data
    const diagnoses = await Diagnosis.find({ patientId }).sort({ createdAt: -1 });
    const prescriptions = await Prescription.find({ patientId }).sort({ createdAt: -1 });
    const appointments = await Appointment.find({ patientId }).sort({ startTime: -1 });

    // Use AI service for risk analysis
    const { AIService } = await import('./aiService.js');
    return await AIService.analyzeRiskFlags(patientId, diagnoses, prescriptions, appointments);
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
