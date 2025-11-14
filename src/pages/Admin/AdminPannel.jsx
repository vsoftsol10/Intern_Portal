import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, UserPlus, ClipboardList } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/interns';
    const InternAdminPortal = () => {
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([
    { id: 1, internId: null, title: 'Complete onboarding', description: 'Finish all onboarding modules', deadline: '2024-11-20', status: 'In Progress' },
    { id: 2, internId: null, title: 'Design mockups', description: 'Create UI mockups for new feature', deadline: '2024-11-25', status: 'Pending' }
  ]);

  const [activeTab, setActiveTab] = useState('interns');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', department: '', startDate: '', status: 'Active' });
  const [taskFormData, setTaskFormData] = useState({ internId: '', title: '', description: '', deadline: '', status: 'Pending' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch interns from API on component mount
  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setInterns(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error('Error fetching interns:', err);
    } finally {
      setLoading(false);
    }
  };

  // Intern CRUD Operations
  const handleAddIntern = () => {
    setEditingIntern(null);
    setFormData({ name: '', email: '', department: '', startDate: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleEditIntern = (intern) => {
    setEditingIntern(intern);
    setFormData({
      name: intern.name,
      email: intern.email,
      department: intern.department,
      startDate: intern.startDate,
      status: intern.status
    });
    setIsModalOpen(true);
  };

  const handleDeleteIntern = async (id) => {
    if (window.confirm('Are you sure you want to delete this intern?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setInterns(interns.filter(i => i._id !== id));
        setTasks(tasks.filter(t => t.internId !== id));
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        alert('Error deleting intern: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleSaveIntern = async () => {
    if (!formData.name || !formData.email || !formData.department || !formData.startDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingIntern) {
        // Update existing intern
        const response = await axios.put(`${API_URL}/${editingIntern._id}`, formData);
        setInterns(interns.map(i => i._id === editingIntern._id ? response.data : i));
      } else {
        // Add new intern
        const response = await axios.post(API_URL, formData);
        setInterns([...interns, response.data]);
      }
      
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      alert('Error saving intern: ' + (err.response?.data?.error || err.message));
    }
  };

  // Task Operations
  const handleAddTask = () => {
    setTaskFormData({ internId: '', title: '', description: '', deadline: '', status: 'Pending' });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskFormData.internId || !taskFormData.title || !taskFormData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    setTasks([...tasks, { ...taskFormData, id: Date.now() }]);
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const getInternName = (internId) => {
    const intern = interns.find(i => i._id === internId);
    return intern ? intern.name : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-2xl p-6 mb-6">
          <h1 className="text-4xl font-bold text-black">Intern Portal Admin</h1>
          <p className="text-gray-900 mt-2">Manage interns and assign tasks</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 flex justify-between items-center">
            <span>Error: {error}</span>
            <button onClick={() => setError(null)} className="text-white hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-900 rounded-lg shadow-2xl p-6 mb-6 text-center">
            <p className="text-yellow-500 text-xl">Loading interns...</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('interns')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'interns'
                ? 'bg-yellow-500 text-black shadow-lg scale-105'
                : 'bg-gray-800 text-yellow-500 hover:bg-gray-700'
            }`}
          >
            <UserPlus size={20} />
            Interns
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'bg-yellow-500 text-black shadow-lg scale-105'
                : 'bg-gray-800 text-yellow-500 hover:bg-gray-700'
            }`}
          >
            <ClipboardList size={20} />
            Tasks
          </button>
        </div>

        {/* Interns Tab */}
        {activeTab === 'interns' && (
          <div className="bg-gray-900 rounded-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-500">Intern Management</h2>
              <button
                onClick={handleAddIntern}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-all"
              >
                <Plus size={20} />
                Add Intern
              </button>
            </div>

            {!loading && interns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">No interns found. Add your first intern!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-yellow-500">
                      <th className="text-left py-3 px-4 text-yellow-500 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-yellow-500 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-yellow-500 font-semibold">Department</th>
                      <th className="text-left py-3 px-4 text-yellow-500 font-semibold">Start Date</th>
                      <th className="text-left py-3 px-4 text-yellow-500 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-yellow-500 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interns.map((intern) => (
                      <tr key={intern._id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                        <td className="py-3 px-4 text-gray-300">{intern.name}</td>
                        <td className="py-3 px-4 text-gray-300">{intern.email}</td>
                        <td className="py-3 px-4 text-gray-300">{intern.department}</td>
                        <td className="py-3 px-4 text-gray-300">{intern.startDate}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            intern.status === 'Active' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {intern.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditIntern(intern)}
                              className="p-2 bg-yellow-600 hover:bg-yellow-700 text-black rounded-lg transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteIntern(intern._id)}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-gray-900 rounded-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-500">Task Assignment</h2>
              <button
                onClick={handleAddTask}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-all"
              >
                <Plus size={20} />
                Assign Task
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">No tasks assigned yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-gray-800 border border-yellow-600 rounded-lg p-4 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-yellow-500">{task.title}</h3>
                        <p className="text-gray-300 mt-1">{task.description}</p>
                        <div className="flex gap-4 mt-3 text-sm">
                          <span className="text-gray-400">Assigned to: <span className="text-yellow-500 font-semibold">{getInternName(task.internId)}</span></span>
                          <span className="text-gray-400">Deadline: <span className="text-yellow-500 font-semibold">{task.deadline}</span></span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            task.status === 'Completed' ? 'bg-green-600 text-white' :
                            task.status === 'In Progress' ? 'bg-yellow-600 text-black' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all ml-4"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Intern Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full p-6 border-2 border-yellow-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-yellow-500">
                  {editingIntern ? 'Edit Intern' : 'Add New Intern'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-yellow-500">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                    placeholder="Enter intern name"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                    placeholder="Enter department"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveIntern}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-3 rounded-lg font-semibold transition-all"
                >
                  <Save size={20} />
                  {editingIntern ? 'Update Intern' : 'Add Intern'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Modal */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full p-6 border-2 border-yellow-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-yellow-500">Assign New Task</h3>
                <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-400 hover:text-yellow-500">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Assign to Intern</label>
                  <select
                    value={taskFormData.internId}
                    onChange={(e) => setTaskFormData({ ...taskFormData, internId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Select an intern</option>
                    {interns.map((intern) => (
                      <option key={intern._id} value={intern._id}>{intern.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Task Title</label>
                  <input
                    type="text"
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Description</label>
                  <textarea
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                    placeholder="Enter task description"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Deadline</label>
                  <input
                    type="date"
                    value={taskFormData.deadline}
                    onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Status</label>
                  <select
                    value={taskFormData.status}
                    onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveTask}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-3 rounded-lg font-semibold transition-all"
                >
                  <Save size={20} />
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternAdminPortal;