import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    diagnosisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Diagnosis',
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
    medications: [
      {
        name: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true, // e.g., "500mg"
        },
        frequency: {
          type: String,
          required: true, // e.g., "twice daily"
        },
        duration: {
          type: String,
          required: true, // e.g., "7 days"
        },
        instructions: String,
      },
    ],
    instructions: {
      type: String,
      required: true,
    },
    refillsAllowed: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'completed'],
      default: 'active',
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Prescription', prescriptionSchema);
