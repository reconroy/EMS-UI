import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layout/layout";
import Login from './pages/user/login';
import Forgot from './pages/user/Forgot';
import Dashboard from './pages/Dashboard';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import ChangePassword from './pages/user/ChangePassword';
import AllEmployee from './pages/masters/Employee/AllEmployee';
import AddEmployee from './pages/masters/Employee/AddEmployee';
import Roles from './pages/Masters/Roles/Roles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<Forgot />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="change-password" element={<ChangePassword />} />
          
          {/* Masters Routes */}
          <Route path="masters" element={<Navigate to="/masters/employee/view" replace />} />
          <Route path="masters/employee" element={<Navigate to="/masters/employee/view" replace />} />
          <Route path="masters/employee/view" element={<AllEmployee />} />
          <Route path="masters/employee/add" element={<AddEmployee />} />
          <Route path="masters/roles" element={<Roles />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
