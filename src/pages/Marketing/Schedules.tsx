import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import IconEye from '../../components/Icon/IconEye';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconBolt from '../../components/Icon/IconBolt';
import ActionItemProspects from '../Prospects/ActionItemProspects';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { REACT_API_BASE_URL } from '../../constants';
import { getProspectsInScheduleByPipelineStep, getStudentsInScheduleByPipelineStep, getStudioOptions } from '../../functions/api';
import ActionItemForSchedule from './ActionItemForSchedule';
import { hashTheID } from '../../functions/shared';

export default function Schedules() {
    const { suid, scheduleID, update, setUpdate, prospectPipelineSteps }: any = UserAuth();
    const [dailyScheduleStudentSteps, setDailyScheduleStudentSteps] = useState<any>([]);
    const [dailyScheduleProspectSteps, setDailyScheduleProspectSteps] = useState<any>([]);
    const [dailyScheduleStudents, setDailyScheduleStudents] = useState<any>([]);
    const [dailyScheduleProspects, setDailyScheduleProspects] = useState<any>([]);
    const [studioOptions, setStudioOptions] = useState<any>([]);

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
        console.log(dataJson);
        setDailyScheduleStudentSteps(dataJson);
    };

    const handleGetProspects = async () => {
        const data = await fetch(`${REACT_API_BASE_URL}/daily-schedule-tools/getPPStepsForSchedule/${scheduleID}/${suid}`);
        const dataJson = await data.json();
        console.log(dataJson.recordset);
        setDailyScheduleProspectSteps(dataJson.recordset);
    };

    useEffect(() => {
        handleGetStudents();
        handleGetProspects();
    }, [suid, scheduleID]);

    const getStudents = async () => {
        const studentsArray: any = [];
        // Get today's date
        const today = new Date();
        // Format today's date as 'YYYY-MM-DD'
        const formattedDate = today.toISOString().split('T')[0];

        for (let i = 0; i < dailyScheduleStudentSteps.length; i++) {
            const data = {
                studioId: suid,
                pipelineStepId: dailyScheduleStudentSteps[i].PipelineStepId,
                nextContactDate: formattedDate, // Set to today's date
            };
            const newStudData = await getStudentsInScheduleByPipelineStep(data);
            if (newStudData.recordset.length > 0) {
                // Get the main data from recordset[0]
                const mainData = { ...newStudData.recordset[0] };
                // Extract all class names into an array
                const classNames = newStudData.recordset.map((student: any) => student.ClassName);
                // Remove duplicates if necessary
                const uniqueClassNames = [...new Set(classNames)];
                // Add the 'Classes' array to the main data
                mainData.Classes = uniqueClassNames;
                // Push the main data to studentsArray
                studentsArray.push(mainData);
            }
        }
        setDailyScheduleStudents(studentsArray);
    };

    const getProspects = async () => {
        const prospectArray: any = [];

        const today = new Date();
        // Format today's date as 'YYYY-MM-DD'
        const formattedDate = today.toISOString().split('T')[0];

        for (let i = 0; i < dailyScheduleProspectSteps.length; i++) {
            const data = {
                studioId: suid,
                pipelineStepId: dailyScheduleProspectSteps[i].PipelineStepId,
                nextContactDate: formattedDate,
            };
            const newProsData = await getProspectsInScheduleByPipelineStep(data);
            if (newProsData.recordset.length > 0) {
                // Get the main data from recordset[0]
                const mainData = { ...newProsData.recordset[0] };
                // Extract all class names into an array
                const classNames = newProsData.recordset.map((prospect: any) => prospect.ClassName);
                // Remove duplicates if necessary
                const uniqueClassNames = [...new Set(classNames)];
                // Add the 'Classes' array to the main data
                mainData.Classes = uniqueClassNames;
                // Push the main data to prospectArray
                prospectArray.push(mainData);
            }
        }
        setDailyScheduleProspects(prospectArray);
    };

    useEffect(() => {
        getStudents();
    }, [dailyScheduleStudentSteps]);

    useEffect(() => {
        getProspects();
    }, [dailyScheduleProspectSteps]);

    const handlePrintSchedule = () => {
        window.print();
    };

    



    return (
        <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-6 mb-6">
            <div className="panel px-0 pb-0">
                <div className="flex items-center justify-between mb-5 px-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Prospect Schedule</h5>
                    <Tippy content="Print Schedule">
                        <button type="button" onClick={handlePrintSchedule} className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
                            <span className="flex items-center">
                                <IconPrinter className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary" />
                            </span>
                        </button>
                    </Tippy>
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
                            {dailyScheduleProspects?.map((prospect: any) => (
                                <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <span className="whitespace-nowrap">{prospect?.StepName}</span>
                                        </div>
                                    </td>
                                    <td className="text-primary">{prospect?.ProspectName}</td>
                                    <td>
                                        <Link to="/apps/invoice/preview">{prospect?.ParentName}</Link>
                                    </td>
                                    <td>
                                        {prospect?.Classes?.map((className: string) => (
                                            <div key={className}>{className}</div>
                                        ))}
                                    </td>
                                    <td className="flex gap-1 staff-center w-max mx-auto ">
                                        <Tippy content="Contact">
                                            <ActionItemProspects
                                                student={prospect}
                                                pipeline={prospectPipelineSteps.find((step: any) => step.PipelineStepId === parseInt(prospect.CurrentPipelineStatus))}
                                                studioOptions={studioOptions}
                                                setUpdate={setUpdate}
                                                update={update}
                                                prospectPipelineSteps={prospectPipelineSteps}
                                            />
                                        </Tippy>
                                        <Tippy content="View">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-primary">
                                                <IconEye />
                                            </NavLink>
                                        </Tippy>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="panel px-0 pb-0">
                <div className="flex items-center justify-between mb-5 px-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Students Schedule</h5>
                    <Tippy content="Print Schedule">
                        <button type="button" onClick={handlePrintSchedule} className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
                            <span className="flex items-center">
                                <IconPrinter className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary" />
                            </span>
                        </button>
                    </Tippy>
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
                            {dailyScheduleStudents?.map((student: any) => (
                                <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td className="text-black dark:text-white flex-wra">
                                        <div>{student?.StepName}</div>
                                    </td>
                                    <td className="">
                                        <Link to={`/students/view-student/${hashTheID(student.Student_id)}/${hashTheID(suid)}`} className="flex hover:text-green-800 text-primary font-bold">
                                            {student?.StudentName}
                                        </Link>
                                    </td>
                                    <td>{student?.Contact1}</td>
                                    <td>
                                        {student?.Classes?.map((className: string) => (
                                            <div key={className}>{className}</div>
                                        ))}
                                    </td>
                                    <td className="flex gap-1 staff-center w-max mx-auto ">
                                        <ActionItemForSchedule student={student} isStudent={true} update={update} setUpdate={setUpdate} studioOptions={studioOptions} />

                                        <Tippy content="View">
                                            <Link to={`/students/view-student/${hashTheID(student.Student_id)}/${hashTheID(suid)}`} className="flex hover:text-green-800 text-primary">
                                                <IconEye />
                                            </Link>
                                        </Tippy>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
