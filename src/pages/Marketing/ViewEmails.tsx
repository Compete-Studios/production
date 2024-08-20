import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconEye from '../../components/Icon/IconEye';
import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { getAllEmailLogsByStudioId, getEmailLogsByStudioId } from '../../functions/emails';
import { constFormateDateMMDDYYYY, hashTheID } from '../../functions/shared';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';
import { Link } from 'react-router-dom';


export default function ViewEmails() {
    const { suid }: any = UserAuth();
    const [emails, setEmails] = useState([]);
    const [startDate, setStartDate] = useState<string>(new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0]);
    const getTomorrowDate = () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
  };
  
  const [endDate, setEndDate] = useState<string>(getTomorrowDate());;
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
          <h1 className="text-2xl font-semibold text-gray-800">Search Email History </h1>
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
                                            <Link to={`/marketing/email-details/${hashTheID(data.EmailId)}`} type="button" className="text-info">
                                                <IconEye />
                                            </Link>
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
