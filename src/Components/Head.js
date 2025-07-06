import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router";
import { BACKEND_URL } from "../Utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../Redux/userSlice";
import { ReactSVG } from "react-svg";
import Tic_Tac_Toe_Logo from "../assets/Tic_Tac_Toe_Logo.svg";

const Head = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post(BACKEND_URL + "/signout", {}, { withCredentials: true });
    dispatch(removeUser());
    return navigate("/login");
  };

  if (!user) return;
  return (
    <div className="absolute flex w-full py-6 px-10 justify-between">
      <Link to="/">
        <ReactSVG
          src={Tic_Tac_Toe_Logo}
          beforeInjection={(svg) => {
            svg.setAttribute("width", "80");
            svg.setAttribute("height", "80");
          }}
        />
      </Link>
      <>
        <div className="dropdown dropdown-end">
          {!user.profilePicture ? (
            <div
              className="avatar avatar-placeholder"
              tabIndex="0"
              role="button"
            >
              <div className="bg-neutral text-neutral-content w-12 rounded-full">
                <span>{user.firstName[0]}</span>
              </div>
            </div>
          ) : (
            <div
              tabIndex="0"
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="rounded-full">
                <img alt="Profile Picture" src={user.profilePicture} />
              </div>
            </div>
          )}

          <ul
            tabIndex="0"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>

            <li>
              <Link to="/history">History</Link>
            </li>

            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </>
    </div>
  );
};

export default Head;
