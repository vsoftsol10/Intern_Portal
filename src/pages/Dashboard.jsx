import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, PlayCircle, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

const API_URL = 'https://internship-backend-upmj.onrender.com/api/interns';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const statusConfig = {
    not_started: {
      label: "Not Started Yet",
      color: "bg-gray-100 text-gray-800 border-gray-300",
      icon: Clock,
      iconColor: "text-gray-600"
    },
    in_progress: {
      label: "In Progress",
      color: "bg-blue-100 text-blue-800 border-blue-300",
      icon: PlayCircle,
      iconColor: "text-blue-600"
    },
    completed: {
      label: "Completed",
      color: "bg-green-100 text-green-800 border-green-300",
      icon: CheckCircle,
      iconColor: "text-green-600"
    },
    blocked: {
      label: "Started but Not Completed",
      color: "bg-red-100 text-red-800 border-red-300",
      icon: XCircle,
      iconColor: "text-red-600"
    }
  };

  // Get current user from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.internId) {
          setCurrentUser(user);
          fetchTasks(user.internId);
        } else {
          setError("User not found. Please login again.");
        }
      } else {
        setError("User not found. Please login again.");
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError("Error loading user data. Please login again.");
    }
  }, []);

  // Fetch tasks from API
  const fetchTasks = async (internId) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/${internId}/tasks`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Update task status via API
  const updateTaskInAPI = async (taskId, status, reason = "") => {
    try {
      const response = await fetch(`${API_URL}/${currentUser.internId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status, 
          reason: status === 'completed' ? '' : reason 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      const updatedTask = await response.json();
      return updatedTask;
    } catch (err) {
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
    if ((newStatus === 'blocked' || newStatus === 'in_progress') && !reason.trim()) {
      alert("Please provide a reason for this status");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateTaskInAPI(selectedTask._id || selectedTask.id, newStatus, reason);
      
      // Update local state
      setTasks(tasks.map(task => 
        (task._id || task.id) === (selectedTask._id || selectedTask.id)
          ? { ...task, status: newStatus, reason: newStatus === 'completed' ? '' : reason }
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
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome, {currentUser?.name || currentUser?.internId || 'Intern'}
              </p>
            </div>
            <button
              onClick={refreshTasks}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Task Statistics */}
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

        {/* Loading State */}
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
          /* Task List */
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
                      <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${statusConfig[task.status]?.color || statusConfig.not_started.color}`}>
                        <StatusIcon status={task.status} />
                        {statusConfig[task.status]?.label || 'Unknown'}
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

      {/* Update Status Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Task Status</h2>
            
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">{selectedTask?.title}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Status
              </label>
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

            {(newStatus === 'blocked' || newStatus === 'in_progress') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason {newStatus === 'blocked' ? '(Required)' : '(Optional)'}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why the task is not completed..."
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

export default Dashboard;