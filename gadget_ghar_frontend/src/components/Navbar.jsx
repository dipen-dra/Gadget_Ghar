import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };


  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">

          <Link to="/" className="flex items-center">
            <img src="/Gadget_logo.png" alt="Gadget_Ghar Logo" className="h-24 w-auto -my-6 relative z-50" />
          </Link>


          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("hero-section")}
              className="text-gray-600 hover:text-sky-600 font-medium transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("featured-products")}
              className="text-gray-600 hover:text-sky-600 font-medium transition-colors cursor-pointer"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("why-choose-us")}
              className="text-gray-600 hover:text-sky-600 font-medium transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("footer")}
              className="text-gray-600 hover:text-sky-600 font-medium transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? "/admin/dashboard" : "/dashboard"} className="text-gray-800 font-semibold hover:text-sky-600 transition-colors">
                  Welcome, {user.fullName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition-all hover:shadow-lg shadow-red-500/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-sky-500 text-white px-6 py-2.5 rounded-full hover:bg-sky-600 transition-all hover:shadow-lg shadow-sky-500/30 font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav >
  );
};

export default Navbar;