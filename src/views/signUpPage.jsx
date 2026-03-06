import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { signup } from '../services/user-service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const SignUpPage = () => {

  const [username, setUsename] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        username: username,
        email: email,
        password: password,
        role:"user"
      });
      toast.success('Sign Up Successful! 🎉', {
        onClose: () => navigate("/LoginPage"),
        autoClose: 1500,
      });
    }
    catch (error) {
      console.log("Error while submitting the signup form:", error);
      toast.error(error?.response?.data?.error || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen pt-16 md:pt-20">
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-red-500 to-orange-500 flex flex-col justify-center items-center text-white p-4 md:p-8 min-h-[40vh] lg:min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Welcome Back!</h1>
        <p className="text-center mb-6 px-4">To keep connected with us please login with your personal info</p>
        <Link to="/LoginPage">
          <button className="px-6 md:px-8 py-2 border-2 border-white rounded-full text-base md:text-lg hover:bg-white hover:text-red-500 transition duration-300">
            SIGN IN
          </button>
        </Link>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 md:p-8 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Create Account</h1>
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
        <p className="text-gray-500 mb-4">or use your email for registration</p>
        <form className="flex flex-col space-y-4 w-full max-w-sm" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={username}
            onChange={(e) => setUsename(e.target.value)}
            required
          />
          <input
            type="email"  
            name="email"
            placeholder="Email"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 md:px-8 py-3 bg-orange-500 text-white rounded-full text-base md:text-lg hover:bg-orange-600 transition duration-300 w-full disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : 'SIGN UP'}
          </button>
        </form>
      </div>
    </div>
  );
};


export default SignUpPage;
