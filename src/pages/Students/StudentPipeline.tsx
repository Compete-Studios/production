import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import AddEditClass from '../Classes/AddEditClass';
import IconPlus from '../../components/Icon/IconPlus';
import IconUsers from '../../components/Icon/IconUsers';
import IconEdit from '../../components/Icon/IconEdit';
import { UserAuth } from '../../context/AuthContext';

const tableData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@yahoo.com',
        date: '10/08/2020',
        sale: 120,
        status: 'Complete',
        register: '5 min ago',
        progress: '40%',
        position: 'Developer',
        office: 'London',
    },
    {
        id: 2,
        name: 'Shaun Park',
        email: 'shaunpark@gmail.com',
        date: '11/08/2020',
        sale: 400,
        status: 'Pending',
        register: '11 min ago',
        progress: '23%',
        position: 'Designer',
        office: 'New York',
    },
    {
        id: 3,
        name: 'Alma Clarke',
        email: 'alma@gmail.com',
        date: '12/02/2020',
        sale: 310,
        status: 'In Progress',
        register: '1 hour ago',
        progress: '80%',
        position: 'Accountant',
        office: 'Amazon',
    },
    {
        id: 4,
        name: 'Vincent Carpenter',
        email: 'vincent@gmail.com',
        date: '13/08/2020',
        sale: 100,
        status: 'Canceled',
        register: '1 day ago',
        progress: '60%',
        position: 'Data Scientist',
        office: 'Canada',
    },
];
export default function StudentPipeline() {
    const {pipelineSteps} = UserAuth();
    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                <div className="flex items-center gap-2">
                    <div className="">
                        <input type="text" className="form-input w-auto" placeholder="Search..." />
                    </div>
                </div>

                <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                    <button type="button" className="btn btn-primary gap-2 ltr:ml-auto rtl:mr-auto">
                        <IconPlus />
                        Add a Pipeline Step
                    </button>
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
                                            <button type="button">
                                                <IconUsers className="w-5 h-5 text-orange-500 hover:text-orange-800" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Edit Step">
                                            <button type="button">
                                                <IconEdit className="w-5 h-5" />
                                            </button>
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
