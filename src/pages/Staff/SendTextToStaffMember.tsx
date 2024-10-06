import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconX from '../../components/Icon/IconX';
import IconSend from '../../components/Icon/IconSend';
import { UserAuth } from '../../context/AuthContext';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { getTextLogsByStudioIdAndPhoneNumber, sendIndividualEmail } from '../../functions/emails';
import { showErrorMessage, showMessage } from '../../functions/shared';
import IconMessage from '../../components/Icon/IconMessage';
import { sendAText } from '../../functions/api';
import IconChatDot from '../../components/Icon/IconChatDot';

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

export default function SendTextToStaffMember({ phone }: any) {
    const { studioOptions, suid }: any = UserAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [textMessage, setTextMessage] = useState<TextMessage>(textInit);
    const [texts, setTexts] = useState<any>([]);
    const [numberOfTextsToDisplay, setNumberOfTextsToDisplay] = useState<number>(5);
    const [loading, setLoading] = useState<boolean>(true);
    const [scrollBehavior, setScrollBehavior] = useState<boolean>(false);
    const [allTexts, setAllTexts] = useState<any>([]);

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

    const handleGetTexts = async () => {
        try {
            const textData = {
                phone: phone,
                studioId: suid,
            };
            console.log(textData, 'textData');
            const res = await getTextLogsByStudioIdAndPhoneNumber(textData);
            setTexts(res.recordset);
            console.log(res, 'res');
        } catch (error) {
            console.log(error);
        }
    };

    const handleScrollToBottomOfTexts = () => {
        const chatBox = document.querySelector('.chat-conversation-box');
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    useEffect(() => {
        if (texts.length > 0) {
            handleScrollToBottomOfTexts();
        }
    }, [texts, isOpen]);

    useEffect(() => {
        handleGetTexts();
    }, [suid, phone]);

    useEffect(() => {
        setTextMessage({
            ...textMessage,
            to: phone,
            studioId: suid,
            message: '',
        });
    }, []);

    const sendMessageHandle = (e: any) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const sendMessage = () => {
        console.log(textMessage);
        sendAText(textMessage).then((res) => {
            if (res.status === 200) {
                showMessage('Text Sent Successfully');
            } else {
                showMessage('Text Failed to Send, Please Try Again');
            }
        });
        setTextMessage({
            ...textMessage,
            message: '',
        });
        setTexts([...texts, { Body: textMessage.message, CreationDate: new Date(), ToNumber: textMessage.to }]);
        setIsOpen(false);
    };

    const handleRemoveOneBeginingOfFromPhoneNumber = (number: any) => {
        if (number.length === 11) {
            return number.slice(1);
        } else if (number.length === 12) {
            return number.slice(2);
        } else if (number.length === 13) {
            return number.slice(3);
        } else {
            return number;
        }
    };

    return (
        <div className="">
            <div className="mt-2">
                <button type="button" onClick={() => setIsOpen(true)} className="btn btn-secondary sm:w-64 w-full">
                    <IconMessage className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> Send Text
                </button>
            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-3xl my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-secondary dark:bg-secondary-dark text-white items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">Send Quick Text</h5>
                                        <button type="button" className="text-white" onClick={() => setIsOpen(false)}>
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <PerfectScrollbar className="relative h-full sm:h-[calc(100vh_-_200px)] chat-conversation-box">
                                        <div className="space-y-5 px-6 pb-96 sm:min-h-[300px] min-h-[400px]">
                                            <>
                                                {texts?.map((message: any, index: any) => {
                                                    return (
                                                        <div key={index}>
                                                            <div
                                                                className={`flex items-start gap-3 ${
                                                                    handleRemoveOneBeginingOfFromPhoneNumber(phone) === handleRemoveOneBeginingOfFromPhoneNumber(message.ToNumber) ? 'justify-end' : ''
                                                                }`}
                                                            >
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <div
                                                                            className={`dark:bg-gray-800 w-96 p-4 py-2 rounded-md break-all bg-black/10 ${
                                                                                handleRemoveOneBeginingOfFromPhoneNumber(phone) === handleRemoveOneBeginingOfFromPhoneNumber(message.ToNumber)
                                                                                    ? 'ltr:rounded-br-none rtl:rounded-bl-none !bg-primary text-white'
                                                                                    : 'ltr:rounded-bl-none rtl:rounded-br-none'
                                                                            }`}
                                                                        >
                                                                            {message.Body}
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={`text-xs text-white-dark ${
                                                                            handleRemoveOneBeginingOfFromPhoneNumber(phone) === handleRemoveOneBeginingOfFromPhoneNumber(message.ToNumber)
                                                                                ? 'ltr:text-right rtl:text-left'
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        {generateTimeAgoWithDateTimeStamp(message.CreationDate) || '5h ago'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        </div>
                                    </PerfectScrollbar>
                                    <div className="p-4 absolute bottom-0 left-0 w-full bg-white">
                <div className="sm:flex w-full space-x-3 rtl:space-x-reverse items-center">
                    <div className="relative flex-1">
                        <textarea
                            className="form-input rounded-md border-0 bg-[#f4f4f4] pr-12 focus:outline-none py-2"
                            placeholder="Type a message"
                            rows={8}
                            value={textMessage.message}
                            onChange={(e) => setTextMessage({ ...textMessage, message: e.target.value })}
                            onKeyUp={sendMessageHandle}
                        />
                    </div>
                </div>
                <button type="button" className="btn btn-info ml-auto gap-1" onClick={() => sendMessage()}>
                    <IconSend /> Send Text
                </button>
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
