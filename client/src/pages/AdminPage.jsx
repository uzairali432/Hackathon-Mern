import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from '../services/userApi';
import { ArrowLeft, Edit2, Trash2, Check, X } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAllUsersQuery({ limit: 50, skip: 0 });
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [selectedUsers, setSelectedUsers] = useState({});

  const users = data?.data?.users || [];

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
                onClick={() => navigate('/dashboard')}
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
