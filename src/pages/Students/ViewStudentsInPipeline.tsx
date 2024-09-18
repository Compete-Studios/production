import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '@fullcalendar/core';
import { UserAuth } from '../../context/AuthContext';
import { getStudentsByPipelineStep } from '../../functions/api';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { hashTheID } from '../../functions/shared';
import ActionItem from './ActionItem';
import ActionItemText from './ActionItemText';
import ActionItemEmail from './ActionItemEmail';
import ActionItemNote from './ActionItemNote';

export default function ViewStudentsInPipeline() {
    const { suid, setStudentToEdit, pipelineSteps, studioOptions, update, setUpdate }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('View Students In Pipeline'));
    });

    const [loading, setLoading] = useState(true);
    const [studentsInPipeline, setStudentsInPipeline] = useState([]);

    const { id } = useParams();

    const handleGetTimeZoneOfUser = () => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return timeZone;
    };

    useEffect(() => {
        try {
            getStudentsByPipelineStep(suid, id).then((res) => {
                setStudentsInPipeline(res.recordset);
                setLoading(false);
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [suid, update]);

    const navigate = useNavigate();

    const handleStudentToEdit = (id: any) => {
        setStudentToEdit(id);
        navigate('/students/view-student');
    };

 

    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/students/student-pipeline" className="text-primary hover:underline">
                        Student Pipeline
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 dark:text-white">
                    <span>{pipelineSteps.find((step: any) => step.PipelineStepId === parseInt(id ?? ''))?.StepName}</span>
                </li>
            </ul>
            <div className="px-4 sm:px-6 lg:px-8 mt-4">
                <div className="lg:flex lg:items-center">
                    <div className="sm:flex-auto w-full sm:gap-x-4">
                        <h1 className="uppercase font-semibold text-lg dark:text-white">
                            Students in Pipeline Step <span className="font-bold text-primary">{pipelineSteps.find((step: any) => step.PipelineStepId === parseInt(id ?? ''))?.StepName}</span>
                        </h1>
                        <p className="dark:text-white">*Students with a highlighted background should be contacted.</p>
                    </div>
                    {/* <div className="sm:flex sm:items-center sm:gap-x-4 w-full space-y-4 sm:space-y-0 lg:mt-0 mt-4 ">
                        <button className="btn btn-primary gap-x-1 w-full sm:w-auto shrink-0 ml-auto " onClick={() => navigate('/students/delete-student')}>
                            <IconPlus /> Email This List
                        </button>
                        <button className="btn btn-warning gap-x-1 w-full sm:w-auto shrink-0" onClick={() => navigate('/students/delete-student')}>
                            <IconPlus /> Text This List
                        </button>
                        <button className="btn btn-secondary gap-x-1 w-full sm:w-auto shrink-0" onClick={() => navigate('/students/delete-student')}>
                            <IconPlus /> Add To Email List
                        </button>
                    </div> */}
                </div>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="mt-4 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-white">
                                                    Last Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell dark:text-white">
                                                    First Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell dark:text-white">
                                                    Next Contact
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Action</span>
                                                </th>

                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">View</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                            {studentsInPipeline?.map((list: any) => (
                                                <tr key={list.StudentId} className={`${new Date(list.NextContactDate) <= new Date() && 'bg-cs text-gray-900'}`}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6">{list.LName}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm  hidden sm:table-cell">{list.FName}</td>
                                                    <td
                                                        className={`whitespace-nowrap px-3 py-4 text-sm hidden sm:table-cell ${
                                                            new Date(list.NextContactDate) <= new Date() ? 'text-danger font-bold' : 'text-gray-900 dark:text-white'
                                                        }`}
                                                    >
                                                        {list.NextContactDate && list.NextContactDate !== '1900-01-01T00:00:00.000Z'
                                                            ? formatDate(new Date(list.NextContactDate), { month: 'short', day: 'numeric', year: 'numeric', timeZone: handleGetTimeZoneOfUser() })
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="relative whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <ActionItemEmail
                                                                student={list}
                                                                pipeline={pipelineSteps.find((step: any) => step.PipelineStepId === parseInt(id ?? ''))}
                                                                studioOptions={studioOptions}
                                                                setUpdate={setUpdate}
                                                                update={update}
                                                            />
                                                            <ActionItemText
                                                                student={list}
                                                                pipeline={pipelineSteps.find((step: any) => step.PipelineStepId === parseInt(id ?? ''))}
                                                                studioOptions={studioOptions}
                                                                setUpdate={setUpdate}
                                                                update={update}
                                                            />
                                                            <ActionItemNote
                                                                student={list}
                                                                pipeline={pipelineSteps.find((step: any) => step.PipelineStepId === parseInt(id ?? ''))}
                                                                studioOptions={studioOptions}
                                                                setUpdate={setUpdate}
                                                                update={update}
                                                            />
                                                            <ActionItem
                                                                student={list}
                                                                pipeline={pipelineSteps.find((step: any) => step.PipelineStepId === parseInt(id ?? ''))}
                                                                studioOptions={studioOptions}
                                                                setUpdate={setUpdate}
                                                                update={update}
                                                            />
                                                        </div>
                                                    </td>

                                                    <td className="relative whitespace-nowrap text-right text-sm font-medium ">
                                                        <Link
                                                            to={`/students/view-student/${hashTheID(list.StudentId)}/${hashTheID(suid)}`}
                                                            type="button"
                                                            className={`btn btn-sm flex items-center gap-1 ${
                                                                new Date(list.NextContactDate) <= new Date() ? 'btn-success' : 'btn-outline-success dark:bg-gray-800'
                                                            }`}
                                                        >
                                                            {' '}
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
