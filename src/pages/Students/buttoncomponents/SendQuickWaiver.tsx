import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import 'flatpickr/dist/flatpickr.css';
import { Tab } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';
import IconX from '../../../components/Icon/IconX';
import { UserAuth } from '../../../context/AuthContext';
import { getTextLogsByStudioIdAndPhoneNumber, sendIndividualEmail } from '../../../functions/emails';
import { getWaiverByStudioId, sendAText } from '../../../functions/api';
import { showErrorMessage, showMessage } from '../../../functions/shared';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EmailData {
    to: string;
    from: string;
    subject: string;
    html: string;
    deliverytime: any;
}

const emailDataInit = {
    to: '',
    from: '',
    subject: 'Waiver - Please Sign and Return',
    html: '',
    deliverytime: null,
};

export default function SendQuickWaiver({ student }: any, prospect = false) {
    const { suid, studioOptions }: any = UserAuth();
    const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
    const [emailData, setEmailData] = useState<EmailData>(emailDataInit);
    const [emailHtml, setEmailHtml] = useState<any>('');

    useEffect(() => {
        setEmailData({ ...emailData, to: student?.email || student?.Email, from: studioOptions?.EmailFromAddress });
    }, [student]);

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setEmailData({ ...emailData, [id]: value });
    };

    const handleSendEmail = () => {
        console.log(emailData);
        const data = {
            studioId: suid,
            email: {
                to: emailData.to,
                from: emailData.from,
                subject: emailData.subject,
                html: emailHtml,
                deliverytime: null,
            },
        };
        sendIndividualEmail(data).then((res) => {
            console.log(res);
            if (res.status === 200) {
                showMessage('Email Sent Successfully');
                setEmailData({
                    ...emailData,
                    subject: '',
                    html: '',
                });
                setShowEmailModal(false);
            } else {
                showErrorMessage('Email Failed to Send, Please Try Again');
            }
        });
    };

    const handleGetWaiver = async () => {
        try {
            const response = await getWaiverByStudioId(suid);
            setEmailHtml(response?.recordset[0]?.WaiverBody);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleGetWaiver();
    }, []);

    return (
        <div>
            <div>
                {prospect ? (
                    <button className="uppercase font-lg font-bold w-full hover:bg-success-light p-4 text-left" onClick={() => setShowEmailModal(true)}>Send Waiver</button>
                ) : (
                    <Tippy content="Send Email">
                        <button className="btn btn-danger flex items-center justify-center rounded-full w-10 h-10 p-0" onClick={() => setShowEmailModal(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                            </svg>
                        </button>
                    </Tippy>
                )}
            </div>
            <Transition appear show={showEmailModal} as={Fragment}>
                <Dialog as="div" open={showEmailModal} onClose={() => setShowEmailModal(false)} className="relative z-[51]">
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
                                        onClick={() => setShowEmailModal(false)}
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
                                        <form className="p-6 grid gap-6">
                                            <select id="acno" name="acno" className="form-select flex-1" value={emailData.from} onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}>
                                                <option value="" disabled>
                                                    Select Email
                                                </option>
                                                <option value={studioOptions?.EmailFromAddress}>{studioOptions?.EmailFromAddress}</option>
                                                <option value={studioOptions?.EmailFromAddress2}>{studioOptions?.EmailFromAddress2}</option>
                                                <option value={studioOptions?.EmailFromAddress3}>{studioOptions?.EmailFromAddress3}</option>
                                            </select>
                                            <div>
                                                <input id="to" type="text" className="form-input" placeholder="Enter To" defaultValue={emailData.to} onChange={changeValue} />
                                            </div>

                                            <div>
                                                <input
                                                    id="title"
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Enter Subject"
                                                    value={emailData.subject}
                                                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                                />
                                            </div>

                                            <div className="h-fit">
                                                <ReactQuill 
                                                theme="snow" 
                                                value={emailHtml} 
                                                style={{ minHeight: '200px' }}
                                                 onChange={setEmailHtml} />
                                            </div>

                                            <div>
                                                <input
                                                    type="file"
                                                    className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                                                    multiple
                                                    accept="image/*,.zip,.pdf,.xls,.xlsx,.txt.doc,.docx"
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-center ltr:ml-auto rtl:mr-auto mt-8">
                                                <button type="button" className="btn btn-outline-danger ltr:mr-3 rtl:ml-3" onClick={() => setShowEmailModal(false)}>
                                                    Close
                                                </button>
                                                <button type="button" className="btn btn-primary" onClick={handleSendEmail}>
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
