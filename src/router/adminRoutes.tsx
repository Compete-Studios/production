import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoutes';
import AdminDashboard from '../admin/AdminDashboard';

const ViewStudios = lazy(() => import('../admin/studios/ViewStudios'));

const adminRoutes = [
    {
        path: '/admin',
        element: <AdminDashboard />,
        layout: 'blank',
    },
    {
        path: '/admin/studios',
        element: <ViewStudios />,
        layout: 'blank',
    },
    
];

export { adminRoutes };