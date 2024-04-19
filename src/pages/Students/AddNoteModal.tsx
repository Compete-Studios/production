import CodeHighlight from '../../components/Highlight';
import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import 'swiper/css';
import { setPageTitle } from '../../store/themeConfigSlice';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import IconX from '../../components/Icon/IconX';
import { updateStudentNotes } from '../../functions/api';
import Swal from 'sweetalert2';

export default function AddNoteModal({ student, setStudent }: any) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Modals'));
    });

    const [newNotes, setNewNotes] = useState('');
    const [initials, setInitials] = useState('');
    const currentDate = new Date();
    const noteDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear() % 100}`;

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
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
    
    const handleAddNoteToTopOfNotes = async (e: any) => {
        e.preventDefault();
        // Concatenate the new note with the existing notes, with the new note on top
        const newNote = noteDate + ' ' + initials + ' ' + newNotes + '\n' + student.notes;
        setStudent({ ...student, notes: newNote });
        updateStudentNotes(student?.Student_id, newNote);
        showMessage('Note Added Successfully');
        setModal2(false);
    };

    const [modal2, setModal2] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-center">
                <button type="button" onClick={() => setModal2(true)} className="btn btn-info">
                    Add Note
                </button>

                <Transition appear show={modal2} as={Fragment}>
                    <Dialog as="div" open={modal2} onClose={() => setModal2(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-center justify-center px-4">
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
                                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">Add Note for {student?.First_Name}</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                                <IconX />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <div>
                                                <label htmlFor="taskTag">Staff Initials</label>
                                                <input id="tags" type="text" className="form-input" placeholder="Enter Initials" autoComplete="off" onChange={(e) => setInitials(e.target.value)} />
                                            </div>
                                            <div className="mt-5">
                                                <label htmlFor="taskdesc">Note</label>
                                                <textarea id="description" className="form-textarea min-h-[130px]" placeholder="Enter Note" onChange={(e) => setNewNotes(e.target.value)}></textarea>
                                            </div>
                                            <div className="mt-8 flex items-center justify-end">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModal2(false)}>
                                                    Discard
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleAddNoteToTopOfNotes}>
                                                    Save
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
        </div>
    );
}
