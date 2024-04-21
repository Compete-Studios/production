import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import { addStudentToAWaitingList, addStudentToClass } from '../../functions/api';
import { showMessage } from '../../functions/shared';

export default function AddStudentToWaitingList({ student, alreadyIn, updateClasses, setUpdateClasses }: any) {
    const { waitingLists } = UserAuth();
    const [newClass, setNewClass] = useState('');
    const [showAddClassModal, setShowAddClassModal] = useState(false);
    const [availableClasses, setAvailableClasses] = useState(waitingLists);

    const removeClassesAlreadyIn = () => {
        let tempClasses = waitingLists;
        for (let i = 0; i < alreadyIn.length; i++) {
            tempClasses = tempClasses.filter((item: any) => item.WaitingListId !== alreadyIn[i].WaitingListId);
        }
        setAvailableClasses(tempClasses);
    };

    useEffect(() => {
        removeClassesAlreadyIn();
    }, [waitingLists]);

    const handleAddToClass = async () => {
        const classData = {
            studentId: student.Student_id,
            waitingListId: newClass,
        };

        try {
            const response = await addStudentToAWaitingList(classData);
            if (response.status === 200) {
                showMessage('Student added to Waiting List');
                setUpdateClasses(!updateClasses);
                setShowAddClassModal(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div>
                <button className="btn btn-outline-info btn-sm ml-auto" onClick={() => setShowAddClassModal(true)}>
                    {' '}
                    Add Student To List
                </button>
            </div>
            <Transition appear show={showAddClassModal} as={Fragment}>
                <Dialog as="div" open={showAddClassModal} onClose={() => setShowAddClassModal(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddClassModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        Add <span className="text-primary font-bold">{student?.First_Name}</span> To a Class
                                    </div>

                                    <div className="p-5">
                                        <form>
                                            <div>
                                                <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Select a Class
                                                </label>
                                                <select id="class" name="class" className="form-select" value={newClass} onChange={(e) => setNewClass(e.target.value)}>
                                                    <option value="">Select a Waiting List</option>
                                                    {availableClasses.map((classItem: any) => (
                                                        <option key={classItem.WaitingListId} value={classItem.WaitingListId}>
                                                            {classItem.Title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mt-8 flex items-center justify-end ">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setShowAddClassModal(false)}>
                                                    Discard
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleAddToClass}>
                                                    Add Student to Waiting List
                                                </button>
                                            </div>
                                        </form>
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
