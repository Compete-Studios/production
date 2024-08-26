import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import Tippy from '@tippyjs/react';
import Swal from 'sweetalert2';
import { setPageTitle } from '../../store/themeConfigSlice';
import { showErrorMessage, showMessage } from '../../functions/shared';
import { addBillingAccount } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import IconSearch from '../../components/Icon/IconSearch';
import IconX from '../../components/Icon/IconX';

export default function AddStudentToBillingAccountModal({ billingAccountId, update, setUpdate, inStudent = false }: any) {
    const dispatch = useDispatch();
    const { students }: any = UserAuth();
    const [modal, setModal] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<any>(students);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        dispatch(setPageTitle('Add Student to Billing Account'));

        setFilteredItems(() => {
            return students?.filter((item: any) =>
                item.Name.toLowerCase().includes(search.toLowerCase()) ||
                item.email.toLowerCase().includes(search.toLowerCase()) ||
                item.Phone.toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [search, students]);

    const handleCheckboxChange = (studentId: number) => {
        setSelectedStudentIds(prevSelected =>
            prevSelected.includes(studentId)
                ? prevSelected.filter(id => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    const handleAddStudents = async () => {
        try {
            for (let studentId of selectedStudentIds) {
                const data = {
                    studentId,
                    paysimpleCustomerId: billingAccountId,
                };
                console.log('ADDING BILLING ACCOUNT', data);
                await addBillingAccount(data);
            }
            showMessage('Students added to billing account');
            setUpdate(!update);
            setModal(false);
        } catch (error) {
            console.error(error);
            showErrorMessage('Error adding students to billing account');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center">
                {inStudent ? (
                    <Tippy content="Add Student">
                        <button className="uppercase font-lg font-bold w-full hover:bg-dark-light p-4 text-left flex items-center gap-4 whitespace-nowrap" onClick={() => setModal(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 14s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2z" />
                            </svg>
                            Add a Student to this Billing Account
                        </button>

                    </Tippy>
                ) :  (
                        <button
                            type="button"
                            className="relative block w-full rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 bg-gradient-to-r from-secondary via-purple-700 to-secondary hover:from-purple-900 hover:via-purple-900 hover:to-purple-900"
                            onClick={() => setModal(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-white" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 14s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2z" />
                            </svg>
                            <span className="mt-2 block text-sm font-semibold text-white">Add a Student</span>
                        </button>

                )}

                <Transition appear show={modal} as={Fragment}>
                    <Dialog as="div" open={modal} onClose={() => setModal(false)}>
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
                                            <div>
                                                <h5 className="text-lg font-bold">Add Students to Billing Account</h5>
                                                <p className="text-xs">Select students to add them to this billing account.</p>
                                            </div>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal(false)}>
                                                <IconX />
                                            </button>
                                        </div>

                                        <div className="p-5 grid grid-cols-6 gap-4">
                                            {errorMessage && (
                                                <div className="col-span-full">
                                                    <div className="relative flex items-center border p-3.5 rounded before:inline-block before:absolute before:top-1/2 ltr:before:right-0 rtl:before:left-0 rtl:before:rotate-180 before:-mt-2 before:border-r-8 before:border-t-8 before:border-b-8 before:border-t-transparent before:border-b-transparent before:border-r-inherit text-danger bg-danger-light border-danger ltr:border-r-[64px] rtl:border-l-[64px] dark:bg-danger-dark-light">
                                                        <span className="absolute ltr:-right-11 rtl:-left-11 inset-y-0 text-white w-6 h-6 m-auto">
                                                            <IconX />
                                                        </span>
                                                        <span className="ltr:pr-2 rtl:pl-2">
                                                            <strong className="ltr:mr-1 rtl:ml-1">Something went wrong!</strong>
                                                            {errorMessage}
                                                        </span>
                                                        <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80" onClick={() => setErrorMessage('')}>
                                                            <IconX />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="col-span-full">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Search Students"
                                                        className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary"
                                                    >
                                                        <IconSearch className="mx-auto" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="col-span-full">
                                                <div className="table-responsive">
                                                    <table className="table-striped table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th>Select</th>
                                                                <th>Name</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredItems?.map((contact: any) => (
                                                                <tr key={contact.Student_ID}>
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedStudentIds.includes(contact.Student_ID)}
                                                                            onChange={() => handleCheckboxChange(contact.Student_ID)}
                                                                        />
                                                                    </td>
                                                                    <td>{contact.Name}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="col-span-full mt-8 flex items-center justify-end">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModal(false)}>
                                                    Discard
                                                </button>
                                                <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4" onClick={handleAddStudents}>
                                                    Add Selected Students
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
