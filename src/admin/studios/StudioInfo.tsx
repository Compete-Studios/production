import React, { useEffect, useState } from 'react';
import { getStudioInfo, updateStudioInDB } from '../../functions/api';
import { showMessage, showErrorMessage } from '../../functions/shared';

const StudioInfo: React.FC<{ studioId: string }> = ({ studioId }) => {
    const [studio, setStudio] = useState<any>(null);

    useEffect(() => {
        if (studioId) {
            getInfo(studioId);
        }
    }, [studioId]);

    const getInfo = async (studioId: string) => {
        try {
            const response = await getStudioInfo(studioId);
            setStudio(response);
        } catch (error) {
            console.log('Error fetching studio info:', error);
        }
    };

    const handleUpdate = async () => {
        try {
         
            await updateStudioInDB(studioId, studio);
            showMessage('Contact info updated successfully');
        } catch (error) {
            console.error('Failed to update contact info:', error);
            showErrorMessage(`Failed to update contact info. Error: ${(error as Error).message}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setStudio((prevStudio: any) => ({
            ...prevStudio,
            [id]: value,
        }));
    };

    if (!studio) {
        return <div>Loading...</div>;
    }

    return (
        <div className="panel xl:col-span-2 lg:row-start-1 xl:h-[480px] xl:relative">
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">Contact Info</h5>
            </div>
            <p className="font-bold ">
                Studio ID:{' '}
                <span className="font-semibold text-primary">
                    {studio?.Studio_Id} 
                </span>
            </p>
            <div className="mb-5 space-y-4">
                <div className="flex flex-col">
                    <label className="font-bold" htmlFor="Contact_Name">
                        Studio Name:
                    </label>
                    <input
                        type="text"
                        id="Studio_Name"
                        value={studio.Studio_Name ?? ''}
                        onChange={handleChange}
                        className="input input-primary"
                        placeholder="Enter contact name"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold" htmlFor="Contact_Name">
                        Contact Name:
                    </label>
                    <input
                        type="text"
                        id="Contact_Name"
                        value={studio.Contact_Name ?? ''}
                        onChange={handleChange}
                        className="input input-primary"
                        placeholder="Enter contact name"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold" htmlFor="Contact_Email">
                        Contact Email:
                    </label>
                    <input
                        type="email"
                        id="Contact_Email"
                        value={studio.Contact_Email ?? ''}
                        onChange={handleChange}
                        className="input input-primary"
                        placeholder="Enter contact email"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold" htmlFor="Contact_Number">
                        Contact Phone:
                    </label>
                    <input
                        type="text"
                        id="Contact_Number"
                        value={studio.Contact_Number ?? ''}
                        onChange={handleChange}
                        className="input input-primary"
                        placeholder="Enter contact phone"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold" htmlFor="Contact_Address">
                        Address:
                    </label>
                    <input
                        type="text"
                        id="Contact_Address"
                        value={studio.Contact_Address ?? ''}
                        onChange={handleChange}
                        className="input input-primary"
                        placeholder="Enter address"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold" htmlFor="Contact_City">
                        City:
                    </label>
                    <input
                        type="text"
                        id="Contact_City"
                        value={studio.Contact_City ?? ''}
                        onChange={handleChange}
                        className="input input-primary"
                        placeholder="Enter city"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold" htmlFor="Contact_State">
                        State:
                    </label>
                    <input
                        type="text"
                        id="Contact_State"
                        value={studio.Contact_State ?? ''}
                        onChange={handleChange}
                        className="input input-primary"
                        placeholder="Enter state"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold" htmlFor="Contact_Zip">
                        Zip Code:
                    </label>
                    <input
                        type="text"
                        id="Contact_Zip"
                        value={studio.Contact_Zip ?? ''}
                        onChange={handleChange}
                        className="input input-primary"
                        placeholder="Enter zip code"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold" htmlFor="Contact_Zip">
                      Admin Notes:
                    </label>
                    <input
                        type="text"
                        id="notes"
                        value={studio.notes ?? ''}
                        onChange={handleChange}
                        className="input input-primary"
                        placeholder="Notes go here."
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <button className="btn btn-primary" onClick={handleUpdate}>
                    Update Contact Info
                </button>
            </div>
        </div>
    );
};

export default StudioInfo;