import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconEye from '../../components/Icon/IconEye';
import { getStaffClassesByStaffId } from '../../functions/api';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import { convertPhone, convertPhoneNumber } from '../../functions/shared';
import IconPhone from '../../components/Icon/IconPhone';
import IconMail from '../../components/Icon/IconMail';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import IconEdit from '../../components/Icon/IconEdit';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function ViewStaffMember({ staffID }: any) {
    const { staff, classes }: any = UserAuth();
    const [modal1, setModal1] = useState(false);
    const [staffClasses, setStaffClasses] = useState<any>([]);
    const [staffInfo, setStaffInfo] = useState<any>({});
    const [classDatesAndInfo, setClassDatesAndInfo] = useState<any>([]);

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

    useEffect(() => {
        const classInfo = staffClasses.map((staffClass: any) => {
            const classData = classes.find((classItem: any) => classItem.ClassId === staffClass.ClassId);
            return {
                ...classData,
            };
        });
        setClassDatesAndInfo(classInfo);
    }, [staffClasses]);

    return (
        <div className="mb-5">
            <div className="flex items-center justify-center">
              <Tippy content="View Staff Member" placement="top">
                <button type="button" className="text-info hover:text-blue-800" onClick={() => getStaffInfo(staffID)}>
                    <IconEye />
                </button>
              </Tippy>
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
                                            <div className="mr-4 flex-shrink-0 relative">
                                                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                                                    <span className="text-xl font-medium leading-none text-white">{staffInfo?.FirstName?.charAt(0)}</span>
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold flex items-start">
                                                    {staffInfo?.FirstName} {staffInfo?.LastName}
                                                    <button>
                                                        <IconEdit className="w-4 h-4 ml-1 text-info hover:text-blue-800" />
                                                    </button>
                                                </h4>
                                                <p className="mt-1 flex items-center">
                                                    <IconMail className="w-4 h-4 mr-1" />
                                                    {staffInfo?.email}
                                                </p>
                                                <p className="flex items-center">
                                                    <IconPhone className="w-4 h-4 mr-1" />
                                                    {convertPhoneNumber(staffInfo?.Phone)}
                                                </p>
                                            </div>
                                        </div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <h5 className="text-xs font-bold uppercase mt-4">Address</h5>
                                        <p className="text-md">{staffInfo?.address}</p>
                                        <p className="text-md">
                                            {staffInfo?.city}, {staffInfo?.state} {staffInfo?.zip}
                                        </p>
                                        <h5 className="text-xs font-bold uppercase mt-4">Security Level</h5>
                                        <p className="text-md">{staffInfo?.SecurityLevel}</p>
                                        <h5 className="text-xs font-bold uppercase mt-4">Birthday</h5>
                                        <p className="text-md">{formatWithTimeZone(staffInfo?.Birthday, handleGetTimeZoneOfUser)}</p>
                                        <h5 className="text-xs font-bold uppercase mt-4">Start Date</h5>
                                        <p className="text-md">{formatWithTimeZone(staffInfo?.StartDate, handleGetTimeZoneOfUser)}</p>
                                        <h5 className="text-xs font-bold uppercase mt-4">Classes</h5>
                                        {classDatesAndInfo.length > 0 ? (
                                            <div className="overflow-y-auto max-h-96">
                                                {classDatesAndInfo.map((staffClass: any, index: number) => (
                                                    <div key={index} className="py-1">
                                                        <p className="text-md"> - {staffClass.Name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-md">No classes assigned</p>
                                        )}
                                        <h5 className="text-xs font-bold uppercase mt-4">Notes</h5>
                                        <p className="text-md">{staffInfo?.notes}</p>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setModal1(false)}>
                                                Close
                                            </button>
                                            <button type="button" className="btn btn-info ltr:ml-4 rtl:mr-4 gap-1" onClick={() => setModal1(false)}>
                                                <IconMail /> Email {staffInfo?.FirstName}
                                            </button>
                                            <button type="button" className="btn btn-secondary ltr:ml-4 rtl:mr-4 gap-1" onClick={() => setModal1(false)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                                                    <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8m0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5" />
                                                </svg>
                                                Text {staffInfo?.FirstName}
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
