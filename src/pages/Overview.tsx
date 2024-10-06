import { useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import IconUsers from '../components/Icon/IconUsers';
import IconDollarSignCircle from '../components/Icon/IconDollarSignCircle';
import IconMenuDashboard from '../components/Icon/Menu/IconMenuDashboard';
import { setPageTitle } from '../store/themeConfigSlice';
import IconUsersGroup from '../components/Icon/IconUsersGroup';
import Schedules from './Marketing/Schedules';
import StudentPipeline from './Students/StudentPipeline';
import ProspectPipeline from './Prospects/ProspectPipeline';
import LatePaymentPipeline from './Payments/LatePaymentPipeline';
import MarketingMetrics from './Studios/MarketingMetrics';
import Studio from '../components/Dashboards/Studio';
import { convertPhone } from '../functions/shared';
import { UserAuth } from '../context/AuthContext';
import IconMail from '../components/Icon/IconMail';
import { updateAllUsers } from '../firebase/firebaseFunctions';
import NewUpdateAlert from '../admin/studios/NewUpdateAlert';

const Overview = () => {
    const { studioInfo, user }: any = UserAuth();
   
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });

    return (
        <div>
            <NewUpdateAlert />           
            <div className="mb-4">
                <div className="lg:flex lg:items-start lg:justify-between">
                    <p className="text-white-dark dark:text-white font-bold">
                        <span className="text-dark dark:text-zinc-400">{studioInfo?.Studio_Name}</span>
                    </p>
                    <p className="text-dark dark:text-zinc-400 font-bold lg:flex lg:items-center gap-1">
                        <IconMail className="hidden lg:block" /> {studioInfo?.Contact_Email}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="hidden lg:block ml-2" viewBox="0 0 16 16">
                            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                        </svg>
                        <span className="block">{convertPhone(studioInfo?.Contact_Number)}</span>
                    </p>
                </div>
                <div className="lg:flex lg:items-start lg:justify-between ">
                    <p className="text-white-dark dark:text-white font-semibold">
                        <span className="text-dark dark:text-zinc-400">{studioInfo?.Contact_Address} </span>
                        <span className="text-dark dark:text-zinc-400">
                            {studioInfo?.Contact_City} {studioInfo?.Contact_State}, {studioInfo?.Contact_Zip}
                        </span>
                    </p>
                </div>
            </div>{' '}
            <MarketingMetrics />
            <Tab.Group>
                <Tab.List className="flex flex-wrap border-b border-zinc-300">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'text-primary !outline-none before:!w-full bg-white rounded-t-lg' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:w-full`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-5 h-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 16 16">
                                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                                </svg>
                                <span className="hidden sm:block">Daily Schedule</span>
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'text-info !outline-none before:!w-full bg-white rounded-t-lg' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                            >
                                <IconUsers className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                <span className="hidden sm:block">Student Pipeline</span>
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'text-secondary !outline-none before:!w-full bg-white rounded-t-lg' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                            >
                                <IconUsersGroup className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                <span className="hidden sm:block">Prospect Pipeline</span>
                            </button>
                        )}
                    </Tab>

                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'text-success !outline-none before:!w-full bg-white rounded-t-lg' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-success before:transition-all before:duration-700 hover:text-success hover:before:w-full`}
                            >
                                <IconDollarSignCircle className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                <span className="hidden sm:block">Late Payment Pipeline</span>
                            </button>
                        )}
                    </Tab>
                </Tab.List>

                <Tab.Panels>
                    <Tab.Panel>
                        <div className="active ">
                            <Schedules />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="">
                            <StudentPipeline />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="">
                            <ProspectPipeline />
                        </div>
                    </Tab.Panel>

                    <Tab.Panel>
                        <div className="">
                            <LatePaymentPipeline />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default Overview;
