import { useEffect, useState } from 'react';
import { updateProspectPipelineStatus, updateStudentPipelineStatus } from '../../../functions/api';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { constFormateDateMMDDYYYY, formatDate, showErrorMessage, showMessage } from '../../../functions/shared';

export default function QuickUpdateShared({ student, setShowActionModal, update, setUpdate, pipelineSteps, isPrpospect = false }: any) {
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
        const statusIDAsNumber = parseInt(student.CurrentPipelineStatus);
        setCurrentPipeline(statusIDAsNumber);
        setNewContactDate(student.NextContactDate);
    }, [student.Student_id]);

    const handleUpdateStudent = async (e: any) => {
        e.preventDefault();
        const newNote = noteDate + ' ' + staffInitials + ' ' + newNotes + '\n' + student.notes;
        const formatedDate = formatDate(newContactDate);
        const data = {
            studentId: student.StudentId,
            pipelineStatus: currentPipeline,
            nextContactDate: formatedDate,
            notes: newNote,
        };
        const updatePipelineStatus = await updateStudentPipelineStatus(data);

        if (updatePipelineStatus.status === 200) {
            showMessage('Student Updated Successfully');
            setShowActionModal(false);
            setUpdate(!update);
        } else {
            console.log('Error updating student');
            showErrorMessage('Error updating student');
        }
    };

    const handleUpdateProspect = async (e: any) => {
        e.preventDefault();
        const newNote = noteDate + ' ' + staffInitials + ' ' + newNotes + '\n' + student.notes;
        const formatedDate = formatDate(newContactDate);
        const data = {
            prospectId: student.ProspectId,
            pipelineStatus: currentPipeline,
            nextContactDate: formatedDate,
            notes: newNote,
        };
        const updatePipelineStatus = await updateProspectPipelineStatus(data);

        if (updatePipelineStatus.status === 200) {
            showMessage('Student Updated Successfully');
            setShowActionModal(false);
            setUpdate(!update);
        } else {
            console.log('Error updating student');
            showErrorMessage('Error updating student');
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2">
                {pipelineSteps.map((step: any) => {
                    return (
                        <label htmlFor={step.PipelineStepId} className="flex items-center cursor-pointer hover:bg-gray-100 p-1" onClick={() => setCurrentPipeline(step.PipelineStepId)}>
                            <input
                                type="radio"
                                name="pipeline"
                                className="form-radio"
                                value={currentPipeline}
                                checked={currentPipeline === step.PipelineStepId}
                                onChange={() => setCurrentPipeline(step.PipelineStepId)}
                            />
                            <span>{step.StepName}</span>
                        </label>
                    );
                })}
            </div>
            <div>
                <div className="font-bold">
                    Current Contact Date: <span className="text-danger">{constFormateDateMMDDYYYY(studentToUpdate?.NextContactDate) || 'Not Set'}</span>
                </div>
            </div>
            <div>
                <label htmlFor="contactDate">Next Contact Date</label>
                <Flatpickr 
                value={newContactDate} 
                className="form-input" 
                options={{ dateFormat: 'm-d-Y', position: 'auto right' }} 
                onChange={(date: any) => setNewContactDate(date)} />
            </div>
            <div>
                <input type="text" className="form-input w-full" placeholder="Staff Initials" value={staffInitials} onChange={(e) => setStaffInitials(e.target.value)} />
            </div>
            <div>
                <textarea className="form-textarea w-full" placeholder="Add a note" rows={4} value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
            </div>
            <div className="w-full">
                <button className="btn btn-info ml-auto" onClick={isPrpospect ? handleUpdateProspect : handleUpdateStudent}>
                    Update Student
                </button>
            </div>
        </div>
    );
}
