import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import IconX from '../../components/Icon/IconX';
import { hashTheID } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function StudentDetailsModal({ isOpen, onRequestClose, students, prospects, category }: { isOpen: boolean, onRequestClose: () => void, students: any[], prospects: any[], category: string }) {
    const { suid }: any = UserAuth();
    const navigate = useNavigate();

    const handleViewStudent = (id: string, type: string) => {
        const hashedStudentId = hashTheID(id);
        const hashedSUID = hashTheID(suid);
        let url = `/students/view-student/${hashedStudentId}/${hashedSUID}`;
        // If type is prospect, then change the url
        if(type === 'prospect'){
            url = `/prospects/view-prospect/${hashedStudentId}/${hashedSUID}`;
        }
        navigate(url);
        //window.open(url, '_same', 'noopener,noreferrer');
    };


    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" open={isOpen} onClose={onRequestClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
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
                                    <h5 className="font-bold text-lg">{category}</h5>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={onRequestClose}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h5 className="font-bold text-lg">Students</h5>
                                    {students && students.length > 0 ? (
                                        <ul>
                                            {students.map((student, index) => (
                                                <li key={index} className="student-item">
                                                    <a
                                                        onClick={() => handleViewStudent(student.student_Id, 'student')}
                                                        className='text-blue-500 hover:underline'
                                                        href='#'
                                                    >
                                                        {student.First_Name} {student.Last_Name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No students available for this category.</p>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h5 className="font-bold text-lg">Prospects</h5>
                                    {prospects && prospects.length > 0 ? (
                                        <ul>
                                            {prospects.map((prospect, index) => (
                                                <li key={index} className="student-item">
                                                    <a
                                                        onClick={() => handleViewStudent(prospect.prospectId, 'prospect')}
                                                        className='text-blue-500 hover:underline'
                                                        href='#'
                                                    >
                                                        {prospect.FName} {prospect.LName}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No prospects available for this category.</p>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
