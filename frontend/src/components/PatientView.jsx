import React, { useState } from 'react';
import { Calendar, Clock, FileText, User, Phone, Mail, MapPin, Edit2, Heart, Activity, Thermometer, Weight } from 'lucide-react';

const PatientView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample patient data
  const patientData = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
    dateOfBirth: '1985-06-15',
    bloodType: 'O+',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '(555) 987-6543'
    }
  };

  const upcomingAppointments = [
    {
      id: 1,
      date: '2025-07-05',
      time: '10:00',
      type: 'Annual Checkup',
      doctor: 'Dr. Smith',
      status: 'Confirmed'
    },
    {
      id: 2,
      date: '2025-07-15',
      time: '14:30',
      type: 'Follow-up',
      doctor: 'Dr. Johnson',
      status: 'Scheduled'
    }
  ];

  const pastAppointments = [
    {
      id: 3,
      date: '2025-06-20',
      time: '09:00',
      type: 'Consultation',
      doctor: 'Dr. Smith',
      status: 'Completed',
      notes: 'Regular checkup completed. All vitals normal.'
    },
    {
      id: 4,
      date: '2025-05-15',
      time: '11:30',
      type: 'Blood Test',
      doctor: 'Dr. Brown',
      status: 'Completed',
      notes: 'Blood work results within normal range.'
    }
  ];

  const medicalRecords = [
    {
      id: 1,
      date: '2025-06-20',
      type: 'Lab Results',
      description: 'Complete Blood Count',
      doctor: 'Dr. Smith'
    },
    {
      id: 2,
      date: '2025-05-15',
      type: 'Prescription',
      description: 'Vitamin D supplement',
      doctor: 'Dr. Brown'
    },
    {
      id: 3,
      date: '2025-04-10',
      type: 'X-Ray',
      description: 'Chest X-Ray',
      doctor: 'Dr. Johnson'
    }
  ];

  const vitals = {
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '98.6°F',
    weight: '165 lbs',
    height: '5\'10"',
    lastUpdated: '2025-06-20'
  };

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'bg-green-100 text-green-800',
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Portal</h1>
        <p className="text-gray-600">Manage your health information and appointments</p>
      </div>

      {/* Patient Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{patientData.name}</h2>
              <p className="text-gray-600">Age: {calculateAge(patientData.dateOfBirth)} • Blood Type: {patientData.bloodType}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'records', label: 'Medical Records', icon: FileText },
              { id: 'vitals', label: 'Vitals', icon: Activity }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{patientData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{patientData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{patientData.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Born: {new Date(patientData.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{patientData.emergencyContact.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{patientData.emergencyContact.relationship}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{patientData.emergencyContact.phone}</span>
                </div>
              </div>
            </div>

            {/* Quick Vitals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Vitals</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <Heart className="w-6 h-6 text-red-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Blood Pressure</div>
                  <div className="font-semibold text-gray-900">{vitals.bloodPressure}</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Heart Rate</div>
                  <div className="font-semibold text-gray-900">{vitals.heartRate} bpm</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Last updated: {vitals.lastUpdated}</p>
            </div>

            {/* Next Appointment */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Appointment</h3>
              {upcomingAppointments.length > 0 ? (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{upcomingAppointments[0].type}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(upcomingAppointments[0].status)}`}>
                      {upcomingAppointments[0].status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{upcomingAppointments[0].date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{upcomingAppointments[0].time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{upcomingAppointments[0].doctor}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No upcoming appointments</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{appointment.type}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{appointment.doctor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
              )}
            </div>

            {/* Past Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Appointments</h3>
              <div className="space-y-4">
                {pastAppointments.map(appointment => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{appointment.type}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{appointment.doctor}</span>
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Records</h3>
            <div className="space-y-4">
              {medicalRecords.map(record => (
                <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{record.description}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{record.type}</span>
                        <span>•</span>
                        <span>{record.date}</span>
                        <span>•</span>
                        <span>{record.doctor}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-red-50 rounded-lg">
                <Heart className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-1">Blood Pressure</h4>
                <p className="text-2xl font-bold text-gray-900">{vitals.bloodPressure}</p>
                <p className="text-sm text-gray-600">mmHg</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Activity className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-1">Heart Rate</h4>
                <p className="text-2xl font-bold text-gray-900">{vitals.heartRate}</p>
                <p className="text-sm text-gray-600">bpm</p>
              </div>
              
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <Thermometer className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-1">Temperature</h4>
                <p className="text-2xl font-bold text-gray-900">{vitals.temperature}</p>
                <p className="text-sm text-gray-600">Fahrenheit</p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Weight className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-1">Weight</h4>
                <p className="text-2xl font-bold text-gray-900">{vitals.weight}</p>
                <p className="text-sm text-gray-600">pounds</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <User className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-1">Height</h4>
                <p className="text-2xl font-bold text-gray-900">{vitals.height}</p>
                <p className="text-sm text-gray-600">feet & inches</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> {vitals.lastUpdated}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Vitals are updated during each appointment. Contact your healthcare provider if you have concerns about any readings.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientView;