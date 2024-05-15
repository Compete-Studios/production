import { useEffect, useState } from 'react';
import { UserAuth } from '../../../context/AuthContext';
import { updateStudentByColumn } from '../../../functions/api';

import { showMessage } from '../../../functions/shared';

export default function QuickNote({ student, setShowActionModal, update, setUpdate }: any) {    
    const [studentToUpdate, setStudentToUpdate] = useState<any>(student);

    useEffect(() => {
        setStudentToUpdate(student);
    }, [student]);

    const handleUpdateByColumn = async (column: string, e: any) => {
        e.preventDefault();
        const data = {
            studentId: student.StudentId,
            columnName: column,
            value: studentToUpdate[column],
        };
        try {
            const response = await updateStudentByColumn(data);
            showMessage('Note Added Successfully');
            setShowActionModal(false);
            setUpdate(!update);
        } catch (error) {
            console.log(error);
        }
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
                <button className="btn btn-info ml-auto" onClick={(e: any) => handleUpdateByColumn('Notes', e)}>
                    Add Note
                </button>
            </div>
        </div>
    );
}
