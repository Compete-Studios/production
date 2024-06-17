import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconEye from '../../components/Icon/IconEye';
import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { getAllEmailLogsByStudioId, getEmailLogsByStudioId } from '../../functions/emails';
import { constFormateDateMMDDYYYY } from '../../functions/shared';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';

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
    const [startDate, setStartDate] = useState<string>(new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [numberOfEmails, setNumberOfEmails] = useState<number>(0);
    const [monthlyAllotment, setMonthlyAllotment] = useState<number>(0);
    // const startDate = '2024-06-10'
    // const endDate = '2024-06-16'

    const handleGetEmails = async () => {
        const formatStartDate = constFormateDateMMDDYYYY(startDate);
        const formatEndDate = constFormateDateMMDDYYYY(endDate);
        const bodyData = {
            studioId: suid,
            startDate: formatStartDate,
            endDate: formatEndDate,
        };
        try {
            const res = await getAllEmailLogsByStudioId(bodyData);
            setEmails(res.recordset);
            console.log(res.recordset, 'res');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetEmails();
    }, [startDate, endDate]);

    useEffect(() => {
        const totalEmails: any = localStorage.getItem('numberOfEmails');
        const totalAllotment: any = localStorage.getItem('monthlyEmailLimit');
        setNumberOfEmails(totalEmails);
        setMonthlyAllotment(totalAllotment);
    }, [emails]);

    return (
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Search Email History</h1>
          <p className="text-sm text-gray-500">Your studio has created {numberOfEmails} emails this month and your monthly allottment of emails is {monthlyAllotment}.</p>
            <div className="table-responsive mt-12 mb-5">
                <table className='panel table-hover'>
                    <thead>
                        <tr>
                            <th>Recipient</th>
                            <th>Date Sent</th>
                            <th>Sent</th>
                            <th>Opened</th>
                            <th>Clicked</th>
                            <th>Bounced</th>
                            <th>Spam</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emails?.map((data: any) => {
                            return (
                                <tr key={data.MailgunGUID}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.ToEmail}</div>
                                    </td>
                                    <td>{formatWithTimeZone(data.SendDate, handleGetTimeZoneOfUser())}</td>
                                    <td>
                                        {data.SendDate && (
                                            <>
                                                <IconCircleCheck fill={true} className="text-success" />
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        {data.Opened && (
                                            <>
                                                <IconCircleCheck fill={true} className="text-success" />
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        {data.Clicked && (
                                            <>
                                                <IconCircleCheck fill={true} className="text-success" />
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        {data.Bounced && (
                                            <>
                                                <IconCircleCheck fill={true} className="text-success" />
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        {data.Spam && (
                                            <>
                                                <IconCircleCheck fill={true} className="text-success" />
                                            </>
                                        )}
                                    </td>

                                    <td className="text-right">
                                        <Tippy content="View Details">
                                            <button type="button" className="text-info">
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
        </div>
    );
}
