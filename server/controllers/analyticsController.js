import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { AnalyticsService } from '../services/analyticsService.js';

/**
 * Get platform analytics
 * GET /api/v1/analytics
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const mostCommonDiagnoses = await AnalyticsService.getMostCommonDiagnoses(
    firstDayOfMonth,
    lastDayOfMonth
  );

  const analyticsData = {
    mostCommonDiagnoses,
  };

  res.status(200).json(new ApiResponse(200, analyticsData, 'Analytics retrieved successfully'));
});
