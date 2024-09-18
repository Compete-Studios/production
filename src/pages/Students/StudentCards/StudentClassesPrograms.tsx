import React from 'react';
import AddStudentToClass from '../../Classes/AddStudentToClass';
import { showWarningMessage } from '../../../functions/shared';
import { dropStudentFromClass, dropStudentFromProgram, dropStudentFromWaitingList } from '../../../functions/api';
import AddStudentToWaitingList from '../../Classes/AddStudentToWaitingList';
import AddStudentToProgram from '../../Classes/AddStudenToProgram';

export default function StudentClassesPrograms({ student, classes, programs, waitingLists, updateClasses, setUpdateClasses }: any) {
    const handleDeleteFromClass = (classID: any) => {
        showWarningMessage('Are you sure you want to remove this student from this class?', 'Remove Student From Class', 'Your student has been removed from the class')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    // User confirmed the action
                    const studentID: any = student?.Student_id;
                    dropStudentFromClass(studentID, classID).then((response) => {
                        if (response) {
                            setUpdateClasses(!updateClasses);
                        }
                    });
                } else {
                    // User canceled the action
                    console.log('User canceled');
                }
            })
            .catch((error) => {
                // Handle error if any
                console.error('Error:', error);
            });
    };

    const handleDeleteFromProgram = (programId: any) => {
        showWarningMessage('Are you sure you want to remove this student from this program?', 'Remove Student From Program', 'Your student has been removed from the program')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    // User confirmed the action
                    const studentId: any = student?.Student_id;
                    dropStudentFromProgram(programId, studentId).then((response) => {
                        if (response) {
                            setUpdateClasses(!updateClasses);
                        }
                    });
                } else {
                    // User canceled the action
                    console.log('User canceled');
                }
            })
            .catch((error) => {
                // Handle error if any
                console.error('Error:', error);
            });
    };

    const handleRemoveFromList = (waitingListId: any) => {
        showWarningMessage('Are you sure you want to remove this student from this waiting list?', 'Remove Student From Waiting List', 'Your student has been removed from the waiting list')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    // User confirmed the action
                    const studentId: any = student?.Student_id;
                    const listID = waitingListId[0];
                    dropStudentFromWaitingList(studentId, listID).then((response) => {
                        if (response) {
                            setUpdateClasses(!updateClasses);
                        }
                    });
                } else {
                    // User canceled the action
                    console.log('User canceled');
                }
            })
            .catch((error) => {
                // Handle error if any
                console.error('Error:', error);
            });
    };
    return (
        <div className="pt-5">
            {/* SCHEDULE */}
            <div className="panel lg:col-span-1 xl:col-span-2 ">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Schedule and Classes</h5>
                </div>
                <div className="table-responsive mb-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Classes</th>
                                <th className="text-center">
                                    <AddStudentToClass student={student} alreadyIn={classes} updateClasses={updateClasses} setUpdateClasses={setUpdateClasses} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes?.map((classItem: any, index: any) => {
                                return (
                                    <tr key={index} className="hover:bg-dark-light ">
                                        <td>
                                            <div className="whitespace-nowrap">{classItem?.Name}</div>
                                        </td>

                                        <td className="flex">
                                            <button className="btn btn-danger btn-sm ml-auto" onClick={() => handleDeleteFromClass(classItem?.ClassId)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="table-responsive mb-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Programs</th>
                                <th className="text-center">
                                    <AddStudentToProgram student={student} alreadyIn={programs} updateClasses={updateClasses} setUpdateClasses={setUpdateClasses} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {programs?.map((programItem: any, index: any) => {
                                return (
                                    <tr key={index} className="hover:bg-zinc-100 ">
                                        <td>
                                            <div className="whitespace-nowrap">{programItem?.Name}</div>
                                        </td>

                                        <td className="flex">
                                            <button className="btn btn-danger btn-sm ml-auto" onClick={() => handleDeleteFromProgram(programItem?.ProgramId)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="table-responsive mb-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Waiting Lists</th>
                                <th className="text-center">
                                    <AddStudentToWaitingList student={student} alreadyIn={waitingLists} updateClasses={updateClasses} setUpdateClasses={setUpdateClasses} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {waitingLists?.map((listItem: any, index: any) => {
                                return (
                                    <tr key={index} className="hover:bg-zinc-100 ">
                                        <td>
                                            <div className="whitespace-nowrap">{listItem?.Title}</div>
                                        </td>

                                        <td className="flex">
                                            <button className="btn btn-danger btn-sm ml-auto" onClick={() => handleRemoveFromList(listItem?.WaitingListId)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
