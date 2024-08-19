import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { unHashTheID } from '../../functions/shared';
import { getEmailLogByEmailId } from '../../functions/emails';
import { formatDate } from '@fullcalendar/core';

export default function ViewEmailDetails() {
    const [email, setEmail] = useState<any>({});

    const { id } = useParams<{ id: string }>();

    const handleGetEmailDetails = async () => {
        try {
            const newID = unHashTheID(id);
            const res = await getEmailLogByEmailId(newID);
            console.log(res.recordset[0], 'res');
            setEmail(res.recordset[0]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetEmailDetails();
    }, []);

    console.log(email, 'email');

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800">Newsletter Details</h1>
            <div className="flex items-start gap-4 mt-4">
                <div className="space-y-2">
                    <h2 className="text-sm text-gray-900 font-bold">{email?.QueryTitle}</h2>
                    <p className="text-sm text-gray-900 font-bold">
                        Recipient: <span className="font-normal text-gray-500">{email?.ToEmail}</span>
                    </p>
                    <p className="text-sm text-gray-900 font-bold">
                        Sender: <span className="font-normal text-gray-500">{email?.FromEmail}</span>
                    </p>
                    <p className="text-sm text-gray-900 font-bold">
                        Creation Date: <span className="font-normal text-gray-500">{formatDate(email.CreationDate)}</span>
                    </p>
                    <p className="text-sm text-gray-900 font-bold">
                        Send Date: <span className="font-normal text-gray-500">{formatDate(email.SendDate)}</span>
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-900 font-bold">
                        Opened: <span className="font-normal text-gray-500">{email?.Opened || "Never"}</span>
                    </p>
                    <p className="text-sm text-gray-900 font-bold">
                        Bounced: <span className="font-normal text-gray-500">{email?.Bounced || "Never"}</span>
                    </p>
                    <p className="text-sm text-gray-900 font-bold">
                        Spam: <span className="font-normal text-gray-500">{email?.Spam || "Never"}</span>
                    </p>
                    <p className="text-sm text-gray-900 font-bold">
                        Clicked: <span className="font-normal text-gray-500">{email?.Clicked || "Never"}</span>
                    </p>
                    <p className="text-sm text-gray-900 font-bold">
                        Subject: <span className="font-normal text-gray-500">{email?.Subject}</span>
                    </p>
                </div>
            </div>
            <div className="mt-4 panel">
                <div dangerouslySetInnerHTML={{ __html: email?.Body }} />
            </div>
            <div className='text-center mt-4'>
                <Link to="/marketing/view-emails" className="text-info">
                    Back to Emails
                </Link>
            </div>
        </div>
    );
}
