import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/user-service';
import { doLogin } from '../auth';
// import { toast } from 'react-toast';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {login as loginRedux} from '../store/slices/authSlice'
const LoginPage = () => {
  const dispatch=useDispatch();
  const [loginDetail, setLoginDeatail] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleOnChange = (event, field) => {
    setLoginDeatail({
      ...loginDetail,
      [field]: event.target.value,
    });
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(loginDetail);
    if (loginDetail.email.trim() == "" || loginDetail.password.trim() == "") {
      toast.error("Username or Password is required");
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email: loginDetail.email,
        password: loginDetail.password
      });
      if (response.status === 200) {
        toast.success("Login Successfully");
        console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        dispatch(loginRedux(response.data.user))
        const role = response.data.user?.role;
        console.log("role:",role)
        if (role === "user") {
          navigate("/");
        } else if (role === 'admin') {
          navigate("/adminDashboard");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }

    // login(loginDetail)
    //   .then((data) => {
    //     console.log("Login:");
    //     console.log(data);
    //     doLogin(data, () => {
    //       console.log("login details is saved");          
    //       navigate("/userDashboard");
    //     });
    //     toast.success("login success");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     toast.error("something went wrong");
    //   });

  };
  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-16 md:pt-20">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 md:p-8 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign in</h1>
        <div className="flex space-x-4 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300">
            <i className="fab fa-facebook-f"></i>
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300">
            <i className="fab fa-google"></i>
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300">
            <i className="fab fa-linkedin-in"></i>
          </div>
        </div>
        <p className="text-gray-500 mb-4">or use your account</p>
        <form className="flex flex-col space-y-4 w-full max-w-sm" onSubmit={handleFormSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={setLoginDeatail.email}
            onChange={(e) => handleOnChange(e, "email")}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={setLoginDeatail.password}
            onChange={(e) => handleOnChange(e, "password")}
          />
          <a href="#" className="text-sm text-orange-500 hover:underline text-right">
            Forgot your password?
          </a>
          <button className="px-8 py-3 bg-orange-500 text-white rounded-full text-lg hover:bg-orange-600 transition duration-300">
            SIGN IN
          </button>
        </form>
      </div>

      <div className="w-full lg:w-1/2 bg-gradient-to-br from-red-500 to-orange-500 flex flex-col justify-center items-center text-white p-4 md:p-8 min-h-[40vh] lg:min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Hello, Friend!</h1>
        <p className="text-center mb-6 px-4">Enter your personal details and start journey with us</p>
        <Link to="/SignUpPage">
          <button className="px-6 md:px-8 py-2 border-2 border-white rounded-full text-base md:text-lg hover:bg-white hover:text-red-500 transition duration-300">
            SIGN UP
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
