import { useRef, useState } from "react";
import axiosClient from "../utils/axios";
import { login as loginAction } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

function Register() {
  const dispatch = useDispatch();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const userPassword = passwordRef.current.value;

    if (!username || !userPassword) {
      setError("Please fill in all fields...");
      return;
    }

    axiosClient
      .post("/auth/register", {
        username,
        password: userPassword,
      })
      .then((data) => dispatch(loginAction(data.data)))
      .catch(() =>
        setError("Registration failed. Please try again.")
      );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-purple-600">
      <div className="absolute inset-0 bg-base-300 opacity-75"></div>
      <div className="relative bg-base-100 bg-opacity-90 p-12 rounded-3xl shadow-2xl max-w-md w-full sm:w-3/4 lg:w-1/2 border border-gray-300">
        <h2 className="text-4xl font-extrabold mb-8 text-blue-400 text-center">
          Register
        </h2>
        {error && (
          <div className="mb-4 text-red-600 font-semibold text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <label className="block text-lg font-medium text-white  mb-2">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
              <FaUser className="text-blue-600 mr-3 text-lg" />
              <input
                className="w-full outline-none bg-transparent text-black focus:ring-0"
                type="text"
                ref={usernameRef}
                placeholder="Enter your username"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-lg font-medium text-white mb-2">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
              <FaLock className="text-blue-600 mr-3 text-lg" />
              <input
                className="w-full outline-none text-black bg-transparent focus:ring-0"
                type="password"
                ref={passwordRef}
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button className="w-full bg-blue-400 text-white p-4 rounded-xl font-bold hover:transition duration-300 ease-in-out transform hover:scale-105">
            Register
          </button>
        </form>
        <p className="text-center text-green-600  mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold link"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
