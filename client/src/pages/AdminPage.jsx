import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation, useUpdateSubscriptionMutation, useGetAnalyticsQuery, useGetSystemUsageQuery, useGetSystemHealthQuery } from '../services/userApi';
import { ArrowLeft, Edit2, Trash2, Check, X } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAllUsersQuery({ limit: 50, skip: 0 });
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [selectedUsers, setSelectedUsers] = useState({});
  const [showSystemUsage, setShowSystemUsage] = useState(false);

  const users = data?.data?.users || [];
  const { data: systemUsage } = useGetSystemUsageQuery(undefined, { skip: !showSystemUsage });
  const { data: systemHealth } = useGetSystemHealthQuery(undefined, { skip: !showSystemUsage });

  const handleToggleUserSelect = (userId) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateRole({ userId, role: newRole }).unwrap();
      alert('User role updated successfully');
    } catch (error) {
      alert(`Error: ${error.data?.message || 'Failed to update role'}`);
    }
  };

  const [updateSubscription] = useUpdateSubscriptionMutation();
  const { data: analytics } = useGetAnalyticsQuery(undefined, { skip: !true });

  const handleUpdateSubscription = async (userId) => {
    // Simulate toggling subscription plan for demo
    try {
      await updateSubscription({ userId, plan: 'basic', status: 'active' }).unwrap();
      alert('Subscription updated (simulated)');
    } catch (err) {
      alert('Failed to update subscription');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId).unwrap();
        alert('User deleted successfully');
      } catch (error) {
        alert(`Error: ${error.data?.message || 'Failed to delete user'}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 h-auto sm:h-16 py-3 sm:py-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <p className="text-sm text-gray-600">Total Users: {data?.data?.total || 0}</p>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">Error loading users: {error.data?.message || 'Unknown error'}</p>
          </div>
        )}

        {users.length > 0 && !isLoading && (
          <>
            {/* Admin actions */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
              <button
                onClick={() => {
                  const summary = analytics
                    ? `Users: ${analytics.totalUsers}, Doctors: ${analytics.totalDoctors}, Receptionists: ${analytics.totalReceptionists}, Patients: ${analytics.totalPatients}`
                    : 'Analytics not loaded';
                  alert(summary);
                }}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md"
              >
                View Analytics (Simulated)
              </button>
              <button
                onClick={() => setShowSystemUsage(!showSystemUsage)}
                className="px-3 py-2 bg-green-600 text-white rounded-md"
              >
                {showSystemUsage ? 'Hide System Usage' : 'View System Usage'}
              </button>
            </div>

            {/* System Usage Section */}
            {showSystemUsage && systemUsage?.data && (
              <div className="mb-8 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">System Usage Monitoring</h2>

                {/* System Health Status */}
                {systemHealth?.data && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className={`p-4 rounded-lg text-white font-semibold ${
                      systemHealth.data.overall === 'critical' ? 'bg-red-600' :
                      systemHealth.data.overall === 'warning' ? 'bg-yellow-600' :
                      'bg-green-600'
                    }`}>
                      <p className="text-sm opacity-90">Overall Status</p>
                      <p className="text-lg capitalize">{systemHealth.data.overall}</p>
                    </div>
                    <div className={`p-4 rounded-lg text-white font-semibold ${
                      systemHealth.data.cpu === 'critical' ? 'bg-red-600' :
                      systemHealth.data.cpu === 'warning' ? 'bg-yellow-600' :
                      'bg-blue-600'
                    }`}>
                      <p className="text-sm opacity-90">CPU</p>
                      <p className="text-lg capitalize">{systemHealth.data.cpu}</p>
                    </div>
                    <div className={`p-4 rounded-lg text-white font-semibold ${
                      systemHealth.data.memory === 'critical' ? 'bg-red-600' :
                      systemHealth.data.memory === 'warning' ? 'bg-yellow-600' :
                      'bg-blue-600'
                    }`}>
                      <p className="text-sm opacity-90">Memory</p>
                      <p className="text-lg capitalize">{systemHealth.data.memory}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-600 text-white font-semibold">
                      <p className="text-sm opacity-90">Database</p>
                      <p className="text-lg capitalize">{systemHealth.data.database}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-600 text-white font-semibold">
                      <p className="text-sm opacity-90">API Status</p>
                      <p className="text-lg capitalize">{systemHealth.data.api}</p>
                    </div>
                  </div>
                )}

                {/* System Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CPU Usage */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600 uppercase font-semibold mb-2">CPU Usage</p>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-gray-900">{systemUsage.data.system.cpuUsage}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            systemUsage.data.system.cpuUsage > 80 ? 'bg-red-600' :
                            systemUsage.data.system.cpuUsage > 60 ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${systemUsage.data.system.cpuUsage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Memory Usage */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Memory Usage</p>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-gray-900">{systemUsage.data.system.memoryUsage}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            systemUsage.data.system.memoryUsage > 85 ? 'bg-red-600' :
                            systemUsage.data.system.memoryUsage > 70 ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${systemUsage.data.system.memoryUsage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Disk Usage */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Disk Usage</p>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-gray-900">{systemUsage.data.system.diskUsage}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            systemUsage.data.system.diskUsage > 85 ? 'bg-red-600' :
                            systemUsage.data.system.diskUsage > 70 ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${systemUsage.data.system.diskUsage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* API Status */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600 uppercase font-semibold mb-2">API Metrics</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Requests/min:</span>
                        <span className="font-semibold text-gray-900">{systemUsage.data.api.requestsPerMinute}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total requests:</span>
                        <span className="font-semibold text-gray-900">{systemUsage.data.api.totalRequests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Uptime:</span>
                        <span className="font-semibold text-gray-900">{systemUsage.data.api.uptime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Statistics */}
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-lg font-semibold text-gray-900 mb-4">User Statistics</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{systemUsage.data.users.total}</p>
                      <p className="text-sm text-gray-600 mt-1">Total Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{systemUsage.data.users.active}</p>
                      <p className="text-sm text-gray-600 mt-1">Active Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{systemUsage.data.users.doctors}</p>
                      <p className="text-sm text-gray-600 mt-1">Doctors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-600">{systemUsage.data.users.receptionists}</p>
                      <p className="text-sm text-gray-600 mt-1">Receptionists</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-pink-600">{systemUsage.data.users.patients}</p>
                      <p className="text-sm text-gray-600 mt-1">Patients</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                {systemUsage.data.recentActivity && systemUsage.data.recentActivity.length > 0 && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <p className="text-lg font-semibold text-gray-900">Recent Activity</p>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {systemUsage.data.recentActivity.slice(0, 5).map((activity, idx) => (
                        <div key={idx} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600 mt-1">{activity.user}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 sm:mt-0">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Subscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                            className="text-sm px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          >
                            <option value="patient">Patient</option>
                            <option value="user">User</option>
                            <option value="doctor">Doctor</option>
                            <option value="receptionist">Receptionist</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-3">
                            <span className="capitalize">{user.subscription?.plan || 'free'}</span>
                            <button onClick={() => handleUpdateSubscription(user._id)} className="px-2 py-1 text-xs bg-yellow-100 rounded">Manage</button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check size={14} />
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
              {users.map((user) => (
                <div key={user._id} className="bg-white rounded-lg shadow p-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Name</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Email</p>
                    <p className="text-sm text-gray-600 mt-1 break-all">{user.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Role</p>
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                        className="w-full text-sm px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 transition-all"
                      >
                        <option value="patient">Patient</option>
                        <option value="user">User</option>
                        <option value="doctor">Doctor</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Status</p>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                        <Check size={14} />
                        Active
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Subscription</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-gray-700 capitalize">{user.subscription?.plan || 'free'}</span>
                      <button onClick={() => handleUpdateSubscription(user._id)} className="px-3 py-1 text-xs bg-yellow-100 rounded">Manage</button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="w-full py-2 px-3 text-red-600 border border-red-200 rounded-md hover:bg-red-50 font-medium inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete User
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {users.length === 0 && !isLoading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        )}
      </main>
    </div>
  );
}
