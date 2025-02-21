import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  return (
    <div className="flex bg-zinc-900 text-white items-center justify-between text-sm py-4 mb-5 border-b border-b-[#cec0c0]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-start">
        <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] mb-2 md:mb-0">
          Doc
        </h2>
        <span className="text-gray-500 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-semibold ml-0 md:ml-2">
          Finder
        </span>
      </div>

      <ul className="md:flex bg-zinc-900 items-start gap-5 font-medium hidden">
        <NavLink to={"/"}>
          <li className="py-1">Home</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/doctors"}>
          <li className="py-1">All Doctors</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/about"}>
          <li className="py-1">About</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/contact"}>
          <li className="py-1">Contact</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 rounded-full"
              src={assets.profile_pic}
              alt="profile_pic"
            />
            <img
              className="w-2.5"
              src={assets.dropdown_icon}
              alt="dropdown_icon"
            />
            <div className="absolute top-0 right-0 py-14 text-base font-medium text-gray-600 hidden group-hover:block">
              <div className="min-w-48 bg-zinc-800 text-white rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:ext-zinc-400 cursor-pointer"
                >
                  Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:ext-zinc-400 cursor-pointer"
                >
                  Appointments
                </p>
                <p onClick={logout} className="hover:text-zinc-400 cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light sm:hidden md:block hover:bg-gray-700 transition-all duration-500"
          >
            Create Account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt="menu_icon"
        />

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } right-0 top-0 bottom-0 z-20 overflow-hidden bg-zinc-900 text-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-start">
              <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] mb-2 md:mb-0">
                Doc
              </h2>
              <span className="text-gray-500 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-semibold ml-0 md:ml-2">
                Finder
              </span>
            </div>
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="cross_icon"
              className="w-7"
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to={"/"}>
              <p className="px-4 py-2 rounded full inline-block">HOME</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to={"/doctors"}>
              <p className="px-4 py-2 rounded full inline-block">ALL DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to={"/about"}>
              <p className="px-4 py-2 rounded full inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to={"/contact"}>
              <p className="px-4 py-2 rounded full inline-block">CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
