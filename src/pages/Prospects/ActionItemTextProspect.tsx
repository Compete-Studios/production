import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import 'flatpickr/dist/flatpickr.css';
import IconX from '../../components/Icon/IconX';
import SendText from '../Students/components/SendText';
import IconChatDot from '../../components/Icon/IconChatDot';

export default function ActionItemTextProspect({ student, pipeline }: any) {
    const [showTextActionModal, setTextShowActionModal] = useState(false);
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
            <div className="flex items-center gap-2 justify-end">
                <button type="button" className="btn btn-danger btn-sm flex items-center gap-1 h-8" onClick={() => setTextShowActionModal(true)}>
                <span className="hidden md:block">Send Text</span><span className="md:hidden block"><IconChatDot /></span>
                </button>
            </div>
            <Transition.Root show={showTextActionModal} as={Fragment}>
                <Dialog className="relative z-50" onClose={setTextShowActionModal}>
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
                                                                Action Text <span className="font-bold text-primary">{pipeline?.StepName}</span>{' '}
                                                            </Dialog.Title>
                                                            <p className="text-sm text-gray-500">This action toolbar allows you to quickly email, text, add notes, or update the student step.</p>
                                                            <h4 className="text-lg font-medium text-gray-900 dark:text-white-dark pt-4">Student: <span className='text-secondary'>{student?.FName} {student?.LName}</span></h4> 
                                                        </div>

                                                        <div className="flex h-7 items-center">
                                                            <button type="button" className="relative text-gray-400 hover:text-gray-500" onClick={() => setTextShowActionModal(false)}>
                                                                <span className="absolute -inset-2.5" />
                                                                <span className="sr-only">Close panel</span>
                                                                <IconX className="h-6 w-6" aria-hidden="true" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Divider container */}
                                                <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                                                    <SendText defaultText={pipeline} student={student} setDefaultTab={setDefaultTab} />
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
