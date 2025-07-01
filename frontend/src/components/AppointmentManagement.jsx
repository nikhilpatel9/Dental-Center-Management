import React, { useState } from 'react';
import {
  Plus, Edit, Trash2, Eye, Search, X, Save,
  Calendar, Clock, User, FileText, DollarSign,
  ChevronDown, Filter, AlertCircle, CheckCircle
} from 'lucide-react';

const AppointmentManagement = () => {
  // Mock data
  const [appointments, setAppointments] = useState([
    {
      id: 1, patientId: 1, title: "Routine Checkup", status: "confirmed",
      description: "Regular dental examination", cost: 150,
      appointmentDate: "2025-07-15T10:00", treatment: "Cleaning",
      nextAppointmentDate: "2025-10-15T10:00", files: []
    },
    {
      id: 2, patientId: 2, title: "Root Canal", status: "pending",
      description: "Root canal therapy", cost: 800,
      appointmentDate: "2025-07-20T14:30", treatment: "Root Canal",
      nextAppointmentDate: "2025-07-27T14:30", files: []
    }
  ]);

  const [patients] = useState([
    { id: 1, fullName: "John Smith", email: "john@example.com" },
    { id: 2, fullName: "Sarah Johnson", email: "sarah@example.com" }
  ]);

  // State management
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    patientId: '', title: '', description: '', status: 'pending',
    appointmentDate: '', treatment: '', cost: '', files: []
  });
  const [errors, setErrors] = useState({});

  // Helper functions
  const getPatientName = (id) => patients.find(p => p.id === id)?.fullName || 'Unknown';
  
  const formatDate = (dateStr) => 
    dateStr ? new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }) : 'N/A';

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  // Form handling
  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = 'Patient required';
    if (!formData.title) newErrors.title = 'Title required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Date required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newAppt = {
      ...formData,
      id: modalMode === 'add' ? appointments.length + 1 : selectedAppt.id,
      cost: parseFloat(formData.cost) || 0
    };

    if (modalMode === 'add') {
      setAppointments([...appointments, newAppt]);
    } else {
      setAppointments(appointments.map(a => a.id === selectedAppt.id ? newAppt : a));
    }
    setShowModal(false);
  };

  // Modal setup
  const setupModal = (mode, appointment = null) => {
    setModalMode(mode);
    if (appointment) {
      setSelectedAppt(appointment);
      setFormData({
        patientId: appointment.patientId,
        title: appointment.title,
        description: appointment.description,
        status: appointment.status,
        appointmentDate: appointment.appointmentDate,
        treatment: appointment.treatment,
        cost: appointment.cost,
        files: appointment.files || []
      });
    } else {
      setFormData({
        patientId: '', title: '', description: '', status: 'pending',
        appointmentDate: '', treatment: '', cost: '', files: []
      });
    }
    setErrors({});
    setShowModal(true);
  };

  // Filtered appointments
  const filteredAppts = appointments
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .filter(a => {
      const patient = patients.find(p => p.id === a.patientId);
      return (
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient?.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    )} )
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-blue-600" /> Appointments
          </h1>
          <p className="text-gray-600">Manage patient appointments</p>
        </div>
        <button 
          onClick={() => setupModal('add')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} /> New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredAppts.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No appointments found
            </h3>
            <button
              onClick={() => setupModal('add')}
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={16} /> Create Appointment
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppts.map(appt => (
                <tr key={appt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{getPatientName(appt.patientId)}</div>
                        <div className="text-sm text-gray-600">{appt.treatment}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{appt.title}</div>
                    <div className="text-sm text-gray-600">{appt.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-900">
                      <Clock className="text-gray-500" size={14} />
                      {formatDate(appt.appointmentDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[appt.status]}`}>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-900">
                      <DollarSign className="text-gray-500" size={14} />
                      ${appt.cost.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setupModal('view', appt)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                        title="View appointment"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => setupModal('edit', appt)}
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                        title="Edit appointment"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Delete this appointment?')) {
                            setAppointments(appointments.filter(a => a.id !== appt.id));
                          }
                        }}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete appointment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {modalMode === 'add' ? 'New Appointment' : 
                 modalMode === 'edit' ? 'Edit Appointment' : 'Appointment Details'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Patient */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                    disabled={modalMode === 'view'}
                    className={`w-full p-2 border rounded-lg text-gray-900 ${
                      errors.patientId ? 'border-red-500' : 'border-gray-300'
                    } ${modalMode === 'view' ? 'bg-gray-100' : 'bg-white'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select patient</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.fullName}</option>
                    ))}
                  </select>
                  {errors.patientId && <p className="text-red-600 text-sm mt-1">{errors.patientId}</p>}
                </div>

                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    disabled={modalMode === 'view'}
                    className={`w-full p-2 border rounded-lg text-gray-900 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    } ${modalMode === 'view' ? 'bg-gray-100' : 'bg-white'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                    disabled={modalMode === 'view'}
                    className={`w-full p-2 border rounded-lg text-gray-900 ${
                      errors.appointmentDate ? 'border-red-500' : 'border-gray-300'
                    } ${modalMode === 'view' ? 'bg-gray-100' : 'bg-white'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.appointmentDate && <p className="text-red-600 text-sm mt-1">{errors.appointmentDate}</p>}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    disabled={modalMode === 'view'}
                    className={`w-full p-2 border border-gray-300 rounded-lg text-gray-900 ${
                      modalMode === 'view' ? 'bg-gray-100' : 'bg-white'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Treatment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                  <input
                    type="text"
                    value={formData.treatment}
                    onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                    disabled={modalMode === 'view'}
                    className={`w-full p-2 border border-gray-300 rounded-lg text-gray-900 ${
                      modalMode === 'view' ? 'bg-gray-100' : 'bg-white'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                {/* Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    disabled={modalMode === 'view'}
                    className={`w-full p-2 border border-gray-300 rounded-lg text-gray-900 ${
                      modalMode === 'view' ? 'bg-gray-100' : 'bg-white'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    disabled={modalMode === 'view'}
                    rows="3"
                    className={`w-full p-2 border border-gray-300 rounded-lg text-gray-900 ${
                      modalMode === 'view' ? 'bg-gray-100' : 'bg-white'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                {modalMode !== 'view' && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                  >
                    <Save size={16} />
                    {modalMode === 'add' ? 'Schedule' : 'Update'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;