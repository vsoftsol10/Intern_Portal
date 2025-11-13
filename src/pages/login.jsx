import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
    const navigate =useNavigate();
  const handleSubmit = () => {
    console.log('Login submitted:', { userId, password });
    if(userId == "IN01"&& password== "Nirmal@01" ){
    navigate("/Dashboard")}
    // Add your login logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-gray-900 to-yellow-900 flex items-center justify-center p-4">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-700"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-black bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl border border-yellow-500 border-opacity-20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4">
              <User className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">Intern Portal</h2>
            <p className="text-gray-400 text-sm">Sign in to access your dashboard</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* User ID Field */}
            <div className="relative">
              <label className="block text-yellow-400 text-sm font-medium mb-2">
                User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className={`w-5 h-5 transition-colors ${focusedField === 'userId' ? 'text-yellow-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onFocus={() => setFocusedField('userId')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter your user ID"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-yellow-400 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-yellow-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/50"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          
        </div>

        {/* Bottom decoration */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full blur-sm opacity-50"></div>
      </div>
    </div>
  );
};

export default Login;