import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, X, Save, CalendarPlus, User, Phone, Mail, Calendar } from 'lucide-react';

const PatientManagement = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1985-06-15',
      address: '123 Main St, City, State 12345',
      emergencyContact: 'Jane Doe - +1 (555) 987-6543',
      healthInfo: 'Allergic to penicillin'
    },
    {
      id: 2,
      fullName: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      dateOfBirth: '1990-03-22',
      address: '456 Oak Ave, City, State 12345',
      emergencyContact: 'Mike Johnson - +1 (555) 876-5432',
      healthInfo: ''
    }
  ]);

  const [appointments] = useState([
    { id: 1, patientId: 1, date: '2024-01-15' },
    { id: 2, patientId: 1, date: '2024-02-20' },
    { id: 3, patientId: 2, date: '2024-01-10' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    healthInfo: ''
  });

  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      emergencyContact: '',
      healthInfo: ''
    });
  };

  const openModal = (mode, patient = null) => {
    setModalMode(mode);
    setSelectedPatient(patient);
    if (patient && (mode === 'edit' || mode === 'view')) {
      setFormData({ ...patient });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newPatient = {
        ...formData,
        id: Date.now()
      };
      setPatients([...patients, newPatient]);
    } else if (modalMode === 'edit') {
      setPatients(patients.map(p => 
        p.id === selectedPatient.id ? { ...selectedPatient, ...formData } : p
      ));
    }
    closeModal();
  };

  const handleDelete = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient? This will also delete all related appointments.')) {
      setPatients(patients.filter(p => p.id !== patientId));
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleScheduleAppointment = (patientId) => {
    const date = prompt('Enter appointment date (YYYY-MM-DD):');
    if (date) {
      alert(`Appointment scheduled for ${date}`);
    }
  };

  const getPatientAppointments = (patientId) => {
    return appointments.filter(apt => apt.patientId === patientId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-in-out scale-100 animate-zoomIn">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {modalMode === 'add' ? 'Add New Patient' : 
             modalMode === 'edit' ? 'Edit Patient' : 'Patient Details'}
          </h3>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-200 rounded-full transition duration-200"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {modalMode === 'view' ? (
          <div className="p-4 sm:p-6 space-y-4 text-black animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['fullName', 'email', 'phone', 'dateOfBirth', 'address', 'emergencyContact', 'healthInfo'].map((field, idx) => (
                <div key={field} className={idx === 4 || idx === 6 ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                  <p className="mt-1 text-sm text-gray-900">{field === 'dateOfBirth' ? formatDate(selectedPatient?.[field]) : selectedPatient?.[field]}</p>
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Appointments</label>
                <p className="mt-1 text-sm text-gray-900">{getPatientAppointments(selectedPatient?.id).length}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-black animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['fullName', 'email', 'phone', 'dateOfBirth', 'address', 'emergencyContact', 'healthInfo'].map((field, idx) => (
                <div key={field} className={idx === 4 || idx === 6 ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {['fullName', 'email', 'phone', 'dateOfBirth'].includes(field) ? '*' : ''}
                  </label>
                  {field === 'healthInfo' ? (
                    <textarea
                      value={formData[field]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200"
                      rows="4"
                      placeholder="Enter health information, allergies, medical conditions..."
                    />
                  ) : (
                    <input
                      type={field === 'dateOfBirth' ? 'date' : field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200"
                      required={['fullName', 'email', 'phone', 'dateOfBirth'].includes(field)}
                      placeholder={
                        field === 'fullName' ? 'Enter full name' : 
                        field === 'email' ? 'Enter email address' : 
                        field === 'phone' ? 'Enter phone number' : 
                        field === 'address' ? 'Enter address' :
                        field === 'emergencyContact' ? 'Enter emergency contact' : ''
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition duration-200 flex items-center justify-center font-medium shadow hover:shadow-lg transform hover:scale-105"
              >
                <Save className="h-5 w-5 mr-2" />
                {modalMode === 'add' ? 'Add Patient' : 'Update Patient'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 size-auto">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 text-black">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your dental practice patients</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition duration-200 flex items-center justify-center sm:justify-start"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No patients found matching your search.' : 'No patients yet. Add your first patient!'}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-black">{patient.fullName}</div>
                        <div className="text-sm text-gray-500">{patient.healthInfo ? 'Has health notes' : 'No health notes'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{patient.email}</div>
                      <div className="text-sm text-gray-500">{patient.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {formatDate(patient.dateOfBirth)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {getPatientAppointments(patient.id).length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('view', patient)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', patient)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 hover:bg-yellow-50 rounded"
                          title="Edit Patient"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleScheduleAppointment(patient.id)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                          title="Schedule Appointment"
                        >
                          <CalendarPlus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Delete Patient"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-gray-500">
            {searchTerm ? 'No patients found matching your search.' : 'No patients yet. Add your first patient!'}
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900">{patient.fullName}</h3>
                    <p className="text-sm text-gray-500">{patient.healthInfo ? 'Has health notes' : 'No health notes'}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openModal('view', patient)}
                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openModal('edit', patient)}
                    className="text-yellow-600 hover:text-yellow-900 p-1 hover:bg-yellow-50 rounded"
                    title="Edit Patient"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{formatDate(patient.dateOfBirth)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{getPatientAppointments(patient.id).length}</span> appointments
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleScheduleAppointment(patient.id)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                      title="Schedule Appointment"
                    >
                      <CalendarPlus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                      title="Delete Patient"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && <Modal />}
    </div>
    </div>
  );
};

export default PatientManagement;