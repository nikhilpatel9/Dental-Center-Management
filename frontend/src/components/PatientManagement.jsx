import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit, Trash2, Eye, Search, X, Save, CalendarPlus } from 'lucide-react';

const PatientManagement = () => {
  const { patients, addPatient, updatePatient, deletePatient, appointments, scheduleAppointment } = useApp();
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
      setFormData({
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        healthInfo: patient.healthInfo
      });
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
      addPatient(formData);
    } else if (modalMode === 'edit') {
      updatePatient({ ...selectedPatient, ...formData });
    }
    closeModal();
  };

  const handleDelete = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient? This will also delete all related appointments.')) {
      deletePatient(patientId);
    }
  };

  const handleScheduleAppointment = (patientId) => {
    const date = prompt('Enter appointment date (YYYY-MM-DD):');
    if (date) {
      scheduleAppointment(patientId, date);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {modalMode === 'add' ? 'Add New Patient' : 
             modalMode === 'edit' ? 'Edit Patient' : 'Patient Details'}
          </h3>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {modalMode === 'view' ? (
          <div className="p-6 space-y-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <p className="mt-1 text-sm">{selectedPatient?.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <p className="mt-1 text-sm">{selectedPatient?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <p className="mt-1 text-sm">{selectedPatient?.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Date of Birth</label>
                <p className="mt-1 text-sm">{formatDate(selectedPatient?.dateOfBirth)}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Address</label>
                <p className="mt-1 text-sm">{selectedPatient?.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Emergency Contact</label>
                <p className="mt-1 text-sm">{selectedPatient?.emergencyContact}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Total Appointments</label>
                <p className="mt-1 text-sm">{getPatientAppointments(selectedPatient?.id).length}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Health Information</label>
                <p className="mt-1 text-sm">{selectedPatient?.healthInfo || 'No health information provided'}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['fullName', 'email', 'phone', 'dateOfBirth', 'address', 'emergencyContact', 'healthInfo'].map((field, idx) => (
                <div key={field} className={idx === 4 ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium mb-1">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {['fullName', 'email', 'phone', 'dateOfBirth'].includes(field) ? '*' : ''}
                  </label>
                  {field === 'healthInfo' ? (
                    <textarea
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      rows="3"
                    />
                  ) : (
                    <input
                      type={field === 'dateOfBirth' ? 'date' : 'text'}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      required={['fullName', 'email', 'phone', 'dateOfBirth'].includes(field)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition duration-200 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {modalMode === 'add' ? 'Add Patient' : 'Update Patient'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 text-black">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Patient Management</h1>
          <p className="text-gray-600">Manage your dental practice patients</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition duration-200 flex items-center"
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
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
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

      {showModal && <Modal />}
    </div>
  );
};

export default PatientManagement;
