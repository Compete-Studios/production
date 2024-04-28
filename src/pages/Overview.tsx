import { useEffect } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import IconUsers from '../components/Icon/IconUsers';
import IconDollarSignCircle from '../components/Icon/IconDollarSignCircle';
import IconMenuDashboard from '../components/Icon/Menu/IconMenuDashboard';
import { setPageTitle } from '../store/themeConfigSlice';

import { UserAuth } from '../context/AuthContext';
import IconUsersGroup from '../components/Icon/IconUsersGroup';
import Schedules from './Marketing/Schedules';
import StudentPipeline from './Students/StudentPipeline';
import ProspectPipeline from './Prospects/ProspectPipeline';
import LatePaymentPipeline from './Payments/LatePaymentPipeline';
import MarketingMetrics from './Studios/MarketingMetrics';



const Overview = () => {
    const { suid }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });
  

  

    return (
        <div>
        <Tab.Group>
            <Tab.List className="flex flex-wrap">
                <Tab as={Fragment}>
                    {({ selected }) => (
                        <button
                            className={`${
                                selected ? 'text-info !outline-none before:!w-full' : ''
                            } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                        >
                            <IconMenuDashboard className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Overview
                        </button>
                    )}
                </Tab>
                <Tab as={Fragment}>
                    {({ selected }) => (
                        <button
                            className={`${
                                selected ? 'text-info !outline-none before:!w-full' : ''
                            } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                        >
                            <IconUsers className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Student Pipeline
                        </button>
                    )}
                </Tab>
                <Tab as={Fragment}>
                    {({ selected }) => (
                        <button
                            className={`${
                                selected ? 'text-info !outline-none before:!w-full' : ''
                            } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                        >
                            <IconUsersGroup className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Prospect Pipeline
                        </button>
                    )}
                </Tab>

                <Tab as={Fragment}>
                    {({ selected }) => (
                        <button
                            className={`${
                                selected ? 'text-info !outline-none before:!w-full' : ''
                            } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                        >
                            <IconDollarSignCircle className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Late Payment Pipeline
                        </button>
                    )}
                </Tab>
            </Tab.List>

            <Tab.Panels>
                <Tab.Panel>
                    <div className="active pt-5">
                        <MarketingMetrics />
                        <Schedules />
                    </div>
                </Tab.Panel>
                <Tab.Panel>
                    <div className="pt-5">
                        <StudentPipeline />
                    </div>
                </Tab.Panel>
                <Tab.Panel>
                    <div className="pt-5">
                        <ProspectPipeline />
                    </div>
                </Tab.Panel>

                <Tab.Panel>
                    <div className="pt-5">
                        <LatePaymentPipeline />
                    </div>
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    </div>
    );
};

export default Overview;
