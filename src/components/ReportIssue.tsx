import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment } from 'react';
import IconInfoTriangle from './Icon/IconInfoTriangle';
import IconX from './Icon/IconX';
import { showErrorMessage, showMessage } from '../functions/shared';
import { UserAuth } from '../context/AuthContext';
import { storeReportToFirebase } from '../firebase/firebaseFunctions';

export default function ReportIssue() {
    const { studioInfo }: any = UserAuth();
    const [issueModal, setIssueModal] = useState(false);
    const path = window.location.pathname;
    const [issue, setIssue] = useState('');

    const handleIssueSubmit = async (e: any) => {
        e.preventDefault();
        const report = {
            issue,
            path,
            studioId: studioInfo?.Studio_Id,
            studioName: studioInfo?.Studio_Name,
            contactEmail: studioInfo?.Contact_Email,
            contactNumber: studioInfo?.Contact_Number,
            dateSubmitted: new Date(),
        };
        const res = storeReportToFirebase(report);
        if (!res) {
            showErrorMessage('Issue Submission Failed');
            return;
        } else {
            showMessage('Issue Submitted Successfully');
            setIssueModal(false);
            setIssue('');
        }
    };
    console.log('path', studioInfo);
    return (
        <div>
            <div className="relative">
                <button
                    type="button"
                    className="btn hover:bg-danger bg-danger/50 rounded-b-none z-50 fixed -bottom-2 hover:bottom-0 right-4 h-0.5 hover:h-auto text-xs hover:text-white text-transparent"
                    onClick={() => setIssueModal(true)}
                >
                    Report Issue
                </button>
            </div>
            <Transition appear show={issueModal} as={Fragment}>
                <Dialog as="div" open={issueModal} onClose={() => setIssueModal(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="standard_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
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
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-xl my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg flex items-center gap-2 text-danger">
                                            <IconInfoTriangle /> Report an Issue or Concern
                                        </h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setIssueModal(false)}>
                                            <IconX className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div className="py-5 text-dark text-center">
                                            <h2 className="text-lg font-bold">We appeciate your feedback and help!</h2>
                                            <p>
                                                It looks like you are at <span className="font-bold text-info block">competestudio.pro{path}</span>
                                            </p>
                                            <p className="mt-4">
                                                Please provide a brief description of the issue or concern you are experiencing. Our team will review and address it as soon as possible.
                                            </p>
                                            <textarea
                                                className="form-textarea mt-5 w-full h-32"
                                                placeholder="Please describe the issue or concern you are experiencing..."
                                                value={issue}
                                                onChange={(e) => setIssue(e.target.value)}
                                            ></textarea>
                                            <p className="text-left">
                                                Your Studio: <span className="font-bold text-info">{studioInfo?.Studio_Name}</span>
                                            </p>
                                            <p className="text-left">
                                                Your Contact Email: <span className="font-bold text-info">{studioInfo?.Contact_Email}</span>
                                            </p>
                                            <p className="text-left">
                                                Your Phone: <span className="font-bold text-info">{studioInfo?.Contact_Number}</span>
                                            </p>
                                        </div>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" onClick={() => setIssueModal(false)} className="btn btn-outline-danger">
                                                Discard
                                            </button>
                                            <button type="button" onClick={(e: any) => handleIssueSubmit(e)} className="btn btn-info ltr:ml-4 rtl:mr-4">
                                                Submit Issue or Concern
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
