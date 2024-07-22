import { createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import AdminLayout from '../components/Layouts/AdminLayout';
import { Suspense } from 'react';
import ErrorPage from '../pages/Tools/ErrorPage';

const finalRoutes = routes.map((route) => {
    return {
        ...route,
        element:
            route.layout === 'admin' ? 
                <Suspense fallback={<div>Loading...</div>}>
                    <AdminLayout>{route.element}</AdminLayout>{' '}
                </Suspense>
             : route.layout === 'blank' ? 
                <Suspense fallback={<div>Loading...</div>}>
                    <BlankLayout>{route.element}</BlankLayout>
                </Suspense>
             : 
                <Suspense fallback={<div>Loading...</div>}>
                    <DefaultLayout>{route.element}</DefaultLayout>
                </Suspense>
            ,
            errorElement: <ErrorPage />,
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;
