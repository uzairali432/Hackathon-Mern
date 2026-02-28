import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { DoctorService } from '../services/doctorService.js';

/**
 * Get doctor's appointments
 * GET /api/v1/doctors/appointments?status=scheduled
 */
export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { status } = req.query;

  const appointments = await DoctorService.getDoctorAppointments(doctorId, status);

  res.status(200).json(new ApiResponse(200, appointments, 'Appointments retrieved successfully'));
});

/**
 * Get patient medical history
 * GET /api/v1/doctors/patient/:patientId/history
 */
export const getPatientHistory = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { patientId } = req.params;

  const history = await DoctorService.getPatientHistory(patientId, doctorId);

  res.status(200).json(new ApiResponse(200, history, 'Patient history retrieved successfully'));
});

/**
 * Add diagnosis
 * POST /api/v1/doctors/diagnosis
 */
export const addDiagnosis = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { appointmentId, patientId, condition, severity, description, aiSuggestion, notes } = req.body;

  // Validate required fields
  if (!appointmentId || !patientId || !condition || !description) {
    throw new ApiError('Missing required fields: appointmentId, patientId, condition, description', 400);
  }

  const diagnosis = await DoctorService.addDiagnosis(
    {
      appointmentId,
      patientId,
      condition,
      severity: severity || 'mild',
      description,
      aiSuggestion,
      notes,
    },
    doctorId
  );

  res.status(201).json(new ApiResponse(201, diagnosis, 'Diagnosis added successfully'));
});

/**
 * Write prescription
 * POST /api/v1/doctors/prescription
 */
export const writePrescription = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { diagnosisId, patientId, medications, instructions, refillsAllowed, expiresAt } = req.body;

  // Validate required fields
  if (!patientId || !medications || !instructions) {
    throw new ApiError('Missing required fields: patientId, medications, instructions', 400);
  }

  if (!Array.isArray(medications) || medications.length === 0) {
    throw new ApiError('Medications must be a non-empty array', 400);
  }

  const prescription = await DoctorService.writePrescription(
    {
      diagnosisId,
      patientId,
      medications,
      instructions,
      refillsAllowed,
      expiresAt,
    },
    doctorId
  );

  res.status(201).json(new ApiResponse(201, prescription, 'Prescription written successfully'));
});

/**
 * Get AI assistance for diagnosis (Enhanced Smart Symptom Checker)
 * POST /api/v1/doctors/ai-assistance
 */
export const getAIAssistance = asyncHandler(async (req, res) => {
  const { symptoms, patientAge, patientGender, patientId } = req.body;

  if (!symptoms || !Array.isArray(symptoms)) {
    throw new ApiError('Symptoms must be a non-empty array', 400);
  }

  const aiSuggestions = await DoctorService.getAIAssistance(symptoms, patientAge, patientGender, patientId);

  res.status(200).json(new ApiResponse(200, aiSuggestions, 'AI suggestions retrieved successfully'));
});

/**
 * Analyze patient risk flags
 * GET /api/v1/doctors/patient/:patientId/risk-flags
 */
export const getPatientRiskFlags = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const riskAnalysis = await DoctorService.analyzePatientRiskFlags(patientId);

  res.status(200).json(new ApiResponse(200, riskAnalysis, 'Risk flags analyzed successfully'));
});

/**
 * Get doctor statistics
 * GET /api/v1/doctors/stats
 */
export const getDoctorStats = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;

  const stats = await DoctorService.getDoctorStats(doctorId);

  res.status(200).json(new ApiResponse(200, stats, 'Doctor statistics retrieved successfully'));
});

/**
 * Update appointment status
 * PATCH /api/v1/doctors/appointments/:appointmentId/status
 */
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { appointmentId } = req.params;
  const { status } = req.body;

  if (!status || !['scheduled', 'in-progress', 'completed', 'cancelled'].includes(status)) {
    throw new ApiError('Invalid status. Must be one of: scheduled, in-progress, completed, cancelled', 400);
  }

  const appointment = await DoctorService.updateAppointmentStatus(appointmentId, doctorId, status);

  res.status(200).json(new ApiResponse(200, appointment, 'Appointment status updated successfully'));
});

/**
 * Get patient's prescriptions
 * GET /api/v1/doctors/patient/:patientId/prescriptions
 */
export const getPatientPrescriptions = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { patientId } = req.params;

  const prescriptions = await DoctorService.getPatientPrescriptions(patientId, doctorId);

  res.status(200).json(new ApiResponse(200, prescriptions, 'Patient prescriptions retrieved successfully'));
});
