import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import IconPlus from '../../components/Icon/IconPlus';
import { addProgram } from '../../functions/api';
import { showMessage } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';

export default function AddNewRank() {
    const { suid, update, setUpdate }: any = UserAuth();
    const [showQuickPayModal, setShowQuickPayModal] = useState(false);
    const [programData, setProgramData] = useState({
        studioId: '',
        name: '',
        description: '',
    });

    const handleAddProgram = async () => {
        programData.studioId = suid;
        try {
            const response = await addProgram(programData);
            if (response.status === 200) {
                showMessage('Room added successfully');
                setProgramData({
                    studioId: '',
                    name: '',
                    description: '',
                });
                setShowQuickPayModal(false);
                setUpdate(!update);
            } else {
                showMessage('Failed to add program', 'error');
            }
        } catch (error) {
            console.error(error);
            showMessage('Failed to add program', 'error');
        }
    };

    return (
        <div>
            <div>
                <button type="button" className="btn btn-primary gap-2 ltr:ml-auto rtl:mr-auto" onClick={() => setShowQuickPayModal(true)}>
                    <IconPlus />
                    Add a Program
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
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Program Information</div>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <label htmlFor="roomname">Program Name</label>
                                            <input
                                                type="text"
                                                id="roomname"
                                                name="roomname"
                                                value={programData.name}
                                                className="form-input"
                                                onChange={(e) => setProgramData({ ...programData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="description">Description</label>
                                            <textarea
                                                id="description"
                                                rows={4}
                                                name="description"
                                                value={programData.description}
                                                className="form-input"
                                                onChange={(e) => setProgramData({ ...programData, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex">
                                            <button type="button" className="ml-auto btn btn-primary" onClick={handleAddProgram}>
                                                Add Program
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
