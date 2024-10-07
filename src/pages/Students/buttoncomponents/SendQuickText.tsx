import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import 'flatpickr/dist/flatpickr.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';
import IconX from '../../../components/Icon/IconX';
import { UserAuth } from '../../../context/AuthContext';
import { sendAText } from '../../../functions/api';
import { showErrorMessage, showMessage } from '../../../functions/shared';
import SendText from '../components/SendText';
import IconMessage from '../../../components/Icon/IconMessage';

interface TextMessage {
    to: string;
    studioId: string;
    message: string;
}

const textInit = {
    to: '',
    studioId: '',
    message: '',
};

export default function SendQuickText({ student, name, pipeline }: any) {
    const { suid, studioOptions }: any = UserAuth();
    const [showChatModal, setShowChatModal] = useState<boolean>(false);
    const [textMessage, setTextMessage] = useState<TextMessage>(textInit);
    const [selectedUser, setSelectedUser] = useState<any>({});
    const [texts, setTexts] = useState<any>([]);

    const generateTimeAgoWithDateTimeStamp = (dateString: any) => {
        const date = new Date(dateString);
        const milliseconds = date.getTime();
        const now = new Date().getTime();
        const timeDifference = now - milliseconds;
        const secondsDiff = timeDifference / 1000;
        const minutes = secondsDiff / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        const weeks = days / 7;
        const months = weeks / 4;
        const years = months / 12;

        if (secondsDiff < 60) {
            return `${Math.floor(secondsDiff)} seconds ago`;
        } else if (minutes < 60) {
            return `${Math.floor(minutes)} minutes ago`;
        } else if (hours < 24) {
            return `${Math.floor(hours)} hours ago`;
        } else if (days < 7) {
            return `${Math.floor(days)} days ago`;
        } else if (weeks < 4) {
            return `${Math.floor(weeks)} weeks ago`;
        } else if (months < 12) {
            return `${Math.floor(months)} months ago`;
        } else {
            return `${Math.floor(years)} years ago`;
        }
    };

    useEffect(() => {
        setTextMessage({
            ...textMessage,
            to: student?.Phone,
            studioId: suid,
            message: '',
        });
    }, [student, suid]);

    const sendMessage = () => {
        sendAText(textMessage).then((res) => {
            if (res.status === 200) {
                showMessage('Text Sent Successfully');
                setShowChatModal(false);
                setTextMessage({
                    ...textMessage,
                    message: '',
                });
            } else {
                showErrorMessage('Text Failed to Send, Please Try Again');
            }
        });
    };

    return (
        <div>
            <div>
                <Tippy content="Send Text" placement="top">
                    <button type="button" className="btn btn-secondary w-10 h-10 p-0 rounded-full" onClick={() => setShowChatModal(true)}>
                        <IconMessage />
                    </button>
                </Tippy>
            </div>
            <Transition.Root show={showChatModal} as={Fragment}>
                <Dialog className="relative z-50" onClose={setShowChatModal}>
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
                                                            <h4 className="text-lg font-medium text-gray-900 dark:text-white-dark pt-4">
                                                                Student:{' '}
                                                                <span className="text-secondary">
                                                                    {student?.First_Name} {student?.Last_Name}
                                                                </span>
                                                            </h4>
                                                        </div>

                                                        <div className="flex h-7 items-center">
                                                            <button type="button" className="relative text-gray-400 hover:text-gray-500" onClick={() => setShowChatModal(false)}>
                                                                <span className="absolute -inset-2.5" />
                                                                <span className="sr-only">Close panel</span>
                                                                <IconX className="h-6 w-6" aria-hidden="true" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Divider container */}
                                                <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                                                    <SendText defaultText={pipeline} student={student} />
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
