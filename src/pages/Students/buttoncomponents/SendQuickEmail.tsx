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
import { sendAText } from '../../../functions/api';
import { showErrorMessage, showMessage } from '../../../functions/shared';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import QuickUpdate from '../components/QuickUpdate';
import SendMail from '../components/SendMail';
import IconMail from '../../../components/Icon/IconMail';

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
    subject: '',
    html: '',
    deliverytime: null,
};

export default function SendQuickEmail({ student, name, pipeline, isProspect = false }: any) {
    const { suid, studioOptions }: any = UserAuth();
    const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
    const [emailData, setEmailData] = useState<EmailData>(emailDataInit);
    const [emailHtml, setEmailHtml] = useState<any>('');

    useEffect(() => {
        if (pipeline) {
            setEmailData({ ...emailData, subject: pipeline?.DefaultEmailSubject, to: student?.email || student?.Email, from: studioOptions?.EmailFromAddress });
            setEmailHtml(pipeline?.DefaultEmailText);
        }
    }, [pipeline]);

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

    return (
        <div>
            <div>
                <Tippy content="Send Email" placement="top">
                    <button type="button" className="btn btn-info w-10 h-10 p-0 rounded-full" onClick={() => setShowEmailModal(true)}>
                        <IconMail />
                    </button>  
                </Tippy>
            </div>

            <Transition.Root show={showEmailModal} as={Fragment}>
                <Dialog className="relative z-50" onClose={setShowEmailModal}>
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
                                                                Action Email <span className="font-bold text-primary">{pipeline?.StepName}</span>{' '}
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
                                                            <button type="button" className="relative text-gray-400 hover:text-gray-500" onClick={() => setShowEmailModal(false)}>
                                                                <span className="absolute -inset-2.5" />
                                                                <span className="sr-only">Close panel</span>
                                                                <IconX className="h-6 w-6" aria-hidden="true" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Divider container */}
                                                <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                                                    <SendMail 
                                                    pipeline={pipeline} 
                                                    studioOptions={studioOptions} 
                                                    student={student} 
                                                    setShowActionModal={setShowEmailModal}
                                                    isPrpospect={isProspect} 
                                                    />
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
