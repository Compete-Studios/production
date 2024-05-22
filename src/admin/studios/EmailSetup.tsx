import React, { useEffect, useState } from 'react';
import { getStudioOptions, updateStudioOptions } from '../../functions/api';
import { showMessage, showErrorMessage } from '../../functions/shared';

const EmailSetup: React.FC<{ studioId: string }> = ({ studioId }) => {
    const [studioOptions, setStudioOptions] = useState<any>(null);

    useEffect(() => {
        if (studioId) {
            getOptions(studioId);
        }
    }, [studioId]);

    const getOptions = async (studioId: string) => {
        try {
            const response = await getStudioOptions(studioId);
            setStudioOptions(response.recordset[0]);
        } catch (error) {
            console.log('Error fetching studio options:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateStudioOptions(studioId, studioOptions);
            showMessage('Email settings updated successfully');
        } catch (error) {
            console.error('Failed to update credentials:', error);
            showErrorMessage(`Failed to update email settings. Error: ${(error as Error).message}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setStudioOptions((prevOptions: any) => ({
            ...prevOptions,
            [id]: value,
        }));
    };

    return (
        <div className="pt-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-6 gap-5 mb-5">
                <div className="panel xl:col-span-2 lg:row-start-1 xl:h-[480px] xl:relative">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Outgoing Email Settings</h5>
                    </div>
                    <p>It's important that we're certain that the user has access to whatever email address is entered here. They will be able to send emails through the system from that address. When they set this up on their own the system sends an email address to them with a verification link included. It's best to ask them to send you an email from this address before you set it up here. </p>
                    <hr />

                    <div className="mb-5 space-y-4">
                        <div className="flex flex-col">
                            <label className="font-bold" htmlFor="EmailFromAddress">
                                Email 1:
                            </label>
                            <input
                                type="email"
                                id="EmailFromAddress"
                                value={studioOptions?.EmailFromAddress ?? ''}
                                onChange={handleChange}
                                className="input input-primary"
                                placeholder="Enter email address"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-bold" htmlFor="EmailFromAddress2">
                                Email 2:
                            </label>
                            <input
                                type="email"
                                id="EmailFromAddress2"
                                value={studioOptions?.EmailFromAddress2 ?? ''}
                                onChange={handleChange}
                                className="input input-primary"
                                placeholder="Enter email address"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-bold" htmlFor="EmailFromAddress3">
                                Email 3:
                            </label>
                            <input
                                type="email"
                                id="EmailFromAddress3"
                                value={studioOptions?.EmailFromAddress3 ?? ''}
                                onChange={handleChange}
                                className="input input-primary"
                                placeholder="Enter email address"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="btn btn-primary" onClick={handleUpdate}>
                            Update Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailSetup;