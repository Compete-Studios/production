import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import Dropdown from '../../components/Dropdown';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconX from '../../components/Icon/IconX';
import IconMenuUsers from '../../components/Icon/Menu/IconMenuUsers';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconSend from '../../components/Icon/IconSend';
import { showErrorMessage, showMessage } from '../../functions/shared';
import { sendBulkSMS } from '../../functions/texts';
import { UserAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import IconMessage from '../../components/Icon/IconMessage';

interface TextMessage {
    to: string;
    studioId: string;
    message: string;
}

const textInit = {
    to: '',
    studioId: '',
    message: '',
};

const addOneToFrontOfNumber = (numVal: string) => {
    const newNumber = '1' + numVal;
    return newNumber;
};

export default function SendBulkText({ recipients, bodyMessage = null, isButton = false, displayAll = true }: any) {
    const { suid }: any = UserAuth();
    const [openBulk, setOpenBulk] = useState(false);
    const [textMessage, setTextMessage] = useState<TextMessage>(textInit);
    const [checkedRecipients, setCheckedRecipients] = useState<any>([]);
    const [viewAll, setViewAll] = useState(false);

    const handleSendBulkMessage = async (e: any) => {
        e.preventDefault();
        if (recipients.length === 0) {
            return;
        }
        const data = {
            listOfRecipientNumbers: checkedRecipients.map((recipient: any) => addOneToFrontOfNumber(recipient.phoneNumber)),
            // listOfRecipientNumbers: ['7193184101', '7196503048'],
            studioId: suid,
            message: textMessage.message,
        };
        try {
            console.log(data);
            const res = await sendBulkSMS(data);
            if (res.apiId) {
                setTextMessage(textInit);
                setOpenBulk(false);
                showMessage('Message Sent Successfully');
            } else {
                showErrorMessage('Error Sending Message');
            }
        } catch (error) {
            showErrorMessage('Error Sending Message');
        }
    };

    useEffect(() => {
        setCheckedRecipients(recipients);
    }, [recipients]);

    return (
        <div>
            {' '}
            <div className="">
                <div className="flex items-center justify-center">
                    {isButton ? (
                        <button className="btn btn-secondary gap-2 w-full whitespace-nowrap" onClick={() => setOpenBulk(true)}>
                            <IconMessage />
                            Text This List
                        </button>
                    ) : (
                        <Tippy content="Send Bulk Text">
                            <button type="button" className="text-secondary hover:text-secondary-800" onClick={() => setOpenBulk(true)}>
                                <IconMenuUsers className="h-6 w-6" />
                            </button>
                        </Tippy>
                    )}
                </div>
                <Transition appear show={openBulk} as={Fragment}>
                    <Dialog as="div" open={openBulk} onClose={() => setOpenBulk(false)}>
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-2xl my-8  ">
                                        <div className="flex bg-secondary dark:bg-secondary-dark items-center justify-between px-5 py-3 text-white">
                                            <h5 className="font-bold text-lg">
                                                Send Bulk Message to <span className="font-extrabold text-yellow-300">{checkedRecipients?.length}</span> people
                                            </h5>
                                            <button type="button" className="text-white " onClick={() => setOpenBulk(false)}>
                                                <IconX className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <div className="p-5 pb-44 sm:flex sm:items-start sm:justify-between gap-4">
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
                                            {displayAll && (
                                                <div className="py-4">
                                                    <div className="flex items-end justify-end text-sm font-medium text-gray-700 dark:text-white-dark ml-auto">Last Message</div>
                                                    <div className="flex items-start justify-end text-white">
                                                        <div className="dark:bg-gray-800 w-96 p-4 py-2 rounded-md break-all bg-black/10 ltr:rounded-br-none rtl:rounded-bl-none !bg-secondary text-whit">
                                                            {bodyMessage}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="p-4 fixed bottom-0 left-0 w-full bg-white">
                                                <div className="sm:flex w-full space-x-3 rtl:space-x-reverse items-center">
                                                    <div className="relative flex items-center w-full">
                                                        <textarea
                                                            className="form-input rounded-md border-0 bg-[#f4f4f4] pr-12 focus:outline-none py-2"
                                                            placeholder="Type a message"
                                                            rows={3}
                                                            value={textMessage.message}
                                                            onChange={(e) => setTextMessage({ ...textMessage, message: e.target.value })}
                                                        />
                                                        <button type="button" className="h-full px-4 text-gray-400 hover:text-gray-500" onClick={(e) => handleSendBulkMessage(e)}>
                                                            {' '}
                                                            <IconSend />
                                                        </button>
                                                    </div>
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
        </div>
    );
}
