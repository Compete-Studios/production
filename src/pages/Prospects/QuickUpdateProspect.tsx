import { useEffect, useState } from 'react';
import { updateProspectByColumn } from '../../functions/api';

import { showMessage } from '../../functions/shared';
import { formatDate } from '@fullcalendar/core';

export default function QuickUpdateProspect({ student, setShowActionModal, update, setUpdate, pipelineSteps, isPrpospect = false }: any) {
    const [studentToUpdate, setStudentToUpdate] = useState<any>(student);
    const [currentPipeline, setCurrentPipeline] = useState<any>([]);
    const [staffInitials, setStaffInitials] = useState<any>('');
    const [newContactDate, setNewContactDate] = useState<any>('');
    const [newNotes, setNewNotes] = useState<any>('');
    const currentDate = new Date();
    const noteDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear() % 100}`;

    console.log('student', student);

    useEffect(() => {
        setStudentToUpdate(student);    
    }, [student.Student_id]);

    const handleUpdateByColumn = async (column: string, secondColumn: string, e: any) => {
        e.preventDefault();
        const data = {
            prospectId: student.ProspectId,
            columnName: column,
            value: studentToUpdate[column],
        };
        const data2 = {
            prospectId: student.ProspectId,
            columnName: secondColumn,
            value: studentToUpdate[secondColumn],
        };
        try {
            const response = await updateProspectByColumn(data);
            const response2 = await updateProspectByColumn(data2);
            showMessage('Updated Successfully');
            setShowActionModal(false);
            setUpdate(!update);
        } catch (error) {
            console.log(error);
        }
    };


    const handleGetTimeZoneOfUser = () => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return timeZone;
    };


    return (
        <div className="space-y-4">
            <div>
                <div className="font-bold">
                    Current Contact Date:{' '}
                    <span className="text-danger">
                        {studentToUpdate.NextContactDate && studentToUpdate.NextContactDate !== '1900-01-01T00:00:00.000Z'
                            ? formatDate(new Date(studentToUpdate.NextContactDate), { month: 'short', day: 'numeric', year: 'numeric', timeZone: handleGetTimeZoneOfUser() })
                            : 'N/A'}
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="contactDate">Next Contact Date</label>
                <input type="date" 
                value={studentToUpdate.NextContactDate}
                className="form-input" 
                onChange={(e) => setStudentToUpdate({ ...studentToUpdate, NextContactDate: e.target.value })} />
            </div>

            <div className="grid grid-cols-2">
            {pipelineSteps.map((step: any) => {
                    return (
                        <label htmlFor={step.PipelineStepId} className="flex items-center cursor-pointer hover:bg-gray-100 p-1" onClick={() => setCurrentPipeline(step.PipelineStepId)}>
                            <input
                                type="radio"
                                name="pipeline"
                                className="form-radio"
                                value={parseInt(studentToUpdate?.CurrentPipelineStatus)}
                                checked={parseInt(studentToUpdate?.CurrentPipelineStatus) === step.PipelineStepId}
                                onChange={() => setStudentToUpdate({ ...studentToUpdate, CurrentPipelineStatus: step.PipelineStepId })}
                            />
                            <span>{step.StepName}</span>
                        </label>
                    );
                })}
            </div>

            <div className="w-full">
            <button className="btn btn-info ml-auto" onClick={(e: any) => handleUpdateByColumn('CurrentPipelineStatus', 'NextContactDate', e)}>
                    Update and View Prospect
                </button>
            </div>
        </div>
    );
}
