import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconNotes from '../Icon/IconNotes';
import { getPaymentNotes } from '../../functions/payments';

export default function UpdateNotes({ payID }: any) {
    const [open, setOpen] = useState(false);
    const [newNote, setNewNote] = useState('');

    const handleGetLatePaymentNotes = async (id: any) => {
        try {
            const notesRes = await getPaymentNotes(id);
            setNewNote(notesRes[0].Notes);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (open) {
            handleGetLatePaymentNotes(payID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, payID]);

    return (
        <>
            <Tippy content="Update Notes">
                <button className="text-warning hover:text-amber-800" onClick={() => setOpen(true)}>
                    <IconNotes />
                </button>
            </Tippy>
            <Transition.Root show={open} as={Fragment}>
                <Dialog className="relative z-50" onClose={setOpen}>
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
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Late Payment Notes</Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none "
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            <span className="absolute -inset-2.5" />
                                                            <span className="sr-only">Close panel</span>
                                                            <IconX className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative flex-1 px-4 sm:px-6">
                                                <textarea className="form-textarea w-full mt-4" placeholder="Add a note" rows={12} value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                                            </div>
                                            <div className="flex flex-shrink-0 justify-end gap-2 px-4 py-4 bg-white fixed bottom-0 right-0 left-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpen(false)}
                                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                                                    >
                                                        Close
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpen(false)}
                                                        className="btn btn-primary"
                                                    >
                                                        Save Notes
                                                    </button>
                                                </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
