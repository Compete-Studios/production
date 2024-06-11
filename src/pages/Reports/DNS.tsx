import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { getClassesByStudentId, getDNSReportForReport } from "../../functions/api";
import { showErrorMessage } from "../../functions/shared";

const DNS = () => {
    const { students }: any = UserAuth();
    const [dnsData, setDnsData] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);

    //Initialize the date range to the last two weeks
    const currentDate = new Date();
    const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
    const [date, setDate] = useState(twoWeeksAgo);

    const getDNSReport = async (studentId: any, date: any) => {
        try {
            const response = await getDNSReportForReport(studentId, date);
            return { studentId, classes: response.recordset };
        } catch (error) {
            console.log(error);
            return { studentId, classes: [] };
        }
    };

    const getClassesEnrolled = async (studentId: any) => {
        try {
            const response = await getClassesByStudentId(studentId);
            return response.recordset;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const fetchDNSData = async (date: any) => {
        const dateObj = new Date(date);
        const formattedDate = dateObj.toISOString().slice(0, 10);
        setLoading(true);
        //console.log('Fetching DNS data for date: ', formattedDate, students);
        try {
            const studentDNSPromises = students.map((student: any) =>
                getDNSReport(student.Student_ID, formattedDate)
            );
            const studentDNS = await Promise.all(studentDNSPromises);

            // Create a Set of student IDs who have attended classes
            const attendedStudentIDs = new Set(
                studentDNS.flatMap(report =>
                    report.classes.length > 0 ? [report.studentId] : []
                )
            );

            // Filter out students who attended, leaving those who didn't
            const studentsWhoDidNotShow = students.filter((student: any) =>
                !attendedStudentIDs.has(student.Student_ID)
            );

            // Get the classes each student is enrolled in
            const studentsWithClasses: any = await Promise.all(studentsWhoDidNotShow.map(async (student: any) => {
                const classes = await getClassesEnrolled(student.Student_ID);
                return {
                    ...student,
                    classes
                };
            }));

            setDnsData(studentsWithClasses);
        
        } catch (error) {
            console.error(error);
            showErrorMessage(`Error fetching students. Error: ${(error as Error).message}`);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        if (date && students && students.length > 0) {
            fetchDNSData(date);
        }
    }, [date, students]);


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
                <div className="grid gap-2" >
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
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Phone
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Email
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Enrolled in:
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {dnsData.map((student: any) => (
                                            <tr key={student.Student_id}>
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
                                                    {student.classes.map((classObj: any, index: any) => (
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