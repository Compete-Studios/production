import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllEmailingListsByStudioId, getEmailLogsByNewsletterId, getNewsletterDetails } from '../../functions/emails';
import { formatDate, unHashTheID } from '../../functions/shared';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';
import IconEye from '../../components/Icon/IconEye';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function ViewNewsletter() {
    const { id, total } = useParams<{ id: string; total: any }>();
    const [letter, setLetter] = useState({
        QueryTitle: 'Open House Saturday, September 7th',
        FromEmail: '',
        CreationDate: '8/16/2024',
        SendDate: '8/16/2024',
        totalSent: '1000 emails sent with this newsletter.',
        opens: 0,
        bounces: 0,
        spamWarnings: 0,
        Body: 'This is the body of the email',
        clicks: 0,
        Subject: 'free dance class, you are invited!!',
    });
    const [logs, setLogs] = useState([]);

    const handleGetNewsLetterDetails = async () => {
        try {
            const newID = unHashTheID(id);
            const res = await getNewsletterDetails(newID);
            console.log(res.recordset[0], 'res');
            setLetter(res.recordset[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetLogs = async () => {
        try {
            const newID = unHashTheID(id);
            const res = await getEmailLogsByNewsletterId(newID);
            console.log(res.recordset, 'res');
            setLogs(res.recordset);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetNewsLetterDetails();
        handleGetLogs();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800">Newsletter Details</h1>
            <div className="flex items-start gap-4 mt-4">
                <div className='space-y-2'>
                    <h2 className="text-sm text-gray-900 font-bold">{letter.QueryTitle}</h2>
                    <p className="text-sm text-gray-900 font-bold">From: <span className='font-normal text-gray-500'>{letter.FromEmail}</span></p>
                    <p className="text-sm text-gray-900 font-bold">Creation Date: <span className='font-normal text-gray-500'>{formatDate(letter.CreationDate)}</span></p>
                    <p className="text-sm text-gray-900 font-bold">Send Date: <span className='font-normal text-gray-500'>{formatDate(letter.SendDate)}</span></p>
                    <p className="text-sm text-gray-900 font-bold">Total Sent: <span className='font-normal text-gray-500'>{total}</span></p>
                </div>
                <div className='space-y-2'>
                    <p className="text-sm text-gray-900 font-bold">Opens: <span className='font-normal text-gray-500'>{letter.opens || 0}</span></p>
                    <p className="text-sm text-gray-900 font-bold">Bounces: <span className='font-normal text-gray-500'>{letter.bounces || 0}</span></p>
                    <p className="text-sm text-gray-900 font-bold">Spam Warnings: <span className='font-normal text-gray-500'>{letter.spamWarnings || 0}</span></p>
                    <p className="text-sm text-gray-900 font-bold">Clicks: <span className='font-normal text-gray-500'>{letter.clicks || 0}</span></p>
                    <p className="text-sm text-gray-900 font-bold">Subject: <span className='font-normal text-gray-500'>{letter.Subject}</span></p>
                </div>
            </div>
            <div className="mt-4 panel">
                <div 
                dangerouslySetInnerHTML={{ __html: letter.Body }} 
                />
            </div>
            <div className="table-responsive mt-12 mb-5">
                <table className="panel table-hover">
                    <thead>
                        <tr>
                            <th>Recipient</th>
                            <th>Date Sent</th>
                            <th>Sent</th>
                            <th>Opened</th>
                            <th>Clicked</th>
                            <th>Bounced</th>
                            <th>Spam</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs?.map((data: any) => {
                            return (
                                <tr key={data.MailgunGUID}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.ToEmail}</div>
                                    </td>
                                    <td>{data.SendDate ? formatWithTimeZone(data.SendDate, handleGetTimeZoneOfUser()) : ''}</td>
                                    <td>
                                        <IconCircleCheck fill={true} className="text-success" />
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
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
