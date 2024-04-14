import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import IconUsersGroup from '../../components/Icon/IconUsersGroup';
import IconUsers from '../../components/Icon/IconUsers';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import StudentPipeline from '../Students/StudentPipeline';

const Pipelines = () => {
    return (
        <div>
            <Tab.Group>
                <Tab.List className="mt-3 flex flex-wrap">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'text-secondary !outline-none before:!w-full' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
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
                                    selected ? 'text-secondary !outline-none before:!w-full' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
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
                                    selected ? 'text-secondary !outline-none before:!w-full' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
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
                        <h4 className="mb-4 text-2xl font-semibold">We move your world!</h4>
                        <p className="mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>
                </Tab.Panel>
                <Tab.Panel>
                    <div>
                        <StudentPipeline />
                    </div>
                </Tab.Panel>
                <Tab.Panel>
                    <div className="pt-5">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                </Tab.Panel>
            </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default Pipelines;
