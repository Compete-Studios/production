import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconX from '../../components/Icon/IconX';
import IconSend from '../../components/Icon/IconSend';
import { UserAuth } from '../../context/AuthContext';
import ReactQuill from 'react-quill';
import { sendIndividualEmail } from '../../functions/emails';
import { showErrorMessage, showMessage } from '../../functions/shared';

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

export default function EmailStaffMember({ toemail }: any) {
    const { studioOptions, suid }: any = UserAuth();
    const [value, setValue] = useState<any>('');
    const [emailData, setEmailData] = useState<EmailData>(emailDataInit);
    const [emailHtml, setEmailHtml] = useState<any>('');
    const [modal2, setModal2] = useState(false);

    useEffect(() => {
        setEmailData({ ...emailData, subject: 'Subject', to: toemail, from: studioOptions?.EmailFromAddress || '' });
        setEmailHtml('Email Content');
    }, []);

    const handleSendEmail = async (e: any) => {
        e.preventDefault();
        const data = {
            studioId: suid,
            email: {
                to: toemail,
                from: emailData.from,
                subject: emailData.subject,
                html: emailHtml,
                deliverytime: null,
            },
        };
        console.log(data);
        try {
            const res = await sendIndividualEmail(data);
            if (res.status === 200) {
                showMessage('Email Sent Successfully');
                setModal2(false);
            } else {
                showErrorMessage('Email Failed to Send, Please Try Again');
            }
        } catch (error) {
            console.log(error);
            showErrorMessage('Email Failed to Send, Please Try Again');
        }
    };

    return (
        <div className="">
            <div className="">
                <button type="button" onClick={() => setModal2(true)} className="btn btn-info sm:w-64 w-full">
                    <IconSend className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> Send Email
                </button>
            </div>
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-3xl my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-info dark:bg-secondary-dark text-white items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">Send Quick Email</h5>
                                        <button type="button" className="text-white" onClick={() => setModal2(false)}>
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <form className="space-y-4">
                                            <div className="">
                                                <label htmlFor="newsletterSubject">Email Subject</label>
                                                <input
                                                    type="text"
                                                    name="newsletterSubject"
                                                    id="newsletterSubject"
                                                    className="form-input"
                                                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                                />
                                            </div>
                                            <div className="">
                                                <label htmlFor="fromEmail">From Email</label>
                                                <select id="acno" name="fromEmail" className="form-select flex-1" onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}>
                                                    <option value="" disabled>
                                                        Select Email
                                                    </option>
                                                    {studioOptions?.EmailFromAddress && <option value={studioOptions?.EmailFromAddress}>{studioOptions?.EmailFromAddress}</option>}
                                                    {studioOptions?.EmailFromAddress2 && <option value={studioOptions?.EmailFromAddress2}>{studioOptions?.EmailFromAddress2}</option>}
                                                    {studioOptions?.EmailFromAddress3 && <option value={studioOptions?.EmailFromAddress3}>{studioOptions?.EmailFromAddress3}</option>}
                                                </select>
                                            </div>
                                            <div className="h-fit">
                                                <label htmlFor="newsletterContent">Email Content</label>
                                                <ReactQuill theme="snow" value={value} onChange={setValue} />
                                            </div>
                                        </form>
                                        <div className="flex justify-end items-center gap-4 mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setModal2(false)}>
                                                Discard
                                            </button>
                                            <button type="submit" className="btn btn-info" onClick={(e) => handleSendEmail(e)}>
                                                Send <IconSend className="w-5 h-5 ltr:ml-2 rtl:mr-2" />
                                            </button>
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
