import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Plus, X } from 'lucide-react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  
  // Sample appointments data - now using state so we can add to it
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      date: '2025-07-02',
      time: '10:00',
      type: 'Consultation',
      status: 'Confirmed'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      date: '2025-07-03',
      time: '14:30',
      type: 'Follow-up',
      status: 'Scheduled'
    },
    {
      id: 3,
      patientName: 'Mike Johnson',
      date: '2025-07-04',
      time: '09:15',
      type: 'Emergency',
      status: 'Pending'
    },
    {
      id: 4,
      patientName: 'Sarah Wilson',
      date: '2025-07-02',
      time: '15:30',
      type: 'Routine Checkup',
      status: 'Confirmed'
    },
    {
      id: 5,
      patientName: 'David Brown',
      date: '2025-07-05',
      time: '11:00',
      type: 'Consultation',
      status: 'Scheduled'
    }
  ]);

  // Form state for new appointment
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    date: '',
    time: '',
    type: 'Consultation',
    status: 'Scheduled'
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const appointmentTypes = ['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup', 'Surgery'];
  const appointmentStatuses = ['Scheduled', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAppointmentsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'bg-blue-500',
      'Confirmed': 'bg-green-500',
      'Pending': 'bg-yellow-500',
      'Completed': 'bg-gray-500',
      'Cancelled': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const handleNewAppointmentClick = () => {
    // If a date is selected, pre-fill the form with that date
    if (selectedDate) {
      setNewAppointment(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }));
    }
    setShowNewAppointmentForm(true);
  };

  const handleFormSubmit = () => {
    // Validate form
    if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new appointment with unique ID
    const newId = Math.max(...appointments.map(apt => apt.id)) + 1;
    const appointmentToAdd = {
      ...newAppointment,
      id: newId
    };

    // Add to appointments
    setAppointments(prev => [...prev, appointmentToAdd]);

    // Reset form and close
    setNewAppointment({
      patientName: '',
      date: '',
      time: '',
      type: 'Consultation',
      status: 'Scheduled'
    });
    setShowNewAppointmentForm(false);
  };

  const handleFormChange = (field, value) => {
    setNewAppointment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateAppointments = getAppointmentsForDate(selectedDate);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar View</h1>
        <p className="text-gray-600">View and manage appointments by date</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 bg-red-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 bg-yellow-50" />
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2  hover:bg-gray-100 hover rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 bg-yellow-50" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map(day => (
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayAppointments = getAppointmentsForDate(day);
                const hasAppointments = dayAppointments.length > 0;
                
                return (
                  <div
                    key={index}
                    className={`
                      min-h-[80px] p-2 border border-gray-200 cursor-pointer transition-colors
                      ${day ? 'hover:bg-gray-50' : ''}
                      ${isToday(day) ? 'bg-blue-50 border-blue-200' : ''}
                      ${isSelected(day) ? 'bg-blue-100 border-blue-300' : ''}
                    `}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <div>
                        <div className={`text-sm ${isToday(day) ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                          {day.getDate()}
                        </div>
                        {hasAppointments && (
                          <div className="mt-1 space-y-1">
                            {dayAppointments.slice(0, 2).map(apt => (
                              <div
                                key={apt.id}
                                className={`text-xs px-1 py-0.5 rounded text-white truncate ${getStatusColor(apt.status)}`}
                                title={`${apt.time} - ${apt.patientName}`}
                              >
                                {apt.time} {apt.patientName}
                              </div>
                            ))}
                            {dayAppointments.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayAppointments.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Cancelled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <button 
              onClick={handleNewAppointmentClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Appointment
            </button>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              
              {selectedDateAppointments.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateAppointments.map(apt => (
                    <div key={apt.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{apt.patientName}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>{apt.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <User className="w-4 h-4" />
                            <span>{apt.type}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No appointments scheduled for this date</p>
                </div>
              )}
            </div>
          )}

          {/* Today's Appointments */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>
            {(() => {
              const todayAppointments = getAppointmentsForDate(new Date());
              return todayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todayAppointments.map(apt => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{apt.patientName}</div>
                        <div className="text-sm text-gray-600">{apt.time} - {apt.type}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(apt.status)}`}>
                        {apt.status}
      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No appointments today</p>
              );
            })()}
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">New Appointment</h3>
              <button
                onClick={() => setShowNewAppointmentForm(false)}
                className="p-2  hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 bg-yellow-50" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  value={newAppointment.patientName}
                  onChange={(e) => handleFormChange('patientName', e.target.value)}
                  className="w-full px-3 text-black  py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-3 text-black  py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => handleFormChange('time', e.target.value)}
                  className="w-full px-3 text-black  py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type
                </label>
                <select
                  value={newAppointment.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  className="w-full px-3 text-black  py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {appointmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newAppointment.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  className="w-full px-3 text-black  py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {appointmentStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewAppointmentForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;