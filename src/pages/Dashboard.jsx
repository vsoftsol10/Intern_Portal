import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, PlayCircle, Calendar, User, AlertCircle } from 'lucide-react';
import Header from '../component/Header';

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete React Documentation",
      description: "Read and understand React hooks documentation",
      assignedDate: "2024-11-01",
      dueDate: "2024-11-15",
      status: "not_started",
      reason: ""
    },
    {
      id: 2,
      title: "Build Login Component",
      description: "Create a reusable login component with form validation",
      assignedDate: "2024-11-03",
      dueDate: "2024-11-18",
      status: "in_progress",
      reason: ""
    },
    {
      id: 3,
      title: "API Integration Task",
      description: "Integrate user authentication API with frontend",
      assignedDate: "2024-11-05",
      dueDate: "2024-11-20",
      status: "not_started",
      reason: ""
    }
  ]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");

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

  const handleStatusUpdate = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setReason(task.reason);
    setShowModal(true);
  };

  const saveStatusUpdate = () => {
    if ((newStatus === 'blocked' || newStatus === 'in_progress') && !reason.trim()) {
      alert("Please provide a reason for this status");
      return;
    }

    setTasks(tasks.map(task => 
      task.id === selectedTask.id 
        ? { ...task, status: newStatus, reason: newStatus === 'completed' ? '' : reason }
        : task
    ));
    
    setShowModal(false);
    setSelectedTask(null);
    setReason("");
  };

  const StatusIcon = ({ status }) => {
    const Icon = statusConfig[status].icon;
    return <Icon className={`w-5 h-5 ${statusConfig[status].iconColor}`} />;
  };

 return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 to-amber-100">
         <Header/>
      <div className="max-w-8xl mx-auto p-6">
     

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

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Assigned: {task.assignedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {task.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${statusConfig[task.status].color}`}>
                      <StatusIcon status={task.status} />
                      {statusConfig[task.status].label}
                    </span>
                    
                    <button
                      onClick={() => handleStatusUpdate(task)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
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
      </div>

      {/* Update Status Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Task Status</h2>
            
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">{selectedTask.title}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={saveStatusUpdate}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Save Update
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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