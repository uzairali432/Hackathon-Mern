import express from 'express';
import * as receptionistController from '../../controllers/receptionistController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = express.Router();

// All receptionist routes require receptionist role
router.post('/patients', authenticate, authorize('receptionist'), receptionistController.registerPatient);
router.patch('/patients/:id', authenticate, authorize('receptionist'), receptionistController.updatePatient);

router.post('/appointments', authenticate, authorize('receptionist'), receptionistController.bookAppointment);
router.get('/appointments', authenticate, authorize('receptionist'), receptionistController.getDailySchedule);
router.patch('/appointments/:appointmentId', authenticate, authorize('receptionist'), receptionistController.updateAppointment);

export default router;
