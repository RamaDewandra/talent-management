import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Assessments } from './pages/Assessments/Assessments';
import { AssessmentForm } from './pages/Assessments/AssessmentForm';
import { Periods } from './pages/Periods/Periods';
import { Indicators } from './pages/Indicators/Indicators';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/assessments" element={
            <ProtectedRoute roles={['HR', 'Manager']}>
              <Layout>
                <Assessments />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/assessments/new" element={
            <ProtectedRoute roles={['HR', 'Manager']}>
              <Layout>
                <AssessmentForm />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/assessments/:id" element={
            <ProtectedRoute roles={['HR', 'Manager']}>
              <Layout>
                <AssessmentForm />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/periods" element={
            <ProtectedRoute roles={['HR']}>
              <Layout>
                <Periods />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/indicators" element={
            <ProtectedRoute roles={['HR']}>
              <Layout>
                <Indicators />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
