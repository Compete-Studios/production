import React from 'react'
import { UserAuth } from '../../../context/AuthContext';
import { updateStudentByColumn } from '../../../functions/api';

export default function StudentPipelineStatus({student, setStudent, toUpdate, setToUpdate}: any) {
    const { pipelineSteps }: any = UserAuth();

    const handleUpdateByColumn = async (column: string) => {
        const data = {
            studentId: student?.Student_id,
            columnName: column,
            value: student[column],
        };
        try {
            await updateStudentByColumn(data);
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className="active pt-5 panel">
    <div className="sm:flex sm:flex-wrap sm:flex-row">
        {pipelineSteps.map((step: any) => {
            return (
                <label htmlFor={step.PipelineStepId} className="flex items-center cursor-pointer hover:bg-gray-100 p-1 sm:basis-1/2">
                    <input
                        type="radio"
                        name="pipeline"
                        className="form-radio"
                        value={parseInt(student?.StudentPipelineStatus)}
                        checked={parseInt(student?.StudentPipelineStatus) === step.PipelineStepId}
                        onChange={() => {
                            setStudent({ ...student, StudentPipelineStatus: step.PipelineStepId });
                            setToUpdate({ ...toUpdate, StudentPipelineStatus: true });
                        }}
                    />
                    <span>{step.StepName}</span>
                </label>
            );
        })}
        <label htmlFor="completed" className="flex items-center cursor-pointer hover:bg-gray-100 p-1">
            <input
                type="radio"
                name="pipeline"
                className="form-radio"
                value={parseInt(student?.StudentPipelineStatus)}
                checked={parseInt(student?.StudentPipelineStatus) === 0}
                onChange={() => {
                    setStudent({ ...student, StudentPipelineStatus: 0 });
                    setToUpdate({ ...toUpdate, StudentPipelineStatus: true });
                }}
            />
            <span>No Status/Ignore</span>
        </label>
    </div>
    {toUpdate?.StudentPipelineStatus && (
        <button
            className="mt-4 btn btn-primary "
            onClick={() => {
                setToUpdate({ ...toUpdate, StudentPipelineStatus: false });
                handleUpdateByColumn('StudentPipelineStatus');
            }}
        >
            Save
        </button>
    )}
</div>
  )
}
