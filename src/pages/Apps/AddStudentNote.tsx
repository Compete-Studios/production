import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';
import IconEdit from '../../components/Icon/IconEdit';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

export default function AddStudentNote() {
    const { students } = UserAuth();
    const [modal2, setModal2] = useState(false);

    const handleAddNote = (e: any) => {
        e.preventDefault();
        setModal2(false);
        showMessage('Note Added Successfully');
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
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
                                                    <select id="title" className="form-select">
                                                        {students?.map((student: any) => (
                                                            <option key={student.Student_ID} value={student.Student_ID}>
                                                                {student.Name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="taskTag">Staff Initials</label>
                                                    <input id="tags" type="text" className="form-input" placeholder="Enter Initials" autoComplete="off" />
                                                </div>
                                                <div>
                                                    <label htmlFor="taskdesc">Note</label>
                                                    <textarea id="description" className="form-textarea min-h-[130px]" placeholder="Enter Note"></textarea>
                                                </div>
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button onClick={() => setModal2(false)} type="button" className="btn btn-outline-danger">
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
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
