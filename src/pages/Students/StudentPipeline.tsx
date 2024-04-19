import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import { UserAuth } from '../../context/AuthContext';
import IconPlus from '../../components/Icon/IconPlus';
import IconUsers from '../../components/Icon/IconUsers';
import IconEdit from '../../components/Icon/IconEdit';
import { Link } from 'react-router-dom';


export default function StudentPipeline() {
    const {pipelineSteps, suid} = UserAuth();
    console.log(pipelineSteps, suid)
    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                {/* <div className="flex items-center gap-2">
                    <div className="">
                        <input type="text" className="form-input w-auto" placeholder="Search..." />
                    </div>
                </div> */}
                 <h2 className="text-xl">Student Pipeline</h2>

                <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                    <Link to="/students/add-pipeline-step" type="button" className="btn btn-primary gap-2 ltr:ml-auto rtl:mr-auto">
                        <IconPlus />
                        Add a Pipeline Step
                    </Link>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Pipeline Step</th>
                            <th>Students In Step</th>
                            
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pipelineSteps?.map((data: any) => {
                            return (
                                <tr key={data.PlacementOrdinal} className={`${
                                    data?.thisStudentPipelineStepNeedsContact &&
                                    "bg-cs"
                                  }`}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.StepName}</div>
                                    </td>
                                    <td>{data.numberOfStudentsInStep}</td>

                                    <td className="text-center gap-x-4 flex items-center justify-center">
                                        <Tippy content="View Roster">
                                            <Link to={`/students/view-students-in-pipeline/${data.PipelineStepId}/${suid}`} type="button">
                                                <IconUsers className="w-5 h-5 text-orange-500 hover:text-orange-800" />
                                            </Link>
                                        </Tippy>
                                        <Tippy content="Edit Step">
                                            <Link to={`/students/edit-pipeline-step/${data.PipelineStepId}/${suid}`} type="button">
                                                <IconEdit className="w-5 h-5 text-primary hover:text-emerald-700" />
                                            </Link>
                                        </Tippy>
                                        <Tippy content="Delete Step">
                                            <button type="button">
                                                <IconTrash className="w-5 h-5" />
                                            </button>
                                        </Tippy>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
