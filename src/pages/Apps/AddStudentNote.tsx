import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconEdit from '../../components/Icon/IconEdit';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { showMessage } from '../../functions/shared';
import { REACT_API_BASE_URL } from '../../constants';
import { updateStudentNotes } from '../../functions/api';
import Select from 'react-select';

export default function AddStudentNote() {
    const { suid } = UserAuth();
    const [students, setStudents] = useState<any>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [newNotes, setNewNotes] = useState<string>('');
    const [initials, setInitials] = useState<string>('');
    const currentDate = new Date();
    const noteDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear() % 100}`;
    const [modal2, setModal2] = useState(false);
    const [studentOptions, setStudentOptions] = useState<any>([
        { value: '1', label: 'Student 1' },
        { value: '2', label: 'Student 2' },
        { value: '3', label: 'Student 3' },
    ]);

    useEffect(() => {
        setStudentOptions(students.map((student: any) => ({ value: student.Student_ID, label: student.Name })));
    }, [students]);

    const handleAddNote = (e: any) => {
        e.preventDefault();
        setModal2(false);
        showMessage('Note Added Successfully');
    };

    useEffect(() => {
        fetch(`${REACT_API_BASE_URL}/studio-access/getStudentsByStudioId/${suid}/1`)
            .then((response) => response.json())
            .then((json) => setStudents(json.recordset));
    }, []);

    const handleAddNoteToTopOfNotes = async (e: any) => {
        e.preventDefault();
        // Concatenate the new note with the existing notes, with the new note on top
        const newNote = noteDate + ' ' + initials + ' ' + newNotes + '\n' + selectedStudent.Notes;
        updateStudentNotes(selectedStudent?.Student_ID, newNote);
        showMessage('Note Added Successfully');
        setModal2(false);
    };

    const handlePlaceSelectedStudent = (e: any) => {
        const student = students.find((student: any) => student.Student_ID === e.value);
        setSelectedStudent(student);
    };

    return (
        <div className="">
            <div className="flex items-center justify-center">
                <button
                    type="button"
                    onClick={() => setModal2(true)}
                    className="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                >
                    <IconEdit />
                </button>
            </div>
            <Transition appear show={modal2} as={Fragment}>
                <Dialog as="div" open={modal2} onClose={() => setModal2(false)}>
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">Add Note</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={(e) => handleAddNote(e)}>
                                            <div className="grid gap-5">
                                                <div>
                                                    <label htmlFor="taskTitle">Student</label>
                                                    <Select placeholder="Select an option" options={studentOptions} onChange={(e: any) => handlePlaceSelectedStudent(e)} />
                                                </div>
                                                <div>
                                                    <label htmlFor="taskTag">Staff Initials</label>
                                                    <input id="tags" type="text" className="form-input" placeholder="Enter Initials" autoComplete="off" onChange={(e) => setInitials(e.target.value)} />
                                                </div>
                                                <div>
                                                    <label htmlFor="taskdesc">Note</label>
                                                    <textarea id="description" className="form-textarea min-h-[130px]" placeholder="Enter Note" onChange={(e) => setNewNotes(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button onClick={() => setModal2(false)} type="button" className="btn btn-outline-danger">
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleAddNoteToTopOfNotes}>
                                                    Add
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
