import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '../components/Icon/IconTrashLines';
import { useEffect, useState } from 'react';
import { getReportsFromFirebase, updateReport } from '../firebase/firebaseFunctions';
import { convertPhoneNumber } from '../functions/shared';
import IconBolt from '../components/Icon/IconBolt';
import IconCircleCheck from '../components/Icon/IconCircleCheck';
import Select from 'react-select';

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

export default function Issues() {
    const [issues, setIssues] = useState([]);
    const [showSelect, setShowSelect] = useState<number>(-1);
    const [optionToUpdate, setOptionToUpdate] = useState<any>(null);
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

    console.log(issues);

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

    return (
        <div>
            <h2 className="text-xl font-semibold">Issues</h2>
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
                        {issues?.map((data: any, index) => {
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
                                        <div className={`whitespace-nowrap capitalize ${data.status === 'done' ? 'text-success' : data.status === 'inProgress' ? 'text-warning' : 'text-danger'}`}>
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
