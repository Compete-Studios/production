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

const textInit = {
    to: '',
    studioId: '',
    message: '',
};

export default function SendText({ defaultText, studioOptions, student, setShowActionModal }: any) {
    const { suid, studioInfo } = UserAuth();
    const [textMessage, setTextMessage] = useState<any>(textInit);
    const [selectedUser, setSelectedUser] = useState<any>({});
    const [texts, setTexts] = useState<any>([]);
    const [loginUser, setLoginUser] = useState<any>({});

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
        try {
            getTextLogsByStudioIdAndPhoneNumber(suid, student?.Phone).then((res) => {
                setTexts(res.recordset);
            });
        } catch (error) {
            console.log(error);
        }
    }, [suid]);

    useEffect(() => {
        setTextMessage({
            ...textMessage,
            to: student?.Phone,
            studioId: suid,
            message: defaultText?.DefaultSMSText,
        });
    }, [defaultText]);

    console.log(defaultText);

    const sendMessageHandle = (e: any) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const sendMessage = () => {
        // sendAText(text).then((res) => {
        //     console.log(res);
        // });
        setTextMessage(textInit);
    };

    return (
        <div>
            <PerfectScrollbar className="relative h-full sm:h-[calc(100vh_-_300px)] chat-conversation-box">
                <div className="space-y-5 px-6 pb-36 sm:min-h-[300px] min-h-[400px]">
                    <div className="block m-6 mt-0">
                        <h4 className="text-xs text-center border-b border-[#f4f4f4] dark:border-gray-800 relative">
                            <span className="relative top-2 px-3 bg-white dark:bg-black">{'Today, ' + selectedUser.time}</span>
                        </h4>
                    </div>

                    <>
                        {texts?.map((message: any, index: any) => {
                            return (
                                <div key={index}>
                                    <div className={`flex items-start gap-3 ${student?.Phone === message.ToNumber ? 'justify-end' : ''}`}>
                                        <div className={`flex-none ${student?.Phone === message.ToNumber ? 'order-2' : ''}`}>
                                            {student?.Phone === message.ToNumber ? (
                                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                                                    <span className="font-medium leading-none text-white">{studioInfo?.Studio_Name[0]}</span>
                                                </span>
                                            ) : (
                                                ''
                                            )}

                                            {student?.Phone !== message.ToNumber ? (
                                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                                                    <span className="font-medium leading-none text-white">
                                                        {student?.FName[0]} {student?.LName[0]}
                                                    </span>
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`dark:bg-gray-800 w-96 p-4 py-2 rounded-md break-all bg-black/10 ${
                                                        student?.Phone === message.ToNumber
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
                                            <div className={`text-xs text-white-dark ${student?.Phone === message.ToNumber ? 'ltr:text-right rtl:text-left' : ''}`}>
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
                        <input
                            className="form-input rounded-full border-0 bg-[#f4f4f4] px-12 focus:outline-none py-2"
                            placeholder="Type a message"
                            value={textMessage.message}
                            onChange={(e) => setTextMessage({ ...textMessage, message: e.target.value })}
                            onKeyUp={sendMessageHandle}
                        />
                        <button type="button" className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 hover:text-primary">
                            <IconMoodSmile />
                        </button>
                        <button type="button" className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 hover:text-primary" onClick={() => sendMessage()}>
                            <IconSend />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
