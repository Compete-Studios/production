import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconX from '../../components/Icon/IconX';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import { UserAuth } from '../../context/AuthContext';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { dropStudentFromRank, updateStudentRank } from '../../functions/api';

export default function AddStudentToRank({ rkID, studentRoster, update, setUpdate }: any) {
    const { students }: any = UserAuth();
    const [modal1, setModal1] = useState(false);
    const [searchValue, setSearchValue] = useState<any>('');
    const [selectedStudents, setSelectedStudents] = useState<any>([]);

    const options = students?.map((student: any) => ({
        label: student.Name,
        value: student.Student_ID,
    }));

    const findStudentOnRosterAndAddThemToSelected = (studentRoster: any) => {
        const studentsOnRoster = studentRoster?.map((student: any) => ({
            label: student.Name,
            value: student.Student_ID,
        }));

        const newSelectedStudents = studentsOnRoster.filter((student: any) => {
            return !selectedStudents.some((selectedStudent: any) => selectedStudent.value === student.value);
        });

        setSelectedStudents((prevSelectedStudents: any) => [...prevSelectedStudents, ...newSelectedStudents]);
    };

    useEffect(() => {
        findStudentOnRosterAndAddThemToSelected(studentRoster);
    }, [studentRoster]);

    const handleAddOrRemoveRank = async (step: any) => {
        console.log('step', step.PipelineStepId);
        if (selectedStudents.find((s: any) => s.value === step.value)) {
            setSelectedStudents((prevSelectedStudents: any) => prevSelectedStudents.filter((student: any) => student.value !== step.value));
            await dropStudentFromRank(step.value, rkID);
            setUpdate(!update);
        } else {
            setSelectedStudents((prevSelectedStudents: any) => [...prevSelectedStudents, step]);
            const data = {
                studentId: step.value,
                rankId: rkID,
            };
            await updateStudentRank(data);
            setUpdate(!update);
        }
    };

    return (
        <div className="">
            <div className="flex items-center justify-center">
                <button type="button" className="btn btn-primary w-full whitespace-nowrap" onClick={() => setModal1(true)}>
                    <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                    Add Student To Rank
                </button>
            </div>
            <Transition appear show={modal1} as={Fragment}>
                <Dialog as="div" open={modal1} onClose={() => setModal1(false)}>
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-lg text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold">Add Student to Rank</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="">
                                        <PerfectScrollbar className="relative h-full sm:h-[calc(100vh_-_200px)] p-5">
                                            <>
                                                {options?.map((student: any, index: any) => {
                                                    return (
                                                        <div key={student.value} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-2">
                                                            <div>
                                                                <div className="font-semibold">{student.label}</div>
                                                            </div>
                                                            <label className="inline-flex">
                                                                {selectedStudents.find((s: any) => s.value === student.value) ? (
                                                                    <button type="button" className="btn btn-danger btn-sm w-16" onClick={() => handleAddOrRemoveRank(student)}>
                                                                        Remove
                                                                    </button>
                                                                ) : (
                                                                    <button type="button" className="btn btn-info btn-sm w-16" onClick={() => handleAddOrRemoveRank(student)}>
                                                                        Add
                                                                    </button>
                                                                )}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        </PerfectScrollbar>
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
