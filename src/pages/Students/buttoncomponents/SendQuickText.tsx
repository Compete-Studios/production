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

export default function SendQuickText({ student }: any) {
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
                <Tippy content="Send Text">
                    <button className="btn btn-secondary flex items-center justify-center rounded-full w-10 h-10 p-0" onClick={() => setShowChatModal(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-text" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                        </svg>
                    </button>
                </Tippy>
            </div>
            <Transition appear show={showChatModal} as={Fragment}>
                <Dialog as="div" open={showChatModal} onClose={() => setShowChatModal(false)} className="relative z-[51]">
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
                                        onClick={() => setShowChatModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        Compose Text To:{' '}
                                        <span className="text-primary font-bold">
                                            {student?.First_Name} {student?.Last_Name}
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <form className="space-y-8">
                                            <div>
                                                <label htmlFor="to">To Number:</label>
                                                <input
                                                    id="title"
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Phone Number"
                                                    value={textMessage.to}
                                                    onChange={(e) => setTextMessage({ ...textMessage, to: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="message">Message:</label>
                                                <textarea
                                                    id="message"
                                                    rows={8}
                                                    className="form-input"
                                                    placeholder="Enter Message"
                                                    value={textMessage.message}
                                                    onChange={(e) => setTextMessage({ ...textMessage, message: e.target.value })}
                                                />
                                            </div>
                                            <div className="flex items-center ltr:ml-auto rtl:mr-auto mt-8">
                                                <button type="button" className="ml-auto btn btn-outline-danger ltr:mr-3 rtl:ml-3" onClick={() => setShowChatModal(false)}>
                                                    Close
                                                </button>
                                                <button type="button" className="btn btn-primary" onClick={sendMessage}>
                                                    Send
                                                </button>
                                            </div>
                                        </form>
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
