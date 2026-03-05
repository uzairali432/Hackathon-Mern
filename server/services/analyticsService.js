/**
 * Analytics Service
 * Handles data aggregation and analytics for the platform
 */

import Diagnosis from '../models/Diagnosis.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

export class AnalyticsService {
  /**
   * Get the most common diagnoses for a given period
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<Array>}
   */
  static async getMostCommonDiagnoses(startDate, endDate) {
    const diagnoses = await Diagnosis.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: '$condition',
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    return diagnoses;
  }
}
