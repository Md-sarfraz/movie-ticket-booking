import { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Ticket, 
  Users,
  BarChart3,
  Film,
  Building2,
  Percent
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  getReportSummary,
  getMoviePerformance,
  getTheaterPerformance,
  getSeatOccupancy,
  getRevenueChart,
  getBookingTrends
} from '../../../services/report-service';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('last30days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [chartPeriod, setChartPeriod] = useState('weekly');
  
  // Report Data
  const [summary, setSummary] = useState({});
  const [revenueChart, setRevenueChart] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);
  const [moviePerformance, setMoviePerformance] = useState([]);
  const [theaterPerformance, setTheaterPerformance] = useState([]);
  const [seatOccupancy, setSeatOccupancy] = useState([]);

  // Calculate date range based on filter
  const getDateRange = () => {
    const today = new Date();
    let startDate, endDate;

    switch (dateFilter) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case 'last7days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = new Date(today);
        break;
      case 'last30days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        endDate = new Date(today);
        break;
      case 'custom':
        startDate = customStartDate ? new Date(customStartDate) : null;
        endDate = customEndDate ? new Date(customEndDate) : null;
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        endDate = new Date(today);
    }

    const formatDate = (date) => {
      if (!date) return null;
      return date.toISOString().split('T')[0];
    };

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    };
  };

  // Fetch all report data
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const { startDate, endDate } = getDateRange();

        // Fetch all data in parallel
        const [
          summaryData,
          revenueData,
          bookingData,
          movieData,
          theaterData,
          occupancyData
        ] = await Promise.all([
          getReportSummary(startDate, endDate),
          getRevenueChart(chartPeriod),
          getBookingTrends(chartPeriod, startDate, endDate),
          getMoviePerformance(startDate, endDate),
          getTheaterPerformance(startDate, endDate),
          getSeatOccupancy(startDate, endDate)
        ]);

        setSummary(summaryData || {});
        setRevenueChart(revenueData || []);
        setBookingTrends(bookingData || []);
        setMoviePerformance(movieData || []);
        setTheaterPerformance(theaterData || []);
        setSeatOccupancy(occupancyData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };

    if (dateFilter !== 'custom' || (customStartDate && customEndDate)) {
      fetchReports();
    }
  }, [dateFilter, customStartDate, customEndDate, chartPeriod]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
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
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <BarChart3 className="mr-3 text-red-600" size={32} />
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-1">Comprehensive insights about your platform performance</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Calendar className="mr-2 text-gray-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">Date Range</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setDateFilter('today')}
            className={`px-4 py-2 rounded-lg border ${
              dateFilter === 'today'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('last7days')}
            className={`px-4 py-2 rounded-lg border ${
              dateFilter === 'last7days'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateFilter('last30days')}
            className={`px-4 py-2 rounded-lg border ${
              dateFilter === 'last30days'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateFilter('custom')}
            className={`px-4 py-2 rounded-lg border ${
              dateFilter === 'custom'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Custom Range
          </button>
        </div>

        {dateFilter === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(summary.totalRevenue || 0)}
              </p>
            </div>
            <DollarSign className="text-green-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">
                {summary.totalBookings || 0}
              </p>
            </div>
            <Ticket className="text-blue-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tickets Sold</p>
              <p className="text-2xl font-bold text-gray-800">
                {summary.totalTicketsSold || 0}
              </p>
            </div>
            <Users className="text-purple-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg. Booking Value</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(summary.averageBookingValue || 0)}
              </p>
            </div>
            <TrendingUp className="text-orange-500" size={40} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Revenue Trend</h2>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueChart}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#DC2626"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Trends Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookingCount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Movie Performance Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Film className="mr-2 text-red-600" size={20} />
            Movie Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Movie Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets Sold</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {moviePerformance.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                moviePerformance.map((movie, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{movie.movieName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{movie.totalTicketsSold}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {formatCurrency(movie.totalRevenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Theater Performance Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Building2 className="mr-2 text-red-600" size={20} />
            Theater Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Theater Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Bookings</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {theaterPerformance.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                theaterPerformance.map((theater, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{theater.theaterName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{theater.totalBookings}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {formatCurrency(theater.totalRevenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seat Occupancy Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Percent className="mr-2 text-red-600" size={20} />
            Seat Occupancy Report
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Movie</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Theater</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Show Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats Sold</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Seats</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupancy %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seatOccupancy.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                seatOccupancy.map((show, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{show.movieName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{show.theaterName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{show.showTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{show.showDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{show.seatsSold}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{show.totalSeats}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          show.occupancyPercentage >= 80
                            ? 'bg-green-100 text-green-800'
                            : show.occupancyPercentage >= 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {show.occupancyPercentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
