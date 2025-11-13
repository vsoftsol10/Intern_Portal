import React, { useState } from 'react'
import { LogOut, X } from 'lucide-react';
import logo from "../assets/Vsoft Logo.png"
const Header = ({ internName = "John Doe", onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    } else {
      // Navigate to home page
      window.location.href = "/";
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-amber-50 to-yellow-50 h-28 shadow-lg border-b-2 border-yellow-400">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo - Left Side */}
          <div className="flex items-center">
            <div>
              <div className="w-25 h-22   items-center justify-center text-xs">
                <img src={logo} alt="Logo" />
              </div>
            </div>
          </div>

          {/* Intern Name and Logout - Right Side */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-gray-600 text-sm block">Welcome back,</span>
              <span className="text-gray-900 font-bold text-lg">
                {internName}
              </span>
            </div>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-yellow-400 px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span>Log Out</span>
              <LogOut size={20}/>
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Confirm Logout</h2>
              <button
                onClick={handleCancelLogout}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelLogout}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-6 py-2 bg-black text-yellow-400 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header