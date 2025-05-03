import './assets/style.css'
import { Route, Routes } from 'react-router-dom';
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
import axios from 'axios';
import EventDetails from './views/eventDetails';
import PaymentPage from './views/paymentPage';
import TicketPage from './views/ticketPage';

function App() {
  //app.jsx
  const dispatch = useDispatch();

  const handleGetUserDetails = async (id) => {
    console.log(id)
    try {
      const response = await axios.get(
        `http://localhost:1111/api/user/get/${id}`
      );
      dispatch(login(response?.data))
    }
    catch (error) {
      console.log("user not found:",error)
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const User = JSON.parse(localStorage.getItem("user"));
      console.log("user:", User);
      handleGetUserDetails(User.id)
    }
  }, [])


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
          <Route path='/paymentDetails' element={<PaymentDetails />} />
          <Route path='/adminLogin' element={<AdminLogin />} />
          <Route path='/adminDashboard/*' element={<AdminDashboard />} />
          <Route path='/paymentPage' element={<PaymentPage />} />

          <Route path='/userDashboard/*' element={<UserDashboardLayout />} />

        </Routes>
        <ToastContainer position="top-center" />
      </div>
      <Footer />
    </div>
  );
}

export default App;
