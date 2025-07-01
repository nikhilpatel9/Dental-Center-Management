/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  patients: [],
  appointments: [],
  isLoading: false
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PATIENTS':
      return { ...state, patients: action.payload };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'ADD_PATIENT':
      return { ...state, patients: [...state.patients, action.payload] };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PATIENT':
      return {
        ...state,
        patients: state.patients.filter(p => p.id !== action.payload)
      };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a => a.id === action.payload.id ? action.payload : a)
      };
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(a => a.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
};

// Hardcoded users for authentication
const users = [
  { id: 1, email: 'admin@dental.com', password: 'admin123', name: 'Dr. Smith', role: 'admin' },
  { id: 2, email: 'john@email.com', password: 'patient123', name: 'John Doe', role: 'patient' },
  { id: 3, email: 'jane@email.com', password: 'patient123', name: 'Jane Smith', role: 'patient' }
];

// Sample data
const samplePatients = [
  {
    id: 1,
    fullName: 'John Doe',
    email: 'john@email.com',
    phone: '+1234567890',
    dateOfBirth: '1990-05-15',
    address: '123 Main St, City',
    emergencyContact: '+1987654321',
    healthInfo: 'No known allergies',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    email: 'jane@email.com',
    phone: '+1234567891',
    dateOfBirth: '1985-08-22',
    address: '456 Oak Ave, City',
    emergencyContact: '+1987654322',
    healthInfo: 'Allergic to penicillin',
    createdAt: new Date().toISOString()
  }
];

const sampleAppointments = [
  {
    id: 1,
    patientId: 1,
    title: 'Routine Checkup',
    description: 'Regular dental examination',
    comments: 'Patient complained of tooth sensitivity',
    appointmentDate: '2025-07-05T10:00:00',
    status: 'completed',
    cost: 150,
    treatment: 'Cleaning and fluoride treatment',
    nextAppointmentDate: '2025-10-05T10:00:00',
    files: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    patientId: 2,
    title: 'Root Canal',
    description: 'Root canal treatment for molar',
    comments: 'Severe pain in lower right molar',
    appointmentDate: '2025-07-10T14:00:00',
    status: 'pending',
    cost: 0,
    treatment: '',
    nextAppointmentDate: '',
    files: [],
    createdAt: new Date().toISOString()
  }
];

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load data from localStorage
    const savedUser = localStorage.getItem('dentalUser');
    const savedPatients = localStorage.getItem('dentalPatients');
    const savedAppointments = localStorage.getItem('dentalAppointments');

    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }

    if (savedPatients) {
      dispatch({ type: 'SET_PATIENTS', payload: JSON.parse(savedPatients) });
    } else {
      dispatch({ type: 'SET_PATIENTS', payload: samplePatients });
      localStorage.setItem('dentalPatients', JSON.stringify(samplePatients));
    }

    if (savedAppointments) {
      dispatch({ type: 'SET_APPOINTMENTS', payload: JSON.parse(savedAppointments) });
    } else {
      dispatch({ type: 'SET_APPOINTMENTS', payload: sampleAppointments });
      localStorage.setItem('dentalAppointments', JSON.stringify(sampleAppointments));
    }
  }, []);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      dispatch({ type: 'SET_USER', payload: user });
      localStorage.setItem('dentalUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('dentalUser');
  };

  const addPatient = (patient) => {
    const newPatient = { ...patient, id: Date.now(), createdAt: new Date().toISOString() };
    dispatch({ type: 'ADD_PATIENT', payload: newPatient });
    const updatedPatients = [...state.patients, newPatient];
    localStorage.setItem('dentalPatients', JSON.stringify(updatedPatients));
  };

  const updatePatient = (patient) => {
    dispatch({ type: 'UPDATE_PATIENT', payload: patient });
    const updatedPatients = state.patients.map(p => p.id === patient.id ? patient : p);
    localStorage.setItem('dentalPatients', JSON.stringify(updatedPatients));
  };

  const deletePatient = (id) => {
    dispatch({ type: 'DELETE_PATIENT', payload: id });
    const updatedPatients = state.patients.filter(p => p.id !== id);
    localStorage.setItem('dentalPatients', JSON.stringify(updatedPatients));
    
    // Also delete related appointments
    const updatedAppointments = state.appointments.filter(a => a.patientId !== id);
    dispatch({ type: 'SET_APPOINTMENTS', payload: updatedAppointments });
    localStorage.setItem('dentalAppointments', JSON.stringify(updatedAppointments));
  };

  const addAppointment = (appointment) => {
    const newAppointment = { ...appointment, id: Date.now(), createdAt: new Date().toISOString() };
    dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
    const updatedAppointments = [...state.appointments, newAppointment];
    localStorage.setItem('dentalAppointments', JSON.stringify(updatedAppointments));
  };

  const updateAppointment = (appointment) => {
    dispatch({ type: 'UPDATE_APPOINTMENT', payload: appointment });
    const updatedAppointments = state.appointments.map(a => a.id === appointment.id ? appointment : a);
    localStorage.setItem('dentalAppointments', JSON.stringify(updatedAppointments));
  };

  const deleteAppointment = (id) => {
    dispatch({ type: 'DELETE_APPOINTMENT', payload: id });
    const updatedAppointments = state.appointments.filter(a => a.id !== id);
    localStorage.setItem('dentalAppointments', JSON.stringify(updatedAppointments));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      logout,
      addPatient,
      updatePatient,
      deletePatient,
      addAppointment,
      updateAppointment,
      deleteAppointment
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};