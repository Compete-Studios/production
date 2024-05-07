import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import 'flatpickr/dist/flatpickr.css';
import { Tab } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import IconBolt from '../../components/Icon/IconBolt';
import IconMail from '../../components/Icon/IconMail';
import IconMessage2 from '../../components/Icon/IconMessage2';
import IconNotes from '../../components/Icon/IconNotes';
import IconListCheck from '../../components/Icon/IconListCheck';
import SendMail from './components/SendMail';
import SendText from './components/SendText';
import QuickUpdate from './components/QuickUpdate';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function ViewStudentActionItem({ student, pipeline, studioOptions, update, setUpdate }: any) {
    const [showActionModal, setShowActionModal] = useState(false);
    const [expandedDescription, setExpandedDescription] = useState(false);
    const [defaultTab, setDefaultTab] = useState(0);

    const description = pipeline?.Description || '';

    const toggleDescription = () => {
        setExpandedDescription(!expandedDescription);
    };

    const renderDescription = () => {
        if (!description) return null;

        const lines = description.split('\n');
        const maxLines = 3;

        if (lines.length <= maxLines || expandedDescription) {
            return (
                <div>
                    Description: <span className="text-primary">{description}</span>
                    {expandedDescription && (
                        <button className="text-info px-5 mt-1 underline" onClick={toggleDescription}>
                            Read Less
                        </button>
                    )}
                </div>
            );
        } else {
            return (
                <div>
                    <p>
                        Description: <span className="text-primary">{description?.slice(0, description.indexOf('\n', description.indexOf('\n') + 1))}</span>
                        <button className="text-info px-5 mt-1 underline" onClick={toggleDescription}>
                            Read more
                        </button>
                    </p>
                </div>
            );
        }
    };
    return (
        <div>
            <div>
                <Tippy content="Action Item">
                    <button type="button" className=" btn btn-info flex items-center justify-center rounded-full w-10 h-10 p-0" onClick={() => setShowActionModal(true)}>
                        <IconBolt fill={true} />
                    </button>
                </Tippy>
            </div>
            <Transition appear show={showActionModal} as={Fragment}>
                <Dialog as="div" open={showActionModal} onClose={() => setShowActionModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-3xl text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setShowActionModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 pt-3 ltr:pr-[50px] rtl:pl-[50px]">Action Item</div>
                                    <p className="pl-5">This action toolbar allows you to quickly email, text, add notes, or update the student step.</p>
                                    <p className="pl-5 font-semibold mt-4">
                                        Current Step: <span className="text-primary">{pipeline?.StepName}</span>
                                    </p>
                                    <p className="pl-5 font-semibold mt-4">{renderDescription()}</p>
                                    <div className="p-5">
                                        <Tab.Group selectedIndex={defaultTab} onChange={setDefaultTab}>
                                            <Tab.List className="flex border-b border-info dark:border-info ">
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? 'bg-info text-white !outline-none' : ''}
                                                    before:inline-block' -mb-[1px] flex items-center justify-center  rounded-t p-3.5 py-2 hover:bg-info hover:text-white w-full  whitespace-nowrap `}
                                                        >
                                                            <IconMail className="ltr:mr-2 rtl:ml-2" />
                                                            Email Student
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? 'bg-info text-white !outline-none' : ''}
                                                    before:inline-block' -mb-[1px] flex items-center justify-center rounded-t p-3.5 py-2 hover:bg-info hover:text-white w-full  whitespace-nowrap `}
                                                        >
                                                            <IconMessage2 className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                            Text Student
                                                        </button>
                                                    )}
                                                </Tab>

                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? 'bg-info text-white !outline-none' : ''}
                                                    before:inline-block' -mb-[1px] flex items-center justify-center  rounded p-3.5 py-2 hover:bg-info hover:text-white w-full  whitespace-nowrap `}
                                                        >
                                                            <IconListCheck className="ltr:mr-2 rtl:ml-2" />
                                                            Update Student & Add Notes
                                                        </button>
                                                    )}
                                                </Tab>
                                            </Tab.List>

                                            <Tab.Panels>
                                                <Tab.Panel>
                                                    <div>
                                                        <SendMail
                                                            pipeline={pipeline}
                                                            studioOptions={studioOptions}
                                                            student={student}
                                                            setShowActionModal={setShowActionModal}
                                                            setDefaultTab={setDefaultTab}
                                                        />
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div className="pt-8">
                                                        <SendText defaultText={pipeline} student={student} setDefaultTab={setDefaultTab} />
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div className="pt-8">
                                                        <QuickUpdate student={student} setShowActionModal={setShowActionModal} setUpdate={setUpdate} update={update} />
                                                    </div>
                                                </Tab.Panel>
                                            </Tab.Panels>
                                        </Tab.Group>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
