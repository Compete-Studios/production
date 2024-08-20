import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconEye from '../../components/Icon/IconEye';
import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { getAllEmailingListsByStudioId } from '../../functions/emails';
import { constFormateDateMMDDYYYY, hashTheID } from '../../functions/shared';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { Link } from 'react-router-dom';

export default function EmailLists() {
    const { suid }: any = UserAuth();
    const [emails, setEmails] = useState([]);
    const [startDate, setStartDate] = useState<string>(new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0]);
    const getTomorrowDate = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const [endDate, setEndDate] = useState<string>(getTomorrowDate());
    const [numberOfEmails, setNumberOfEmails] = useState<number>(0);
    const [monthlyAllotment, setMonthlyAllotment] = useState<number>(0);
    // const startDate = '2024-06-10'
    // const endDate = '2024-06-16'

    const handleGetEmailLists = async () => {
        try {
            const res = await getAllEmailingListsByStudioId(suid);
            setEmails(res.recordset);
            console.log(res, 'res');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetEmailLists();
    }, []);

    useEffect(() => {
        const totalEmails: any = localStorage.getItem('numberOfEmails');
        const totalAllotment: any = localStorage.getItem('monthlyEmailLimit');
        setNumberOfEmails(totalEmails);
        setMonthlyAllotment(totalAllotment);
    }, [emails]);

    return (
        <div>
            <div className='md:flex md:items-center md:justify-between'>
            <div>
            <h1 className="text-2xl font-semibold text-gray-800">View Email Lists</h1>
            <p className="text-sm text-gray-500">
                Your studio has created {numberOfEmails} emails this month and your monthly allottment of emails is {monthlyAllotment}.
            </p>
            </div>
            <div className='md:mt-0 mt-4'>
                <button className="btn btn-primary">Create New List</button>

            </div>
            </div>
            <div className="table-responsive mt-12 mb-5">
                <table className="panel table-hover">
                    <thead>
                        <tr>
                            <th>List Name</th>
                            <th>Members and Info</th>
                            <th>Send Newsletter to This List</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emails?.map((data: any) => {
                            return (
                                <tr key={data.EmailingListId}>
                                    <td>
                                        <div>{data.FriendlyName}</div>
                                    </td>
                                    <td>
                                        <Link to={`/marketing/email-list-details/${hashTheID(data.EmailingListId)}`} type="button" className="text-info">
                                            View 
                                        </Link>
                                    </td>
                                    <td>
                                        <button type="button" className="text-info">
                                           Create Newsletter
                                        </button>
                                    </td>

                                    <td className="text-right">
                                        <Tippy content="View Details">
                                            <button type="button" className="text-danger">
                                                <IconTrashLines />
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
