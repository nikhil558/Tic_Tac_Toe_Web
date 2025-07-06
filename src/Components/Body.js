import { Outlet, useNavigate } from "react-router";
import Head from "./Head";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../Utils/Constants";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await axios.get(BACKEND_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(userData.data.response));
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <div>
      <Head />
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              Tic Tac Toe
            </h1>
            <p className="text-white/80 text-lg">
              Challenge yourself or a friend!
            </p>
          </div>
          <div className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-lg">
            <Outlet context={{ setToast }} />
          </div>
        </div>
      </div>
      {toast && (
        <div className="toast">
          <div className={`alert alert-${toast.type} shadow-lg`}>
            <h3 className="font-bold text-gray-800">{toast.title}</h3>
            <p className="text-sm text-gray-600">{toast.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Body;
