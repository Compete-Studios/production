import { useEffect, useState, useCallback } from 'react';
import { UserAuth } from '../../context/AuthContext';
import AnimateHeight from 'react-animate-height';
import { getAttendanceByClassAndDate, getStudentsByClassId, getTheClassScheduleByClassId } from '../../functions/api';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';

interface Student {
    Student_ID: string;
    Name: string;
    Phone: string;
    email: string;
    attendanceData?: Attendance[];
    attendanceRate?: number;
}

interface Attendance {
    StudentId: string;
    ClassDate: string;
}

interface Class {
    ClassId: string;
    Name: string;
    schedule?: Schedule[];
    students?: Student[];
    attendance?: Student[];
}

interface Schedule {
    DayOfWeek: string;
}

const StudentAttendanceReport: React.FC = () => {
    const { classes } = UserAuth() as { classes: Class[] };
    const [loading, setLoading] = useState<boolean>(false);
    const [attendance, setAttendance] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    const currentDate = new Date();
    const thisMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const thisMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const [startDate, setStartDate] = useState<Date>(thisMonthStartDate);
    const [endDate, setEndDate] = useState<Date>(thisMonthEndDate);

    const getStudentsByClassIdFunc = async (classId: string): Promise<Student[]> => {
        try {
            const res = await getStudentsByClassId(classId);
            console.log(`Response for class ${classId}:`, res);

            // Check if the response has the correct structure and contains students
            if (res && Array.isArray(res)) {
                return res;
            } else if (res && res.recordset && Array.isArray(res.recordset)) {
                return res.recordset;
            } else {
                console.log(`Unexpected response structure for class ${classId}. Response:`, res);
                return [];
            }
        } catch (error) {
            console.log(`Error fetching students for class ${classId}:`, error);
            return [];
        }
    };

    const getAttendanceByClassAndDateFunc = async (classId: string, studentId: string, startDate: string, endDate: string): Promise<Attendance[]> => {
        try {
            const response = await getAttendanceByClassAndDate(classId, studentId, startDate, endDate);
            console.log(`Fetched attendance for student ${studentId} in class ${classId}:`, response.recordset);
            return response.recordset;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const getClassScheduleByClassIdFunc = async (classId: string): Promise<Schedule[]> => {
        try {
            const response = await getTheClassScheduleByClassId(classId);
            return response.recordset;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const toggleClassTab = (classId: string) => {
        setSelectedClassId(selectedClassId === classId ? null : classId);
    };

    const calculateClassMeetingDates = (dayOfWeek: string, startDate: Date, endDate: Date): Date[] => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const classMeetingDates: Date[] = [];
        const daysOfWeek: { [key: string]: number } = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
        };

        const dayOfWeekNumber = daysOfWeek[dayOfWeek];

        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            if (date.getDay() === dayOfWeekNumber) {
                classMeetingDates.push(new Date(date));
            }
        }

        return classMeetingDates;
    };

    const fetchAttendanceData = useCallback(async (startDate: Date, endDate: Date) => {
        setLoading(true);
        // Set dates
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        try {
            // What days does each class meet on?
            const schedulesPromises = classes.map((classItem) => getClassScheduleByClassIdFunc(classItem.ClassId));
            const schedules = await Promise.all(schedulesPromises);

            const classesWithSchedules = classes.map((classItem, index) => ({
                ...classItem,
                schedule: schedules[index] || [],
            }));

            // Get attendance for each student in each class
            const classesWithStudentsAndAttendance = await Promise.all(
                classesWithSchedules.map(async (classItem) => {
                    const students = await getStudentsByClassIdFunc(classItem.ClassId);
                    const attendance = await Promise.all(
                        students.map(async (student) => {
                            const attendanceData = await getAttendanceByClassAndDateFunc(classItem.ClassId, student.Student_ID, formattedStartDate, formattedEndDate);
                            return { ...student, attendanceData };
                        })
                    );
                    attendance.forEach((student) => {
                        const attendanceCount = student.attendanceData?.length ?? 0;
                        if (classItem.schedule.length === 0) {
                            student.attendanceRate = 0;
                        } else {
                            const dayOfWeek = classItem.schedule[0]?.DayOfWeek;
                            const totalClasses = calculateClassMeetingDates(dayOfWeek, startDate, endDate);
                            student.attendanceRate = (attendanceCount / totalClasses.length) * 100;
                        }
                    });
                    return { ...classItem, students, attendance };
                })
            );

            console.log('Final attendance data:', classesWithStudentsAndAttendance);
            setAttendance(classesWithStudentsAndAttendance);
        } catch (error) {
            console.error('Error fetching data:', error);
            setAttendance([]);
        } finally {
            setLoading(false);
        }
    }, [classes]);


    const handleDateChange = async () => {
        await fetchAttendanceData(startDate, endDate);
    };

    useEffect(() => {
        if (classes && classes.length > 0) {
            fetchAttendanceData(startDate, endDate);
        } else {
            console.log('Waiting for studioClasses to be populated...');
        }
    }, [classes, startDate, endDate, fetchAttendanceData]);

    const AttendanceRow: React.FC<{ student: Student }> = ({ student }) => {
        const attendanceColor = student.attendanceRate! >= 75 ? 'green' : student.attendanceRate! >= 50 ? 'yellow' : 'red';

        return (
            <tr key={student.Student_ID}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-${attendanceColor}-600`}>
                    {student.attendanceRate?.toFixed(0)}%
                </td>
            </tr>
        );
    };

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">Attendance</h2>
                    <p className="text-muted-foreground">See how your students are doing with their attendance for all classes</p>
                </div>
            </div>
            <div className="flex items-end gap-x-2">
                <div className="grid gap-2">
                    <span className="text-sm text-gray-500 font-medium">From:</span>
                    <div className="mt-2">
                        <input
                            type="date"
                            id="start-date"
                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                            value={startDate.toISOString().split('T')[0]}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <span className="text-sm text-gray-500 font-medium">To:</span>
                    <div className="mt-2">
                        <input
                            type="date"
                            id="end-date"
                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                            value={endDate.toISOString().split('T')[0]}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-sm bg-blue-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 flex items-center"
                        onClick={handleDateChange}
                    >
                        Update
                    </button>
                </div>
            </div>
            {loading ? (
                <p>Compiling attendance data...this can take a moment...</p>
            ) : (
                <div>
                    <div className="space-y-2 font-semibold">
                        {attendance.map((classItem) => (
                            <div key={classItem.ClassId} className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                                <button
                                    className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] bg-white`}
                                    onClick={() => toggleClassTab(classItem.ClassId)}
                                >
                                    {classItem.Name}
                                    <div className={`ltr:ml-auto rtl:mr-auto`}>
                                        <IconCaretDown className={`transform ${selectedClassId === classItem.ClassId ? 'rotate-180' : 'rotate-0'}`} />
                                    </div>
                                </button>
                                {selectedClassId === classItem.ClassId && (
                                    <AnimateHeight duration={300} height={'auto'}>
                                        <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                            <div className="mb-4">
                                                <span className="font-medium">This Class Met On: </span>
                                                {classItem.schedule && calculateClassMeetingDates(classItem.schedule[0]?.DayOfWeek, startDate, endDate)
                                                    .map((date) => date.toLocaleDateString())
                                                    .join(', ')}
                                            </div>
                                            <table className="min-w-full bg-white shadow-md rounded-lg">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Rate</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {classItem.attendance && classItem.attendance.map((student) => (
                                                        <tr key={student.Student_ID}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.Name}</td>
                                                            <AttendanceRow student={student} />
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {student.attendanceData && student.attendanceData.length > 0 ? (
                                                                    student.attendanceData.map((attendance) => (
                                                                        <div key={attendance.StudentId} className="flex items-center space-x-2">
                                                                            <span>{new Date(attendance.ClassDate).toLocaleDateString()}</span>
                                                                            <span className="text-green-600">
                                                                                <IconCircleCheck />
                                                                            </span>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-red-600">No Attendance Records Found</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </AnimateHeight>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAttendanceReport;
