import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';
import { addStaffToClass } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import IconX from '../../components/Icon/IconX';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { showErrorMessage, showMessage } from '../../functions/shared';
import IconUserPlus from '../../components/Icon/IconUserPlus';

export default function AddStaffToClass({ classData, updatedClasses, setUpdatedClasses }: any) {
    const { staff }: any = UserAuth();
    
    const [modal21, setModal21] = useState(false);
    const setNewDateTo12PM = () => {
        const newDate = new Date();
        newDate.setHours(12, 0, 0, 0);
        return newDate;
    };
    const [staffIDToAdd, setStaffIDToAdd] = useState('');

    const [isLoading, setIsLoading] = useState(false);

  
    const handleAddStaffToClass = async () => {
        setIsLoading(true);       
        try {
            const response = await addStaffToClass(staffIDToAdd, classData.ClassId);        
            if (response.status === 200) {
                showMessage('Staff added successfully');
                setModal21(false);
                setUpdatedClasses(!updatedClasses);
                setIsLoading(false);
            } else {
                showErrorMessage('Failed to add staff');
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            showErrorMessage('Failed to add staff');
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Tippy content="Assign Instructor">
                <button onClick={() => setModal21(true)}>
                    <IconUserPlus className="ltr:mr-2 rtl:ml-2 text-info" />
                </button>
            </Tippy>

            <Transition appear show={modal21} as={Fragment}>
                <Dialog
                    as="div"
                    open={modal21}
                    onClose={() => {
                        setModal21(false);
                    }}
                >
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="register_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4 ">
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
                                        <h5 className="text-lg">
                                            Add Staff to Class: <span className="font-bold text-secondary">{classData?.Name}</span>
                                        </h5>
                                        <button onClick={() => setModal21(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 px-5">You can assign as many staff as you want to this class.</p>
                                    <div className="p-5 ">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label htmlFor="staff">Select Staff</label>
                                                <select
                                                    id="staff"
                                                    name="staff"
                                                    className="form-select"
                                                    onChange={(e) => {
                                                        setStaffIDToAdd(e.target.value);
                                                    }}
                                                >
                                                    <option value="">Select Staff</option>
                                                    {staff?.map((st: any) => {
                                                        return (
                                                            <option key={st.StaffId} value={st.StaffId}>
                                                                {st.FirstName} {st.LastName}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setModal21(false)}>
                                                Discard
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleAddStaffToClass}>
                                                Assign {staffIDToAdd}
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
    );
}
