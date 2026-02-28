import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { ApiError } from '../utils/ApiError.js';

export class ReceptionistService {
  // Register a new patient
  static async registerPatient(patientData) {
    const { firstName, lastName, email, password, phone, dob } = patientData;

    // Basic checks
    const exists = await User.findOne({ email });
    if (exists) {
      throw new ApiError('Email already registered', 400);
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      dob,
      role: 'patient',
    });

    await user.save();
    return user;
  }

  // Update patient info (admin/recep)
  static async updatePatient(patientId, updateData) {
    const user = await User.findById(patientId);
    if (!user) throw new ApiError('Patient not found', 404);

    // Only allow updating patient fields (avoid role changes here)
    const allowed = ['firstName', 'lastName', 'email', 'phone', 'dob', 'avatar', 'bio'];
    allowed.forEach((k) => {
      if (updateData[k] !== undefined) user[k] = updateData[k];
    });

    await user.save();
    return user;
  }

  // Book appointment
  static async bookAppointment(appointmentData) {
    const { patientId, doctorId, title, description, startTime, endTime, type } = appointmentData;

    // Verify patient and doctor exist
    const patient = await User.findById(patientId);
    if (!patient) throw new ApiError('Patient not found', 404);

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') throw new ApiError('Doctor not found', 404);

    // Basic conflict check: doctor availability overlap
    const overlap = await Appointment.findOne({
      doctorId,
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
      ],
      status: { $ne: 'cancelled' },
    });

    if (overlap) {
      throw new ApiError('Doctor has a conflicting appointment during that time', 409);
    }

    const appt = new Appointment({
      patientId,
      doctorId,
      title,
      description,
      startTime,
      endTime,
      type: type || 'consultation',
      status: 'scheduled',
    });

    await appt.save();
    return appt;
  }

  // Get daily schedule for receptionist (all appointments for date)
  static async getDailySchedule(dateStr) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(new Date(start).setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({
      startTime: { $gte: start, $lte: end },
    })
      .populate('patientId', 'firstName lastName email phone')
      .populate('doctorId', 'firstName lastName email')
      .sort({ startTime: 1 });

    return appointments;
  }

  // Update appointment (status/time/details)
  static async updateAppointment(appointmentId, updateData) {
    const appt = await Appointment.findById(appointmentId);
    if (!appt) throw new ApiError('Appointment not found', 404);

    const allowed = ['startTime', 'endTime', 'title', 'description', 'status', 'type', 'notes'];
    allowed.forEach((k) => {
      if (updateData[k] !== undefined) appt[k] = updateData[k];
    });

    await appt.save();
    return appt;
  }
}
