import React, { useState } from 'react';
import {
  Plus, Edit, Trash2, Eye, Search, X, Save, CalendarPlus
} from 'lucide-react';

const PatientManagement = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1985-06-15',
      address: '123 Main St',
      emergencyContact: 'Jane Doe - +1 (555) 987-6543',
      healthInfo: 'Allergic to penicillin'
    },
    {
      id: 2,
      fullName: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      dateOfBirth: '1990-03-22',
      address: '456 Oak Ave',
      emergencyContact: 'Mike Johnson - +1 (555) 876-5432',
      healthInfo: ''
    }
  ]);

  const [appointments, setAppointments] = useState([
    { id: 1, patientId: 1, date: '2024-01-15' },
    { id: 2, patientId: 1, date: '2024-02-20' },
    { id: 3, patientId: 2, date: '2024-01-10' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', dateOfBirth: '',
    address: '', emergencyContact: '', healthInfo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (mode, patient = null) => {
    setModalMode(mode);
    setSelectedPatient(patient);
    if (patient) {
      setFormData({ ...patient });
    } else {
      setFormData({
        fullName: '', email: '', phone: '', dateOfBirth: '',
        address: '', emergencyContact: '', healthInfo: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      setPatients([...patients, { ...formData, id: Date.now() }]);
    } else if (modalMode === 'edit') {
      setPatients(patients.map(p => p.id === selectedPatient.id ? { ...formData, id: selectedPatient.id } : p));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this patient?')) {
      setPatients(p => p.filter(pt => pt.id !== id));
    }
  };

  const handleScheduleAppointment = (id) => {
    const date = prompt("Enter appointment date (YYYY-MM-DD):");
    if (date) {
      setAppointments(prev => [...prev, { id: Date.now(), patientId: id, date }]);
      alert(`Appointment scheduled on ${date}`);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  const getAppointmentsCount = (id) =>
    appointments.filter(a => a.patientId === id).length;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
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
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">{patient.fullName}</div>
                      <div className="text-sm text-gray-500">{patient.healthInfo ? 'Has health notes' : 'No health notes'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{patient.email}</div>
                      <div className="text-sm text-gray-500">{patient.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {formatDate(patient.dateOfBirth)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {getAppointmentsCount(patient.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => openModal('view', patient)} title="View">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </button>
                        <button onClick={() => openModal('edit', patient)} title="Edit">
                          <Edit className="h-4 w-4 text-yellow-600" />
                        </button>
                        <button onClick={() => handleScheduleAppointment(patient.id)} title="Schedule Appointment">
                          <CalendarPlus className="h-4 w-4 text-green-600" />
                        </button>
                        <button onClick={() => handleDelete(patient.id)} title="Delete">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal form (same as before, you can re-add it if needed) */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-semibold">{modalMode === 'add' ? 'Add Patient' : 'Edit Patient'}</h2>
                <button onClick={closeModal}><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                {Object.keys(formData).map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type={field === 'dateOfBirth' ? 'date' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg border-gray-300"
                    />
                  </div>
                ))}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button type="button" onClick={closeModal} className="px-4 py-2 border rounded text-gray-600">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
                    <Save size={16} />
                    {modalMode === 'add' ? 'Add' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;
