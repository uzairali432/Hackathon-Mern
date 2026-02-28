/**
 * System Usage Service
 * Provides simulated system metrics for admin monitoring
 */

import User from '../models/User.js';

export class SystemUsageService {
  /**
   * Get current system usage metrics (simulated)
   */
  static async getSystemUsage() {
    const now = new Date();

    // Count users by role
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const doctorsCount = await User.countDocuments({ role: 'doctor' });
    const receptionistsCount = await User.countDocuments({ role: 'receptionist' });
    const patientsCount = await User.countDocuments({ role: 'patient' });

    // Simulated metrics (in production, use OS module and database queries)
    const cpuUsage = Math.floor(Math.random() * 40) + 20; // 20-60%
    const memoryUsage = Math.floor(Math.random() * 50) + 30; // 30-80%
    const diskUsage = Math.floor(Math.random() * 35) + 40; // 40-75%

    // Simulated API metrics
    const totalRequests = Math.floor(Math.random() * 5000) + 2000;
    const requestsPerMinute = Math.floor(Math.random() * 50) + 10;

    // Simulated recent activity (would come from logs in production)
    const recentActivity = [
      { id: 1, timestamp: new Date(now - 1000 * 60 * Math.random()), action: 'User login', user: 'John Doe', type: 'login' },
      { id: 2, timestamp: new Date(now - 1000 * 120 * Math.random()), action: 'Profile updated', user: 'Jane Smith', type: 'update' },
      { id: 3, timestamp: new Date(now - 1000 * 180 * Math.random()), action: 'Appointment scheduled', user: 'Mike Johnson', type: 'create' },
      { id: 4, timestamp: new Date(now - 1000 * 300 * Math.random()), action: 'User logout', user: 'Sarah Williams', type: 'logout' },
      { id: 5, timestamp: new Date(now - 1000 * 600 * Math.random()), action: 'Subscription activated', user: 'Tom Brown', type: 'subscription' },
    ].sort((a, b) => b.timestamp - a.timestamp);

    return {
      timestamp: now,
      system: {
        cpuUsage,
        memoryUsage,
        diskUsage,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        doctors: doctorsCount,
        receptionists: receptionistsCount,
        patients: patientsCount,
      },
      api: {
        totalRequests,
        requestsPerMinute,
        uptime: '99.9%',
      },
      recentActivity,
    };
  }

  /**
   * Get system health status
   */
  static async getSystemHealth() {
    const metrics = await this.getSystemUsage();

    const cpuStatus = metrics.system.cpuUsage > 80 ? 'critical' : metrics.system.cpuUsage > 60 ? 'warning' : 'healthy';
    const memoryStatus = metrics.system.memoryUsage > 85 ? 'critical' : metrics.system.memoryUsage > 70 ? 'warning' : 'healthy';
    const databaseStatus = 'healthy'; // Simulated
    const apiStatus = 'healthy'; // Simulated

    return {
      overall: cpuStatus === 'critical' || memoryStatus === 'critical' ? 'critical' : cpuStatus === 'warning' || memoryStatus === 'warning' ? 'warning' : 'healthy',
      cpu: cpuStatus,
      memory: memoryStatus,
      database: databaseStatus,
      api: apiStatus,
      lastChecked: new Date(),
    };
  }
}
