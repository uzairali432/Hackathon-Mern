import express from 'express';
import * as patientController from '../../controllers/patientController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = express.Router();

/**
 * All patient routes require authentication and patient role
 */
router.use(authenticate);
router.use(authorize('patient'));

// Get patient appointments
router.get('/appointments', patientController.getPatientAppointments);

// Get patient prescriptions
router.get('/prescriptions', patientController.getPatientPrescriptions);

// Get single prescription
router.get('/prescriptions/:id', patientController.getPrescriptionById);

// Download prescription PDF
router.get('/prescriptions/:id/pdf', patientController.downloadPrescriptionPDF);

// Get AI explanation for prescription
router.get('/prescriptions/:id/explanation', patientController.getPrescriptionExplanation);

export default router;

