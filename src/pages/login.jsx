import React, { useState } from 'react';
import { User, Lock, ArrowRight, AlertCircle, CheckCircle, Clock, XCircle, PlayCircle, Calendar, RefreshCw, LogOut } from 'lucide-react';
import myLogo from '../assets/Vsoft Logo.png';

const API_URL = 'http://localhost:5000/api/interns';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login'); // 'login' or 'dashboard'

  return (
    <div>
      {view === 'login' ? (
        <Login onLoginSuccess={(user) => {
          setCurrentUser(user);
          setView('dashboard');
        }} />
      ) : (
        <Dashboard
          currentUser={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            setView('login');
          }}
        />
      )}
    </div>
  );
};

// ==================== LOGIN COMPONENT ====================
const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please enter both Email and Password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error: Invalid response format. Please check if the API is running.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Login successful
      onLoginSuccess(data);

    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please ensure the API is running on http://localhost:5000');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-gray-900 to-yellow-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-black bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl border border-yellow-500 border-opacity-20 p-8">
          <div className="text-center mb-8">

            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow mb-4 mx-auto">
              <img
                src={myLogo}
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
            </div>

            <h2 className="text-3xl font-bold text-yellow-400 mb-2">Intern Portal</h2>
            <p className="text-gray-400 text-sm">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <label className="block text-yellow-400 text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-yellow-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-yellow-400 text-sm font-medium mb-2">Password</label>
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
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full blur-sm opacity-50"></div>
      </div>
    </div>
  );
};

// ==================== DASHBOARD COMPONENT ====================
const Dashboard = ({ currentUser, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statusConfig = {
    "Acknowledge": {
      label: "Not Started Yet",
      color: "bg-gray-100 text-gray-800 border-gray-300",
      icon: Clock,
      iconColor: "text-gray-600"
    },
    "Pending": {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: Clock,
      iconColor: "text-yellow-600"
    },
    "In Progress": {
      label: "In Progress",
      color: "bg-blue-100 text-blue-800 border-blue-300",
      icon: PlayCircle,
      iconColor: "text-blue-600"
    },
    "Completed": {
      label: "Completed",
      color: "bg-green-100 text-green-800 border-green-300",
      icon: CheckCircle,
      iconColor: "text-green-600"
    },
    "Blocked": {
      label: "Started but Not Completed",
      color: "bg-red-100 text-red-800 border-red-300",
      icon: XCircle,
      iconColor: "text-red-600"
    }
  };

  React.useEffect(() => {
    if (currentUser?.internId) {
      fetchTasks(currentUser.internId);
    }
  }, [currentUser]);

  const fetchTasks = async (internId) => {
    setLoading(true);
    setError("");
    try {
      // Fetch all tasks from the tasks API
      const response = await fetch('http://localhost:5000/api/tasks');

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();

      // Filter tasks for the current intern only
      let allTasks = [];
      if (Array.isArray(data)) {
        allTasks = data;
      } else if (data.tasks && Array.isArray(data.tasks)) {
        allTasks = data.tasks;
      }

      // Filter tasks assigned to this specific intern
      const internTasks = allTasks.filter(task =>
        task.internId === internId || task.internId?._id === internId
      );

      setTasks(internTasks);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskInAPI = async (taskId, status, reason = "") => {
    try {
      // Update task status in the tasks API
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          reason: status === 'Completed' ? '' : reason
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to update task');
      }

      const updatedTask = await response.json();
      return updatedTask;
    } catch (err) {
      console.error('Task update error:', err);
      throw new Error(err.message);
    }
  };

  const handleStatusUpdate = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setReason(task.reason || "");
    setShowModal(true);
  };

  const saveStatusUpdate = async () => {
    if ((newStatus === 'Blocked' || newStatus === 'In Progress') && !reason.trim()) {
      alert("Please provide a reason for this status");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateTaskInAPI(selectedTask._id || selectedTask.id, newStatus, reason);

      setTasks(tasks.map(task =>
        (task._id || task.id) === (selectedTask._id || selectedTask.id)
          ? { ...task, status: newStatus, reason: newStatus === 'Completed' ? '' : reason }
          : task
      ));

      setShowModal(false);
      setSelectedTask(null);
      setReason("");
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }) => {
    const Icon = statusConfig[status]?.icon || Clock;
    return <Icon className={`w-5 h-5 ${statusConfig[status]?.iconColor || 'text-gray-600'}`} />;
  };

  const refreshTasks = () => {
    if (currentUser?.internId) {
      fetchTasks(currentUser.internId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome, {currentUser?.name || currentUser?.email}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={refreshTasks}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = tasks.filter(t => t.status === status).length;
            return (
              <div key={status} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{config.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{count}</p>
                  </div>
                  <div className={`p-3 rounded-full ${config.color}`}>
                    <StatusIcon status={status} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {loading && tasks.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tasks assigned yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task._id || task.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                      <p className="text-gray-600 mb-3">{task.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Assigned: {formatDate(task.assignedDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {formatDate(task.dueDate)}</span>
                        </div>
                        {task.priority && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Priority: {task.priority}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${statusConfig[task.status]?.color || statusConfig["Acknowledge"].color}`}>
                        <StatusIcon status={task.status} />
                        {statusConfig[task.status]?.label || task.status}
                      </span>

                      <button
                        onClick={() => handleStatusUpdate(task)}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>

                  {task.reason && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-900">Reason:</p>
                        <p className="text-sm text-amber-800">{task.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Task Status</h2>

            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">{selectedTask?.title}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {Object.entries(statusConfig).map(([status, config]) => (
                  <option key={status} value={status}>{config.label}</option>
                ))}
              </select>
            </div>

            {(newStatus === 'Blocked' || newStatus === 'In Progress' || newStatus === 'Pending') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason {newStatus === 'Blocked' ? '(Required)' : '(Optional)'}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain the status or reason..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                  disabled={loading}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={saveStatusUpdate}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Update'
                )}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setReason("");
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;