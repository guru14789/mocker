import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import AcademyDashboard from './dashboards/AcademyDashboard';
import AspirantDashboard from './dashboards/AspirantDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Route to the right dashboard based on profile type set during Create Profile
  const profileType = user?.profileType || user?.profile || 'aspirant';

  if (profileType === 'admin') return <AdminDashboard />;
  if (profileType === 'academy') return <AcademyDashboard />;
  return <AspirantDashboard />;
};

export default Dashboard;
