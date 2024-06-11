import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '../components/Icon/IconTrashLines';
import { useEffect, useState } from 'react';
import { getReportsFromFirebase, updateReport } from '../firebase/firebaseFunctions';
import { convertPhoneNumber } from '../functions/shared';
import IconBolt from '../components/Icon/IconBolt';
import IconCircleCheck from '../components/Icon/IconCircleCheck';
import Select from 'react-select';

export default function Issues() {
    const [issues, setIssues] = useState([]);
    const [showSelect, setShowSelect] = useState<number>(-1);
    const [optionToUpdate, setOptionToUpdate] = useState<any>(null);
    const [filter, setFilter] = useState<string>('All');

    const options = [
        { value: 'Assign', label: 'Select' },
        { value: 'Bret', label: 'Bret' },
        { value: 'Evan', label: 'Evan' },
        { value: 'Mago', label: 'Mago' },
    ];

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

    const handleSave = (id: any) => {
        setShowSelect(-1);
        const issueData = {
            assignedTo: optionToUpdate.value,
        };
        updateReport(id, issueData);
        setIssues((prev: any) => {
            return prev.map((data: any) => {
                if (data.id === id) {
                    return { ...data, assignedTo: optionToUpdate.value };
                }
                return data;
            });
        });
        setOptionToUpdate(null);
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
        if (filter === issue.assignedTo) return true;
        if (filter === 'InProgress' && issue.status === 'inProgress') return true;
        if (filter === 'Done' && issue.status === 'done') return true;
        return false;
    });

    return (
        <div>
            <h2 className="text-xl font-semibold">Issues</h2>
            <div className="my-3">
                <button className={`mr-2 px-4 py-2 ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('All')}>All</button>
                <button className={`mr-2 px-4 py-2 ${filter === 'Unassigned' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('Unassigned')}>Unassigned</button>
                <button className={`mr-2 px-4 py-2 ${filter === 'Bret' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('Bret')}>Bret</button>
                <button className={`mr-2 px-4 py-2 ${filter === 'Evan' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('Evan')}>Evan</button>
                <button className={`mr-2 px-4 py-2 ${filter === 'Mago' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('Mago')}>Mago</button>
                <button className={`mr-2 px-4 py-2 ${filter === 'InProgress' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('InProgress')}>In Progress</button>
                <button className={`mr-2 px-4 py-2 ${filter === 'Done' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleFilterChange('Done')}>Done</button>
            </div>
            <div className="table-responsive my-5">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Contact</th>
                            <th>Date</th>
                            <th className="max-w-[170px]">Issue</th>
                            <th>Path</th>
                            <th>Status</th>
                            <th>Assigned</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIssues?.map((data: any, index) => {
                            return (
                                <tr key={data.id}>
                                    <td>{data.studioId}</td>
                                    <td>
                                        <div className="whitespace-nowrap font-bold">{data.studioName}</div>
                                        <div>{convertPhoneNumber(data.contactNumber)}</div>
                                        <div>{data.contactEmail}</div>
                                    </td>
                                    <td>{convertFBNanoandSecToDate(data.dateSubmitted)}</td>
                                    <td className="max-w-[270px] font-semibold">{data.issue}</td>
                                    <td className="max-w-[170px] break-words ">{data.path}</td>
                                    <td>
                                        <div className={`whitespace-nowrap text-center badge capitalize ${data.status === 'done' ? 'bg-success' : data.status === 'inProgress' ? 'bg-warning' : 'bg-danger'}`}>
                                            {data.status === 'done' ? 'Done' : data.status === 'inProgress' ? 'In Progress' : 'Reported'}
                                        </div>
                                    </td>
                                    <td>
                                        {showSelect === index ? (
                                            <div className="flex items-center gap-1">
                                                <Select defaultValue={options[0]} options={options} onChange={(option) => setOptionToUpdate(option)} isSearchable={false} />
                                                <button className="text-info px-2 py-1 rounded-md" onClick={() => handleSave(data.id)}>
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className={`${data.assignedTo ? "text-info" : "text-warning"} px-2 py-1 rounded-md `}
                                                onClick={() => setShowSelect(index)}>
                                                {data.assignedTo ? data.assignedTo : 'Assign'}
                                            </button>
                                        )}
                                    </td>
                                    <td className="text-center space-x-2">
                                        <Tippy content="Mark as In Progress">
                                            <button type="button" onClick={() => markInProgress(data.id)}>
                                                <IconBolt className="w-5 h-5 text-yellow-500" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Mark as done">
                                            <button type="button" onClick={() => markDone(data.id)}>
                                                <IconCircleCheck className="w-5 h-5 text-green-500" />
                                            </button>
                                        </Tippy>
                                        {/* <Tippy content="Delete">
                                            <button type="button">
                                                <IconTrashLines className="w-5 h-5 text-red-500" />
                                            </button>
                                        </Tippy> */}
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
