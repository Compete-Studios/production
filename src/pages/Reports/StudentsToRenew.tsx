import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { UserAuth } from "../../context/AuthContext";
import { getAllActivePaymentSchedules, getInternalPaymentSchedulesByStudioId } from "../../functions/payments";
import { convertPhone, hashTheID } from '../../functions/shared';
import { Link } from 'react-router-dom';

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

const StudentsToRenew = () => {
    const { suid, students }: any = UserAuth();
    const [loading, setLoading] = useState(true);
    const [studentsToRenew, setStudentsToRenew] = useState<Student[] | undefined>(undefined);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Students To Renew'));
    });

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await getStudents();
                if (response) {
                    setStudentsToRenew(response);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [students]);


    const getStudents = async () => {
        try {
            let studentsWithoutSchedules: Student[] = [];

            // Fetch all payment schedules from Paysimple
            const allPaymentSchedules = await getAllActivePaymentSchedules(suid);
            // Fetch all internal and PIF payment schedules from our db
            const allInternalPaymentSchedules = await getInternalPaymentSchedulesByStudioId(suid);

            // Compare students obj to allPaymentSchedules, return any students that don't have a schedule
            if (allPaymentSchedules.Meta && allPaymentSchedules.Meta.HttpStatus === "OK" && allPaymentSchedules.Meta.PagingDetails.TotalItems > 0) {
                studentsWithoutSchedules = students.filter((student: Student) =>
                    !allPaymentSchedules.Response.some((schedule: PaymentSchedule) =>
                        schedule.CustomerId === student.PaysimpleCustomerId
                    )
                );
            } else {
                studentsWithoutSchedules = students; // If no payment schedules, consider all students without schedules
            }

            // Now compare studentsWithoutSchedules to allInternalPaymentSchedules
            if (allInternalPaymentSchedules.length > 0) {
                studentsWithoutSchedules = studentsWithoutSchedules.filter((student: Student) =>
                    !allInternalPaymentSchedules.some((schedule: any) =>
                        schedule.StudentId === student.Student_ID
                    )
                );
            }

            return studentsWithoutSchedules;
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">Students Without Payment Schedules</h2>
                    <p className="text-muted-foreground">
                        This report shows all current students without any active payment schedules.
                    </p>
                </div>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : studentsToRenew ? (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
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
                                {studentsToRenew?.map((contact: any): JSX.Element => {
                                    return (
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
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
            ) : (
                <p>No students found.</p>
            )}

        </div>
    );
};

export default StudentsToRenew;
