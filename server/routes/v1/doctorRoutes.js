import express from 'express';
import * as doctorController from '../../controllers/doctorController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = express.Router();

/**
 * All routes require doctor role
 */

// Appointments
router.get('/appointments', authenticate, authorize('doctor'), doctorController.getDoctorAppointments);
router.patch('/appointments/:appointmentId/status', authenticate, authorize('doctor'), doctorController.updateAppointmentStatus);

// Patient management
router.get('/patient/:patientId/history', authenticate, authorize('doctor'), doctorController.getPatientHistory);
router.get('/patient/:patientId/prescriptions', authenticate, authorize('doctor'), doctorController.getPatientPrescriptions);
router.get('/patient/:patientId/risk-flags', authenticate, authorize('doctor'), doctorController.getPatientRiskFlags);

// Diagnosis & Prescriptions
router.post('/diagnosis', authenticate, authorize('doctor'), doctorController.addDiagnosis);
router.post('/prescription', authenticate, authorize('doctor'), doctorController.writePrescription);

// AI Assistance
router.post('/ai-assistance', authenticate, authorize('doctor'), doctorController.getAIAssistance);

// Statistics
router.get('/stats', authenticate, authorize('doctor'), doctorController.getDoctorStats);

export default router;
