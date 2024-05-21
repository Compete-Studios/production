import React, { useEffect, useState } from 'react';
import { getStudioOptions, updateStudioOptions } from '../../functions/api';
import { showMessage, showErrorMessage } from '../../functions/shared';

const StudioLimits: React.FC<{ studioId: string }> = ({ studioId }) => {
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
            showMessage('Studio limits updated successfully');
        } catch (error) {
            console.error('Failed to update limits:', error);
            showErrorMessage(`Failed to update limits. Error: ${(error as Error).message}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setStudioOptions((prevOptions: any) => ({
            ...prevOptions,
            [id]: value,
        }));
    };

    return(
        <div className="pt-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-6 gap-5 mb-5">
                <div className="panel xl:col-span-2 lg:row-start-1 xl:h-[480px] xl:relative">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Monthly Email, Text, and Enrollment Limits</h5>
                    </div>
                    <div className="mb-5 space-y-4">
                        <div className="flex flex-col">
                            <label className="font-bold" htmlFor="EmailFromAddress">
                               Email Limit:
                            </label>
                            <input
                                type="email"
                                id="MonthlyEmailVolume"
                                value={studioOptions?.MonthlyEmailVolume ?? ''}
                                onChange={handleChange}
                                className="input input-primary"
                                placeholder="How many emails can be sent per month"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-bold" htmlFor="EmailFromAddress2">
                               Text Limit:
                            </label>
                            <input
                                type="email"
                                id="MonthlyTextVolume"
                                value={studioOptions?.MonthlyTextVolume ?? ''}
                                onChange={handleChange}
                                className="input input-primary"
                                placeholder="How many texts can be sent per month"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-bold" htmlFor="EmailFromAddress3">
                                Student Limit:
                            </label>
                            <input
                                type="email"
                                id="MaxStudentEnrollment"
                                value={studioOptions?.MaxStudentEnrollment ?? ''}
                                onChange={handleChange}
                                className="input input-primary"
                                placeholder="How many total students can be enrolled in the studio"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="btn btn-primary" onClick={handleUpdate}>
                            Update Limits
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudioLimits;