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

        // Map backend User entity to frontend shape
        const mappedUsers = data.map((u) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          username: u.username,
          joinDate: u.dob,                 // temp fallback
          lastActive: u.dob,               // temp fallback
          totalBookings: 0,                // backend doesn't have this yet
          status: u.role === 'ADMIN' ? 'active' : 'active',
          role: u.role,
          country: u.country,
          phoneNo: u.phoneNo,
          image: u.image
        }));

        setUsers(mappedUsers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
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
    
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      console.log('✅ User deleted successfully');
    } catch (err) {
      console.error('❌ Delete error:', err);
      setError(err.message || 'Failed to delete user');
    }
  };

  // Change status
  const handleStatusChange = async (userId, newStatus, event) => {
    // Prevent event bubbling and default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      console.log('✅ User status updated successfully');
    } catch (err) {
      console.error('❌ Status update error:', err);
      setError(err.message || 'Failed to update user status');
    }
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
    <main className="flex-grow px-4 py-8">
      {/* Search and Status Filter */}
      <div className="flex flex-col items-start justify-between p-6 border-b md:flex-row md:items-center border-gray-200">
        <div className="relative flex-grow md:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center self-end mt-4 space-x-2 md:mt-0">
          <span className="text-sm text-gray-500">Status:</span>
          <div className="flex p-1 bg-gray-100 rounded-md">
            {['all', 'active', 'inactive', 'suspended'].map(s => (
              <button
                key={s}
                onClick={() => handleStatusFilter(s)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  statusFilter === s ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['name', 'joinDate', 'lastActive', 'totalBookings'].map((key, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort(key)}>
                    {key === 'name' ? 'User' : key === 'joinDate' ? 'Join Date' : key === 'lastActive' ? 'Last Active' : 'Bookings'}
                    {sortConfig.key === key && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.length > 0 ? currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                      <span className="text-sm font-medium text-blue-800">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.joinDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastActive}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.totalBookings}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="w-5 h-5" />
                    </button>
                    {user.status !== 'active' ? (
                      <button className="text-green-600 hover:text-green-900" onClick={(e) => handleStatusChange(user.id, 'active', e)}>
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <button className="text-orange-600 hover:text-orange-900" onClick={(e) => handleStatusChange(user.id, 'suspended', e)}>
                        <Ban className="w-5 h-5" />
                      </button>
                    )}
                    <button className="text-red-600 hover:text-red-900" onClick={(e) => handleDeleteUser(user.id, e)}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <Users className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">No users found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
          <span className="text-sm text-gray-700">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </span>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={currentPage === page ? 'font-bold' : ''}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
