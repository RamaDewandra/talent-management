import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Analytics } from './pages/Analytics/Analytics';
import { Assessments } from './pages/Assessments/Assessments';
import { AssessmentForm } from './pages/Assessments/AssessmentForm';
import { Periods } from './pages/Periods/Periods';
import { Indicators } from './pages/Indicators/Indicators';
import { Reports } from './pages/Reports/Reports';
import { Employees } from './pages/Employees/Employees';
import { EmployeeProfile } from './pages/Employees/EmployeeProfile';
import { UserManagement } from './pages/ManageUsers/UserManagement';
import { AssessmentCalendar } from './pages/Calendar/AssessmentCalendar';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* Analytics */}
          <Route path="/analytics" element={
            <ProtectedRoute roles={['HR', 'Manager']}>
              <Layout><Analytics /></Layout>
            </ProtectedRoute>
          } />

          {/* Assessments */}
          <Route path="/assessments" element={
            <ProtectedRoute roles={['HR', 'Manager']}>
              <Layout><Assessments /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/assessments/new" element={
            <ProtectedRoute roles={['HR', 'Manager']}>
              <Layout><AssessmentForm /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/assessments/:id" element={
            <ProtectedRoute roles={['HR', 'Manager']}>
              <Layout><AssessmentForm /></Layout>
            </ProtectedRoute>
          } />

          {/* Reports */}
          <Route path="/reports" element={
            <ProtectedRoute roles={['HR', 'Manager']}>
              <Layout><Reports /></Layout>
            </ProtectedRoute>
          } />

          {/* Employees */}
          <Route path="/employees" element={
            <ProtectedRoute roles={['HR', 'Manager']}>
              <Layout><Employees /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/employees/:id" element={
            <ProtectedRoute roles={['HR', 'Manager']}>
              <Layout><EmployeeProfile /></Layout>
            </ProtectedRoute>
          } />

          {/* HR only */}
          <Route path="/calendar" element={
            <ProtectedRoute roles={['HR']}>
              <Layout><AssessmentCalendar /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/manage/users" element={
            <ProtectedRoute roles={['HR']}>
              <Layout><UserManagement /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/periods" element={
            <ProtectedRoute roles={['HR']}>
              <Layout><Periods /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/indicators" element={
            <ProtectedRoute roles={['HR']}>
              <Layout><Indicators /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
