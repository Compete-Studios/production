import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconX from '../../components/Icon/IconX';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import { UserAuth } from '../../context/AuthContext';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Select from 'react-select';
import { addProspectToClass, addStudentToClass, dropProspectFromClass, dropStudentFromClass, searchProspectsBySearchTerm } from '../../functions/api';
import { showMessage } from '../../functions/shared';

export default function AddStudentProspectToClass({ classID, studentRoster, student = true, updatedClasses, setUpdatedClasses }: any) {
    const { students, suid }: any = UserAuth();
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [selectedStudents, setSelectedStudents] = useState<any>([]);
    const [searchValue, setSearchValue] = useState<any>('');
    const [prospectOptions, setProspectOptions] = useState<any>([]);

    const filteredItems = students?.filter((item: any) => {
        return studentRoster?.filter((roster: any) => roster.Student_ID === item.Student_ID).length === 0;
    });

    //do the same as filterItems but return an an array of objects with label and value
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

    const addProspectsToSelectedStudents = (prospects: any) => {

        const studentsOnRoster = prospects?.map((student: any) => ({
            label: student.Name,
            value: student.ProspectId,
        }));


        const newSelectedStudents = studentsOnRoster.filter((prospect: any) => {
            return !selectedStudents.some((selectedStudent: any) => selectedStudent.value === prospect.value);
        });

        setSelectedStudents((prevSelectedStudents: any) => [...prevSelectedStudents, ...newSelectedStudents]);
    };

    console.log(studentRoster);

    useEffect(() => {
        if (student) {
            findStudentOnRosterAndAddThemToSelected(studentRoster);
        } else {
            addProspectsToSelectedStudents(studentRoster);
        }
    }, [student, studentRoster]);

    const handleCheckboxChange = async (e: any, prospect: any) => {
        if (e.target.checked) {
            setSelectedStudents((prevSelectedStudents: any) => [...prevSelectedStudents, prospect]);
        } else {
            setSelectedStudents((prevSelectedStudents: any) =>
                prevSelectedStudents.filter((student: any) => student.value !== prospect.value)
            );

            try {
                const response = student ? await dropStudentFromClass(prospect.value, classID) : await dropProspectFromClass(prospect.value, classID);
                // Handle response if needed
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleAddToClass = async () => {
        console.log(selectedStudents);
        for (let i = 0; i < selectedStudents.length; i++) {
            const classData = {
                studentId: selectedStudents[i].value,
                classId: classID,
            };

            try {
                const response = student ? await addStudentToClass(classData) : await addProspectToClass(classID,  selectedStudents[i].value);
                // if (response.status === 200) {
                // }
            } catch (error) {
                console.log(error);
            }
        }
        showMessage('Students added to Class');
        setUpdatedClasses(!updatedClasses);
        setAddContactModal(false);
        setSearchValue('');
        setProspectOptions([]);
        setSelectedStudents([]);
    };

    const handleSearch = async (e: any) => {
        e.preventDefault();
        const data = {
            studioId: suid,
            searchTerm: searchValue,
        };
        try {
            const response = await searchProspectsBySearchTerm(data);
            const studentsRes = response?.recordset;
            const options = studentsRes?.map((student: any) => ({
                label: student.LName + ', ' + student.FName,
                value: student.ProspectId,
            }));
            setProspectOptions(options);
            console.log(options);
        } catch (err) {
            console.error('Error fetching prospects:', err);
        }
    };

    const handleCancelAll = () => {
        setSelectedStudents([]);
        setProspectOptions([]);
        setSearchValue('');
        setAddContactModal(false);
    };
 

    return (
        <div>
            {student ? (
                <button type="button" className="btn btn-primary gap-2 w-full whitespace-nowrap" onClick={() => setAddContactModal(true)}>
                    <IconUserPlus />
                    Add Students
                </button>
            ) : (
                <button type="button" className="btn btn-dark gap-2 w-full whitespace-nowrap" onClick={() => setAddContactModal(true)}>
                    <IconUserPlus />
                    Add Prospects
                </button>
            )}

            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center  px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel min-h-24 max-h-[90vh] overflow-hidden border-0 p-0 rounded-lg  my-8 w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => handleCancelAll()}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-white hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className={`text-lg font-medium text-white ${student ? 'bg-primary' : 'bg-dark'}  dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]`}>
                                        Add {student ? 'Students' : 'Prospect'}{' '}
                                    </div>
                                    <PerfectScrollbar className="relative min-h-64 max-h-[calc(100vh_-_200px)] chat-conversation-box">
                                        <div className="p-5 pb-24">
                                            <div className="mb-5">
                                                {student ? (
                                                    <div className="space-y-4">
                                                        {options?.map((prospect: any) => (
                                                            <label className="flex" key={prospect.value}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-checkbox"
                                                                    checked={selectedStudents.some((student: any) => student.value === prospect.value)}
                                                                    onChange={(e) => handleCheckboxChange(e, prospect)}
                                                                />
                                                                <span>{prospect.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <form className="flex items-center gap-2" onSubmit={handleSearch}>
                                                        <input
                                                            type="text"
                                                            id="name"
                                                            className="form-input text-white-dark"
                                                            placeholder="Search Prospects"
                                                            value={searchValue}
                                                            onChange={(e) => setSearchValue(e.target.value)}
                                                        />
                                                        <button type="submit" className="btn btn-primary">
                                                            Search
                                                        </button>
                                                    </form>
                                                )}

                                                {!student && (
                                                    <div className="mt-4 space-y-2">
                                                        {prospectOptions?.length > 0 ? (
                                                            <>
                                                                {prospectOptions?.map((prospect: any) => (
                                                                    <label className="flex" key={prospect.value}>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox"
                                                                            checked={selectedStudents.some((student: any) => student.value === prospect.value)}
                                                                            onChange={(e) => handleCheckboxChange(e, prospect)}
                                                                        />
                                                                        <span>{prospect.label}</span>
                                                                    </label>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <div className="mt-4 text-center">
                                                                <p className="">No prospects found</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </PerfectScrollbar>
                                    <div className="flex justify-end items-center absolute bottom-0 right-0 w-full bg-dark-light dark:bg-dark p-5 border-t ">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => handleCancelAll()}>
                                            Cancel
                                        </button>
                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleAddToClass} disabled={!selectedStudents[0]}>
                                            Update Roster
                                        </button>
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
