import { useEffect, useState } from 'react';
import { UserAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { showErrorMessage, showMessage } from '../../../functions/shared';
import { hashTheID } from '../../../functions/shared';
import {
    addBillingAccount,
    dropStudentFromBillingAccount,
    getStudentsByBillingId,
} from '../../../functions/api';

interface Student {
    Student_id: number;
    StudentId: number;
    Name: string;
}

export default function StudentsOnBillingAccount({ paysimpleCustomerId }: any) {
    const { students, suid }: any = UserAuth();
    const [studentsOnAccount, setStudentsOnAccount] = useState<Student[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (paysimpleCustomerId) {
            fetchStudents();
        }
    }, [paysimpleCustomerId]);

    const fetchStudents = async () => {
        const response = await getStudentsByBillingId(paysimpleCustomerId);
        setStudentsOnAccount(response.recordset);
    };

    const removeStudent = async (studentId: any) => {
        try {
            const response = await dropStudentFromBillingAccount(studentId, paysimpleCustomerId);
            if (response.rowsAffected[0] > 0) {
                showMessage('Student removed from billing account');
                // Refresh the list of students associated with the billing account
                fetchStudents();
            } else {
                console.log(response);
                showErrorMessage('Error removing student from billing account');
            }
        } catch (error) {
            console.error(error);
            showErrorMessage('Error removing student from billing account');
        }
    };

    const handleStudentClick = (studentId: number) => {
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Navigate to the student's info page
        navigate(`/students/view-student/${hashTheID(studentId)}/${hashTheID(suid)}`);
    };

    return (
        <div className="flex items-center gap-2">
            {studentsOnAccount.length > 0 && (
                <div className='md-4'>
                    <h3 className="font-bold">Students Attached to this Billing Account:</h3>
                    <ul>
                        {studentsOnAccount.map((student) => (
                            <li key={student.Student_id} className="flex items-center justify-between">
                                <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => handleStudentClick(student.StudentId)}
                                >
                                    {student.Name}
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-800 p-1"
                                    onClick={() => removeStudent(student.StudentId)}
                                    aria-label="Remove student"
                                >
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
