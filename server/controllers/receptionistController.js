import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { ReceptionistService } from '../services/receptionistService.js';

export const registerPatient = asyncHandler(async (req, res) => {
  const patientData = req.body;
  const user = await ReceptionistService.registerPatient(patientData);
  res.status(201).json(new ApiResponse(201, user, 'Patient registered successfully'));
});

export const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const user = await ReceptionistService.updatePatient(id, updateData);
  res.status(200).json(new ApiResponse(200, user, 'Patient updated successfully'));
});

export const bookAppointment = asyncHandler(async (req, res) => {
  const apptData = req.body;
  const appt = await ReceptionistService.bookAppointment(apptData);
  res.status(201).json(new ApiResponse(201, appt, 'Appointment booked'));
});

export const getDailySchedule = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const schedule = await ReceptionistService.getDailySchedule(date);
  res.status(200).json(new ApiResponse(200, schedule, 'Daily schedule retrieved'));
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const updateData = req.body;
  const appt = await ReceptionistService.updateAppointment(appointmentId, updateData);
  res.status(200).json(new ApiResponse(200, appt, 'Appointment updated'));
});
