import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconMail from '../../components/Icon/IconMail';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import 'react-quill/dist/quill.snow.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { convertPhone, showErrorMessage, showMessage } from '../../functions/shared';
import { sendAText } from '../../functions/api';

const textInit = {
    to: '',
    studioId: '',
    message: '',
};

export default function TextFailedPayment({ suid, PaymentPipelineStepId, student, btn = false }: any) {
    const { latePayementPipeline, studioOptions }: any = UserAuth();
    const [modal2, setModal2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [textMessage, setTextMessage] = useState<any>(textInit);

    useEffect(() => {
        const pipeline = latePayementPipeline.find((item: any) => item.PaymentPipelineStepId === PaymentPipelineStepId);
        if (pipeline) {
            setTextMessage({
                ...textMessage,
                to: student?.Phone,
                studioId: suid,
                message: pipeline?.DefaultSMSText,
            });
        }
    }, [PaymentPipelineStepId, student, suid]);

    const handleSendEmail = (e: any) => {
        e.preventDefault();
        setLoading(true);
        sendAText(textMessage).then((res) => {
            console.log(res);
            if (res.status === 200) {
                showMessage('Text Sent Successfully');
                setLoading(false);
                setModal2(false);
            } else {
                showErrorMessage('Text Failed to Send, Please Try Again');
                setLoading(false);
            }
        });
    };

    return (
        <>
            <div className="">
                {btn ? (
                    <div className="flex items-center justify-center">
                        <button type="button" onClick={() => setModal2(true)} className="btn btn-secondary gap-1 sm:w-auto w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="" viewBox="0 0 16 16">
                                <path d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
                            </svg>
                            Send Text Message
                        </button>
                    </div>
                ) : (
                    <Tippy content="Send Text Message" placement="right">
                        <button type="button" onClick={() => setModal2(true)} className="flex items-center font-semibold gap-1 text-info hover:text-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-warning" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                            </svg>
                            {convertPhone(student?.Phone)}
                        </button>
                    </Tippy>
                )}

                <Transition appear show={modal2} as={Fragment}>
                    <Dialog as="div" open={modal2} onClose={() => setModal2(false)}>
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="text-lg">
                                                Compose email to <span className="font-bold">Dyana Rinesmith</span>{' '}
                                            </h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                                <IconX />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <div className="space-y-4">
                                                <div>
                                                    <input
                                                        id="to"
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="Enter To"
                                                        defaultValue={textMessage.to}
                                                        onChange={(e) => setTextMessage({ ...textMessage, to: e.target.value })}
                                                    />
                                                </div>

                                                <div>
                                                    <textarea
                                                        id="text"
                                                        rows={6}
                                                        className="form-input"
                                                        placeholder="Enter Text"
                                                        value={textMessage.message}
                                                        onChange={(e) => setTextMessage({ ...textMessage, message: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModal2(false)}>
                                                    Discard
                                                </button>

                                                {loading ? (
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" disabled>
                                                        <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                                        Sending
                                                    </button>
                                                ) : (
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={(e) => handleSendEmail(e)}>
                                                        Send
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </>
    );
}
