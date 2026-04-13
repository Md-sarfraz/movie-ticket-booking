import { useState, useEffect } from 'react';
import { 
  Search, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Users
} from 'lucide-react';
import { getAllUsers, deleteUser, updateUserStatus } from '../../../services/user-service';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'lastActive', direction: 'desc' });
  const usersPerPage = 5;

  // Fetch users from Spring Boot API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        console.log('Fetched users:', data);

        // Map backend User entity to frontend shape
        const mappedUsers = data.map((u) => ({
          id: u.id,
          name: u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username,
          email: u.email,
          username: u.username,
          joinDate: u.dob || 'N/A',
          lastActive: u.dob || 'N/A',
          totalBookings: 0,                // backend doesn't have this yet
          status: 'active',                // default status since backend doesn't track this
          role: u.role,
          country: u.country || 'N/A',
          phoneNo: u.phoneNo || 'N/A',
          image: u.image,
          firstName: u.firstName,
          lastName: u.lastName
        }));

        setUsers(mappedUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and sort users
  useEffect(() => {
    let result = [...users];

    // Search filter (name, email, username)
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(result);
  }, [users, search, statusFilter, sortConfig]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prevSort => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Delete user
  const handleDeleteUser = async (userId, event) => {
    // Prevent event bubbling and default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      const response = await deleteUser(userId);
      console.log('Delete response:', response);
      setUsers(users.filter(user => user.id !== userId));
      setSuccess('User deleted successfully');
      setError(null);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('❌ Delete error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete user';
      setError(errorMessage);
      setSuccess(null);
    }
  };

  // Change status - Note: Backend doesn't have status field yet
  // This is a placeholder for future implementation
  const handleStatusChange = async (userId, newStatus, event) => {
    // Prevent event bubbling and default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    alert('Status change feature is not yet implemented in the backend. This feature will be available soon.');
    
    // Uncomment when backend supports status field
    /*
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      console.log('✅ User status updated successfully');
      setError(null);
    } catch (err) {
      console.error('❌ Status update error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update user status';
      setError(errorMessage);
      alert('Error: ' + errorMessage);
    }
    */
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Error loading users</p>
          <p className="mt-1 text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-3 md:p-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              User <span className="text-red-500">Management</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor all registered users ({users.length} total users)
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Users
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 px-6 py-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900 text-2xl leading-none">
            ×
          </button>
        </div>
      )}
      {error && (
        <div className="mb-4 px-6 py-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Ban className="w-6 h-6" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 text-2xl leading-none">
            ×
          </button>
        </div>
      )}
      
      {/* Search and Status Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-grow lg:max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={search}
              onChange={handleSearch}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Filter by Status:</span>
            <div className="flex p-1 bg-gray-100 rounded-lg">
              {['all', 'active', 'inactive', 'suspended'].map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusFilter(s)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    statusFilter === s 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['name', 'joinDate', 'lastActive', 'totalBookings'].map((key, idx) => (
                  <th key={idx} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort(key)}>
                      {key === 'name' ? 'User' : key === 'joinDate' ? 'Join Date' : key === 'lastActive' ? 'Last Active' : 'Bookings'}
                      {sortConfig.key === key && (
                        <span className="ml-2 text-blue-600">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 mr-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full overflow-hidden shadow-sm">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-white">
                            {user.username ? user.username.substring(0, 2).toUpperCase() : 'NA'}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.lastActive}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {user.totalBookings}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all"
                        title="Edit User"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {user.status !== 'active' ? (
                        <button 
                          className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all" 
                          onClick={(e) => handleStatusChange(user.id, 'active', e)}
                          title="Activate User"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      ) : (
                        <button 
                          className="p-2 text-orange-600 hover:text-white hover:bg-orange-600 rounded-lg transition-all" 
                          onClick={(e) => handleStatusChange(user.id, 'suspended', e)}
                          title="Suspend User"
                        >
                          <Ban className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all" 
                        onClick={(e) => handleDeleteUser(user.id, e)}
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No users found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-600 font-medium">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                disabled={currentPage === 1}
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page} 
                    onClick={() => setCurrentPage(page)} 
                    className={`w-10 h-10 rounded-lg transition-all font-medium ${
                      currentPage === page 
                        ? 'bg-red-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
