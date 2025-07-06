import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../Utils/Constants";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/userSlice";

const Login = () => {
  const [login, setLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        `${BACKEND_URL}/signin`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.response));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  const onSignUp = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        `${BACKEND_URL}/signup`,
        { firstName, lastName, email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.response));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 drop-shadow-lg">
          {login ? "Login" : "Signup"}
        </h1>
        <p className="text-gray-400 text-lg">
          {login
            ? "Enter your credentials to access your account."
            : "Create an account to get started."}
        </p>
      </div>
      <div className="space-y-6">
        {!login && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <p>{error}</p>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          onClick={login ? onLogin : onSignUp}
        >
          {login ? "Login" : "Sign Up"}
        </button>
        <p className="text-sm text-gray-500 text-center">
          {login ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-600 hover:underline"
            onClick={() => setLogin(!login)}
          >
            {login ? "Register here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
