import IconChatDot from '../../components/Icon/IconChatDot';
import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import { sendAText } from '../../functions/api';
import { showErrorMessage, showMessage } from '../../functions/shared';
import { getTextLogsByStudioIdAndPhoneNumber } from '../../functions/emails';
import PerfectScrollbar from 'react-perfect-scrollbar';
import IconSend from '../../components/Icon/IconSend';
import IconArrowForward from '../../components/Icon/IconArrowForward';

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

export default function ChatModal({ chatDataForText, isOutgoing, isOpen, setIsOpen }: any) {
    const { suid, studioOptions }: any = UserAuth();
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
            return Math.floor(minutes) > 1 ? `${Math.floor(minutes)} minutes ago` : `${Math.floor(minutes)} minute ago`;
        } else if (hours < 24) {
            return Math.floor(hours) > 1 ? `${Math.floor(hours)} hours ago` : `${Math.floor(hours)} hour ago`;
        } else if (days < 7) {
            return Math.floor(days) > 1 ? `${Math.floor(days)} days ago}` : `${Math.floor(days)} day ago`;
        } else if (weeks < 4) {
            return Math.floor(weeks) > 1 ? `${Math.floor(weeks)} weeks ago` : `${Math.floor(weeks)} week ago`;
        } else if (months < 12) {
            return Math.floor(months) > 1 ? `${Math.floor(months)} months ago` : `${Math.floor(months)} month ago`;
        } else {
            return Math.floor(years) > 1 ? `${Math.floor(years)} years ago` : `${Math.floor(years)} year ago`;
        }
    };

    const removeNumber = (number: any) => {
        if (typeof number !== 'string') {
            return ''; // or handle appropriately based on your logic
        }

        if (number[0] === '+') {
            return number.slice(2).replace(/\s/g, '');
        } else if (number[0] === '1') {
            return number.slice(1).replace(/\s/g, '');
        } else {
            return number.replace(/\s/g, '');
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setNumberOfTextsToDisplay(5);
            setTextMessage({
                ...textMessage,
                message: '',
            });
            setLoading(true);
            setTexts([]);
        }
    }, [isOpen]);

    const handleGetTextMessages = async () => {
        const data = {
            studioId: suid,
            phone: isOutgoing ? chatDataForText?.recipients[0]?.phoneNumber : chatDataForText.rawNumber,
        };
        try {
            const res = await getTextLogsByStudioIdAndPhoneNumber(data);

            //sort based on SendDate
            const sortedData = res.recordset.sort((a: any, b: any) => new Date(a.CreationDate).getTime() - new Date(b.CreationDate).getTime());

            // rrun removeNumber on all FromNumber and ToNumber
            const filteredData = sortedData.map((message: any) => {
                return {
                    ...message,
                    FromNumber: removeNumber(message.FromNumber),
                    ToNumber: removeNumber(message.ToNumber),
                };
            });
            setLoading(false);
            setAllTexts(filteredData);
        } catch (error) {
            console.log(error);
            setLoading(false);
            showErrorMessage('Failed to Retrieve Texts');
        }
    };

    useEffect(() => {
        if (isOpen) {
            console.log('retrieving texts for:', chatDataForText.rawNumber);
            handleGetTextMessages();
        }
    }, [suid, isOpen]);

    // useEffect(() => {
    //     if (isOpen) {
    //         setTextMessage({
    //             ...textMessage,
    //             to: '7193184101',
    //             studioId: suid,
    //             message: '',
    //         });
    //     }
    // }, [suid]);

    const scrollToTop = () => {
        const chat = document.getElementById('chattotop');
        if (chat) {
            chat.scrollTop = 0;
        }
    };

    useEffect(() => {
        if (allTexts.length > numberOfTextsToDisplay) {
            const slicedData = allTexts.slice(allTexts.length - numberOfTextsToDisplay);
            setTexts(slicedData);
        } else {
            setTexts(allTexts);
        }
    }, [allTexts, numberOfTextsToDisplay]);

    const handleLoadMoreTexts = async () => {
        setNumberOfTextsToDisplay(numberOfTextsToDisplay + 5);
        scrollToTop();
    };

    const sendMessage = (e: any) => {
        e.preventDefault();
        const data = {
            to: isOutgoing ? chatDataForText?.recipients[0]?.phoneNumber : chatDataForText.rawNumber,
            studioId: suid,
            message: textMessage.message,
        };
        sendAText(data).then((res) => {
            if (res.status === 200) {
                showMessage('Text Sent Successfully');
                setTextMessage({
                    ...textMessage,
                    message: '',
                });
                setIsOpen(false);
            } else {
                showErrorMessage('Text Failed to Send, Please Try Again');
            }
        });
    };

    const scrollToBottom = () => {
        const chat = document.getElementById('chat');
        if (chat) {
            chat.scrollTop = chat.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [scrollBehavior]);

    return (
        <div>
            <div className="mb-5">
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                            <div className="flex items-center justify-center min-h-full px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-2xl my-8 text-black dark:text-white-dark">
                                        <div className="flex bg-info sticky top-0 dark:bg-info-dark items-center justify-between px-5 py-3 text-white dark:text-black h-full " id="chattop">
                                            <h5 className="font-bold text-lg">Send Text</h5>
                                            <button type="button" className="text-white dark:text-black" onClick={() => setIsOpen(false)}>
                                                <IconX />
                                            </button>
                                        </div>
                                        <PerfectScrollbar className="relative h-full sm:h-[calc(100vh_-_200px)] chat-conversation-box" id="chat">
                                            <div className="space-y-5 px-6 pb-44 sm:min-h-[300px] min-h-[400px]">
                                                <>
                                                    {loading && (
                                                        <div className="flex items-center justify-center h-96">
                                                            <IconChatDot className="w-20 h-20 text-gray-300 dark:text-gray-700 " />
                                                        </div>
                                                    )}
                                                    {allTexts?.length > numberOfTextsToDisplay ? (
                                                        <div className="flex items-center justify-center py-12">
                                                            <button type="button" className="mx-auto text-info hover:text-blue-900" onClick={handleLoadMoreTexts}>
                                                                Load More
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center py-12">
                                                            <span className="mx-auto text-info">No More Messages</span>
                                                        </div>
                                                    )}

                                                    <div className="space-y-6">
                                                        {texts?.map((message: any, index: any) => {
                                                            return (
                                                                <div key={index}>
                                                                    <div
                                                                        className={`flex items-start gap-3 ${message.FromNumber === removeNumber(studioOptions?.TextFromNumber) ? 'justify-end' : ''}`}
                                                                    >
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center gap-3">
                                                                                {message.FromNumber === removeNumber(studioOptions?.TextFromNumber) && (
                                                                                    <div className="text-xs text-white-dark ltr:text-right rtl:text-left">
                                                                                        {generateTimeAgoWithDateTimeStamp(message.CreationDate) || ''}
                                                                                    </div>
                                                                                )}
                                                                                <div
                                                                                    className={`dark:bg-gray-800 w-96 p-4 py-2 rounded-md break-all bg-black/10 ${
                                                                                        message.FromNumber === removeNumber(studioOptions?.TextFromNumber)
                                                                                            ? 'ltr:rounded-br-none rtl:rounded-bl-none !bg-secondary text-white'
                                                                                            : 'ltr:rounded-bl-none rtl:rounded-br-none'
                                                                                    }`}
                                                                                >
                                                                                    {message.Body}
                                                                                </div>
                                                                                {message.FromNumber !== removeNumber(studioOptions?.TextFromNumber) && (
                                                                                    <div className="text-xs text-white-dark ltr:text-right rtl:text-left">
                                                                                        {generateTimeAgoWithDateTimeStamp(message.CreationDate) || ''}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                                <div className="p-4 fixed bottom-0 left-0 w-full bg-white">
                                                    <div className="sm:flex w-full space-x-3 rtl:space-x-reverse items-center">
                                                        <div className="relative flex items-center w-full">
                                                            <textarea
                                                                className="form-input rounded-md border-0 bg-[#f4f4f4] pr-12 focus:outline-none py-2"
                                                                placeholder="Type a message"
                                                                rows={2}
                                                                value={textMessage.message}
                                                                onChange={(e) => setTextMessage({ ...textMessage, message: e.target.value })}
                                                            />
                                                            <button type="button" className="h-full px-4 text-gray-400 hover:text-gray-500" onClick={(e) => sendMessage(e)}>
                                                                {' '}
                                                                <IconSend />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </PerfectScrollbar>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
}
