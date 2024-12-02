import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layout/layout";
import Login from './pages/user/login';
import Forgot from './pages/user/Forgot';
import Dashboard from './pages/Dashboard';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import ChangePassword from './pages/user/ChangePassword';
import AllEmployee from './pages/Masters/Employee/AllEmployee';
import AddEmployee from './pages/Masters/Employee/AddEmployee';

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
          <Route path="masters">
            <Route path="employee/view" element={<AllEmployee />} />
            <Route path="employee/add" element={<AddEmployee />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
