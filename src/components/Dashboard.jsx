/* eslint-disable no-unused-vars */
import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  // Mock data for demonstration
  const user = { name: 'Dr. Smith', role: 'admin', email: 'admin@dental.com' };
  const patients = [
    { id: 1, fullName: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' },
    { id: 3, fullName: 'Bob Johnson', email: 'bob@example.com', phone: '555-123-4567' },
    { id: 4, fullName: 'Alice Brown', email: 'alice@example.com', phone: '444-987-6543' },
    { id: 5, fullName: 'Charlie Wilson', email: 'charlie@example.com', phone: '333-555-7777' }
  ];
  
  const appointments = [
    { 
      id: 1, 
      patientId: 1, 
      title: 'Regular Checkup', 
      description: 'Routine dental examination',
      treatment: 'Dental Cleaning',
      appointmentDate: '2025-07-15T10:00:00',
      status: 'pending',
      cost: 150
    },
    { 
      id: 2, 
      patientId: 2, 
      title: 'Teeth Cleaning', 
      description: 'Professional dental cleaning',
      treatment: 'Deep Cleaning',
      appointmentDate: '2025-07-10T14:30:00',
      status: 'completed',
      cost: 200
    },
    { 
      id: 3, 
      patientId: 3, 
      title: 'Cavity Treatment', 
      description: 'Filling cavity in molar',
      treatment: 'Dental Filling',
      appointmentDate: '2025-07-20T09:00:00',
      status: 'pending',
      cost: 300
    },
    { 
      id: 4, 
      patientId: 1, 
      title: 'Root Canal', 
      description: 'Root canal therapy',
      treatment: 'Endodontic Treatment',
      appointmentDate: '2025-06-15T11:00:00',
      status: 'completed',
      cost: 800
    },
    { 
      id: 5, 
      patientId: 4, 
      title: 'Consultation', 
      description: 'Initial consultation',
      treatment: 'Consultation',
      appointmentDate: '2025-07-25T16:00:00',
      status: 'pending',
      cost: 100
    }
  ];

  // Calculate KPIs
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const totalRevenue = completedAppointments.reduce((sum, apt) => sum + (apt.cost || 0), 0);

  // Get next 10 appointments
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.appointmentDate) >= new Date())
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 10);

  // Get top patients (by number of appointments)
  const patientAppointmentCounts = patients.map(patient => ({
    ...patient,
    appointmentCount: appointments.filter(apt => apt.patientId === patient.id).length
  }));
  const topPatients = patientAppointmentCounts
    .sort((a, b) => b.appointmentCount - a.appointmentCount)
    .slice(0, 5);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.fullName : 'Unknown Patient';
  };

  if (user?.role === 'patient') {
    // Patient dashboard - show only their data
    const patientAppointments = appointments.filter(apt => {
      const patient = patients.find(p => p.email === user.email);
      return patient && apt.patientId === patient.id;
    });

    const patientUpcoming = patientAppointments.filter(apt => new Date(apt.appointmentDate) >= new Date());
    const patientCompleted = patientAppointments.filter(apt => apt.status === 'completed');
    const patientPending = patientAppointments.filter(apt => apt.status === 'pending');

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>

        {/* Patient Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Appointments"
            value={patientAppointments.length}
            icon={Calendar}
            color="bg-blue-500"
          />
          <StatCard
            title="Completed"
            value={patientCompleted.length}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Upcoming"
            value={patientUpcoming.length}
            icon={Clock}
            color="bg-yellow-500"
          />
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
          </div>
          <div className="p-6">
            {patientUpcoming.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {patientUpcoming.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                      <p className="text-sm text-gray-600">{appointment.description}</p>
                      <p className="text-sm text-blue-600">{formatDate(appointment.appointmentDate)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Treatment History */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Treatments</h3>
          </div>
          <div className="p-6">
            {patientCompleted.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No completed treatments</p>
            ) : (
              <div className="space-y-4">
                {patientCompleted.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                      <p className="text-sm text-gray-600">{appointment.treatment}</p>
                      <p className="text-sm text-gray-500">{formatDate(appointment.appointmentDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${appointment.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your dental practice</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Appointments"
          value={totalAppointments}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-purple-500"
          subtitle="From completed appointments"
        />
        <StatCard
          title="Completion Rate"
          value={`${Math.round((completedAppointments.length / totalAppointments) * 100)}%`}
          icon={TrendingUp}
          color="bg-indigo-500"
          subtitle={`${completedAppointments.length}/${totalAppointments} completed`}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <span className="text-sm text-gray-500">{upcomingAppointments.length} scheduled</span>
          </div>
          <div className="p-6">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Patient: {getPatientName(appointment.patientId)}
                      </p>
                      <p className="text-sm text-blue-600">{formatDate(appointment.appointmentDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${appointment.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Patients */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Most Active Patients</h3>
          </div>
          <div className="p-6">
            {topPatients.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No patient data available</p>
            ) : (
              <div className="space-y-4">
                {topPatients.map((patient, index) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-800">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{patient.fullName}</h4>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{patient.appointmentCount}</p>
                      <p className="text-xs text-gray-500">appointments</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {appointments
              .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
              .slice(0, 8)
              .map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-full ${
                    appointment.status === 'completed' ? 'bg-green-100' :
                    appointment.status === 'pending' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    {appointment.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : appointment.status === 'pending' ? (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.title} - {getPatientName(appointment.patientId)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(appointment.appointmentDate)} • ${appointment.cost}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Add New Patient</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Schedule Appointment</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;