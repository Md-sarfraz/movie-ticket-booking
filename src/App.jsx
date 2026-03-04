import './assets/style.css'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './views/home';
import About from './views/about';
import LoginPage from './views/loginPage';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Contact from './views/contact';
import SignUpPage from './views/signUpPage';
import MovieDetails from './views/movieDetails';
import BookTickets from './views/bookTickets';
import SeatSelection from './views/seatSelection';
import PaymentDetails from './views/paymentDetails';
import AdminLogin from './views/adminLogin';
import AdminDashboard from './views/dashboard/admin/dashboardLayout';
import UserDashboardLayout from './views/dashboard/user/dashboardLayout';
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

function App() {
  //app.jsx
  const dispatch = useDispatch();
  const location = useLocation();

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
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        // Don't redirect here - let user continue browsing
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const userStr = localStorage.getItem("user");
      if (userStr && userStr !== "undefined") {
        const User = JSON.parse(userStr);
        console.log("user:", User);
        // Immediately dispatch user from localStorage to avoid null state
        if (User?.id) {
          dispatch(login(User));
          handleGetUserDetails(User.id);
        }
      }
    }
  }, [])

  // Pages where footer should NOT be displayed
  const hideFooterRoutes = [
    '/paymentPage',
    '/payment',
    '/ticketPage',
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


  return (
    <div>
      {/* <ToastContainer/> */}
      <Navbar />
      < div className=''>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/event' element={<Event />} />
          <Route path='/ticketPage' element={<TicketPage />} />
          <Route path='/loginPage' element={<LoginPage />} />
          <Route path='/signUpPage' element={<SignUpPage />} />
          <Route path='/movieDetails' element={<MovieDetails />} />
          <Route path='/eventDetails' element={<EventDetails />} />
          <Route path='/bookTickets' element={<BookTickets />} />
          <Route path='/seatSelection' element={<SeatSelection />} />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/paymentDetails' element={<PaymentDetails />} />
          <Route path='/adminLogin' element={<AdminLogin />} />
          <Route path='/adminDashboard/*' element={<AdminDashboard />} />
          <Route path='/paymentPage' element={<PaymentPage />} />
          <Route path='/userList' element={<UserList />} />

          <Route path='/userDashboard/*' element={<UserDashboardLayout />} />

        </Routes>
        <ToastContainer position="top-center" />
      </div>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
