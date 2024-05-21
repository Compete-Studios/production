import React, { useEffect, useState } from 'react';
import { updateStudioOptions, getStudioOptions } from '../../functions/api';
import { showMessage, showErrorMessage } from '../../functions/shared';

const TextMessageSetup: React.FC<{ studioId: string }> = ({ studioId }) => {
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
            showMessage('Text message settings updated successfully');
        } catch (error) {
            console.error('Failed to update text message settings:', error);
            showErrorMessage(`Failed to update text message settings. Error: ${(error as Error).message}`);
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
                        <h5 className="font-semibold text-lg dark:text-white-light">Text Message Settings</h5>
                    </div>
                    <p>The studio uses the "From" number to send out texts. When recipients respond to these text messages they'll go right back to the studio's account and will be visible when they log in. This number is purchased from Plivo by Compete and assigned to the studio.</p> 
                    <p> The Forwarding number is used if the studio owner/staff wants to recieve incoming messages on their phone. Compete will automatically forward incoming messages to this number. </p>
                    <div className="mb-5 space-y-4">
                        <div className="flex flex-col">
                            <label className="font-bold" htmlFor="TextFromNumber">
                                Text "From" Number:
                            </label>
                            <input
                                type="text"
                                id="TextFromNumber"
                                value={studioOptions?.TextFromNumber ?? ''}
                                onChange={handleChange}
                                className="input input-primary"
                                placeholder="Enter text from number"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-bold" htmlFor="RedirectIncomingTextNumber">
                                Forwarding Number:
                            </label>
                            <input
                                type="text"
                                id="RedirectIncomingTextNumber"
                                value={studioOptions?.RedirectIncomingTextNumber ?? ''}
                                onChange={handleChange}
                                className="input input-primary"
                                placeholder="Enter forwarding number"
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

export default TextMessageSetup;
