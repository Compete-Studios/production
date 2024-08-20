import { useEffect, useState, useCallback } from "react";
import { UserAuth } from "../../context/AuthContext";
import { getClassesByStudentId, getDNSReportForReport } from "../../functions/api";
import { showErrorMessage } from "../../functions/shared";

interface Student {
    Student_ID: string;
    First_Name: string;
    Last_Name: string;
    Phone: string;
    email: string;
}

interface Class {
    Name: string;
}

interface DNSReport {
    studentId: string;
    classes: Class[];
}

const DNS: React.FC = () => {
    const { students } = UserAuth() as { students: Student[] };
    const [dnsData, setDnsData] = useState<StudentWithClasses[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    interface StudentWithClasses extends Student {
        classes: Class[];
    }

    // Initialize the date range to the last two weeks
    const currentDate = new Date();
    const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
    const [date, setDate] = useState<Date>(twoWeeksAgo);

    const getDNSReport = async (studentId: string, date: string): Promise<DNSReport> => {
        try {
            const response = await getDNSReportForReport(studentId, date);
            return { studentId, classes: response.recordset };
        } catch (error) {
            console.log(error);
            return { studentId, classes: [] };
        }
    };

    const getClassesEnrolled = async (studentId: string): Promise<Class[]> => {
        try {
            const response = await getClassesByStudentId(studentId);
            return response.recordset;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const fetchDNSData = useCallback(async (date: Date) => {
        const formattedDate = date.toISOString().slice(0, 10);
        setLoading(true);
        try {
            const studentDNSPromises = students.map((student) =>
                getDNSReport(student.Student_ID, formattedDate)
            );
            const studentDNS = await Promise.all(studentDNSPromises);

            const attendedStudentIDs = new Set(
                studentDNS.flatMap(report => (report.classes.length > 0 ? [report.studentId] : []))
            );

            const studentsWhoDidNotShow = students.filter(
                (student) => !attendedStudentIDs.has(student.Student_ID)
            );

            const studentsWithClasses = await Promise.all(
                studentsWhoDidNotShow.map(async (student) => {
                    const classes = await getClassesEnrolled(student.Student_ID);
                    return {
                        ...student,
                        classes,
                    };
                })
            );

            setDnsData(studentsWithClasses);
        } catch (error) {
            console.error(error);
            showErrorMessage(`Error fetching students. Error: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    }, [students]);

    useEffect(() => {
        if (date && students && students.length > 0) {
            fetchDNSData(date);
        }
    }, [date, students, fetchDNSData]);

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">"Did Not Show" Report</h2>
                    <p className="text-muted-foreground">
                        Check which students have not shown up for class
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-x-2">
                <span className="text-sm text-gray-500 font-medium">Since:</span>
                <div className="grid gap-2">
                    <div className="mt-2">
                        <input
                            type="date"
                            id="date"
                            className="form-input"
                            value={date.toISOString().slice(0, 10)}
                            onChange={(e) => setDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
            </div>
            {loading ? (
                <p>Compiling DNS data...this can take a moment...</p>
            ) : (
                dnsData.length > 0 ? (
                    <div>
                        <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">Students: </h3>
                        <div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Enrolled in:
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dnsData.map((student) => (
                                        <tr key={student.Student_ID}>
                                            <td className="px-6 py-4 whitespace-normal word-break text-sm text-gray-500">
                                                {student.First_Name} {student.Last_Name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-normal word-break text-sm text-gray-500">
                                                {student.Phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-normal word-break text-sm text-gray-500">
                                                {student.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-normal word-break text-sm text-gray-500">
                                                {student.classes.map((classObj, index) => (
                                                    <span key={index}>{(index ? ', ' : '') + classObj.Name}</span>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p>No students found.</p>
                )
            )}
        </div>
    );
};

export default DNS;
