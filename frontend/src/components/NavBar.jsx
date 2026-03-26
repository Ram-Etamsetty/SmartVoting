import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/EB_logo.svg";
import LoginOptions from "./LoginOptions";
import { useAuth } from "../Context/AuthContext";

const NavBar = ({ onProfileClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav
      className="w-full bg-white shadow-sm"
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex justify-around items-center">
        <Link to="/">
          <img src={logo} alt="logo" className="h-15 w-60 cursor-pointer" />
        </Link>
        <div className="flex items-center justify-around">
          <div className="px-5 py-6 text-xl text-gray-400 hover:text-gray-700 hover:border-b-black">
            <NavLink to="/elections"> Elections </NavLink>
          </div>
          <div className="px-5 py-6 text-xl text-gray-400 hover:text-gray-700 hover:border-b-black">
            <NavLink to="/meeting-votes"> Meeting Votes </NavLink>
          </div>
          <div className="px-5 py-6 text-xl text-gray-400 hover:text-gray-700 hover:border-b-black">
            <NavLink to="/services"> Services </NavLink>
          </div>
          <div className="px-5 py-6 text-xl text-gray-400 hover:text-gray-700 hover:border-b-black">
            <NavLink to="/pricing"> Pricing </NavLink>
          </div>
        </div>
        <div className="flex items-center space-x-10 ">
          {user ? (
            <button
              onClick={() => onProfileClick?.()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00263A] text-white hover:bg-gray-800 transition"
            >
              👤 {user.name}
            </button>
          ) : (
            <>
              <Link
                onMouseEnter={() => setIsOpen(false)}
                to="/get-started"
                className="get-started-font px-6 py-3 border bg-[#00263A] text-white text-lg hover:bg-white hover:text-black transition duration-300"
              >
                Get-Started
              </Link>
              <div onMouseEnter={() => setIsOpen(true)}>
                <button className="text-[#00263A] text-xl cursor-pointer">
                  Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {isOpen && !user && (
        <div onMouseLeave={() => setIsOpen(false)}>
          <LoginOptions></LoginOptions>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
