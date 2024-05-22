import React, { useEffect, useState } from 'react';
import { updateStudioPaysimpleCredentials, getStudioInfo } from '../../functions/api';
import { showMessage, showErrorMessage } from '../../functions/shared';

const PaysimpleIntegration: React.FC<{ studioId: string }> = ({ studioId }) => {
    const [studio, setStudio] = useState<any>(null);
    const [apiUserId, setApiUserId] = useState<string>('');
    const [apiKey, setApiKey] = useState<string>('');

    useEffect(() => {
        if (studioId) {
            getInfo(studioId);
        }
    }, [studioId]);

    const getInfo = async (studioId: string) => {
        try {
            const response = await getStudioInfo(studioId);
            setStudio(response);
            setApiUserId(response.paySimpleUserId || '');
            setApiKey(response.paySimpleAPIKey || '');
        } catch (error) {
            console.log('Error fetching studio info:', error);
        }
    };

    const handleUpdate = async () => {
        const data = {
            studioId: studio.Studio_Id,
            APIUserId: apiUserId,
            APIKey: apiKey,
        };
        try {
            await updateStudioPaysimpleCredentials(data);
            showMessage('Paysimple credentials updated successfully');
        } catch (error) {
            console.error('Failed to update credentials:', error);
            showErrorMessage(`Failed to update Paysimple credentials. Error: ${(error as Error).message}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'apiUserId') {
            setApiUserId(value);
        } else if (id === 'apiKey') {
            setApiKey(value);
        }
    };

    return (
        <div className="panel xl:col-span-2 lg:row-start-1 xl:h-[480px] xl:relative">
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">Paysimple Integration</h5>
            </div>
            <div className="mb-5 space-y-4">
                <div className="flex flex-col">
                    <label className="font-bold" htmlFor="apiUserId">
                        API User ID:
                    </label>
                    <input
                        type="text"
                        id="apiUserId"
                        value={apiUserId}
                        onChange={handleChange}
                        className="input input-primary"
                        placeholder="Enter API User ID"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold" htmlFor="apiKey">
                        API Key:
                    </label>
                    <input
                        type="text"
                        id="apiKey"
                        value={apiKey}
                        onChange={handleChange}
                        className="input input-primary"
                        placeholder="Enter API Key"
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <button className="btn btn-primary" onClick={handleUpdate}>
                    Update Credentials
                </button>
            </div>
        </div>
    );
};

export default PaysimpleIntegration;