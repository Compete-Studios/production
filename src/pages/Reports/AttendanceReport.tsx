import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import AnimateHeight from 'react-animate-height';
import { getAttendanceByClassAndDate, getStudentsByClassId, getTheClassScheduleByClassId } from '../../functions/api';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';

const StudentAttendanceReport = () => {
    const { classes }: any = UserAuth();
    //local variable of classes to update and morph without messing with global variable classes
    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);

    const currentDate = new Date();
    const thisMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const thisMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // Initialize date state with the current month's start and end dates for page load
    const [startDate, setStartDate] = useState(thisMonthStartDate);
    const [endDate, setEndDate] = useState(thisMonthEndDate);

    const getStudentsByClassIdFunc = async (classId: any) => {
        try {
            const res = await getStudentsByClassId(classId);
            return res;
        } catch (error) {
            console.log(error);
        }
    };

    const getAttendanceByClassAndDateFunc = async (classId: any, studentId: any, startDate: any, endDate: any) => {
        try {
            const response = await getAttendanceByClassAndDate(classId, studentId, startDate, endDate);
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    const getClassScheduleByClassIdFunc = async (classId: any) => {
        try {
            const response = await getTheClassScheduleByClassId(classId);
            return response.recordset;
        } catch (error) {
            console.log(error);
        }
    };

    // Handler to toggle class tab
    const toggleClassTab = (classId: any) => {
        setSelectedClassId(selectedClassId === classId ? null : classId);
    };

    const calculateClassMeetingDates = (dayOfWeek: any, startDate: any, endDate: any) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Ensure start date is the beginning of the day and end date is the end of the day
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        let classMeetingDates = [];
        const daysOfWeek = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
        };

        // Get the numeric representation of the day of week
        const dayOfWeekNumber: any = daysOfWeek[dayOfWeek];
        // Loop through each day
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            if (date.getDay() === dayOfWeekNumber) {
                classMeetingDates.push(new Date(date));
            }
        }

        return classMeetingDates;
    };

    const fetchAttendanceData = async (startDate: any, endDate: any) => {
        setLoading(true);
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        console.log('Fetching attendance data for date range:', formattedStartDate, formattedEndDate);
        try {
            // Fetch class schedules
            const schedulesPromises = classes.map((classItem: any) => getClassScheduleByClassIdFunc(classItem.ClassId));
            const schedules = await Promise.all(schedulesPromises);
            const classesWithSchedules = classes.map((classItem: any, index: any) => ({
                ...classItem,
                schedule: schedules[index],
            }));

            // Fetch students for each class
            const classesWithStudentsAndAttendance: any = await Promise.all(
                classesWithSchedules.map(async (classItem: any) => {
                    const students = await getStudentsByClassIdFunc(classItem.ClassId);
                    return { ...classItem, students };
                })
            );

            // Fetch attendance data for each class
            for (const classItem of classesWithStudentsAndAttendance) {
                classItem.attendance = await Promise.all(
                    classItem.students.map(async (student: any) => {
                        const attendanceData = await getAttendanceByClassAndDateFunc(classItem.ClassId, student.Student_ID, formattedStartDate, formattedEndDate);
                        return { ...student, attendanceData };
                    })
                );

                // Calculate attendance rate for each student
                classItem.attendance.forEach((student: any) => {
                    let attendanceCount = student.attendanceData.length;
                    if (classItem.schedule.length === 0) {
                        student.attendanceRate = 0;
                    } else {
                        let dayOfWeek = classItem.schedule[0].DayOfWeek;
                        let totalClasses = calculateClassMeetingDates(dayOfWeek, formattedStartDate, formattedEndDate);
                        student.attendanceRate = (attendanceCount / totalClasses.length) * 100;
                    }
                });
            }

            setAttendance(classesWithStudentsAndAttendance);
        } catch (error) {
            console.error('Error fetching data:', error);
            setAttendance([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = async () => {
        await fetchAttendanceData(startDate, endDate);
    };

    useEffect(() => {
        if (classes && classes.length > 0) {
            fetchAttendanceData(startDate, endDate);
        } else {
            console.log('Waiting for studioClasses to be populated...');
        }
    }, [classes]);

    const AttendanceRow = ({ student }: any) => {
        const attendanceColor = student.attendanceRate >= 75 ? 'green' : student.attendanceRate >= 50 ? 'yellow' : 'red';

        return (
            <tr key={student.Student_ID}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-${attendanceColor}-600`}>{student.attendanceRate.toFixed(0)}%</td>
            </tr>
        );
    };

    /* 
    ATTENDANCE STRUCTURE:
    ClassId,
    Description,
    EnrollmentLimit,
    Name, (this is the name of the class)
    Notes,
    StudioId,
    enrollment (int),
    prospectEnrollment,
    students [
        Student_ID, ClassId (always the same), Name (student's name), Phone, email
    ]
    attendance [
        Student_ID, ClassId (always the same), Name (student's name), ClassName, Phone, email, attendanceRate,
        attendanceData [
        (length = 0 if this student did not attend this class during the date range)
        OTHERWISE: StudentId, Name, ClassDate, length = 1
        ],
    ],
    */

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
                            id="date"
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
                            id="date
                            "
                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                            value={endDate.toISOString().split('T')[0]}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary" onClick={handleDateChange}>
                        Update
                    </button>
                </div>
            </div>
            {loading ? (
                <p>Compiling attendance data...this can take a moment...</p>
            ) : (
                <div>
                    {/* <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">Classes: </h3> */}
                    <div className="space-y-2 font-semibold">
                        {attendance?.map((classItem: any) => (
                            <div key={classItem.ClassId} className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                                <button className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] bg-white `} onClick={() => toggleClassTab(classItem.ClassId)}>
                                    {classItem.Name}
                                    <div className={`ltr:ml-auto rtl:mr-auto `}>
                                        <IconCaretDown className={`transform ${selectedClassId === classItem.ClassId ? 'rotate-180' : 'rotate-0'}`} />
                                    </div>
                                </button>
                                {selectedClassId === classItem.ClassId && (
                                    <AnimateHeight duration={300} height={'auto'}>
                                        <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                            <div className="mb-4">
                                                <span className="font-medium">This Class Met On: </span>
                                                {calculateClassMeetingDates(classItem.schedule[0]?.DayOfWeek, startDate, endDate)
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
                                                    {classItem.attendance.map((student: any) => (
                                                        <tr key={student.Student_ID}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.Name}</td>
                                                            <AttendanceRow student={student} />
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {student.attendanceData && student.attendanceData.length > 0 ? (
                                                                    student.attendanceData.map((attendance: any) => (
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
