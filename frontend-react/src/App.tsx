import { Outlet } from 'react-router-dom';
import { DashboardLayoutWrapper } from './components/layouts/dashboard-layout-wrapper';
// import { DashboardLayout } from './components/layouts/dashboard/dashboard-layout';
import { DashboardLayout } from './components/layouts/dashboard/layout';
// import { DashboardLayout } from './components/layouts/dashboard/dashboard-layout';

function App() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default App;
