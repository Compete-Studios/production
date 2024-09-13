import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import IconEye from '../../components/Icon/IconEye';
import IconPrinter from '../../components/Icon/IconPrinter';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { REACT_API_BASE_URL } from '../../constants';
import {
    getProspectById,
    getProspectsInScheduleByPipelineStep,
    getProspectsInScheduleByPipelineStepFromArrayOfSteps,
    getStudentsInScheduleByPipelineStep,
    getStudentsInScheduleByPipelineStepFromArrayOfSteps,
    getStudioOptions,
} from '../../functions/api';
import ActionItemForSchedule from './ActionItemForSchedule';
import { hashTheID } from '../../functions/shared';
import IconLoader from '../../components/Icon/IconLoader';
import IconNotes from '../../components/Icon/IconNotes';
import UpdateNotesForStudent from '../Students/UpdateNotesForStudent';
import QuickAction from './QuickAction';
import IconNotesEdit from '../../components/Icon/IconNotesEdit';
import UpdateScheduleSteps from './UpdateScheduleSteps';

export default function Schedules() {
    const { suid, scheduleID, update, setUpdate }: any = UserAuth();
    const [dailyScheduleStudentSteps, setDailyScheduleStudentSteps] = useState<any>([]);
    const [dailyScheduleProspectSteps, setDailyScheduleProspectSteps] = useState<any>([]);
    const [dailyScheduleStudents, setDailyScheduleStudents] = useState<any>([]);
    const [dailyScheduleProspects, setDailyScheduleProspects] = useState<any>([]);
    const [studioOptions, setStudioOptions] = useState<any>([]);
    const [noStudents, setNoStudents] = useState(false);
    const [noProspects, setNoProspects] = useState(false);
    const [loading, setLoading] = useState(true);
    const [gettingStudents, setGettingStudents] = useState(true);
    const [gettingProspects, setGettingProspects] = useState(true);
    const [scheduleDate, setScheduleDate] = useState(new Date());

    useEffect(() => {
        try {
            getStudioOptions(suid).then((res) => {
                setStudioOptions(res.recordset[0]);
            });
        } catch (error) {
            console.log(error);
        }
    }, [suid]);

    const handleGetStudents = async () => {
        const data = await fetch(`${REACT_API_BASE_URL}/daily-schedule-tools/getSPStepsForSchedule/${scheduleID}/${suid}`);
        const dataJson = await data.json();
        if (dataJson.length > 0) {
            setDailyScheduleStudentSteps(dataJson);
           
        } else {
            setDailyScheduleStudentSteps([]);
            setGettingStudents(false);
        }
    };

    const handleGetProspects = async () => {
        const data = await fetch(`${REACT_API_BASE_URL}/daily-schedule-tools/getPPStepsForSchedule/${scheduleID}/${suid}`);
        const dataJson = await data.json();
        if (dataJson?.recordset?.length > 0) {
            setDailyScheduleProspectSteps(dataJson.recordset);
           
        } else {
            setDailyScheduleProspectSteps([]);
            setGettingProspects(false);
        }
    };

    useEffect(() => {
        if (scheduleID) {
            handleGetStudents();
            handleGetProspects();
        }
    }, [suid, scheduleID, update]);

    const handleGetNewSchedule = async () => {
        handleGetStudents();
        handleGetProspects();
        setGettingStudents(true);
        setGettingProspects(true);
    };

    useEffect(() => {
        if (!gettingStudents && !gettingProspects) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [gettingStudents, gettingProspects]);

    const getStudents = async () => {
        if (dailyScheduleStudentSteps?.length > 0) {
            // Format today's date as 'YYYY-MM-DD'
            const formattedDate = scheduleDate.toISOString().split('T')[0];

            const data = {
                studioId: suid,
                steps: dailyScheduleStudentSteps,
                nextContactDate: formattedDate, // Set to today's date
            };

            const response = await getStudentsInScheduleByPipelineStepFromArrayOfSteps(data);
            const filteredResponse = response.filter((item: any) => item.recordset.length > 1);

            // Extract student data from filtered response
            const studentData = filteredResponse.map((item: any) => item.recordset).flat();

            // Grouping student data by Student_id
            const groupedStudents: any = {};
            studentData.forEach((student: any) => {
                const studentId = student.Student_id;
                if (!groupedStudents[studentId]) {
                    groupedStudents[studentId] = {
                        StepName: student.StepName,
                        Student_id: student.Student_id,
                        StudentName: student.StudentName,
                        Contact1: student.Contact1,
                        Classes: [student.ClassName], // Assuming you want an array of class names
                    };
                } else {
                    groupedStudents[studentId].Classes.push(student.ClassName);
                }
            });
            // Converting the grouped students object to an array
            const dailySS = Object.values(groupedStudents);
            setDailyScheduleStudents(dailySS);
            setGettingStudents(false);
        } else {
            console.log('No students today');
        }
    };

    const getProspects = async () => {
        if (dailyScheduleProspectSteps?.length > 0) {
            const formattedDate = scheduleDate.toISOString().split('T')[0];

            const data = {
                studioId: suid,
                steps: dailyScheduleProspectSteps,
                nextContactDate: formattedDate, // Set to today's date
            };

            try {
                const response = await getProspectsInScheduleByPipelineStepFromArrayOfSteps(data);
                // Filter response items with recordset length greater than 1
                const filteredResponse = response.filter((item: any) => item.recordset.length > 1);

                // Extract student data from filtered response
                const studentData = filteredResponse.map((item: any) => item.recordset).flat();

                // Grouping student data by ProspectId
                const groupedStudents: any = {};

                await Promise.all(
                    studentData.map(async (student: any) => {
                        const prospectValues = await getProspectById(student.ProspectId);
                        const studentId = student.ProspectId;

                        if (!groupedStudents[studentId]) {
                            groupedStudents[studentId] = {
                                StepName: student.StepName,
                                Student_id: student.ProspectId,
                                StudentName: student.ProspectName,
                                Contact1: student.ParentName,
                                Classes: [student.ClassName],
                                prospectInfo: prospectValues,
                            };
                        } else {
                            groupedStudents[studentId].Classes.push(student.ClassName);
                        }
                    })
                );

                // Converting the grouped students object to an array
                const dailySP = Object.values(groupedStudents);
                setDailyScheduleProspects(dailySP);
                setGettingProspects(false);
            } catch (error) {
                console.error('Error fetching prospects:', error);
            }
        } else {
            console.log('No prospects today');
        }
    };

    useEffect(() => {
        getStudents();
    }, [dailyScheduleStudentSteps]);

    useEffect(() => {
        getProspects();
    }, [dailyScheduleProspectSteps]);

    const handlePrintProspectSchedule = () => {
        const htmlData: any = prospectTableHTML();
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.open();
        printWindow?.document.write(htmlData);
        printWindow?.document.close();
        printWindow?.print();
    };

    const prospectTableHTML = () => {
        const htmlForPrint =
            dailyScheduleProspects?.length > 0
                ? `<!DOCTYPE html>
            <html>
            <head>
            <style>
            /* Styles for the table */
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 4px;
                text-align: left;
                border-bottom: 1px solid #ddd;
                font-size: 12px;
            }
            th {
                background-color: #f2f2f2;
            }
            tr:hover {
                background-color: #f5f5f5;
            }
            /* Styles for the notes section */
            .note-section {
                margin-top: 10px;
                font-style: italic;
                color: #888;
            }
        </style>
            </head>
            <body>
                <div class="grid grid-cols-1 gap-6 mb-6 border-t">                    
                    <div class="panel px-0 pb-0">
                        <div class="">
                            <h2 >Prospect Schedule</h2>                        
                        </div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th class="ltr:rounded-l-md rtl:rounded-r-md">Pipeline Step</th>
                                        <th>Name</th>
                                        <th>Parent Name</th>
                                        <th>Class</th>
                                        <th class="ltr:rounded-r-md rtl:rounded-l-md">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>                                   
                                    ${dailyScheduleProspects
                                        ?.map(
                                            (prospect: any) => `
                                            <tr class="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                                <td class="">
                                                    <div class="">${prospect?.StepName}</div>
                                                </td>
                                                <td>
                                                    <h5>
                                                        ${prospect?.StudentName}
                                                        
                                                    </h5>
                                                </td>
                                                <td>${prospect?.Contact1}</td>
                                                <td style="font-size: 8px;">
                                                    ${prospect?.Classes?.map((className: string) => `<div key="${className}">${className}</div>`).join('')}
                                                </td>
                                                <td>
                                               
                                                </td>
                                            </tr>
                                        `
                                        )
                                        .join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </body>
            </html>`
                : ` 
                <!DOCTYPE html>
<html>
    <head>
        <style>
                        /* Styles for the table */
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            padding: 8px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        tr:hover {
                            background-color: #f5f5f5;
                        }
                        /* Styles for the notes section */
                        .note-section {
                            margin-top: 10px;
                            font-style: italic;
                            color: #888;
                        }
                    </style>
    </head>
    <body>
        <div class="grid grid-cols-1 gap-6 mb-6 border-t">
            <div class="panel px-0 pb-0">
                <div class>
                    <h2>Prospect Schedule</h2>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th
                                    class="ltr:rounded-l-md rtl:rounded-r-md">Pipeline
                                    Step</th>
                                <th>Name</th>
                                <th>Parent Name</th>
                                <th>Class</th>
                                <th
                                    class="ltr:rounded-r-md rtl:rounded-l-md">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className>
                                <td className colSpan="6" style="text-align: center;">
                                    No Prospects Today
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>
            `;

        return htmlForPrint;
    };

    const handlePrintStudentSchedule = () => {
        const htmlData: any = studentTableHTML();
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.open();
        printWindow?.document.write(htmlData);
        printWindow?.document.close();
        printWindow?.print();
    };

    const studentTableHTML = () => {
        const htmlForPrint =
            dailyScheduleStudents?.length > 0
                ? `<!DOCTYPE html>
            <html>
            <head>
                <style>
                    /* Styles for the table */
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 4px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                        font-size: 12px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    tr:hover {
                        background-color: #f5f5f5;
                    }
                    /* Styles for the notes section */
                    .note-section {
                        margin-top: 10px;
                        font-style: italic;
                        color: #888;
                    }
                </style>
            </head>
            <body style="background: #f8f8f8; padding: 4px 4px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;">
                <div class="grid grid-cols-1 gap-6 mb-6 border-t">                    
                    <div class="panel px-0 pb-0">
                        <div class="">
                            <h2 >Student Schedule</h2>                        
                        </div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th class="ltr:rounded-l-md rtl:rounded-r-md">Pipeline Step</th>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Class</th>
                                        <th class="ltr:rounded-r-md rtl:rounded-l-md">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>                                   
                                    ${dailyScheduleStudents
                                        ?.map(
                                            (student: any) => `
                                            <tr class="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                                <td class="">
                                                    <div class="">${student?.StepName}</div>
                                                </td>
                                                <td>
                                                    <h5>
                                                        ${student?.StudentName}
                                                        
                                                    </h5>
                                                </td>
                                                <td>${student?.Contact1}</td>
                                                <td style="font-size: 8px;">
                                                    ${student?.Classes?.map((className: string) => `<div key="${className}">${className}</div>`).join('')}
                                                </td>
                                                <td>
                                               
                                                </td>
                                            </tr>
                                        `
                                        )
                                        .join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </body>
            </html>`
                : ` 
                <!DOCTYPE html>
<html>
    <head>
        <style>
                        /* Styles for the table */
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            padding: 8px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        tr:hover {
                            background-color: #f5f5f5;
                        }
                        /* Styles for the notes section */
                        .note-section {
                            margin-top: 10px;
                            font-style: italic;
                            color: #888;
                        }
                    </style>
    </head>
    <body>
        <div class="grid grid-cols-1 gap-6 mb-6 border-t">
            <div class="panel px-0 pb-0">
                <div class>
                    <h2>Student Schedule</h2>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th
                                    class="ltr:rounded-l-md rtl:rounded-r-md">Pipeline
                                    Step</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Class</th>
                                <th
                                    class="ltr:rounded-r-md rtl:rounded-l-md">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className>
                                <td className colSpan="6" style="text-align: center;">
                                    No Students Today
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>
            `;

        return htmlForPrint;
    };

    const handlePrintBoth = () => {
        const htmlData: any = studentTableHTML() + prospectTableHTML();
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.open();
        printWindow?.document.write(htmlData);
        printWindow?.document.close();
        printWindow?.print();
    };

    return (
        <div className="mb-6 ">
             <div className="hidden sm:flex items-center justify-between whitespace-nowrap mt-12">
                        <div className="flex items-center gap-4 sm:w-1/2 w-full">
                            <label htmlFor="scheduleDate">Next Contact Date</label>
                            <input
                                type="date"
                                id="scheduleDate"
                                value={scheduleDate.toISOString().split('T')[0]}
                                onChange={(e) => setScheduleDate(new Date(e.target.value))}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            <button onClick={handleGetNewSchedule} className="btn btn-primary ">
                                Update Schedule
                            </button>
                        </div>
                        <div>
                            <button onClick={handlePrintBoth} className="btn btn-secondary gap-1">
                                <IconPrinter /> Print Schedule
                            </button>
                        </div>
                    </div>
            {loading ? (
                <div className="panel bg-gray-100 animate-pulse h-48 mt-4 flex justify-center items-center">Getting Schedule...</div>
            ) : (
                <div>
                   
                    <div className="panel p-0 mt-6">
                        <div className="flex items-center justify-between py-5 px-5 bg-dark rounded-t-lg text-white">
                            <h5 className="font-semibold text-lg dark:text-white-light">Prospect Schedule</h5>
                            <div className="flex items-center gap-1">
                                <div>
                                    <UpdateScheduleSteps type="prospect" steps={dailyScheduleProspectSteps} studioID={suid} scheduleId={scheduleID} />
                                </div>
                                <Tippy content="Print Schedule">
                                    <button type="button" onClick={handlePrintProspectSchedule} className="font-semibold  hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
                                        <span className="flex items-center">
                                            <IconPrinter className="w-5 h-5 text-white dark:text-white/70 hover:!text-primary" />
                                        </span>
                                    </button>
                                </Tippy>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="">
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Pipeline Step</th>
                                        <th>Name</th>
                                        <th>Parent Name</th>
                                        <th>Class</th>
                                        <th className="ltr:rounded-r-md rtl:rounded-l-md">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dailyScheduleProspects?.length > 0 ? (
                                        dailyScheduleProspects?.map((prospect: any, index: any) => (
                                            <tr key={index} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                                <td className="min-w-[150px] text-black dark:text-white">
                                                    <div className="flex items-center">
                                                        <span className="whitespace-nowrap">{prospect?.StepName}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Tippy content="View Propsect">
                                                        <Link
                                                            to={`/prospects/view-prospect/${hashTheID(prospect.Student_id)}/${hashTheID(suid)}`}
                                                            className="flex hover:text-green-800 text-primary font-bold gap-1"
                                                        >
                                                            {prospect?.StudentName}{' '}
                                                            <span className="text-warning hover:yellow-900">
                                                                <IconNotes />
                                                            </span>
                                                        </Link>
                                                    </Tippy>
                                                </td>
                                                <td>{prospect?.Contact1}</td>
                                                <td>
                                                    {prospect?.Classes?.map((className: string, index: any) => (
                                                        <div key={index}>{className}</div>
                                                    ))}
                                                </td>
                                                <td className="flex gap-1 staff-center w-max mx-auto ">
                                                    {/* <QuickAction student={prospect} /> */}
                                                    <Tippy content="View Prospect">
                                                        <NavLink
                                                            to={`/prospects/view-prospect/${hashTheID(prospect.Student_id)}/${hashTheID(suid)}`}
                                                            className="flex text-primary hover:text-primary/90 gap-1"
                                                        >
                                                            {' '}
                                                            <IconEye />
                                                        </NavLink>
                                                    </Tippy>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                            <td className="text-black dark:text-white flex-wra text-center" colSpan={5}>
                                                <div>No Prospects Today</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="panel p-0 mt-6">
                    <div className="flex items-center justify-between py-5 px-5 bg-dark rounded-t-lg text-white">
                        <h5 className="font-semibold text-lg dark:text-white-light">Students Schedule</h5>
                        <div className="flex items-center gap-1">
                            <div>
                                <UpdateScheduleSteps type="student" steps={dailyScheduleStudentSteps} studioID={suid} scheduleId={scheduleID} />
                            </div>
                            <Tippy content="Print Schedule">
                                <button type="button" onClick={handlePrintStudentSchedule} className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
                                    <span className="flex items-center">
                                        <IconPrinter className="w-5 h-5 text-white dark:text-white/70 hover:!text-primary" />
                                    </span>
                                </button>
                            </Tippy>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Pipeline Step</th>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Class</th>
                                    <th className="ltr:rounded-r-md rtl:rounded-l-md">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyScheduleStudents?.length > 0 ? (
                                    dailyScheduleStudents?.map((student: any, index: any) => (
                                        <tr key={index} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                            <td className="text-black dark:text-white flex-wra">
                                                <div>{student?.StepName}</div>
                                            </td>
                                            <td className="">
                                                <UpdateNotesForStudent student={student} update={update} setUpdate={setUpdate} />
                                            </td>
                                            <td>{student?.Contact1}</td>
                                            <td>
                                                {student?.Classes?.map((className: string) => (
                                                    <div key={className}>{className}</div>
                                                ))}
                                            </td>
                                            <td className="flex-wra">
                                                <Tippy content="View">
                                                    <Link to={`/students/view-student/${hashTheID(student.Student_id)}/${hashTheID(suid)}`} className="flex hover:text-green-800 text-primary gap-1">
                                                        <IconEye /> View
                                                    </Link>
                                                </Tippy>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white flex-wra text-center" colSpan={5}>
                                            <div>No Students Today</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}
