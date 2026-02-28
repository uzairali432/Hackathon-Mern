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
   * Get AI-generated explanation for prescription (Enhanced with lifestyle recommendations and Urdu mode)
   */
  static async getPrescriptionExplanation(prescriptionId, patientId, language = 'english') {
    const prescription = await Prescription.findOne({
      _id: prescriptionId,
      patientId,
    })
      .populate('doctorId', 'firstName lastName')
      .populate('diagnosisId', 'condition description');

    if (!prescription) {
      throw new ApiError('Prescription not found', 404);
    }

    // Use enhanced AI service
    const { AIService } = await import('./aiService.js');
    const result = await AIService.prescriptionExplanation(prescription, language);

    return {
      prescriptionId: prescription._id,
      explanation: result.explanation,
      language: result.language,
      generatedAt: result.generatedAt,
      note: result.note || null,
    };
  }
}

