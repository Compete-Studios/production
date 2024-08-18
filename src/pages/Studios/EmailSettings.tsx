import React, { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { getStudioOptions, updateStudioOptions } from '../../functions/api';
import { showErrorMessage, showMessage } from '../../functions/shared';
import IconMail from '../../components/Icon/IconMail';

export default function EmailSettings() {
    const { suid, studioInfo }: any = UserAuth();
    const [options, setOptions]: any = useState({});
    const [phoneWorking, setPhoneWorking] = useState(false);
    const [signature, setSignature] = useState('');
    const [update, setUpdate] = useState(false);

    console.log('options', options);

    const fetchOptions = async () => {
        try {
            const response = await getStudioOptions(suid);
            setOptions(response.recordset[0]);
            if (response.recordset[0].TextFromNumber) {
                setPhoneWorking(true);
            }
        } catch (error) {
            console.error('Error fetching studio options:', error);
            setOptions([]);
        }
    };

    const handleUpdate = async () => {
        showMessage('Signatue Updated Successfully');
        setUpdate(false);
    };

    useEffect(() => {
        fetchOptions();
    }, [suid]);

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">My "From" Emails</h2>
            <p className="text-muted-foreground">
                You can have up to three verfied email addresses registered with your account at a time. These email addresses are used as the "from" address when you send emails through the software.
                When you add a new email address you need to click the "send verification email" button. This will send an email to the address that contains a link to click to verify that you have
                access to that email account. Only verified email addresses may be used through the Compete software.
            </p>
            <div className="flex items-center gap-2 mt-4">
                <h4 className="text-lg font-bold ">Email 1:</h4>
                {options?.EmailFromAddress ? (
                    <p className="text-lg">{options?.EmailFromAddress}</p>
                ) : (
                    <div>
                        <div className="flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <IconMail aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    className="form-input block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="button"
                                className="relative -ml-px inline-flex items-center gap-x-1.5 bg-info rounded-r-md px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-blue-500"
                            >
                                Send Verification Email
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2 mt-4">
                <h4 className="text-lg font-bold ">Email 2:</h4>
                {options?.EmailFromAddress2 ? (
                    <p className="text-lg">{options?.EmailFromAddress2}</p>
                ) : (
                    <div>
                        <div className="flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <IconMail aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    className="form-input block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="button"
                                className="relative -ml-px inline-flex items-center gap-x-1.5 bg-info rounded-r-md px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-blue-500"
                            >
                                Send Verification Email
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2 mt-4">
                <h4 className="text-lg font-bold ">Email 3:</h4>
                {options?.EmailFromAddress3 ? (
                    <p className="text-lg">{options?.EmailFromAddress3}</p>
                ) : (
                    <div>
                        <div className="flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <IconMail aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    className="form-input block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="button"
                                className="relative -ml-px inline-flex items-center gap-x-1.5 bg-info rounded-r-md px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-blue-500"
                            >
                                Send Verification Email
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <p className="text-muted-foreground text-xs text-info mt-4">
                Your emails with have a higher rate of deliverability and speed if you use email addresses with domains that you can access and update. For example, you're better off using an email
                address like "info@MyDanceStudioDomain.com" than something like "MyDanceStudio@Gmail.com."
            </p>
            <p className="text-muted-foreground mt-4">
                If you are using a domain specific email address and continue to have deliverability issues let us know. While this is rare, there may be some additional settings we can help you
                update on your domain server that will help.
            </p>
            {update ? (
                <div className="mt-4">
                    <h2 className="text-2xl font-bold tracking-tight">Save and Update Your Studio Email Signature</h2>
                    <p className="text-muted-foreground">
                        If you create one, your signature will be automatically attached to any email you send. You can always edit or delete it inside any emails you compose.
                    </p>
                    <textarea rows={4} className="form-input" placeholder="Signature Content" value={signature} onChange={(e) => setSignature(e.target.value)} />
                    <div className="flex items-end gap-2 mt-4">
                        <button className="btn btn-primary" onClick={handleUpdate}>
                            Save
                        </button>
                        <button className="btn btn-secondary" onClick={() => setUpdate(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-end gap-2 mt-4 ">
                    <button className="btn btn-primary ml-auto" onClick={() => setUpdate(true)}>
                        Edit Email Signature
                    </button>
                </div>
            )}
        </div>
    );
}
