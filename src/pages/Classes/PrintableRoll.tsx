import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Tab } from '@headlessui/react';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconX from '../../components/Icon/IconX';
import IconPrinter from '../../components/Icon/IconPrinter';
import { UserAuth } from '../../context/AuthContext';

export default function PrintableRoll({ classes }: any) {
    const [showQuickPayModal, setShowQuickPayModal] = useState(false);

    return (
        <div>
            <div>
                <button type="button" className="btn btn-secondary gap-2 ltr:ml-auto rtl:mr-auto" onClick={() => setShowQuickPayModal(true)}>
                    <IconPrinter />
                    Printable Roll
                </button>
            </div>
            <Transition appear show={showQuickPayModal} as={Fragment}>
                <Dialog as="div" open={showQuickPayModal} onClose={() => setShowQuickPayModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-start justify-center px-4 py-8">
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
                                        onClick={() => setShowQuickPayModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Printable Roll</div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-x-4">
                                            <div className="w-2/3">
                                                <label className="text-sm">Select Class</label>
                                                <select className="form-select">
                                                    <option>Choose a Class</option>
                                                    {classes.map((item: any) => (
                                                        <option key={item.ClassId}>{item.Name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-1/3">
                                                <label className="text-sm">Select Month</label>

                                                <select className="form-select">
                                                    <option>Choose a Month</option>
                                                    <option value="this month">This Month</option>
                                                    <option value="next month">Next Month</option>
                                                    <option value="last month">Last Month</option>
                                                    
                                                    
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex">
                                            <input type="checkbox" className="form-checkbox" />
                                            <label className="text-sm">Include Prospective Students</label>
                                        </div>
                                        <div className="mt-4 flex">
                                            <input type="checkbox" className="form-checkbox" />
                                            <label className="text-sm">Add additional blank lines</label>
                                        </div>
                                        <div className="mt-4 flex">
                                            <button type="button" className="ml-auto btn btn-secondary gap-x-2">
                                                <IconPrinter /> Generate and Print Roll
                                            </button>
                                        </div>
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
