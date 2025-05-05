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
  const navigate=useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
        username: username,
        email: email,
        password: password,
        role:"user"

      });
      toast.success('Sign Up Successful! 🎉', {
        onClose: () => navigate("/LoginPage"), // Redirect after toast closes
        autoClose: 1000, // Auto close after 1 seconds
      });
    }
    catch (error) {
      console.log("Error while submitting the signup form:", error);
      toast.error(error?.response?.data?.error || "Failed to sign up");
    }
  }

  return (
    <div className="flex h-screen pt-20">
      <div className="w-1/2 bg-gradient-to-br from-red-500 to-orange-500 flex flex-col justify-center items-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-center mb-6">To keep connected with us please login with your personal info</p>
        <Link to="/LoginPage">
          <button className="px-8 py-2 border-2 border-white rounded-full text-lg hover:bg-white hover:text-red-500 transition duration-300">
            SIGN IN
          </button>
        </Link>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <h1 className="text-4xl font-bold mb-4">Create Account</h1>
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
        <form className="flex flex-col space-y-4 w-3/4" onSubmit={(e) => handleSubmit(e)}>
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="px-8 py-3 bg-orange-500 text-white rounded-full text-lg hover:bg-orange-600 transition duration-300">
            SIGN U
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
