import React, { useEffect, useState } from 'react';
import { UserAuth } from '../../../context/AuthContext';
import { getStudentInfo, updateStudentByColumn, updateStudentNotes, updateStudentPipelineStatus } from '../../../functions/api';

import { formatDate } from '@fullcalendar/core';
import { hashTheID, showMessage } from '../../../functions/shared';
import { useNavigate } from 'react-router-dom';

export default function QuickUpdate({ student, setShowActionModal, update, setUpdate }: any) {
    const { pipelineSteps, suid }: any = UserAuth();
    const [studentToUpdate, setStudentToUpdate] = useState<any>(student);
    const [currentPipeline, setCurrentPipeline] = useState<any>([]);
    const [staffInitials, setStaffInitials] = useState<any>('');
    const [newNotes, setNewNotes] = useState<any>('');
    const currentDate = new Date();
    const noteDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear() % 100}`;
    
    const navigate = useNavigate();

    const handleGetStudentInfo = async (studentId: any) => {
        const studentInfo = await getStudentInfo(studentId);
        setStudentToUpdate(studentInfo);
    };

    useEffect(() => {
        handleGetStudentInfo(student.StudentId);
    }, [student]);
 

    const handleUpdateByColumn = async (column: string, secondColumn: string, e: any) => {
        e.preventDefault();
        const data = {
            studentId: student.StudentId,
            columnName: column,
            value: studentToUpdate[column],
        };
        const data2 = {
            studentId: student.StudentId,
            columnName: secondColumn,
            value: studentToUpdate[secondColumn],
        };
        try {
            const response = await updateStudentByColumn(data);
            const response2 = await updateStudentByColumn(data2);
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
                                value={parseInt(studentToUpdate?.StudentPipelineStatus)}
                                checked={parseInt(studentToUpdate?.StudentPipelineStatus) === step.PipelineStepId}
                                onChange={() => setStudentToUpdate({ ...studentToUpdate, StudentPipelineStatus: step.PipelineStepId })}
                            />
                            <span>{step.StepName}</span>
                        </label>
                    );
                })}
            </div>
            <div className="w-full">
                <button className="btn btn-info ml-auto" onClick={(e: any) => handleUpdateByColumn('StudentPipelineStatus', 'NextContactDate', e)}>
                    Update and View Student
                </button>
            </div>
        </div>
    );
}
