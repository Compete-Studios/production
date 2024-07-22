import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconX from '../../components/Icon/IconX';
import IconBolt from '../../components/Icon/IconBolt';
import Tippy from '@tippyjs/react';
import IconMail from '../../components/Icon/IconMail';
import IconChatDot from '../../components/Icon/IconChatDot';
import IconNotes from '../../components/Icon/IconNotes';
import { UserAuth } from '../../context/AuthContext';
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
    subject: '',
    html: '',
    deliverytime: null,
};

export default function QuickAction({ student }: any) {
    const { prospectPipelineSteps, studioOptions }: any = UserAuth();
    const [quickOpen, setQuickOpen] = useState(false);
    const [emailData, setEmailData] = useState<EmailData>(emailDataInit);
    const [emailHtml, setEmailHtml] = useState<any>('');

    useEffect(() => {
        // Find the matching pipeline step
        const pipeline = prospectPipelineSteps.find((step: any) => step.PipelineStepId === student.prospectInfo.CurrentPipelineStatus);

        console.log(pipeline);

        if (pipeline) {
            setEmailData({
                ...emailData,
                subject: pipeline.DefaultEmailSubject,
                to: student?.prospectInfo.Email,
                from: studioOptions?.EmailFromAddress,
            });
            setEmailHtml(pipeline.DefaultEmailText);
        }
    }, [prospectPipelineSteps, student, studioOptions]);

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setEmailData({ ...emailData, [id]: value });
    };

    const handleSendEmail = (e: any) => {
        e.preventDefault();
        // const data = {
        //     studioId: suid,
        //     email: {
        //         to: emailData.to,
        //         from: emailData.from,
        //         subject: emailData.subject,
        //         html: emailHtml,
        //         deliverytime: null,
        //     },
        // };
        // sendIndividualEmail(data).then((res) => {
        //     console.log(res);
        //     if (res.status === 200) {
        //         showMessage('Email Sent Successfully');
        //         setShowActionModal(false);
        //         setDefaultTab(2);
        //     } else {
        //         showErrorMessage('Email Failed to Send, Please Try Again');
        //     }
        // });
    };

    console.log(emailData);
    return (
        <div className="mb-5">
            <div className="flex items-center justify-center">
                <Tippy content="Quick Action">
                    <button type="button" className="text-info hover:text-info/90 " onClick={() => setQuickOpen(true)}>
                        <IconBolt fill={true} />
                    </button>
                </Tippy>
            </div>
            <Transition appear show={quickOpen} as={Fragment}>
                <Dialog as="div" open={quickOpen} onClose={() => setQuickOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-2xl text-black dark:text-white-dark">
                                    <div className="flex bg-info text-white dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold">Quick Action</div>
                                        <button type="button" className="text-white hover:text-dark" onClick={() => setQuickOpen(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <Tab.Group>
                                            <Tab.List className="mt-3 flex flex-wrap">
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${
                                                                selected ? 'text-info !outline-none before:!w-full' : ''
                                                            } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                                        >
                                                            <IconMail className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                            Email
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${
                                                                selected ? 'text-info !outline-none before:!w-full' : ''
                                                            } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                                        >
                                                            <IconChatDot className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                            Send Text
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${
                                                                selected ? 'text-info !outline-none before:!w-full' : ''
                                                            } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                                        >
                                                            <IconBolt className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                            Update Step
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${
                                                                selected ? 'text-info !outline-none before:!w-full' : ''
                                                            } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                                        >
                                                            <IconNotes className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                            View Notes
                                                        </button>
                                                    )}
                                                </Tab>
                                            </Tab.List>

                                            <Tab.Panels>
                                                <Tab.Panel>
                                                    <div className="active pt-5">
                                                        <h4 className="mb-4 text-2xl font-semibold">We move your world!</h4>
                                                        <form className="p-6 grid gap-6 h-full flex-col relative">
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

                                                            <div>
                                                                <input
                                                                    type="file"
                                                                    className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                                                                    multiple
                                                                    accept="image/*,.zip,.pdf,.xls,.xlsx,.txt.doc,.docx"
                                                                />
                                                            </div>

                                                            {/* Action buttons */}
                                                            <div className="flex-shrink-0 px-4 py-5 sm:px-6 mt-auto">
                                                                <div className="flex justify-end space-x-3">
                                                                    <button
                                                                        type="button"
                                                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                                       
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button type="submit" className="btn btn-primary" onClick={(e) => handleSendEmail(e)}>
                                                                        Send
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div>
                                                        <div className="flex items-start pt-5">
                                                            <div className="h-20 w-20 flex-none ltr:mr-4 rtl:ml-4">
                                                                <img
                                                                    src="/assets/images/profile-34.jpeg"
                                                                    alt="img"
                                                                    className="m-0 h-20 w-20 rounded-full object-cover ring-2 ring-[#ebedf2] dark:ring-white-dark"
                                                                />
                                                            </div>
                                                            <div className="flex-auto">
                                                                <h5 className="mb-4 text-xl font-medium">Media heading</h5>
                                                                <p className="text-white-dark">
                                                                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate
                                                                    at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div className="pt-5">
                                                        <p>
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                                                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                                            deserunt mollit anim id est laborum.
                                                        </p>
                                                    </div>
                                                </Tab.Panel>
                                            </Tab.Panels>
                                        </Tab.Group>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setQuickOpen(false)}>
                                                Discard
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setQuickOpen(false)}>
                                                Save
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
