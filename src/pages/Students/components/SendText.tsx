import React, { useEffect, useState } from 'react';
import IconSend from '../../../components/Icon/IconSend';
import IconMoodSmile from '../../../components/Icon/IconMoodSmile';
import IconMicrophoneOff from '../../../components/Icon/IconMicrophoneOff';
import IconDownload from '../../../components/Icon/IconDownload';
import IconCamera from '../../../components/Icon/IconCamera';
import IconHorizontalDots from '../../../components/Icon/IconHorizontalDots';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { getTextLogsByStudioIdAndPhoneNumber } from '../../../functions/emails';
import { UserAuth } from '../../../context/AuthContext';
import { sendAText } from '../../../functions/api';
import { showMessage } from '../../../functions/shared';

const textInit = {
    to: '',
    studioId: '',
    message: '',
};

export default function SendText({ defaultText, student, setDefaultTab }: any) {
    const { suid, studioInfo }: any = UserAuth();
    const [textMessage, setTextMessage] = useState<any>(textInit);
    const [selectedUser, setSelectedUser] = useState<any>({});
    const [texts, setTexts] = useState<any>([]);

    console.log(defaultText, 'defaultText');

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
                phone: student?.Phone,
                studioId: suid,
            };
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
    }, [texts]);

    useEffect(() => {
        handleGetTexts();
    }, [suid]);

    useEffect(() => {
        setTextMessage({
            ...textMessage,
            to: student?.Phone,
            studioId: suid,
            message: defaultText?.DefaultSMSText,
        });
    }, [defaultText]);

    const sendMessageHandle = (e: any) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const sendMessage = () => {
        console.log(textMessage);
        sendAText(textMessage).then((res) => {
            if (res.status === 200) {
                setDefaultTab(2);
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
    }


    return (
        <div className="h-96">
            <div className="px-12 py-4 flex items-center gap-4">
                <label htmlFor="to" className=" whitespace-nowrap">
                    To Number:
                </label>
                <input id="title" type="text" className="form-input" placeholder="Phone Number" value={textMessage.to} onChange={(e) => setTextMessage({ ...textMessage, to: e.target.value })} />
            </div>
            <div className="block m-6 mt-0">
                <h4 className="text-xs text-center border-b border-[#f4f4f4] dark:border-gray-800 relative">
                    <span className="relative top-2 px-3 bg-white dark:bg-black">{'This Week, ' + new Date().toLocaleDateString()}</span>
                </h4>
            </div>

            <PerfectScrollbar className="relative h-full sm:h-[calc(100vh_-_200px)] chat-conversation-box">
                <div className="space-y-5 px-6 pb-96 sm:min-h-[300px] min-h-[400px]">
                    <>
                        {texts?.map((message: any, index: any) => {
                            return (
                                <div key={index}>
                                    <div className={`flex items-start gap-3 ${handleRemoveOneBeginingOfFromPhoneNumber(student?.Phone) === handleRemoveOneBeginingOfFromPhoneNumber(message.ToNumber) ? 'justify-end' : ''}`}>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`dark:bg-gray-800 w-96 p-4 py-2 rounded-md break-all bg-black/10 ${
                                                        handleRemoveOneBeginingOfFromPhoneNumber(student?.Phone) === handleRemoveOneBeginingOfFromPhoneNumber(message.ToNumber)
                                                            ? 'ltr:rounded-br-none rtl:rounded-bl-none !bg-primary text-white'
                                                            : 'ltr:rounded-bl-none rtl:rounded-br-none'
                                                    }`}
                                                >
                                                    {message.Body}
                                                </div>
                                                <div className={`${selectedUser.userId === message.fromUserId ? 'hidden' : ''}`}>
                                                    <IconMoodSmile className="hover:text-primary" />
                                                </div>
                                            </div>
                                            <div className={`text-xs text-white-dark ${handleRemoveOneBeginingOfFromPhoneNumber(student?.Phone) === handleRemoveOneBeginingOfFromPhoneNumber(message.ToNumber) ? 'ltr:text-right rtl:text-left' : ''}`}>
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
        </div>
    );
}
