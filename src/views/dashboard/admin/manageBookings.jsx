import { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Ticket,
  Filter,
  Calendar,
  DollarSign
} from 'lucide-react';
import { getAllBookings, updateBookingStatus } from '../../../services/booking-service';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const bookingsPerPage = 10;

  // Fetch bookings from Spring Boot API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getAllBookings();
        console.log('Fetched bookings:', data);
        setBookings(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter and sort bookings
  useEffect(() => {
    let result = [...bookings];

    // Search filter (booking reference, user ID, seat labels)
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(booking =>
        booking.bookingReference?.toLowerCase().includes(searchLower) ||
        booking.userId?.toString().includes(searchLower) ||
        booking.seatLabels?.toLowerCase().includes(searchLower) ||
        booking.show?.movie?.title?.toLowerCase().includes(searchLower) ||
        booking.show?.theater?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.paymentStatus === statusFilter);
    }

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle nested properties (like show.movie.title)
        if (sortConfig.key === 'movie') {
          aVal = a.show?.movie?.title || '';
          bVal = b.show?.movie?.title || '';
        } else if (sortConfig.key === 'theater') {
          aVal = a.show?.theater?.name || '';
          bVal = b.show?.theater?.name || '';
        }

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredBookings(result);
  }, [bookings, search, statusFilter, sortConfig]);

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

  // Update booking status
  const handleStatusChange = async (bookingId, newStatus, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }

    try {
      const updatedBooking = await updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(booking => 
        booking.bookingId === bookingId ? updatedBooking : booking
      ));
      setSuccess(`Booking status updated to ${newStatus}`);
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating booking status:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update status';
      setError(errorMessage);
      setSuccess(null);
      setTimeout(() => setError(null), 5000);
    }
  };

  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Ticket className="mr-3 text-red-600" size={32} />
              Manage Bookings
            </h1>
            <p className="text-gray-600 mt-1">View and manage all movie bookings</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-800">{filteredBookings.length}</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by booking reference, movie, theater..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold text-gray-800">
            {bookings.filter(b => b.paymentStatus === 'CONFIRMED').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-gray-800">
            {bookings.filter(b => b.paymentStatus === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Failed</p>
          <p className="text-2xl font-bold text-gray-800">
            {bookings.filter(b => b.paymentStatus === 'FAILED').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-500">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold text-gray-800">
            {bookings.filter(b => b.paymentStatus === 'CANCELLED').length}
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('bookingReference')}
                >
                  Ref
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('movie')}
                >
                  Movie & Show
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('theater')}
                >
                  Theater
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Seats
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalAmount')}
                >
                  Amount
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('paymentStatus')}
                >
                  Status
                </th>
                <th 
                  className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  Date
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-2 py-12 text-center text-gray-500">
                    <Ticket className="mx-auto mb-2 text-gray-300" size={48} />
                    <p>No bookings found</p>
                  </td>
                </tr>
              ) : (
                currentBookings.map((booking) => (
                  <tr key={booking.bookingId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-2">
                      <div className="text-xs font-medium text-gray-900">
                        {booking.bookingReference}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-xs font-medium text-gray-900 truncate max-w-[150px]" title={booking.show?.movie?.title || 'N/A'}>
                        {booking.show?.movie?.title || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.show?.showDate} • {booking.show?.showTime}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-xs text-gray-900 truncate max-w-[120px]" title={booking.show?.theater?.name || 'N/A'}>
                        {booking.show?.theater?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.show?.screenNumber}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-xs text-gray-900">
                        {booking.seatLabels}
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="text-xs font-medium text-gray-900">
                        ₹{booking.totalAmount?.toFixed(0)}
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 inline-flex text-xs font-semibold rounded ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <select
                        value={booking.paymentStatus}
                        onChange={(e) => handleStatusChange(booking.bookingId, e.target.value, e)}
                        className="px-1 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-red-500 focus:border-transparent w-full"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="FAILED">Failed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstBooking + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastBooking, filteredBookings.length)}</span> of{' '}
                    <span className="font-medium">{filteredBookings.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-red-50 border-red-500 text-red-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
