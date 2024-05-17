import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconMail from '../../components/Icon/IconMail';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { sendIndividualEmail } from '../../functions/emails';
import { showErrorMessage, showMessage } from '../../functions/shared';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const emailDataInit = {
    to: '',
    from: '',
    subject: '',
    html: '',
    deliverytime: null,
};

export default function EmailFailedPayment({ suid, PaymentPipelineStepId, student, btn = false }: any) {
    const { latePayementPipeline, studioOptions }: any = UserAuth();
    const [emailData, setEmailData] = useState<any>(emailDataInit);
    const [emailHtml, setEmailHtml] = useState<any>('');
    const [modal2, setModal2] = useState(false);
    const [loading, setLoading] = useState(false);

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setEmailData({ ...emailData, [id]: value });
    };

    useEffect(() => {
        const pipeline = latePayementPipeline.find((item: any) => item.PaymentPipelineStepId === PaymentPipelineStepId);
        if (pipeline) {
            setEmailData({ ...emailData, subject: pipeline?.DefaultEmailSubject, to: student?.email, from: studioOptions?.EmailFromAddress });
            setEmailHtml(pipeline?.DefaultEmailText);
        }
    }, [PaymentPipelineStepId]);

    const handleSendEmail = (e: any) => {
        e.preventDefault();
        setLoading(true);
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
                setLoading(false);
                setModal2(false);
            } else {
                showErrorMessage('Email Failed to Send, Please Try Again');
                setLoading(false);
            }
        });
    };

    return (
        <>
            <div className="">
                {btn ? (
                    <div className="flex items-center justify-center">
                        <button type="button" onClick={() => setModal2(true)} className="btn btn-info gap-1 sm:w-auto w-full">
                            <IconMail fill={true} /> Send Email
                        </button>
                    </div>
                ) : (
                    <Tippy content="Send Email" placement='right'>
                        <button
                            type="button"
                            onClick={() => setModal2(true)}
                            className="flex items-center font-semibold gap-1 text-info hover:text-blue-800"
                        >
                            
                                <IconMail className='text-warning' />
                                {student?.email}
                          
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
                                                <select
                                                    id="acno"
                                                    name="acno"
                                                    className="form-select flex-1"
                                                    value={emailData.from}
                                                    onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}
                                                >
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
                                                    <ReactQuill theme="snow" value={emailHtml} style={{ minHeight: '200px' }} onChange={setEmailHtml} />
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
