import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeLayout from './layout/HomeLayout';
import HomePage from './screens/HomePage';
import AuthLayout from './layout/AuthLayout';
import LoginPage from './screens/LoginPage';
import SignupPage from './screens/SignupPage';
import UpdateProfilePage from './screens/UpdateProfilePage';
import NotFoundPage from './screens/NotFoundPage';
import { SnackbarProviderWrapper } from './context/SnackbarContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import TaskPage from './screens/TaskPage';

function App() {
  return (
    <SnackbarProviderWrapper>
      <Router>
        <Routes>
          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <HomeLayout />
            </ProtectedRoute>
          }>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<UpdateProfilePage />} />
            <Route path="/tasks" element={<TaskPage />} />
          </Route>

          {/* Public Routes */}
          <Route element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Catch all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </SnackbarProviderWrapper>
  );
}

export default App;