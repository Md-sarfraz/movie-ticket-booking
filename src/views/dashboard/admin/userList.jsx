import { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  Filter, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Download
} from 'lucide-react';

// Mock data for users
const initialUsers = [
  { 
    id: 1, 
    name: 'John Smith', 
    joinDate: '2024-10-12', 
    lastActive: '2025-05-01',
    totalBookings: 28,
    status: 'active' 
  },
  { 
    id: 2, 
    name: 'Emma Johnson', 
    joinDate: '2023-08-24', 
    lastActive: '2025-05-05',
    totalBookings: 45,
    status: 'active' 
  },
  { 
    id: 3, 
    name: 'Michael Chen', 
    joinDate: '2024-01-15', 
    lastActive: '2025-04-20',
    totalBookings: 12,
    status: 'inactive' 
  },
  { 
    id: 4, 
    name: 'Sofia Garcia', 
    joinDate: '2024-03-30', 
    lastActive: '2025-05-04',
    totalBookings: 19,
    status: 'active' 
  },
  { 
    id: 5, 
    name: 'David Kim', 
    joinDate: '2023-11-08', 
    lastActive: '2025-02-15',
    totalBookings: 33,
    status: 'suspended' 
  },
  { 
    id: 6, 
    name: 'Sarah Wilson', 
    joinDate: '2024-07-14', 
    lastActive: '2025-05-03',
    totalBookings: 8,
    status: 'active' 
  },
];

export default function UserList() {
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'lastActive', direction: 'desc' });
  const usersPerPage = 5;

  // Filter and sort users
  useEffect(() => {
    let result = [...users];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Apply sorting
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

  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Handle status filter change
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevSort => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Handle user status change
  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Get status badge styling
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

  return (
    <>
      {/* Header
      <header className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage all registered users of your movie booking platform</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export Users
              </button>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex-grow px-4 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col items-start justify-between p-6 border-b md:flex-row md:items-center border-gray-200">
          <div className="flex items-center w-full mb-4 space-x-4 md:w-auto md:mb-0">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
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
            <div className="relative">
              <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                Filter
              </button>
              <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {/* Filter dropdown content would go here - not shown for simplicity */}
              </div>
            </div>
          </div>
          <div className="flex items-center self-end space-x-2">
            <span className="text-sm text-gray-500">Status:</span>
            <div className="flex p-1 bg-gray-100 rounded-md">
              <button 
                onClick={() => handleStatusFilter('all')} 
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  statusFilter === 'all' ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => handleStatusFilter('active')} 
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  statusFilter === 'active' ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => handleStatusFilter('inactive')} 
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  statusFilter === 'inactive' ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                Inactive
              </button>
              <button 
                onClick={() => handleStatusFilter('suspended')} 
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  statusFilter === 'suspended' ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                Suspended
              </button>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                    User
                    {sortConfig.key === 'name' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('joinDate')}>
                    Join Date
                    {sortConfig.key === 'joinDate' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('lastActive')}>
                    Last Active
                    {sortConfig.key === 'lastActive' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('totalBookings')}>
                    Bookings
                    {sortConfig.key === 'totalBookings' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                          <span className="text-sm font-medium text-blue-800">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(user.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(user.lastActive).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.totalBookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-5 h-5" />
                        </button>
                        {user.status !== 'active' ? (
                          <button 
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleStatusChange(user.id, 'active')}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        ) : (
                          <button 
                            className="text-orange-600 hover:text-orange-900"
                            onClick={() => handleStatusChange(user.id, 'suspended')}
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center justify-center py-6">
                      <Users className="w-12 h-12 mb-3 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search or filter to find what you're looking for.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'z-10 bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}