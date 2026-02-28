import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { PatientService } from '../services/patientService.js';
import PDFDocument from 'pdfkit';

/**
 * Get patient's appointments
 * GET /api/v1/patients/appointments
 */
export const getPatientAppointments = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const { status } = req.query;

  const appointments = await PatientService.getPatientAppointments(patientId, status);

  res.status(200).json(
    new ApiResponse(200, appointments, 'Appointments retrieved successfully')
  );
});

/**
 * Get patient's prescriptions
 * GET /api/v1/patients/prescriptions
 */
export const getPatientPrescriptions = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const { status } = req.query;

  const prescriptions = await PatientService.getPatientPrescriptions(patientId, status);

  res.status(200).json(
    new ApiResponse(200, prescriptions, 'Prescriptions retrieved successfully')
  );
});

/**
 * Get single prescription by ID
 * GET /api/v1/patients/prescriptions/:id
 */
export const getPrescriptionById = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const { id } = req.params;

  const prescription = await PatientService.getPrescriptionById(id, patientId);

  res.status(200).json(
    new ApiResponse(200, prescription, 'Prescription retrieved successfully')
  );
});

/**
 * Download prescription as PDF
 * GET /api/v1/patients/prescriptions/:id/pdf
 */
export const downloadPrescriptionPDF = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const { id } = req.params;

  const prescription = await PatientService.getPrescriptionById(id, patientId);

  // Create PDF
  const doc = new PDFDocument({ margin: 50 });
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=prescription-${id}.pdf`
  );

  // Pipe PDF to response
  doc.pipe(res);

  // Add content to PDF
  doc.fontSize(20).text('PRESCRIPTION', { align: 'center' });
  doc.moveDown();

  // Patient Information
  doc.fontSize(14).text('Patient Information:', { underline: true });
  doc.fontSize(12);
  doc.text(`Name: ${req.user.firstName} ${req.user.lastName}`);
  doc.text(`Email: ${req.user.email}`);
  doc.moveDown();

  // Doctor Information
  if (prescription.doctorId) {
    doc.fontSize(14).text('Prescribed By:', { underline: true });
    doc.fontSize(12);
    doc.text(`Dr. ${prescription.doctorId.firstName} ${prescription.doctorId.lastName}`);
    if (prescription.doctorId.specialization) {
      doc.text(`Specialization: ${prescription.doctorId.specialization}`);
    }
    doc.moveDown();
  }

  // Date
  doc.fontSize(14).text('Date:', { underline: true });
  doc.fontSize(12);
  doc.text(new Date(prescription.createdAt).toLocaleDateString());
  doc.moveDown();

  // Diagnosis
  if (prescription.diagnosisId) {
    doc.fontSize(14).text('Diagnosis:', { underline: true });
    doc.fontSize(12);
    doc.text(`Condition: ${prescription.diagnosisId.condition}`);
    if (prescription.diagnosisId.description) {
      doc.text(`Description: ${prescription.diagnosisId.description}`);
    }
    doc.moveDown();
  }

  // Medications
  doc.fontSize(14).text('Medications:', { underline: true });
  doc.fontSize(12);
  prescription.medications.forEach((med, index) => {
    doc.text(`${index + 1}. ${med.name}`);
    doc.text(`   Dosage: ${med.dosage}`);
    doc.text(`   Frequency: ${med.frequency}`);
    doc.text(`   Duration: ${med.duration}`);
    if (med.instructions) {
      doc.text(`   Instructions: ${med.instructions}`);
    }
    doc.moveDown(0.5);
  });

  // General Instructions
  if (prescription.instructions) {
    doc.moveDown();
    doc.fontSize(14).text('General Instructions:', { underline: true });
    doc.fontSize(12);
    doc.text(prescription.instructions, { align: 'justify' });
    doc.moveDown();
  }

  // Additional Notes
  if (prescription.notes) {
    doc.fontSize(14).text('Additional Notes:', { underline: true });
    doc.fontSize(12);
    doc.text(prescription.notes, { align: 'justify' });
    doc.moveDown();
  }

  // Status and Expiry
  doc.fontSize(12);
  doc.text(`Status: ${prescription.status.toUpperCase()}`);
  if (prescription.expiresAt) {
    doc.text(`Valid until: ${new Date(prescription.expiresAt).toLocaleDateString()}`);
  }
  if (prescription.refillsAllowed > 0) {
    doc.text(`Refills Allowed: ${prescription.refillsAllowed}`);
  }

  // Footer
  doc.moveDown(2);
  doc.fontSize(10).text(
    'This is a computer-generated prescription. Please consult your doctor for any questions.',
    { align: 'center', color: '#666666' }
  );

  // Finalize PDF
  doc.end();
});

/**
 * Get AI-generated explanation for prescription
 * GET /api/v1/patients/prescriptions/:id/explanation
 */
export const getPrescriptionExplanation = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const { id } = req.params;

  const explanation = await PatientService.getPrescriptionExplanation(id, patientId);

  res.status(200).json(
    new ApiResponse(200, explanation, 'Prescription explanation generated successfully')
  );
});

