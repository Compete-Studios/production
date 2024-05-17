import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconEye from '../../components/Icon/IconEye';
import { getStaffClassesByStaffId } from '../../functions/api';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import { convertPhone } from '../../functions/shared';

export default function ViewStaffMember({ staffID }: any) {
  const { staff }: any = UserAuth();
    const [modal1, setModal1] = useState(false);
    const [staffClasses, setStaffClasses] = useState<any>([]);
    const [staffInfo, setStaffInfo] = useState<any>({});

    const getStaffInfo = async (id: any) => {
        setModal1(true);
        try {
            const response = await getStaffClassesByStaffId(id);
            setStaffClasses(response.recordset);
            const staffData = await staff.find((staff: any) => staff.StaffId === id);
            setStaffInfo(staffData);
        } catch (error) {
            console.error(error);
        }
    };

    console.log(staffClasses, staffInfo);

    return (
        <div className="mb-5">
            <div className="flex items-center justify-center">
                <button type="button" className="text-info hover:text-blue-800" onClick={() => getStaffInfo(staffID)}>
                    <IconEye />
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
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-start justify-between px-5 py-3">
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-500">
                                                    <span className="text-xl font-medium leading-none text-white">
                                                    {staffInfo?.FirstName?.charAt(0)}
                                                      </span>
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold">
                                                    {staffInfo?.FirstName} {staffInfo?.LastName}
                                                </h4>
                                                <p className="mt-1">
                                                   {staffInfo?.email}
                                                </p>
                                                <p>
                                                   {convertPhone(staffInfo?.Phone)}
                                                </p>
                                            </div>
                                        </div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <p>
                                            Mauris mi tellus, pharetra vel mattis sed, tempus ultrices eros. Phasellus egestas sit amet velit sed luctus. Orci varius natoque penatibus et magnis dis
                                            parturient montes, nascetur ridiculus mus. Suspendisse potenti. Vivamus ultrices sed urna ac pulvinar. Ut sit amet ullamcorper mi.
                                        </p>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setModal1(false)}>
                                                Discard
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModal1(false)}>
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
    );
}
