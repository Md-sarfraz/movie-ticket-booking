import './assets/style.css'
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTransition, { AnimatePresence } from './components/pageTransition';
import Home from './views/home';
import About from './views/about';
import LoginPage from './views/loginPage';
import Navbar from './components/navbar';
import Footer from './components/footer';
import BottomNav from './components/BottomNav';
import MobileHeader from './components/MobileHeader';
import SidebarDrawer from './components/SidebarDrawer';
import Contact from './views/contact';
import SignUpPage from './views/signUpPage';
import MovieDetails from './views/movieDetails';
import BookTickets from './views/bookTickets';
import SeatSelection from './views/seatSelection';
import PaymentDetails from './views/paymentDetails';
import AdminLogin from './views/adminLogin';
import AdminDashboard from './views/dashboard/admin/dashboardLayout';
import UserDashboardLayout from './views/dashboard/user/dashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Event from './views/event';
import Movies from './views/movies';
import ScrollToTop from './components/scrollOnTop';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './store/slices/authSlice';
import { myAxios } from './services/helper';
import EventDetails from './views/eventDetails';
import PaymentPage from './views/paymentPage';
import TicketPage from './views/ticketPage';
import UserList from './views/dashboard/admin/userList';
import { clearAuthStorage, getStoredAuth } from './auth/storage';
import EventBookingPage from './views/eventBookingPage';
import Support from './views/support';
import BookingConfirmationPage from './views/bookingConfirmationPage';
import ProfilePage from './components/ProfilePage';
import { useState } from 'react';

function App() {
  //app.jsx
  const dispatch = useDispatch();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleGetUserDetails = async (id) => {
    console.log(id)
    try {
      const response = await myAxios.get(
        `/user/get/${id}`
      );
      if (response?.data?.data) {
        dispatch(login(response.data.data));
      }
    }
    catch (error) {
      console.log("user not found:",error)
      // Only redirect if it's a critical auth error, not just data fetch failure
      if (error.response?.status === 401) {
        console.warn("Invalid token, clearing auth data");
        clearAuthStorage();
        // Don't redirect here - let user continue browsing
      }
    }
  }

  useEffect(() => {
    const { token, user } = getStoredAuth();
    if (token && user?.id) {
      dispatch(login(user));
      handleGetUserDetails(user.id);
    }
  }, [])

  // Pages where footer should NOT be displayed
  const hideFooterRoutes = [
    '/paymentPage',
    '/payment',
    '/event-booking',
    '/ticketPage',
    '/booking-confirmation',
    '/seatSelection',
    '/loginPage',
    '/signUpPage',
    '/adminLogin',
    '/adminDashboard',
    '/userDashboard'
  ];

  // Check if footer should be hidden on current route
  const shouldHideFooter = hideFooterRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  const hideMobileShellRoutes = [
    '/loginPage',
    '/signUpPage',
    '/adminLogin',
    '/adminDashboard'
  ];

  const shouldHideMobileShell = hideMobileShellRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  const showMobileHeader = !shouldHideMobileShell;
  const showBottomNav = !shouldHideMobileShell;


  return (
    <div>
      {/* <ToastContainer/> */}
      <Navbar />
      {showMobileHeader && <MobileHeader onOpenDrawer={() => setMobileDrawerOpen(true)} />}
      <SidebarDrawer open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
      <div className={`${showMobileHeader ? 'pt-12 md:pt-0' : ''} ${showBottomNav ? 'pb-20 md:pb-0' : ''}`}>
        <ScrollToTop />
        <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<PageTransition><Home /></PageTransition>} />
          <Route path='/about' element={<PageTransition><ProtectedRoute><About /></ProtectedRoute></PageTransition>} />
          <Route path='/movies' element={<PageTransition><ProtectedRoute><Movies /></ProtectedRoute></PageTransition>} />
          <Route path='/contact' element={<PageTransition><ProtectedRoute><Contact /></ProtectedRoute></PageTransition>} />
          <Route path='/support' element={<PageTransition><ProtectedRoute><Support /></ProtectedRoute></PageTransition>} />
          <Route path='/event' element={<PageTransition><ProtectedRoute><Event /></ProtectedRoute></PageTransition>} />
          <Route path='/ticketPage' element={<PageTransition><ProtectedRoute><TicketPage /></ProtectedRoute></PageTransition>} />
          <Route path='/booking-confirmation' element={<PageTransition><ProtectedRoute><BookingConfirmationPage /></ProtectedRoute></PageTransition>} />
          <Route path='/profile' element={<PageTransition><ProtectedRoute><ProfilePage /></ProtectedRoute></PageTransition>} />
          <Route path='/loginPage' element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path='/signUpPage' element={<PageTransition><SignUpPage /></PageTransition>} />
          <Route path='/movieDetails' element={<PageTransition><ProtectedRoute><MovieDetails /></ProtectedRoute></PageTransition>} />
          <Route path='/eventDetails' element={<PageTransition><ProtectedRoute><EventDetails /></ProtectedRoute></PageTransition>} />
          <Route path='/eventDetails/:eventId' element={<PageTransition><ProtectedRoute><EventDetails /></ProtectedRoute></PageTransition>} />
          <Route path='/event-booking' element={<PageTransition><ProtectedRoute><EventBookingPage /></ProtectedRoute></PageTransition>} />
          <Route path='/bookTickets' element={<PageTransition><ProtectedRoute><BookTickets /></ProtectedRoute></PageTransition>} />
          <Route path='/seatSelection' element={<PageTransition><ProtectedRoute><SeatSelection /></ProtectedRoute></PageTransition>} />
          <Route path='/payment' element={<PageTransition><ProtectedRoute><PaymentPage /></ProtectedRoute></PageTransition>} />
          <Route path='/paymentDetails' element={<PageTransition><ProtectedRoute><PaymentDetails /></ProtectedRoute></PageTransition>} />
          <Route path='/adminLogin' element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route path='/adminDashboard/*' element={<PageTransition><ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute></PageTransition>} />
          <Route path='/paymentPage' element={<PageTransition><ProtectedRoute><PaymentPage /></ProtectedRoute></PageTransition>} />
          <Route path='/userList' element={<PageTransition><ProtectedRoute requiredRole="ADMIN"><UserList /></ProtectedRoute></PageTransition>} />
          <Route path='/userDashboard/*' element={<PageTransition><ProtectedRoute requiredRole="USER"><UserDashboardLayout /></ProtectedRoute></PageTransition>} />
        </Routes>
        </AnimatePresence>
        <ToastContainer position="top-center" />
      </div>
      {showBottomNav && <BottomNav />}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
