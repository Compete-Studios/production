import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import { addAStudentToProgram, addStudentToClass } from '../../functions/api';
import { showMessage } from '../../functions/shared';

export default function AddStudentToProgram({ student, alreadyIn, updateClasses, setUpdateClasses }: any) {
    const { programs } = UserAuth();
    const [newProgram, setNewProgram] = useState('');
    const [showAddProgramModal, setShowAddProgramModal] = useState(false);
    const [availablePrograms, setAvailablePrograms] = useState(programs);

    const removeProgramsAlreadyIn = () => {
        let tempClasses = programs;
        for (let i = 0; i < alreadyIn.length; i++) {
            tempClasses = tempClasses.filter((item: any) => item.ProgramId !== alreadyIn[i].ProgramId);
        }
        setAvailablePrograms(tempClasses);
    };

    useEffect(() => {
        removeProgramsAlreadyIn();
    }, [programs]);
    
    const handleAddToProgram = async () => {
        const programData = {
            studentId: student.Student_id,
            programId: newProgram,
        }   
        
        try {
            const response = await addAStudentToProgram(programData);
            if (response.status === 200) {
                showMessage('Student added to class');
                setUpdateClasses(!updateClasses);
                setShowAddProgramModal(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div>
                <button className="btn btn-outline-info btn-sm ml-auto" onClick={() => setShowAddProgramModal(true)}>
                    {' '}
                    Add Student To Program
                </button>
            </div>
            <Transition appear show={showAddProgramModal} as={Fragment}>
                <Dialog as="div" open={showAddProgramModal} onClose={() => setShowAddProgramModal(false)}>
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
                                        onClick={() => setShowAddProgramModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        Add <span className="text-primary font-bold">{student?.First_Name}</span> To a Program
                                    </div>

                                    <div className="p-5">
                                        <form>
                                            <div>
                                                <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Select a Program
                                                </label>
                                                <select id="class" name="class" className="form-select" value={newProgram} onChange={(e) => setNewProgram(e.target.value)}>
                                                    <option value="">Select a Program</option>
                                                    {availablePrograms.map((classItem: any) => (
                                                        <option key={classItem.ProgramId} value={classItem.ProgramId}>
                                                            {classItem.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mt-8 flex items-center justify-end ">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setShowAddProgramModal(false)}>
                                                    Discard
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleAddToProgram}>
                                                    Add Student to Program
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
