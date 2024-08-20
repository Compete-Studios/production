import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEmailingListByListId, getEmailListMembers } from '../../functions/emails';
import { unHashTheID } from '../../functions/shared';
import { formatDate } from '@fullcalendar/core';

export default function EmailListDetails() {
    const [listDetails, setListDetails] = useState<any>(null);
    const [listMembers, setListMembers] = useState<any>(null);
    const { listID } = useParams<{ listID: string }>();

    const handleGetListMembers = async () => {
        try {
            const newID = unHashTheID(listID);
            const res = await getEmailListMembers(newID);
            setListMembers(res.recordset);
            console.log(res, 'res');
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetListDetails = async () => {
        try {
            const newID = unHashTheID(listID);
            const res = await getEmailingListByListId(newID);
            setListDetails(res.recordset[0]);
            console.log(res, 'res');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetListDetails();
        handleGetListMembers();
    }, []);

    console.log(listMembers, 'listMembers');

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800">Email List Details</h1>
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-800">List Name: {listDetails?.FriendlyName}</h2>
                <p className="text-sm text-gray-500">List Description: {listDetails?.Description}</p>
                <p className="text-sm text-gray-500">List Created Date: {formatDate(listDetails?.CreationDate)}</p>
                <p className="text-sm text-gray-500">Number of Members: {listMembers?.length || 0}</p>
            </div>
            <div className="mt-4">
                <table className="min-w-full divide-y divide-gray-200 border rounded-md shadow">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Member Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Member Email
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {listMembers?.map((member: any, index: number) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {member.Name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-danger">Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
