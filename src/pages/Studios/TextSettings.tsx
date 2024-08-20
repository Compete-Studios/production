import React, { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { getStudioOptions, updateStudioOptions } from '../../functions/api';
import { showErrorMessage, showMessage } from '../../functions/shared';

export default function TextSettings() {
    const { suid, studioInfo }: any = UserAuth();
    const [options, setOptions]: any = useState({});
    const [phoneWorking, setPhoneWorking] = useState(false);
    const [newNumber, setNewNumber] = useState('');
    const [update, setUpdate] = useState(false);

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
        const newOptions = {
            ...options,
            RedirectIncomingTextNumber: newNumber,
        };
        const res = await updateStudioOptions(suid, newOptions);
        if (res == 'Update was successful') {
            showMessage('Forwarding Number Updated Successfully');
            setUpdate(false);
            fetchOptions();
        } else {
            showErrorMessage('Failed to update limits. Error: ' + res);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, [suid]);

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Text Settings</h2>
            <div className="flex items-end gap-2 mt-4">
                <h4 className="text-lg font-bold ">Text "From" Number:</h4>
                <p className="text-lg">{options?.TextFromNumber}</p>
            </div>
            <div className="flex items-end gap-2 mt-4">
                <h4 className="text-lg font-bold ">Forwarding Number:</h4>
                <p className={`text-lg ${!options?.RedirectIncomingTextNumber && 'text-danger'}`}>{options?.RedirectIncomingTextNumber ? options?.RedirectIncomingTextNumber : 'No Number Set'}</p>
            </div>
            {update ? (
                <div className="mt-4">
                    <p className="text-muted-foreground text-xs text-info">
                        *You can update this phone number at any time. To disable text forwarding simply leave the text box blank and hit the 'update' button.
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight">Update Forwarding Info</h2>
                    <p className="text-muted-foreground">
                        Alright, we've selected your 'From' number that will be used to send out messages. When recipients respond to these text messages they'll go right back to your secure account
                        and be visible when you log in. You'll be able to respond to these messages just like you do on your phone. However, the software can also notify you of incoming messages by
                        forwarding these messages to a text-enabled phone of your choice. (These incoming text messages come from the number you selected in the previous step.) This step is completely
                        optional and can be updated or turned on or off at any time. If you don't want to set this forwarding number right now, just leave the text box blank.
                    </p>
                    <input type="text" className="form-input" placeholder="Enter Forwarding Number" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
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
                <div className="flex items-end gap-2 mt-4">
                    <button className="btn btn-primary" onClick={() => setUpdate(true)}>
                        Update Forwarding Info
                    </button>
                </div>
            )}
        </div>
    );
}
