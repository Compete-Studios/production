import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoutes';
import path from 'path';
import ViewStudios from '../admin/studios/ViewStudios';

const AddStudio = lazy(() => import('../admin/studios/AddStudio'));
const StudioOverview = lazy(() => import('../admin/studios/StudioOverview'));

const adminRoutes = [
    {
        path: '/admin/studios',
        element: <ViewStudios />,
        layout: 'blank',
    },
    {
        path: '/admin/add-studio',
        element: <AddStudio />,
        layout: 'blank',
    },
    {
        path: '/admin/studio-overview/:id',
        element: <StudioOverview />,
        layout: 'blank',
    },
    
];

export { adminRoutes };