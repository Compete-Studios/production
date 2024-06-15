import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '../components/Icon/IconTrashLines';
import { useEffect, useState } from 'react';
import { getReportsFromFirebase, getSprint, updateReport } from '../firebase/firebaseFunctions';
import { convertPhoneNumber } from '../functions/shared';
import IconBolt from '../components/Icon/IconBolt';
import IconCircleCheck from '../components/Icon/IconCircleCheck';
import Select from 'react-select';
import IssueToTaskModal from './IssueToTaskModal';
import { Link } from 'react-router-dom';

export default function Issues() {
    const [issues, setIssues] = useState([]);
    const [sprintCards, setSprintCards] = useState<any>([]);
    const [filter, setFilter] = useState<string>('All');

    const handleGetSprint = async (id: string) => {
        const res = await getSprint(id);
        console.log(res);
        setSprintCards(res);
    };

    useEffect(() => {
        handleGetSprint('1');
    }, []);

    const handleGetIssues = async () => {
        const response: any = await getReportsFromFirebase();
        setIssues(response);
    };

    useEffect(() => {
        handleGetIssues();
    }, []);

    const convertFBNanoandSecToDate = (timestamp: any) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
    };

    const markInProgress = (id: any) => {
        const issueData = {
            status: 'inProgress',
        };
        updateReport(id, issueData);
        setIssues((prev: any) => {
            return prev.map((data: any) => {
                if (data.id === id) {
                    return { ...data, status: 'inProgress' };
                }
                return data;
            });
        });
    };

    const markDone = (id: any) => {
        const issueData = {
            status: 'done',
        };
        updateReport(id, issueData);
        setIssues((prev: any) => {
            return prev.map((data: any) => {
                if (data.id === id) {
                    return { ...data, status: 'done' };
                }
                return data;
            });
        });
    };

    const handleFilterChange = (filterValue: string) => {
        setFilter(filterValue);
    };

    const filteredIssues = issues.filter((issue: any) => {
        if (filter === 'All') return true;
        if (filter === 'Unassigned' && !issue.assignedTo) return true;
        if (filter === issue.assignedTo && issue.status !== 'done') return true;
        if (filter === 'InProgress' && issue.status === 'inProgress') return true;
        if (filter === 'Done' && issue.status === 'done') return true;
        return false;
    });

    return (
        <div>
            <h2 className="text-xl font-semibold">Issues</h2>
            <div className="my-3">
                <button className={`mr-2 px-4 py-2 ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('All')}>
                    All
                </button>
                <button className={`mr-2 px-4 py-2 ${filter === 'Unassigned' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('Unassigned')}>
                    Unassigned
                </button>
                <button className={`mr-2 px-4 py-2 ${filter === 'Bret' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('Bret')}>
                    Bret
                </button>
                <button className={`mr-2 px-4 py-2 ${filter === 'Evan' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('Evan')}>
                    Evan
                </button>
                <button className={`mr-2 px-4 py-2 ${filter === 'Mago' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('Mago')}>
                    Mago
                </button>
                <button className={`mr-2 px-4 py-2 ${filter === 'InProgress' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('InProgress')}>
                    In Progress
                </button>
                <button className={`mr-2 px-4 py-2 ${filter === 'Done' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('Done')}>
                    Done
                </button>
            </div>
            <div className="flex items-center gap-4 mt-12">
                <div className="font-bold">Status Legend:</div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <div>Done</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-warning" />
                        <div>In Progress</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-danger" />
                        <div>Not Started</div>
                    </div>
                </div>
            </div>
            <div className="table-responsive my-5 panel p-0">
                <table>
                    <thead>
                        <tr>
                            <th className='text-left'>Status</th>
                            <th>Date</th>
                            <th>Contact</th>
                            <th>Issue</th>
                            <th className="text-center">Assigned</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIssues?.map((data: any, index) => {
                            return (
                                <tr key={data.id}>
                                    <td className=''>
                                        <div
                                            className={`text-center flex items-center justify-center ml-4 w-3 h-3 rounded-full capitalize ${
                                                data.status === 'done' ? 'bg-success' : data.status === 'inProgress' ? 'bg-warning' : 'bg-danger'
                                            }`}
                                        />
                                    </td>
                                    <td>{convertFBNanoandSecToDate(data.dateSubmitted)}</td>
                                    <td>
                                        <div className="whitespace-nowrap font-bold">{data.studioName}</div>
                                        <div>{convertPhoneNumber(data.contactNumber)}</div>
                                        <div>{data.contactEmail}</div>
                                        <div>Studio: #{data.studioId}</div>
                                    </td>
                                    <td>
                                        <div className="font-semibold">{data.issue}</div>
                                        <div className="break-words text-xs mt-2">{data.path}</div>
                                    </td>
                                    <td>
                                        <td className="text-right">
                                            {data?.assignedTo ? (
                                                <div className="flex items-center gap-2">
                                                    <div></div>
                                                    <Tippy content="View Current Sprint">
                                                        <Link to="/admin/sprint" className="btn btn-sm btn-outline-success gap-1">
                                                            <IconCircleCheck className="w-4 h-4" /> {data.assignedTo}
                                                        </Link>
                                                    </Tippy>
                                                </div>
                                            ) : (
                                                <IssueToTaskModal docData={data} cards={sprintCards} setIssues={setIssues} />
                                            )}
                                        </td>
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
