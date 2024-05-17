import { useEffect, useState } from 'react';
import { updateProspectByColumn, updateProspectNotes } from '../../functions/api';
import { showMessage } from '../../functions/shared';

export default function QuickNoteProspect({ student, setShowActionModal, update, setUpdate }: any) {    
    const [studentToUpdate, setStudentToUpdate] = useState<any>(student);

    useEffect(() => {
        setStudentToUpdate(student);
        const statusIDAsNumber = parseInt(student.StudentPipelineStatus);
    }, [student])
    
    console.log('student', student)


    const handleSaveNotes = (e: any) => {
        e.preventDefault();
        const noteData = {
            prospectId: student.ProspectId,
            notes: studentToUpdate?.Notes,
        };
        updateProspectNotes(noteData);
        showMessage('Notes Updated!');
        setUpdate(!update);
        setShowActionModal(false);
    };

    return (
        <div className="space-y-4">
            <div>
                <textarea
                    className="form-textarea w-full"
                    placeholder="Add a note"
                    rows={24}
                    value={studentToUpdate?.Notes}
                    onChange={(e) => setStudentToUpdate({ ...studentToUpdate, Notes: e.target.value })}
                ></textarea>
            </div>
            <div className="w-full">
                <button className="btn btn-info ml-auto" onClick={(e) => handleSaveNotes(e)}>
                    Add Note
                </button>
            </div>
        </div>
    );
}
