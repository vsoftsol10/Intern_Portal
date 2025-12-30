import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, UserPlus, ClipboardList, Eye, EyeOff, Download } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_URL = 'https://internship-backend-upmj.onrender.com/api/interns';
const TASK_API_URL = 'https://internship-backend-upmj.onrender.com/api/tasks';

const InternAdminPortal = () => {
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('interns');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    department: '', 
    startDate: '', 
    status: 'Active',
    role: 'Intern' // New field
  });
  const [taskFormData, setTaskFormData] = useState({ 
    internId: '', 
    title: '', 
    description: '', 
    deadline: '', 
    status: 'Acknowledge',
    reason: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInterns();
    fetchTasks();
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

  const fetchTasks = async () => {
    try {
      const response = await axios.get(TASK_API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleAddIntern = () => {
    setEditingIntern(null);
    setFormData({ name: '', email: '', password: '', department: '', startDate: '', status: 'Active', role: 'Intern' });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleEditIntern = (intern) => {
    setEditingIntern(intern);
    setFormData({
      name: intern.name,
      email: intern.email,
      password: '',
      department: intern.department,
      startDate: intern.startDate,
      status: intern.status,
      role: intern.role || 'Intern' // Default to Intern if not set
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleDeleteIntern = async (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        await fetchInterns();
        await fetchTasks();
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        alert('Error deleting: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleSaveIntern = async () => {
    if (!formData.name || !formData.email || !formData.department || !formData.startDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editingIntern && !formData.password) {
      alert('Password is required for new entries');
      return;
    }

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        startDate: formData.startDate,
        status: formData.status,
        role: formData.role // Explicitly include role
      };

      if (editingIntern) {
        if (formData.password) {
          dataToSend.password = formData.password;
        }
        console.log('🔄 UPDATING Intern - Data being sent:', dataToSend);
        console.log('🔄 Role value:', formData.role);
        const response = await axios.put(`${API_URL}/${editingIntern._id}`, dataToSend);
        console.log('✅ Server response:', response.data);
        alert(`Updated! Role saved as: ${response.data.role}`);
      } else {
        dataToSend.password = formData.password;
        console.log('➕ CREATING Intern - Data being sent:', dataToSend);
        console.log('➕ Role value:', formData.role);
        const response = await axios.post(API_URL, dataToSend);
        console.log('✅ Server response:', response.data);
        alert(`Created! Role saved as: ${response.data.role}`);
      }
      await fetchInterns();
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      alert('Error saving: ' + (err.response?.data?.error || err.message));
      console.error('❌ Full error:', err.response?.data);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskFormData({ internId: '', title: '', description: '', deadline: '', status: 'Acknowledge', reason: '' });
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormData({
      internId: task.internId?._id || task.internId,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      status: task.status,
      reason: task.reason || ''
    });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async () => {
    if (!taskFormData.internId || !taskFormData.title || !taskFormData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingTask) {
        await axios.put(`${TASK_API_URL}/${editingTask._id}`, {
          internId: taskFormData.internId,
          title: taskFormData.title,
          description: taskFormData.description,
          deadline: taskFormData.deadline,
          status: taskFormData.status,
          reason: taskFormData.reason
        });
      } else {
        await axios.post(TASK_API_URL, taskFormData);
      }
      await fetchTasks();
      setIsTaskModalOpen(false);
    } catch (err) {
      alert('Error saving task: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${TASK_API_URL}/${id}`);
        await fetchTasks();
      } catch (err) {
        alert('Error deleting task: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const getInternName = (internId) => {
    if (!internId) return 'Unknown';
    if (typeof internId === 'object' && internId.name) {
      return internId.name;
    }
    const intern = interns.find(i => i._id === internId);
    return intern ? intern.name : 'Unknown';
  };

  const exportToExcel = () => {
    const getInternDetails = (internId) => {
      if (!internId) return { name: 'Unknown', department: 'N/A', startDate: 'N/A', role: 'N/A' };

      if (typeof internId === 'object' && internId.name) {
        return {
          name: internId.name,
          department: internId.department || 'N/A',
          startDate: internId.startDate || 'N/A',
          role: internId.role || 'N/A'
        };
      }

      const intern = interns.find(i => i._id === internId);
      if (intern) {
        return {
          name: intern.name,
          department: intern.department,
          startDate: intern.startDate,
          role: intern.role || 'N/A'
        };
      }

      return { name: 'Unknown', department: 'N/A', startDate: 'N/A', role: 'N/A' };
    };

    const excelData = tasks.map(task => {
      const internDetails = getInternDetails(task.internId);
      const createdAt = task.createdAt ? new Date(task.createdAt) : null;
      const updatedAt = task.updatedAt ? new Date(task.updatedAt) : null;
      const deadline = task.deadline ? new Date(task.deadline) : null;

      return {
        'Task ID': task._id,
        'Task Title': task.title,
        'Task Description': task.description,
        'Current Status': task.status,
        'Status Reason': task.reason || 'N/A',
        'Assigned To': internDetails.name,
        'Role': internDetails.role,
        'Department': internDetails.department,
        'Start Date': internDetails.startDate,
        'Task Deadline': deadline ? deadline.toLocaleDateString() : 'No deadline',
        'Days Until Deadline': deadline ? Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)) : 'N/A',
        'Task Created': createdAt ? createdAt.toLocaleDateString() + ' ' + createdAt.toLocaleTimeString() : 'N/A',
        'Last Updated': updatedAt ? updatedAt.toLocaleDateString() + ' ' + updatedAt.toLocaleTimeString() : 'N/A',
        'Days Since Creation': createdAt ? Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24)) : 'N/A',
        'Task Age (Days)': createdAt ? Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24)) : 'N/A',
        'Status Progress': getStatusProgress(task.status),
        'Priority Level': calculatePriority(task.deadline, task.status)
      };
    });

    excelData.sort((a, b) => {
      const dateA = a['Task Created'] !== 'N/A' ? new Date(a['Task Created']) : new Date(0);
      const dateB = b['Task Created'] !== 'N/A' ? new Date(b['Task Created']) : new Date(0);
      return dateB - dateA;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const columnWidths = [
      { wch: 25 }, { wch: 30 }, { wch: 40 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, 
      { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 20 }, 
      { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 12 }
    ];
    worksheet['!cols'] = columnWidths;

    const summaryData = [
      { 'Metric': 'Total Tasks', 'Value': tasks.length },
      { 'Metric': 'Completed Tasks', 'Value': tasks.filter(t => t.status === 'Completed').length },
      { 'Metric': 'In Progress Tasks', 'Value': tasks.filter(t => t.status === 'In Progress').length },
      { 'Metric': 'Pending Tasks', 'Value': tasks.filter(t => t.status === 'Pending').length },
      { 'Metric': 'Blocked Tasks', 'Value': tasks.filter(t => t.status === 'Blocked').length },
      { 'Metric': 'Acknowledge Tasks', 'Value': tasks.filter(t => t.status === 'Acknowledge').length },
      { 'Metric': 'Active Interns', 'Value': interns.filter(i => i.status === 'Active' && i.role === 'Intern').length },
      { 'Metric': 'Active Students', 'Value': interns.filter(i => i.status === 'Active' && i.role === 'Student').length },
      { 'Metric': 'Total People', 'Value': interns.length },
      { 'Metric': 'Export Date', 'Value': new Date().toLocaleString() }
    ];

    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    summaryWorksheet['!cols'] = [{ wch: 25 }, { wch: 15 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Task History Details');
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary Statistics');

    const now = new Date();
    const fileName = `Task_History_${now.toISOString().split('T')[0]}_${now.getHours()}${now.getMinutes()}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const getStatusProgress = (status) => {
    const progressMap = {
      'Acknowledge': '0% - Not Started',
      'Pending': '25% - Awaiting Action',
      'In Progress': '50% - Active Work',
      'Completed': '100% - Finished',
      'Blocked': '0% - Issue Encountered'
    };
    return progressMap[status] || 'Unknown';
  };

  const calculatePriority = (deadline, status) => {
    if (status === 'Completed') return 'Completed';
    if (!deadline) return 'No Deadline';

    const daysUntilDeadline = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));

    if (daysUntilDeadline < 0) return 'Overdue';
    if (daysUntilDeadline <= 3) return 'High';
    if (daysUntilDeadline <= 7) return 'Medium';
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-2xl p-6 mb-6">
          <h1 className="text-4xl font-bold text-black">Management Portal</h1>
          <p className="text-gray-900 mt-2">Manage interns, students and assign tasks</p>
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
            <p className="text-yellow-500 text-xl">Loading...</p>
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
            People
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
              <h2 className="text-2xl font-bold text-yellow-500">People Management</h2>
              <button
                onClick={handleAddIntern}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-all"
              >
                <Plus size={20} />
                Add Person
              </button>
            </div>

            {!loading && interns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">No people found. Add your first person!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-yellow-500">
                      <th className="text-left py-3 px-4 text-yellow-500 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-yellow-500 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-yellow-500 font-semibold">Role</th>
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
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            intern.role === 'Intern' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                          }`}>
                            {intern.role || 'Intern'}
                          </span>
                        </td>
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
              <div className="flex gap-3">
                <button
                  onClick={exportToExcel}
                  disabled={tasks.length === 0}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  <Download size={20} />
                  Download Task History Excel
                </button>
                <button
                  onClick={handleAddTask}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  <Plus size={20} />
                  Assign Task
                </button>
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">No tasks assigned yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <div key={task._id} className="bg-gray-800 border border-yellow-600 rounded-lg p-4 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-yellow-500">{task.title}</h3>
                        <p className="text-gray-300 mt-1">{task.description}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                          <span className="text-gray-400">
                            Assigned to: <span className="text-yellow-500 font-semibold">{getInternName(task.internId)}</span>
                          </span>
                          <span className="text-gray-400">
                            Deadline: <span className="text-yellow-500 font-semibold">{task.deadline}</span>
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            task.status === 'Completed' ? 'bg-green-600 text-white' :
                            task.status === 'In Progress' ? 'bg-yellow-600 text-black' :
                            task.status === 'Blocked' ? 'bg-red-600 text-white' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        {task.reason && (
                          <div className="mt-2 text-sm text-gray-400">
                            <span className="font-semibold">Reason:</span> {task.reason}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-2 bg-yellow-600 hover:bg-yellow-700 text-black rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
            <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full p-6 border-2 border-yellow-500 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-yellow-500">
                  {editingIntern ? 'Edit Person' : 'Add New Person'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-yellow-500">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Intern">Intern</option>
                    <option value="Student">Student</option>
                  </select>
                </div>

                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                    placeholder="Enter name"
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
                  <label className="block text-yellow-500 font-semibold mb-2">
                    Password {editingIntern && <span className="text-sm text-gray-400">(leave blank to keep current)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 pr-12 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                      placeholder={editingIntern ? "Leave blank to keep current password" : "Create a password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
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
                  {editingIntern ? 'Update Person' : 'Add Person'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Modal */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full p-6 border-2 border-yellow-500 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-yellow-500">
                  {editingTask ? 'Edit Task' : 'Assign New Task'}
                </h3>
                <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-400 hover:text-yellow-500">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">Assign to</label>
                  <select
                    value={taskFormData.internId}
                    onChange={(e) => setTaskFormData({ ...taskFormData, internId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Select a person</option>
                    {interns.map((intern) => (
                      <option key={intern._id} value={intern._id}>
                        {intern.name} ({intern.role || 'Intern'})
                      </option>
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
                    <option value="Acknowledge">Acknowledge</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                {(taskFormData.status === 'Pending' || taskFormData.status === 'In Progress' || taskFormData.status === 'Blocked') && (
                  <div>
                    <label className="block text-yellow-500 font-semibold mb-2">
                      Reason {taskFormData.status === 'Blocked' ? '(Required)' : '(Optional)'}
                    </label>
                    <textarea
                      value={taskFormData.reason}
                      onChange={(e) => setTaskFormData({ ...taskFormData, reason: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 bg-gray-800 border border-yellow-600 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500"
                      placeholder="Explain the status or reason..."
                    />
                  </div>
                )}

                <button
                  onClick={handleSaveTask}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-3 rounded-lg font-semibold transition-all"
                >
                  <Save size={20} />
                  {editingTask ? 'Update Task' : 'Assign Task'}
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