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

export default function ActionItem({ student, pipeline, update, setUpdate }: any) {
    const [showActionModal, setShowActionModal] = useState(false);

    return (
        <div>
            <div className="hidden md:flex  items-center gap-2 justify-end">
                <button type="button" className="btn btn-info btn-sm flex items-center gap-1 w-full" onClick={() => setShowActionModal(true)}>
                    <IconBolt fill={true} className="h-4 w-4" /> Update Step
                </button>
            </div>
            <div className="md:hidden flex  items-center gap-2 justify-end">
                <Tippy content="Update Step">
                    <button type="button" className="btn btn-info btn-sm flex items-center gap-1" onClick={() => setShowActionModal(true)}>
                        <IconBolt fill={true} />
                    </button>
                </Tippy>
            </div>
            <Transition.Root show={showActionModal} as={Fragment}>
                <Dialog className="relative z-50" onClose={setShowActionModal}>
                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                                        <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                            <div className="flex-1">
                                                {/* Header */}
                                                <div className="bg-gray-50 px-4 py-6 sm:px-6">
                                                    <div className="flex items-start justify-between space-x-3">
                                                        <div className="space-y-1">
                                                            <Dialog.Title className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ">
                                                                Action Pipeline Step <span className="font-bold text-primary">{pipeline?.StepName}</span>{' '}
                                                            </Dialog.Title>
                                                            <p className="text-sm text-gray-500">This action toolbar allows you to quickly email, text, add notes, or update the student step.</p>
                                                            <h4 className="text-lg font-medium text-gray-900 dark:text-white-dark pt-4">
                                                                Student:{' '}
                                                                <span className="text-secondary">
                                                                    {student?.FName} {student?.LName}
                                                                </span>
                                                            </h4>
                                                        </div>

                                                        <div className="flex h-7 items-center">
                                                            <button type="button" className="relative text-gray-400 hover:text-gray-500" onClick={() => setShowActionModal(false)}>
                                                                <span className="absolute -inset-2.5" />
                                                                <span className="sr-only">Close panel</span>
                                                                <IconX className="h-6 w-6" aria-hidden="true" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Divider container */}
                                                <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 px-5 mt-8">
                                                    <QuickUpdate student={student} setShowActionModal={setShowActionModal} setUpdate={setUpdate} update={update} />
                                                </div>
                                            </div>
                                        </form>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
}
