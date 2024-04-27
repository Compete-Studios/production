import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import { addProspectToClass, addStudentToClass } from '../../functions/api';
import { showMessage } from '../../functions/shared';

export default function AddStudentToClass({ student, alreadyIn, updateClasses, setUpdateClasses, isProspect = false }: any) {
    const { classes }: any = UserAuth();
    const [newClass, setNewClass] = useState('');
    const [showAddClassModal, setShowAddClassModal] = useState(false);
    const [availableClasses, setAvailableClasses] = useState(classes);

    const removeClassesAlreadyIn = () => {
        let tempClasses = classes;
        for (let i = 0; i < alreadyIn.length; i++) {
            tempClasses = tempClasses.filter((item: any) => item.ClassId !== alreadyIn[i].ClassId);
        }
        setAvailableClasses(tempClasses);
    };

    useEffect(() => {
        removeClassesAlreadyIn();
    }, [classes]);


    const handleAddProspectToClass = async () => {
        try {
            const response = await addProspectToClass(newClass, student);
            if (response.status === 200) {
                showMessage('Student added to Program');
                setUpdateClasses(!updateClasses);
                setShowAddClassModal(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddToClass = async () => {
        const classData = {
            studentId: student.Student_id,
            classId: newClass,
        };

        try {
            const response = await addStudentToClass(classData);
            if (response.status === 200) {
                showMessage('Student added to Program');
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
                    Add {isProspect ? "Prospect" : "Student"} To Class
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
                                                    <option value="">Select a Class</option>
                                                    {availableClasses.map((classItem: any) => (
                                                        <option key={classItem.ClassId} value={classItem.ClassId}>
                                                            {classItem.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mt-8 flex items-center justify-end ">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setShowAddClassModal(false)}>
                                                    Discard
                                                </button>
                                                {isProspect ? (
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleAddProspectToClass}>
                                                        Add Prospect to Class
                                                    </button>
                                                ) : (
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleAddToClass}>
                                                        Add Student to Class
                                                    </button>
                                                )}
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
