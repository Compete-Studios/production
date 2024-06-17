import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconEye from '../../components/Icon/IconEye';
import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { getEmailLogsByStudioId } from '../../functions/emails';
import { constFormateDateMMDDYYYY } from '../../functions/shared';

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

export default function ViewEmails() {
    const { suid }: any = UserAuth();
    const [emails, setEmails] = useState([]);
    const [startDate, setStartDate] = useState<string>(new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const handleGetEmails = async () => {
        const formatStartDate = constFormateDateMMDDYYYY(startDate);
        const formatEndDate = constFormateDateMMDDYYYY(endDate);
        const bodyData = {
            studioId: suid,
            startDate: formatStartDate,
            endDate: formatEndDate,
        };
        try {
            const res = await getEmailLogsByStudioId(bodyData);
            setEmails(res.recordset);
            console.log(res.recordset, 'res');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetEmails();
    }, [startDate, endDate]);

    console.log(emails);

    return (
        <div className="table-responsive mb-5">
            <table>
                <thead>
                    <tr>
                        <th>Recipient</th>
                        <th>Date Sent</th>
                        <th>Sent</th>
                        <th>Opened</th>
                        <th>Clicked</th>
                        <th>Bounced</th>
                        <th>Spam</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((data) => {
                        return (
                            <tr key={data.id}>
                                <td>
                                    <div className="whitespace-nowrap">{data.name}</div>
                                </td>
                                <td>{data.date}</td>
                                <td>{data.sale}</td>
                                <td>
                                    <div
                                        className={`whitespace-nowrap ${
                                            data.status === 'completed'
                                                ? 'text-success'
                                                : data.status === 'Pending'
                                                ? 'text-secondary'
                                                : data.status === 'In Progress'
                                                ? 'text-info'
                                                : data.status === 'Canceled'
                                                ? 'text-danger'
                                                : 'text-success'
                                        }`}
                                    >
                                        {data.status}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <Tippy content="Delete">
                                        <button type="button">
                                            <IconEye />
                                        </button>
                                    </Tippy>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
