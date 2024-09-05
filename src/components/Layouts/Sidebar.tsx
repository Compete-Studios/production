import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMinus from '../Icon/IconMinus';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuCharts from '../Icon/Menu/IconMenuCharts';
import IconMenuTodo from '../Icon/Menu/IconMenuTodo';
import IconBolt from '../Icon/IconBolt';
import IconSearch from '../Icon/IconSearch';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/dashboard" className="main-logo flex items-center shrink-0">
                            <img className="w-auto h-4 ml-[5px] flex-none" src="/assets/images/logodark.png" alt="logo" />
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'dashboards' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboards')}>
                                    <div className="flex items-center">
                                    <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Dashboards</span>
                                    </div>

                                    <div className={currentMenu !== 'dashboards' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'dashboards' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/dashboard">Home</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/studio-dashboard">Studio Dashboard</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/marketing-dashboard">Marketing Dashboard</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/payment-dashboard">Payment Dashboard</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                          

                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-info-light dark:bg-info-light dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <IconMinus className="w-4 h-5 flex-none hidden" />
                                <span>Studio Manager</span>
                            </h2>
                            <li className="nav-item">
                                <NavLink to="/students/view-students" className="group">
                                    <div className="flex items-center">
                                        <IconMenuUsers className="group-hover:!text-info shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('View Students')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/students/add-student" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-info shrink-0" viewBox="0 0 16 16">
                                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                            <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Add Student')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/students/student-pipeline" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-info shrink-0" viewBox="0 0 16 16">
                                            <path
                                                fill-rule="evenodd"
                                                d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5z"
                                            />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Student Pipeline')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/staff/view-staff" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-info shrink-0" viewBox="0 0 16 16">
                                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('View Staff')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/staff/add-staff" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-info shrink-0" viewBox="0 0 16 16">
                                            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                            <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Add Staff')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'classes' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('classes')}>
                                    <div className="flex items-center">
                                        <IconMenuDatatables className="group-hover:!text-info shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Classes</span>
                                    </div>

                                    <div className={currentMenu !== 'classes' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'classes' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/classes/view-classes">View Classes</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/classes/attendance">Attendance</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/classes/rooms">Rooms</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/classes/waiting-lists">Waiting Lists</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/classes/programs">Programs</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/classes/ranks">Ranks</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-secondary-light dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <IconMinus className="w-4 h-5 flex-none hidden" />
                                <span>Marketing Manager</span>
                            </h2>
                            <li className="nav-item">
                                <NavLink to="/prospects/prospect-pipeline" className="group">
                                    <div className="flex items-center">
                                        <IconBolt fill={true} className="group-hover:!text-secondary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Prospect Pipeline')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/prospects/add-prospect" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-secondary shrink-0" viewBox="0 0 16 16">
                                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                            <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Add Prospect')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/marketing/marketing-methods" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-secondary shrink-0" viewBox="0 0 16 16">
                                            <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25 25 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009l.496.008a64 64 0 0 1 1.51.048m1.39 1.081q.428.032.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a66 66 0 0 1 1.692.064q.491.026.966.06" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Marketing Methods')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/marketing/view-emails" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-secondary shrink-0" viewBox="0 0 16 16">
                                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 4.697v4.974A4.5 4.5 0 0 0 12.5 8a4.5 4.5 0 0 0-1.965.45l-.338-.207z" />
                                            <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Email History')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/marketing/view-news-letters" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-secondary shrink-0" viewBox="0 0 16 16">
                                            <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5z" />
                                            <path d="M2 3h10v2H2zm0 3h4v3H2zm0 4h4v1H2zm0 2h4v1H2zm5-6h2v1H7zm3 0h2v1h-2zM7 8h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2z" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('View Newsletters')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/marketing/email-lists" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-secondary shrink-0" viewBox="0 0 16 16">
                                            <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671" />
                                            <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Email Lists')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/marketing/view-text-messages" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-secondary shrink-0" viewBox="0 0 16 16">
                                            <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Text Messages')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/marketing/capture-forms" className="group">
                                    <div className="flex items-center">
                                        <IconMenuTodo className="group-hover:!text-secondary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Capture Forms')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-success-light dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <IconMinus className="w-4 h-5 flex-none hidden" />
                                <span>Payment Manager</span>
                            </h2>
                            <li className="nav-item">
                                <NavLink to="/payments/search-payments" className="group">
                                    <div className="flex items-center">
                                        <IconMenuInvoice className="group-hover:!text-success shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Search Payments')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/payments/quick-pay" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-success shrink-0" viewBox="0 0 16 16">
                                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Quick Pay')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/payments/late-payment-pipeline" className="group">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="group-hover:!text-success shrink-0" viewBox="0 0 16 16">
                                            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                                        </svg>

                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Late Payment Pipeline')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/payments/view-invoices" className="group">
                                    <div className="flex items-center">
                                        <IconMenuDocumentation className="group-hover:!text-success shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Invoices')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <IconMinus className="w-4 h-5 flex-none hidden" />
                                <span>Tools</span>
                            </h2>

                            <li className="nav-item">
                                <NavLink to="/reports/all-reports" className="group">
                                    <div className="flex items-center">
                                        <IconMenuCharts className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Reports</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <ul>
                                    <li className="nav-item">
                                        <NavLink to="/tools/advanced-search" className="group">
                                            <div className="flex items-center">
                                                <IconSearch className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Advanced Search')}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                    {/* <li className="nav-item">
                                        <NavLink to="/apps/chat" className="group">
                                            <div className="flex items-center">
                                                <IconMenuChat className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Text Messages')}</span>
                                            </div>
                                        </NavLink>
                                    </li> */}
                                    {/* <li className="nav-item">
                                        <NavLink to="/apps/todolist" className="group">
                                            <div className="flex items-center">
                                                <IconMenuTodo className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('todo_list')}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/apps/notes" className="group">
                                            <div className="flex items-center">
                                                <IconMenuNotes className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('notes')}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/apps/performance-planner" className="group">
                                            <div className="flex items-center">
                                                <IconMenuScrumboard className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Planner</span>
                                            </div>
                                        </NavLink>
                                    </li> */}

                                    {/* <li className="nav-item">
                                        <NavLink to="/apps/calendar" className="group">
                                            <div className="flex items-center">
                                                <IconMenuCalendar className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('calendar')}</span>
                                            </div>
                                        </NavLink>
                                    </li> */}
                                    {/* <li className="nav-item">
                                        <NavLink to="/reports/birthday" className="group">
                                            <div className="flex items-center">
                                                <IconMenuCalendar className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Birthday Reports</span>
                                            </div>
                                        </NavLink>
                                    </li> */}

                                    {/* {!isMaster && (
                                        <li className="menu nav-item">
                                            <button type="button" className={`${currentMenu === 'master' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('master')}>
                                                <div className="flex items-center">
                                                    <IconMenuAuthentication className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Accounts</span>
                                                </div>

                                                <div className={currentMenu !== 'students' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                    <IconCaretDown />
                                                </div>
                                            </button>

                                            <AnimateHeight duration={300} height={currentMenu === 'master' ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                   {masters?.map((master: any) => (
                                                        <li key={master.studioID}>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => handleSetNewStudio(master.studioID)}
                                                                className="nav-link group w-full"
                                                            >{master.studioName}</button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AnimateHeight>
                                        </li>
                                    )} */}
                                </ul>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
