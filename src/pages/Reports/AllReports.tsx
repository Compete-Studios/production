import { useEffect, useState, Suspense, lazy } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import 'tippy.js/dist/tippy.css';
import { UserAuth } from '../../context/AuthContext';
import IconDollarSign from '../../components/Icon/IconDollarSign';
import IconChecks from '../../components/Icon/IconChecks';
import IconCalendar from '../../components/Icon/IconCalendar';
import IconBarChart from '../../components/Icon/IconBarChart';
import IconAward from '../../components/Icon/IconAward';
import IconCashBanknotes from '../../components/Icon/IconCashBanknotes';

const AnticipatedPayments = lazy(() => import('./AnticipatedPayments') );
const AttendanceReport = lazy(() => import('./AttendanceReport') );
const Birthday = lazy(() => import('./Birthday') );
const DNS = lazy(() => import('./DNS') );
const Snapshot = lazy(() => import('./Snapshot') );
const StudentsToRenew = lazy(() => import('./StudentsToRenew') );


const AllReports = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('All Reports'));
    });

    const renderCategoryTabs = () => (
        <div className="flex flex-wrap justify-center space-x-4">
            <button onClick={() => setSelectedCategory('Student')} className="btn btn-primary">
                Student
            </button>
            <button onClick={() => setSelectedCategory('Marketing')} className="btn btn-primary">
                Marketing
            </button>
            <button onClick={() => setSelectedCategory('Financial')} className="btn btn-primary">
                Financial
            </button>
        </div>
    );

    const renderReportTabs = () => {
        if (!selectedCategory) return null;

        const reportComponents: { [key: string]: { component: React.ReactNode, label: string, icon: React.ElementType }[] } = {
            'Student': [
                { component: <DNS />, label: 'DNS', icon: IconChecks },
                { component: <AttendanceReport />, label: 'Attendance', icon: IconAward },
                { component: <Birthday />, label: 'Birthday', icon: IconCalendar }
            ],
            'Marketing': [
                { component: <Snapshot />, label: 'Snapshot', icon: IconBarChart }
            ],
            'Financial': [
                { component: <AnticipatedPayments />, label: 'Anticipated Payments', icon: IconDollarSign },
                { component: <StudentsToRenew />, label: 'Students To Renew', icon: IconCashBanknotes }
            ]
        };

        return (
            <Tab.Group>
                <Tab.List className="flex flex-wrap">
                    {reportComponents[selectedCategory].map((report, index) => (
                        <Tab key={index} as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${selected ? 'text-info !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                >
                                    <report.icon className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    {report.label}
                                </button>
                            )}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels>
                    {reportComponents[selectedCategory].map((report, index) => (
                        <Tab.Panel key={index}>
                            <div className="pt-5">
                                {report.component}
                            </div>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        );
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <span className="text-primary">Reports</span>
                    </li>
                </ul>
            </div>
            {renderCategoryTabs()}
            {renderReportTabs()}
        </div>
    );
};

export default AllReports;