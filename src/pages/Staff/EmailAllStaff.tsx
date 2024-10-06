import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconSend from '../../components/Icon/IconSend';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import Hashids from 'hashids';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, useParams } from 'react-router-dom';
import { sendEmailToClass } from '../../functions/emails';
import { showErrorMessage, showMessage } from '../../functions/shared';
import Tippy from '@tippyjs/react';
import IconCaretDown from '../../components/Icon/IconCaretDown';

export default function EmailAllStaff({ recipients, type, displayAll = false }: any) {
    const [emailModal, setEmailModal] = useState(false);
    const { studioOptions, suid }: any = UserAuth();
    const [value, setValue] = useState<any>('');
    const [emailData, setEmailData] = useState({
        level: 'readonly',
        listName: 'temporary',
        newsLetterTitle: '',
        type: 1,
        listDescription: 'temporary',
        from: '',
        subject: '',
    });
    const [studentRoster, setStudentRoster] = useState<any>([]);
    const [prospectRoster, setProspectRoster] = useState<any>([]);
    const [studentsChecked, setStudentsChecked] = useState<any>(true);
    const [prospectsChecked, setProspectsChecked] = useState<any>(false);
    const [staffChecked, setStaffChecked] = useState<any>(false);
    const [classStaff, setClassStaff] = useState<any>([]);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [removedBlanks, setRemovedBlanks] = useState<any>([]);
    const [checkedRecipients, setCheckedRecipients] = useState<any>([]);
    const [viewAll, setViewAll] = useState(false);

    useEffect(() => {
        setEmailData({ ...emailData, from: studioOptions?.EmailFromAddress });
    }, []);

    const handleSendBulkMessage = async (e: any) => {
        e.preventDefault();
        if (recipients.length === 0) {
            return;
        }
        setSendingEmail(true);
        const data = {
            studioId: suid,
            level: emailData.level,
            listName: emailData.listName,
            newsLetterTitle: emailData.newsLetterTitle,
            type: emailData.type,
            listDescription: emailData.listDescription,
            listOfNewMembers: checkedRecipients.map((recipient: any) => recipient.email),
            from: emailData.from,
            subject: emailData.subject,
            html: value,
        };

        // const data = {
        //     studioId: suid,
        //     level: emailData.level,
        //     listName: emailData.listName,
        //     newsLetterTitle: emailData.newsLetterTitle,
        //     type: emailData.type,
        //     listDescription: emailData.listDescription,
        //     listOfNewMembers: ['bret@techbret.com', '', 'hello@codetega.com', 'bretljohnson0@gmail.com'],
        //     from: emailData.from,
        //     subject: emailData.subject,
        //     html: value,
        // };

        try {
            const res = await sendEmailToClass(data);
            if (res.status === 200) {
                showMessage('Email Sent Successfully');
                setEmailModal(false);
                setTimeout(() => {
                    setSendingEmail(false);
                }, 1000);
                setEmailData({
                    level: 'readonly',
                    listName: 'temporary',
                    newsLetterTitle: '',
                    type: 1,
                    listDescription: 'temporary',
                    from: '',
                    subject: '',
                });
                setValue('');
            } else {
                showErrorMessage('Email Failed to Send, Please Try Again');
                setEmailModal(false);
                setTimeout(() => {
                    setSendingEmail(false);
                }, 1000);
            }
        } catch (error) {
            console.log(error);
            showErrorMessage('Email Failed to Send, Please Try Again');
        }
    };

    useEffect(() => {
        setCheckedRecipients(recipients);
    }, [recipients]);

    const handleDiscard = (e: any) => {
        e.preventDefault();
        setEmailModal(false);
        setEmailData({
            level: 'readonly',
            listName: 'temporary',
            newsLetterTitle: '',
            type: 1,
            listDescription: 'temporary',
            from: '',
            subject: '',
        });
        setSendingEmail(false);
        setValue('');
    };

    return (
        <div className="">
            <div className="flex items-center justify-center">
                <button type="button" onClick={() => setEmailModal(true)} className="btn btn-info gap-2 w-full whitespace-nowrap">
                    <IconSend />
                    Email Active Staff
                </button>
            </div>
            <Transition appear show={emailModal} as={Fragment}>
                <Dialog as="div" open={emailModal} onClose={() => setEmailModal(false)}>
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
                                    <div className="flex bg-info dark:bg-secondary-dark items-center justify-between px-5 py-3 text-white">
                                        <h5 className="font-bold text-lg">
                                            Send Bulk Email to <span className="font-extrabold text-yellow-300">{checkedRecipients?.length}</span> people
                                        </h5>
                                        <button type="button" className="text-white " onClick={() => setEmailModal(false)}>
                                            <IconX className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        {type === 'all' && (
                                            <div className="mb-4 relative flex items-center border p-3.5 rounded text-warning bg-warning-light border-warning ltr:border-l-[64px] rtl:border-r-[64px] dark:bg-warning-dark-light w-full">
                                                <span className="absolute ltr:-left-11 inset-y-0 text-white w-6 h-6 m-auto">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-exclamation-diamond" viewBox="0 0 16 16">
                                                        <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z" />
                                                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                                                    </svg>
                                                </span>
                                                <span className="ltr:pr-2 rtl:pl-2">
                                                    <strong className="ltr:mr-1 rtl:ml-1">Warning!</strong>You are about to send an email to{' '}
                                                    <span className="font-bold text-danger">all your students</span>.
                                                </span>
                                            </div>
                                        )}

                                        <div className="ml-1 text-xs text-gray-500 flex items-center gap-1">
                                            <div>
                                                <Tippy content="View All">
                                                    <button
                                                        className="hover:text-info"
                                                        onClick={() => {
                                                            setViewAll(!viewAll);
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            <div>{checkedRecipients?.length} Recipients</div>
                                                            <div>
                                                                <IconCaretDown className={`${!viewAll && '-rotate-90'}`} />
                                                            </div>
                                                        </div>
                                                    </button>
                                                </Tippy>
                                                <div className="mt-2 btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black dark:text-white-dark hover:text-primary dark:hover:text-primary bg-zinc-100 max-h-full overflow-y-auto">
                                                    {viewAll && (
                                                        <ul
                                                            className={`w-auto max-h-auto h-auto max-h-screen overflow-y-auto bg-zinc-50 border rounded-lg grid ${
                                                                displayAll ? 'grid-cols-1' : 'sm:grid-cols-3 grid-cols-2'
                                                            }  gap-x-2`}
                                                        >
                                                            {recipients?.map((recipient: any, index: number) => {
                                                                return (
                                                                    <li key={index}>
                                                                        <div className="flex items-center whitespace-nowrap px-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={checkedRecipients?.includes(recipient)}
                                                                                onClick={() => {
                                                                                    if (checkedRecipients?.includes(recipient)) {
                                                                                        setCheckedRecipients(checkedRecipients?.filter((item: any) => item !== recipient));
                                                                                    } else {
                                                                                        setCheckedRecipients([...checkedRecipients, recipient]);
                                                                                    }
                                                                                }}
                                                                                className="form-checkbox text-secondary"
                                                                            />
                                                                            <div
                                                                                className={`badge ${
                                                                                    recipient.type === 'staff'
                                                                                        ? ' text-secondary'
                                                                                        : recipient.type === 'student'
                                                                                        ? ' text-info'
                                                                                        : recipient.type === 'prospect'
                                                                                        ? ' text-primary '
                                                                                        : ' text-danger '
                                                                                }`}
                                                                            >
                                                                                {recipient.name}
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {type === 'class' && (
                                            <form className="pt-8">
                                                <h3 className="text-lg font-semibold  mb-3">Select Recipients</h3>
                                                <div className="flex items-center gap-4">
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox"
                                                            checked={studentsChecked}
                                                            onChange={() => setStudentsChecked(!studentsChecked)}
                                                            disabled={studentRoster?.length < 1}
                                                        />
                                                        <span className={`${studentsChecked ? 'font-bold text-success' : 'text-white-dark'} `}>Students ({studentRoster?.length})</span>
                                                    </label>
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox"
                                                            checked={prospectsChecked}
                                                            onChange={() => setProspectsChecked(!prospectsChecked)}
                                                            disabled={prospectRoster?.length < 1}
                                                        />
                                                        <span className={`${prospectsChecked ? 'font-bold text-success' : 'text-white-dark'} `}>Prospects ({prospectRoster?.length})</span>
                                                    </label>
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox"
                                                            checked={staffChecked}
                                                            onChange={() => setStaffChecked(!staffChecked)}
                                                            disabled={classStaff?.length < 1}
                                                        />
                                                        <span className={`${staffChecked ? 'font-bold text-success' : 'text-white-dark'} `}>Staff ({classStaff?.length})</span>
                                                    </label>
                                                </div>
                                            </form>
                                        )}

                                        <form className="panel space-y-4">
                                            <div className="">
                                                <label htmlFor="newsletterTitle">Email Title</label>
                                                <input
                                                    type="text"
                                                    name="newsletterTitle"
                                                    id="newsletterTitle"
                                                    className="form-input"
                                                    onChange={(e) => setEmailData({ ...emailData, newsLetterTitle: e.target.value })}
                                                />
                                            </div>
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
                                                    <option value={studioOptions?.EmailFromAddress}>{studioOptions?.EmailFromAddress}</option>
                                                    <option value={studioOptions?.EmailFromAddress2}>{studioOptions?.EmailFromAddress2}</option>
                                                    <option value={studioOptions?.EmailFromAddress3}>{studioOptions?.EmailFromAddress3}</option>
                                                </select>
                                            </div>
                                            <div className="h-fit">
                                                <label htmlFor="newsletterContent">Email Content</label>
                                                <ReactQuill theme="snow" value={value} onChange={setValue} />
                                            </div>
                                        </form>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={(e: any) => handleDiscard(e)}>
                                                Discard
                                            </button>

                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={(e: any) => handleSendBulkMessage(e)}>
                                                {sendingEmail ? (
                                                    <>
                                                        <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                                        Sending Email...
                                                    </>
                                                ) : (
                                                    'Send Email'
                                                )}
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
