import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { UserAuth } from '../../context/AuthContext';
import { sendIndividualEmail } from '../../functions/emails';
import { showErrorMessage, showMessage } from '../../functions/shared';
import IconMail from '../../components/Icon/IconMail';
import IconX from '../../components/Icon/IconX';

export default function BaseEmail({ email, emailhtml, setNotes, notes, title, additional = null }: any) {
    const { suid, studioOptions }: any = UserAuth();
    const [loading, setLoading] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [emailData, setEmailData] = useState({
        to: '',
        from: '',
        subject: '',
        html: '',
        deliverytime: null,
    });

    useEffect(() => {
        setEmailData({
            to: email.to,
            from: email.from,
            subject: email.subject,
            html: '',
            deliverytime: null,
        });
    }, [email]);

    const handleSendEmail = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        const htmlData = await emailhtml;
        const data = {
            studioId: suid,
            email: {
                to: emailData.to,
                from: emailData.from,
                subject: emailData.subject,
                html: htmlData,
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
        <div>
            <button type="button" onClick={() => setModal2(true)} className="btn btn-info gap-1 w-full whitespace-nowrap">
                <IconMail fill={true} /> {title}
            </button>
            <Transition appear show={modal2} as={Fragment}>
                <Dialog as="div" open={modal2} onClose={() => setModal2(false)}>
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">Compose email</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div className="space-y-4">
                                            <select id="acno" name="acno" className="form-select flex-1" value={emailData.from} onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}>
                                                <option value="" disabled>
                                                    Select Email
                                                </option>
                                                <option value={studioOptions?.EmailFromAddress}>{studioOptions?.EmailFromAddress}</option>
                                                <option value={studioOptions?.EmailFromAddress2}>{studioOptions?.EmailFromAddress2}</option>
                                                <option value={studioOptions?.EmailFromAddress3}>{studioOptions?.EmailFromAddress3}</option>
                                            </select>
                                            <div>
                                                <input id="to" type="text" className="form-input" placeholder="Enter To" value={emailData.to} />
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
                                                {additional && <div className="text-sm">{additional}</div>}
                                                <textarea id="email" className="form-textarea" rows={10} value={notes} onChange={(e) => setNotes(e.target.value)} />
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModal2(false)}>
                                                    Discard
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={(e) => handleSendEmail(e)} disabled={loading}>
                                                    {loading && (
                                                        <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                                    )}
                                                    {loading ? 'Sending Email' : 'Send Email'}
                                                </button>
                                            </div>
                                        </div>
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
