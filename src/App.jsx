import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // ✅ Navigate added
import { AuthProvider } from './context/authContext';
import PrivateRoute from './components/layout/PrivateRoute';
import Alert from './components/layout/Alert';
import AdminLayout from './components/layout/AdminLayout';
import MemberLayout from './components/layout/MemberLayout';

import Login from './components/auth/Login';
import Register from './components/auth/Register';

import Dashboard from './pages/admin/Dashboard';
import Classes from './pages/admin/Classes';
import Members from './pages/admin/Members';
import WorkoutPlans from './pages/admin/WorkoutPlans';

import MDashboard from './pages/member/MDashboard';
import MClasses from './pages/member/MClasses';
import MWorkoutPlans from './pages/member/MWorkoutPlans';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="container">
    

          <Alert />
          <Routes>
            {/* ✅ Redirect root path to login */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Layout with Nested Routes */}
            <Route element={<PrivateRoute roles={['admin']}><AdminLayout /></PrivateRoute>}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/classes" element={<Classes />} />
              <Route path="/admin/members" element={<Members />} />
              <Route path="/admin/workout-plans" element={<WorkoutPlans />} />
            </Route>

            {/* Member Layout with Nested Routes */}
            <Route path="/member" element={<MemberLayout />}>
              <Route
                path="dashboard"
                element={
                  <PrivateRoute roles={['member']}>
                    <MDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="classes"
                element={
                  <PrivateRoute roles={['member']}>
                    <MClasses />
                  </PrivateRoute>
                }
              />
              <Route
                path="workout-plans"
                element={
                  <PrivateRoute roles={['member']}>
                    <MWorkoutPlans />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
