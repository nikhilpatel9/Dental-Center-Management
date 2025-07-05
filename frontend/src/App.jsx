import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import AppointmentManagement from './components/AppointmentManagement';
import CalendarView from './components/CalendarView';
import PatientView from './components/PatientView';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css'; 
function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 w-screen">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/patients"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <PatientManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AppointmentManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <CalendarView />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/patient-view"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientView />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
