/*
NOTES:

This page needs to handle many different cases.

The main case is when a student is the only student on a billing account. In this case, we can delete the student and remove them from all classes, programs, etc. If the student has any active payment schedules, we can also remove them. 

If there are multiple students on the billing account, we DO NOT touch the payment schedules. The page should warn the user of this and make it clear that any and all active payment schedules will remain active.

The server logic handles all of this, so long as we pass the correct parameters when calling dropStudent() on this page. If we pass only the studentId and the activityLevel, the server will only deactivate the student and nothing else. Then, here, we drop them from classes, etc.

If we also pass along the studioId and paysimpleCustomerId, the server will also suspend any active payment schedules. This is what we want to do when there is only one student on the billing account.

*/

import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../../context/AuthContext';
import { showErrorMessage, showMessage } from '../../../functions/shared';
import { formatDate } from '@fullcalendar/core';
import { dropStudent, dropStudentFromClass, dropStudentFromProgram, dropStudentFromWaitingList, getStudentsByBillingId, updateStudentByColumn } from '../../../functions/api';
import IconX from '../../../components/Icon/IconX';

interface BillingInfo {
    PaysimpleCustomerId?: string;
    AccountNumber?: string;
    BillingAddress?: string;
}

interface PaymentSchedule {
    ScheduleStatus: string;
    PaymentAmount: string;
    StartDate: string;
    EndDate: string;
}

interface Student {
    Student_id: string;
    First_Name: string;
    Last_Name: string;
    email: string;
    Phone: string;
    Phone2?: string;
    EntryDate: string;
    StudentPipelineStatus: number;
}

interface DeleteStudentProps {
    student: Student;
    billingInfo?: BillingInfo;
    paymentSchedules: PaymentSchedule[];
    classes?: any[];
    programs?: any[];
    waitingLists?: any[];
    onStudentUpdate: (updatedStudent: any) => void;
}

const DeleteStudent: React.FC<DeleteStudentProps> = ({ student, billingInfo, paymentSchedules, classes = [], programs = [], waitingLists = [], onStudentUpdate }) => {
    const { suid } = UserAuth() as { suid: string };
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [multipleStudentsOnBillingAccount, setMultipleStudentsOnBillingAccount] = useState<boolean>(false);

    useEffect(() => {
        if (billingInfo?.PaysimpleCustomerId) {
            loadStudentsOnBillingAccount(billingInfo.PaysimpleCustomerId);
        }
    }, [billingInfo]);

    const loadStudentsOnBillingAccount = async (billingAccountId: string) => {
        try {
            const res = await getStudentsByBillingId(billingAccountId);
            if (res.length > 1) {
                setMultipleStudentsOnBillingAccount(true);
            }
        } catch (error) {
            showErrorMessage('An error occurred while loading students on billing account');
        }
    };

    const deleteStudent = async () => {
        console.log('CLASSES:', classes);
        console.log('PROGRAMS:', programs);
        console.log('WAITING LISTS:', waitingLists);
        try {
            let data = {
                studentId: student.Student_id,
                activityLevel: 0,
                studioId: suid,
                paysimpleCustomerId: billingInfo?.PaysimpleCustomerId ?? null,
            };

            console.log('Single student on billing account', data);
            const results = await dropStudent(data);

            console.log('API Response:', results); // Log the complete response for debugging

            // Check if the response has the expected structure and success message
            if (results.body === "Success" || results === "Student deactivated and removed from classes and waiting lists.") {
                // Delete student from classes, waiting lists, programs, pipeline

                if (classes && classes.length > 0) {
                    for (let i = 0; i < classes.length; i++) {
                        await dropStudentFromClass(
                            student.Student_id,
                            classes[i].ClassId,
                        );
                    }
                }

                if (programs && programs.length > 0) {
                    for (let i = 0; i < programs.length; i++) {
                        await dropStudentFromProgram(
                            programs[i].ProgramId,
                            student.Student_id
                        );
                    }
                }

                if (waitingLists && waitingLists.length > 0) {
                    for (let i = 0; i < waitingLists.length; i++) {
                        await dropStudentFromWaitingList(
                            student.Student_id,
                            waitingLists[i].WaitingListId,
                        );
                    }
                }

                if (student.StudentPipelineStatus && student.StudentPipelineStatus !== -1) {
                    const data = {
                        studentId: student.Student_id,
                        columnName: 'StudentPipelineStatus',
                        value: -1,
                    };
                    await updateStudentByColumn(data);
                }

                showMessage('Student successfully deactivated.');
                onStudentUpdate({ ...student, activity: 0 }); // Update the student state in the parent component
            } else {
                showErrorMessage('An unknown error occurred: ' + (results.message || 'No additional details provided.'));
            }
        } catch (error) {
            console.error('Error deleting student:', error); // Log the error for debugging
            showErrorMessage('An error occurred while deleting the student');
        }
    };


    const convertPhoneNumber = (phone: string) => {
        return phone?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    };

    return (
        <div>
            <button
                className="uppercase font-lg font-bold w-full hover:bg-danger-light p-4 text-left"
                onClick={() => setShowDeleteModal(true)}
            >
                Delete Student
            </button>

            <Transition.Root show={showDeleteModal} as={Fragment}>
                <Dialog className="relative z-50" onClose={setShowDeleteModal}>
                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                            <div className="bg-gray-50 px-4 py-6 sm:px-6">
                                                <div className="flex items-start justify-between space-x-3">
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-500">
                                                            Verify the info below before deactivating the student.
                                                        </p>
                                                    </div>
                                                    <div className="flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="relative text-gray-400 hover:text-gray-500"
                                                            onClick={() => setShowDeleteModal(false)}
                                                        >
                                                            <span className="absolute -inset-2.5" />
                                                            <span className="sr-only">Close panel</span>
                                                            <IconX className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 space-y-6">
                                                <div>
                                                    <div className="font-semibold text-2xl">
                                                        {student?.First_Name} {student?.Last_Name}
                                                    </div>
                                                    <p className="font-normal text-sm">{student?.email}</p>
                                                    <p className="font-normal text-sm">{convertPhoneNumber(student?.Phone)}</p>
                                                    <p className="font-normal text-xs">
                                                        Created: {formatDate(student?.EntryDate)}
                                                    </p>

                                                    {billingInfo ? (
                                                        <div>
                                                            <h2 className="text-xl font-semibold">Billing Information</h2>
                                                            <p className="text-sm">
                                                                <strong>Account Number:</strong> {billingInfo?.AccountNumber ?? 'N/A'}
                                                            </p>
                                                            <p className="text-sm">
                                                                <strong>Billing Address:</strong> {billingInfo?.BillingAddress ?? 'N/A'}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p>No billing information available.</p>
                                                    )}

                                                    <h2 className="text-xl font-semibold">Payment Schedules</h2>
                                                    {paymentSchedules.length > 0 ? (
                                                        <div>
                                                            {paymentSchedules.map((data, index) => (
                                                                <div key={index} className="flex items-center text-xs gap-2 mt-2">
                                                                    <div
                                                                        className={`${data.ScheduleStatus === 'Active'
                                                                            ? 'text-success'
                                                                            : 'text-danger'
                                                                            }`}
                                                                    >
                                                                        {data.ScheduleStatus}
                                                                    </div>
                                                                    <div className="font-bold">
                                                                        ${parseFloat(data?.PaymentAmount).toFixed(2)}
                                                                    </div>
                                                                    <div>
                                                                        {formatDate(data?.StartDate)} - {formatDate(data?.EndDate)}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p>No active payment schedules.</p>
                                                    )}
                                                </div>
                                                <p className="text-lg mb-4">
                                                    Deactivating this student will remove them from all Classes, Programs, Ranks,
                                                    and so on. It will also remove them from their Billing Account, if they have one
                                                    set up. Note that any unpaid Invoices for this student will remain unpaid and open.
                                                </p>
                                                {multipleStudentsOnBillingAccount && (
                                                    <>
                                                        <p className="text-xl mb-4 text-danger">
                                                            There are multiple students attached to the billing account. Because of this,
                                                            any active payment schedules WILL REMAIN ACTIVE.
                                                        </p>
                                                        <p className="text-xl mb-4 text-danger">
                                                            Please make sure you double-check all payment schedules and update{' '}
                                                            <strong>or suspend</strong> them as needed before deactivating this student.
                                                        </p>
                                                    </>
                                                )}
                                                <button
                                                    className="uppercase font-lg font-bold w-full bg-danger text-white p-4 rounded hover:bg-danger-dark"
                                                    onClick={deleteStudent}
                                                >
                                                    Delete Student
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default DeleteStudent;
