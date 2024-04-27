import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconX from '../../components/Icon/IconX';
import IconPlus from '../../components/Icon/IconPlus';
import { addWaitingList } from '../../functions/api';
import { showMessage } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';

export default function AddWaitingList() {
    const { suid, update, setUpdate }: any = UserAuth();
    const [showQuickPayModal, setShowQuickPayModal] = useState(false);
    const [waitingListData, setWaitingListData] = useState({
        studioId: '',
        title: '',
        notificationEnrollmentCount: 0,
        notes: '',
        creationDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
    });

    const handleAddRoom = async () => {
        waitingListData.studioId = suid;
        try {
            const response = await addWaitingList(waitingListData);
            if (response.status === 200) {
                showMessage('Waiting List added successfully');
                setWaitingListData({
                    studioId: '',
                    title: '',
                    notificationEnrollmentCount: 0,
                    notes: '',
                    creationDate: new Date().toISOString(),
                    endDate: new Date().toISOString(),
                });
                setShowQuickPayModal(false);
                setUpdate(!update);
            } else {
                showMessage('Failed to add room', 'error');
            }
        } catch (error) {
            console.error(error);
            showMessage('Failed to add room', 'error');
        }
    };

    return (
        <div>
            <div>
                <button type="button" className="btn btn-primary gap-2 ltr:ml-auto rtl:mr-auto" onClick={() => setShowQuickPayModal(true)}>
                    <IconPlus />
                    Add a Waiting List
                </button>
            </div>
            <Transition appear show={showQuickPayModal} as={Fragment}>
                <Dialog as="div" open={showQuickPayModal} onClose={() => setShowQuickPayModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-start justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-3xl text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setShowQuickPayModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Create a Waiting List</div>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <label htmlFor="roomname">Waiting List Name:</label>
                                            <input
                                                type="text"
                                                id="roomname"
                                                name="roomname"
                                                value={waitingListData.title}
                                                className="form-input"
                                                onChange={(e) => setWaitingListData({ ...waitingListData, title: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="notes">Notes</label>
                                            <textarea
                                                id="notes"
                                                rows={4}
                                                name="notes"
                                                value={waitingListData.notes}
                                                className="form-input"
                                                onChange={(e) => setWaitingListData({ ...waitingListData, notes: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex">
                                            <button type="button" className="ml-auto btn btn-primary" onClick={handleAddRoom}>
                                                Add Waiting List
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
