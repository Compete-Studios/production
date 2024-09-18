 import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { UserAuth } from "../../context/AuthContext";
import { getAllActivePaymentSchedules, getInternalPaymentSchedulesByStudioId } from "../../functions/payments";
import { convertPhone, hashTheID } from '../../functions/shared';
import { Link } from 'react-router-dom';
import AnimateHeight from 'react-animate-height';

interface Student {
    Student_ID: number;
    First_Name: string;
    Last_Name: string;
    PaysimpleCustomerId: number;
    email: string;
    Phone: string;
}

interface PaymentSchedule {
    Id: number; //ID of the schedule itself
    CustomerId: number; //ID of the customer in Paysimple
    AccountId: number; //ID of the payment method
    CustomerFirstName: string;
    CustomerLastName: string;
}

interface GetStudentsResult {
    studentsWithoutSchedules: Student[];
    studentsEndingSoon: Student[];
}

const StudentsToRenew = () => {
    const { suid, students }: any = UserAuth();
    const [loading, setLoading] = useState(true);
    const [studentsToRenew, setStudentsToRenew] = useState<Student[] | undefined>(undefined);
    const [studentsEndingSoon, setStudentsEndingSoon] = useState<Student[] | undefined>(undefined);
    const [selectedTab, setSelectedTab] = useState<string | null>(null);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Students To Renew'));
    });

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const result = await getStudents();
                if (result) {
                    setStudentsToRenew(result.studentsWithoutSchedules);
                    setStudentsEndingSoon(result.studentsEndingSoon);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [students]);

    const toggleTab = (tabId: string) => {
        setSelectedTab(selectedTab === tabId ? null : tabId);
    };

    const getStudents = async (): Promise<GetStudentsResult | undefined> => {
        try {
            let studentsWithoutSchedules: Student[] = [];
            let studentsEndingSoon: Student[] = [];

            // Fetch all payment schedules from Paysimple
            const allPaymentSchedules = await getAllActivePaymentSchedules(suid);
            // Fetch all internal and PIF payment schedules from our db
            const allInternalPaymentSchedules = await getInternalPaymentSchedulesByStudioId(suid);

            const now = new Date();
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(now.getDate() + 30);

            if (allPaymentSchedules.Meta && allPaymentSchedules.Meta.HttpStatus === "OK" && allPaymentSchedules.Meta.PagingDetails.TotalItems > 0) {
                studentsWithoutSchedules = students.filter((student: Student) => {
                    const schedule = allPaymentSchedules.Response.find((schedule: PaymentSchedule) =>
                        schedule.CustomerId === student.PaysimpleCustomerId
                    );

                    if (!schedule) {
                        return true; // No payment schedule found for this student
                    }

                    const endDate = new Date(schedule.EndDate);

                    if (endDate.getTime() > now.getTime() && endDate.getTime() <= thirtyDaysFromNow.getTime()) {
                        studentsEndingSoon.push(student); // Payment schedule ending soon
                        return false;
                    }

                    return false;
                });
            } else {
                studentsWithoutSchedules = students; // If no payment schedules, consider all students without schedules
            }

            if (allInternalPaymentSchedules.length > 0) {
                studentsWithoutSchedules = studentsWithoutSchedules.filter((student: Student) =>
                    !allInternalPaymentSchedules.some((schedule: any) =>
                        schedule.StudentId === student.Student_ID
                    )
                );
            }

            return { studentsWithoutSchedules, studentsEndingSoon };
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="space-y-2 font-semibold">
                <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                    <button
                        className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] bg-white`}
                        onClick={() => toggleTab('withoutSchedules')}
                    >
                        Students Without Payment Schedules
                        <div className={`ltr:ml-auto rtl:mr-auto`}>
                            <span className={`transform ${selectedTab === 'withoutSchedules' ? 'rotate-180' : 'rotate-0'}`}>
                                ▼
                            </span>
                        </div>
                    </button>
                    {selectedTab === 'withoutSchedules' && (
                        <AnimateHeight duration={300} height={'auto'}>
                            <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                {loading ? (
                                    <p>Loading...</p>
                                ) : studentsToRenew && studentsToRenew.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th className="!text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {studentsToRenew.map((contact: any): JSX.Element => (
                                                    <tr key={contact.Student_ID}>
                                                        <td>
                                                            <div className="flex items-center w-max">
                                                                <div>{contact.Name}</div>
                                                            </div>
                                                        </td>
                                                        <td>{contact.email}</td>
                                                        <td className="whitespace-nowrap">{convertPhone(contact.Phone)}</td>
                                                        <td>
                                                            <div className="flex gap-4 items-center justify-center">
                                                                <Link to={`/students/view-student/${hashTheID(contact.Student_ID)}/${hashTheID(suid)}`} type="button" className="btn btn-sm btn-outline-info">
                                                                    View
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No students found without payment schedules.</p>
                                )}
                            </div>
                        </AnimateHeight>
                    )}
                </div>

                <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                    <button
                        className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] bg-white`}
                        onClick={() => toggleTab('expiringSoon')}
                    >
                        Payments Expiring in 30 Days
                        <div className={`ltr:ml-auto rtl:mr-auto`}>
                            <span className={`transform ${selectedTab === 'expiringSoon' ? 'rotate-180' : 'rotate-0'}`}>
                                ▼
                            </span>
                        </div>
                    </button>
                    {selectedTab === 'expiringSoon' && (
                        <AnimateHeight duration={300} height={'auto'}>
                            <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                {loading ? (
                                    <p>Loading...</p>
                                ) : studentsEndingSoon && studentsEndingSoon.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th className="!text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {studentsEndingSoon.map((contact: any): JSX.Element => (
                                                    <tr key={contact.Student_ID}>
                                                        <td>
                                                            <div className="flex items-center w-max">
                                                                <div>{contact.Name}</div>
                                                            </div>
                                                        </td>
                                                        <td>{contact.email}</td>
                                                        <td className="whitespace-nowrap">{convertPhone(contact.Phone)}</td>
                                                        <td>
                                                            <div className="flex gap-4 items-center justify-center">
                                                                <Link to={`/students/view-student/${hashTheID(contact.Student_ID)}/${hashTheID(suid)}`} type="button" className="btn btn-sm btn-outline-info">
                                                                    View
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No students found with payments expiring soon.</p>
                                )}
                            </div>
                        </AnimateHeight>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentsToRenew;
