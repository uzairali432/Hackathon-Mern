import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    icdCode: {
      type: String, // ICD-10 code
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'critical'],
      default: 'mild',
    },
    description: {
      type: String,
      required: true,
    },
    aiSuggestion: {
      type: String, // AI-assisted suggestion
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Diagnosis', diagnosisSchema);
