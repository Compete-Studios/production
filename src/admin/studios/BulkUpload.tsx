import React, { useEffect, useState } from 'react';
import { getStudioInfo } from '../../functions/api';
import { showMessage, showErrorMessage } from '../../functions/shared';

const BulkUpload: React.FC<{ studioId: string }> = ({ studioId }) => {
    const [studio, setStudio] = useState<any>(null);
    const [uploadType, setUploadType] = useState<string>('students');
    const [students, setStudents] = useState<any[]>([]);
    const [prospects, setProspects] = useState<any[]>([]);

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

    const bulkUpdate = async () => {
        try {
            console.log('STUDIO:', studio);
            if (uploadType === 'students') {
                console.log('Students:', students);
                showMessage('Students added successfully');
            } else {
                console.log('Prospects:', prospects);
                showMessage('Prospects added successfully');
            }
        } catch (error) {
            console.error(`Failed to add ${uploadType}:`, error);
            showErrorMessage(`Failed to add ${uploadType}. Error: ${(error as Error).message}`);
        }
    };

    if (!studio) {
        return <div>Loading...</div>;
    }

    return (
        <div className="panel xl:col-span-2 lg:row-start-1 xl:h-[480px] xl:relative">
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">
                    You are uploading
                    <span className="font-bold text-blue-500"> {uploadType === 'students' ? 'Students' : 'Prospects'}</span> to <span className="text-lg font-bold text-blue-500">{studio?.Studio_Name}</span>
                </h5>
            </div>

            <div className="mb-5 space-y-4">
                <div>
                    <label className="ml-4">
                        <input
                            type="radio"
                            name="uploadType"
                            value="students"
                            checked={uploadType === 'students'}
                            onChange={() => setUploadType('students')}
                        />
                        Students
                    </label>
                    <label className="ml-4">
                        <input
                            type="radio"
                            name="uploadType"
                            value="prospects"
                            checked={uploadType === 'prospects'}
                            onChange={() => setUploadType('prospects')}
                        />
                        Prospects
                    </label>
                </div>

                {uploadType === 'students' ? (
                    <div>
                        <h4>Select the file to upload. It must be a .csv file and the columns must match the guidelines exactly.</h4>
                        <h4>You cannot have any other columns in the .csv other than the ones shown here. Make sure to completely delete empty columns with names like "Column1", "Column2", etc.</h4>
                        <h4>Remember that everything is case sensitive.</h4>
                        <h4>You can identify these students later by searching for "massUpload" in the AdminNotes for each student.</h4>
                        <h4>Sometimes, while uploading, a row of the spreadsheet will be skipped. This is usually because it does not have anything in the "First_Name" or "Last_Name" cells. If any rows are skipped, they will be displayed at the bottom of this page. If you like, you can enter them by hand into the studio's account.</h4>

                        <p><strong>Some common errors:</strong></p>
                        <p><i><strong>"The given column does not match the column mapping"</strong></i> One or more of the columns has the wrong name. This could be something misspelled, miscapitalized, or there's a column in the .csv that shouldn't be there, like "Column1" or "StreetAddress".</p>
                        <p><i><strong>"Received an invalid column length from the bcp client for..."</strong></i> One or more entries in a cell is too long, maybe a ridiculously long address or a very long sequence of numbers was accidentally entered in the Zip field.</p>
                        <p><i><strong>"SqlDateTime overflow. Must be between..."</strong></i> Somewhere in the spreadsheet a date is formatted incorrectly.</p>
                        <p><i><strong>"Object reference not set to an instance of an object"</strong></i> Something's gone wrong on the back end, call tech support.</p>

                        <div className="row">
                            
                        </div>
                    </div>
                ) : (
                    <div>
                        <h6>Prospect-specific content</h6>
                        {/* Add any additional content for prospects here */}
                            
                    </div>
                )}
            </div>
            <div className="flex justify-end">
                <button className="btn btn-primary" onClick={bulkUpdate}>
                    {uploadType === 'students' ? 'Add Students' : 'Add Prospects'}
                </button>
            </div>
            
        </div>
    );
};

export default BulkUpload;
