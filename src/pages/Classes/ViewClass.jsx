import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconX from '../../components/Icon/IconX';
import IconEye from '../../components/Icon/IconEye';
import { UserAuth } from '../../context/AuthContext';
import { getProspectsByClassId, getStaffByClassId, getStudentsByClassId, getTheClassScheduleByClassId } from '../../functions/api';

export default function ViewClass({ classId }) {
    const { classes } = UserAuth();
    const [modal18, setModal18] = useState(false);
    const [classInfo, setClassInfo] = useState({});
    const [staffInfo, setStaffInfo] = useState({});
    const [scheduleInfo, setScheduleInfo] = useState({});
    const [studentRoster, setStudentRoster] = useState({});
    const [prospectRoster, setProspectRoster] = useState({});

    const handleGetClassInfo = async () => {
        const classForEditing = classes.find((c) => c.ClassId === classId);
        setClassInfo(classForEditing);
        try {
            getStaffByClassId(classId).then((res) => {
                setStaffInfo(res);
            });
        } catch (error) {
            console.log(error);
        }
        try {
            getTheClassScheduleByClassId(classId).then((response) => {
                // setScheduleInfo(response);
            });
        } catch (error) {
            console.log(error);
        }
        try {
            getStudentsByClassId(classId).then((res) => {
                setStudentRoster(res);
            });
            getProspectsByClassId(classId).then((res) => {
                setProspectRoster(res);
            });
        } catch (error) {
            console.log(error);
        }
        setModal18(true);
    };

    const getTimeOnlyfromZulueStamp = (date) => {
        const timeString = date?.split('T')[1];
        return timeString?.slice(0, 5);
    };  

    return (
        <div>
            <Tippy content="View Class">
                <button onClick={() => handleGetClassInfo()} type="button" className="flex text-info hover:text-primary">
                    <IconEye />
                </button>
            </Tippy>
            <Transition appear show={modal18} as={Fragment}>
                <Dialog as="div" open={modal18} onClose={() => setModal18(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="tabs_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
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
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">View Class {classId}</h5>
                                        <button onClick={() => setModal18(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <Tab.Group>
                                            <Tab.List className="flex flex-wrap mt-3 border-b border-white-light dark:border-[#191e3a]">
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            type="button"
                                                            className={`${
                                                                selected ? '!border-white-light !border-b-white  text-primary dark:!border-[#191e3a] dark:!border-b-black !outline-none ' : ''
                                                            } p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-b-black`}
                                                        >
                                                            Class Info
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            type="button"
                                                            className={`${
                                                                selected ? '!border-white-light !border-b-white  text-primary dark:!border-[#191e3a] dark:!border-b-black !outline-none ' : ''
                                                            } p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-b-black`}
                                                        >
                                                            Staff
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            type="button"
                                                            className={`${
                                                                selected ? '!border-white-light !border-b-white  text-primary dark:!border-[#191e3a] dark:!border-b-black !outline-none ' : ''
                                                            } p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-b-black`}
                                                        >
                                                            Schedule
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            type="button"
                                                            className={`${
                                                                selected ? '!border-white-light !border-b-white  text-primary dark:!border-[#191e3a] dark:!border-b-black !outline-none ' : ''
                                                            } p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-b-black`}
                                                        >
                                                            Students
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            type="button"
                                                            className={`${
                                                                selected ? '!border-white-light !border-b-white  text-primary dark:!border-[#191e3a] dark:!border-b-black !outline-none ' : ''
                                                            } p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-b-black`}
                                                        >
                                                            Prospects
                                                        </button>
                                                    )}
                                                </Tab>
                                            </Tab.List>
                                            <Tab.Panels>
                                                <Tab.Panel>
                                                    <div className="active pt-5">
                                                        <h4 className="font-semibold text-2xl mb-4">{classInfo?.Name}</h4>
                                                        <p className="mb-4">{classInfo?.Description}</p>
                                                        <p>
                                                            <span className="font-bold">Enrollment</span> {classInfo?.enrollment}
                                                        </p>
                                                        <p>
                                                            <span className="font-bold">Prospects Enrolled</span> {classInfo?.prospectEnrollment}
                                                        </p>
                                                        <p>
                                                            <span className="font-bold">Enrollment Limit</span> {classInfo?.EnrollmentLimit}
                                                        </p>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div>
                                                        <div className="flex items-start pt-5">
                                                            <div className="flex-auto">
                                                                {staffInfo && staffInfo?.length > 0 ? (
                                                                    staffInfo?.map((staff) => (
                                                                        <div key={staff.StaffId} className="flex items-center justify-between mb-4">
                                                                            <div className="flex items-center">
                                                                                <div className="ltr:ml-4 rtl:mr-4">
                                                                                    <h5 className="font-semibold text-lg">
                                                                                        {staff.FirstName}
                                                                                        {staff.LastName}
                                                                                    </h5>
                                                                                    <p className="text-gray-500">{staff.Role}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p>No staff assigned</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div className="pt-5">
                                                        <p>
                                                            <span className="font-bold">Day of the Week:</span> {scheduleInfo?.DayOfWeek}
                                                        </p>
                                                        <p>
                                                            <span className="font-bold">Start Time:</span> {getTimeOnlyfromZulueStamp(scheduleInfo?.StartTime)}
                                                        </p>
                                                        <p>
                                                            <span className="font-bold">End Time:</span> {getTimeOnlyfromZulueStamp(scheduleInfo?.EndTime)}
                                                        </p>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div className="pt-5">
                                                        <h4 className="font-semibold text-2xl mb-4">Students</h4>
                                                        <div className="flex items-start">
                                                            <div className="flex-auto">
                                                                {studentRoster && studentRoster?.length > 0 ? (
                                                                    studentRoster?.map((student) => (
                                                                        <div key={student.StudentId} className="flex items-center justify-between mb-4">
                                                                            <div className="flex items-center">
                                                                                <div className="ltr:ml-4 rtl:mr-4">
                                                                                    <h5 className="font-semibold text-lg">{student.Name}</h5>
                                                                                    <p className="text-gray-500">{student.email}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p>No students enrolled</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div className="pt-5">
                                                        <h4 className="font-semibold text-2xl mb-4">Prospects</h4>
                                                        <div className="flex items-start">
                                                            <div className="flex-auto">
                                                                {prospectRoster && prospectRoster?.length > 0 ? (
                                                                    prospectRoster?.map((student) => (
                                                                        <div key={student.ProspectId} className="flex items-center justify-between mb-4">
                                                                            <div className="flex items-center">
                                                                                <div className="ltr:ml-4 rtl:mr-4">
                                                                                    <h5 className="font-semibold text-lg">{student.Name}</h5>
                                                                                    <p className="text-gray-500">{student.email}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p>No students enrolled</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tab.Panel>
                                            </Tab.Panels>
                                        </Tab.Group>
                                        <div className="flex justify-end items-center mt-8">
                                            <button onClick={() => setModal18(false)} type="button" className="btn btn-outline-danger">
                                                Close
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
