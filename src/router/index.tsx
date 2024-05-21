import { createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { adminRoutes } from './adminRoutes';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import AdminLayout from '../components/Layouts/AdminLayout';

/* 
    THIS WILL ALLOW EVERYONE TO ACCESS ADMIN PAGES
    CHANGE THIS BEFORE ADDING TO PRODUCTION
*/

const finalRoutes = routes.map((route) => {
  
    return {
        ...route,
        element: route.layout === 'admin' ? <AdminLayout>{route.element}</AdminLayout> : route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>,
    };
});

const router = createBrowserRouter(finalRoutes);

// ***DELETE THE FOLLOWING BEFORE ADDING TO PRODUCTION***

// const combinedRoutes = [...routes, ...adminRoutes];

// const finalRoutes = combinedRoutes.map((route) => {
//     return {
//         ...route,
//         element: route.layout === 'admin' ? <AdminLayout>{route.element}</AdminLayout> :  route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>,
//     };
// });


export default router;
