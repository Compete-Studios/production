import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoutes';

const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const RegisterBoxed = lazy(() => import('../pages/Authentication/RegisterBoxed'));
const Error = lazy(() => import('../components/Error'));

const Overview = lazy(() => import('../pages/Overview'));
const SearchPayments = lazy(() => import('../pages/Payments/SearchPayments'));
const QuickPay = lazy(() => import('../pages/Payments/QuickPay'));
const LatePaymentPipeline = lazy(() => import('../pages/Payments/LatePaymentPipeline'));
const ViewInvoices = lazy(() => import('../pages/Payments/ViewInvoices'));
const ViewClasses = lazy(() => import('../pages/Classes/ViewClasses'));
const ViewRoster = lazy(() => import('../pages/Classes/ViewRoster'));
const ViewStaff = lazy(() => import('../pages/Staff/ViewStaff'));
const AddStaff = lazy(() => import('../pages/Staff/AddStaff'));
const Attendance = lazy(() => import('../pages/Classes/Attendance'));
const Rooms = lazy(() => import('../pages/Classes/Rooms'));
const WaitingLists = lazy(() => import('../pages/Classes/WaitingLists'));
const Programs = lazy(() => import('../pages/Classes/Programs'));
const Ranks = lazy(() => import('../pages/Classes/Ranks'));
const AddStudent = lazy(() => import('../pages/Students/AddStudent'));
const ViewStudents = lazy(() => import('../pages/Students/ViewStudents'));
const SearchStudents = lazy(() => import('../pages/Students/SearchStudents'));
const StudentPipeline = lazy(() => import('../pages/Students/StudentPipeline'));
const Methods = lazy(() => import('../pages/Marketing/Methods'));

const ViewProspects = lazy(() => import('../pages/Prospects/ViewProspects'));
const AddProspect = lazy(() => import('../pages/Prospects/AddProspect'));
const SearchDisplay = lazy(() => import('../pages/SearchDisplay'));
const ProspectPipeline = lazy(() => import('../pages/Prospects/ProspectPipeline'));

const routes = [
    //Authentication
    {
        path: '/auth/boxed-signin',
        element: <LoginBoxed />,
        layout: 'blank',
    },
    {
        path: '/auth/boxed-signup',
        element: <RegisterBoxed />,
        layout: 'blank',
    },
    //payments
    {
        path: '/search-payments',
        element: <SearchPayments />,
    },
    {
        path: '/quick-pay',
        element: <QuickPay />,
    },
    {
        path: '/late-payment-pipeline',
        element: <LatePaymentPipeline />,
    },
    {
        path: '/view-invoices',
        element: <ViewInvoices />,
    },

    //classes
    {
        path: '/classes/view-classes',
        element: <ViewClasses />,
    },
    {
        path: '/classes/view-roster/:classId/:uid',
        element: <ViewRoster />,
    },
    {
        path: '/classes/attendance',
        element: <Attendance />,
    },
    {
        path: '/classes/rooms',
        element: <Rooms />,
    },
    {
        path: '/classes/waiting-lists',
        element: <WaitingLists />,
    },
    {
        path: '/classes/programs',
        element: <Programs />,
    },
    {
        path: '/classes/ranks',
        element: <Ranks />,
    },

    //staff
    {
        path: '/staff/view-staff',
        element: <ViewStaff />,
    },
    {
        path: '/staff/add-staff',
        element: <AddStaff />,
    },
    //students
    {
        path: '/students/view-students',
        element: <ViewStudents />,
    },
    {
        path: '/students/add-student',
        element: <AddStudent />,
    },
    {
        path: '/students/search-students',
        element: <SearchStudents />,
    },
    {
        path: '/students/student-pipeline',
        element: <StudentPipeline />,
    },
    //prospects
    {
        path: '/prospects/view-prospects',
        element: <ViewProspects />,
    },
    {
        path: '/prospects/add-prospect',
        element: <AddProspect />,
    },
    {
        path: '/prospects/prospect-pipeline',
        element: <ProspectPipeline />,
    },
    //dashboard
    {
        path: '/',
        element: <Overview />,
    },
    //marketing
    {
        path: '/marketing-methods',
        element: <Methods />,
    },
    //other
    {
        path: '/search',
        element: <SearchDisplay />,
    },

    //errors
    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
