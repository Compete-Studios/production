import React, { useState } from 'react';
import { updateStudentByColumn } from '../../../functions/api';
import { convertPhoneNumber, showErrorMessage } from '../../../functions/shared';
import IconEdit from '../../../components/Icon/IconEdit';
import { formatDate } from '@fullcalendar/core';
import { UserAuth } from '../../../context/AuthContext';


export default function StudentDetails({student, setStudent, toUpdate, setToUpdate, displayedSource}: any) {
    const { marketingSources }: any = UserAuth();
    const [allEdit, setAllEdit] = useState(false);
    const [savingData, setSavingData] = useState(false);

    const handleUpdateAllColumns = async () => {
        setSavingData(true);
        const data = {
            studentId: student?.Student_id,
            First_Name: student.First_Name,
            Last_Name: student.Last_Name,
            email: student.email,
            Phone: student.Phone,
            Phone2: student.Phone2,
            Contact1: student.Contact1,
            Contact2: student.Contact2,
            mailingaddr: student.mailingaddr,
            city: student.city,
            state: student.state,
            Zip: student.Zip,
            nextContactDate: student.NextContactDate,
            IntroDate: student.IntroDate,
            Birthdate: student.Birthdate,
            MarketingMethod: student.MarketingMethod,
            FirstClassDate: student.FirstClassDate,
            StudentPipelineStatus: student.StudentPipelineStatus,
        };
        try {
            const arrayForUpdate: any = Object.entries(data);
            console.log(arrayForUpdate);
            for (let i = 0; i < arrayForUpdate.length; i++) {
                if (arrayForUpdate[i][1] !== null) {
                    const data = {
                        studentId: student?.Student_id,
                        columnName: arrayForUpdate[i][0],
                        value: arrayForUpdate[i][1],
                    };
                    console.log(data);
                    try {
                        await updateStudentByColumn(data);
                    } catch (error) {
                        console.log(error);
                    }
                    // await updateStudentByColumn(data);
                }
            }

            setAllEdit(false);
            setToUpdate({
                First_Name: false,
                Last_Name: false,
                email: false,
                Phone: false,
                Phone2: false,
                Contact1: false,
                Contact2: false,
                mailingaddr: false,
                city: false,
                state: false,
                Zip: false,
                nextContactDate: false,
                IntroDate: false,
                Birthdate: false,
                MarketingMethod: false,
                FirstClassDate: false,
                StudentPipelineStatus: false,
            });
            setSavingData(false);
        } catch (error) {
            console.log(error);
            setSavingData(false);
            showErrorMessage('There was an error updating the student');
        }
    };

    const handleCancelAllEdit = () => {
        setAllEdit(false);
        setToUpdate({
            First_Name: false,
            Last_Name: false,
            email: false,
            Phone: false,
            Phone2: false,
            Contact1: false,
            Contact2: false,
            mailingaddr: false,
            city: false,
            state: false,
            Zip: false,
            nextContactDate: false,
            IntroDate: false,
            Birthdate: false,
            MarketingMethod: false,
            FirstClassDate: false,
            StudentPipelineStatus: false,
        });
    };

    const handleSetAllToEdit = () => {
        setAllEdit(true);
        setToUpdate({
            First_Name: true,
            Last_Name: true,
            email: true,
            Phone: true,
            Phone2: true,
            Contact1: true,
            Contact2: true,
            mailingaddr: true,
            city: true,
            state: true,
            Zip: true,
            nextContactDate: true,
            IntroDate: true,
            Birthdate: true,
            MarketingMethod: true,
            FirstClassDate: true,
            StudentPipelineStatus: true,
        });
    };

    const handleRemoveData = async (column: string) => {
        const data = {
            studentId: student?.Student_id,
            columnName: column,
            value: null,
        };
        try {
            await updateStudentByColumn(data);
        } catch (error) {
            console.log(error);
        }
    }; 

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
        <div className="active pt-5">
            {/* ADDITIONAL INFO */}
            <div className="mb-2 flex">
                {allEdit ? (
                    <div className="flex items-center gap-2 ml-auto">
                        <button className="text-danger" onClick={handleCancelAllEdit}>
                            Cancel
                        </button>
                        <button className="text-primary ml-auto" onClick={handleUpdateAllColumns}>
                            Save
                        </button>
                    </div>
                ) : (
                    <button className="text-primary ml-auto" onClick={handleSetAllToEdit}>
                        Update All
                    </button>
                )}
            </div>
            <div className="panel">
                {savingData ? (
                    <div className="flex items-center justify-center h-40">Saving Data...</div>
                ) : (
                    <div className="grid grid-cols-3 gap-6">
                        <p className="font-bold">First Name:</p>
                        {toUpdate?.First_Name ? (
                            <input type="text" className="form-input" value={student?.First_Name} onChange={(e) => setStudent({ ...student, First_Name: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.First_Name && 'text-danger'}`}>{student?.First_Name ? student?.First_Name : 'No First Name Set'}</p>
                        )}

                        {toUpdate?.First_Name ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, First_Name: false });
                                    handleUpdateByColumn('First_Name');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, First_Name: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                        <p className="font-bold">Last Name:</p>
                        {toUpdate?.Last_Name ? (
                            <input type="text" className="form-input" value={student?.Last_Name} onChange={(e) => setStudent({ ...student, Last_Name: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.Last_Name && 'text-danger'}`}>{student?.Last_Name ? student?.Last_Name : 'No Last Name Set'}</p>
                        )}
                        {toUpdate?.Last_Name ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, Last_Name: false });
                                    handleUpdateByColumn('Last_Name');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, Last_Name: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                        <p className="font-bold">Email:</p>
                        {toUpdate?.email ? (
                            <input type="text" className="form-input" value={student?.email} onChange={(e) => setStudent({ ...student, Email: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.email && 'text-danger'}`}>{student?.email ? student?.email : 'No Email Set'}</p>
                        )}
                        {toUpdate?.email ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, email: false });
                                    handleUpdateByColumn('email');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, email: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                        <p className="font-bold">Cell Number:</p>
                        {toUpdate?.Phone ? (
                            <input type="text" className="form-input" value={student?.Phone} onChange={(e) => setStudent({ ...student, Phone: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.email && 'text-danger'}`}>{student?.Phone ? convertPhoneNumber(student?.Phone) : 'No Phone Set'}</p>
                        )}
                        {toUpdate?.Phone ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, Phone: false });
                                    handleUpdateByColumn('Phone');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, Phone: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                        <p className="font-bold">Home Phone:</p>
                        {toUpdate?.Phone2 ? (
                            <input type="text" className="form-input" value={student?.Phone2} onChange={(e) => setStudent({ ...student, Phone2: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.Phone2 && 'text-danger'}`}>{student?.Phone2 ? convertPhoneNumber(student?.Phone2) : 'No Home Phone Set'}</p>
                        )}
                        {toUpdate?.Phone2 ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, Phone2: false });
                                    handleUpdateByColumn('Phone2');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, Phone2: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                        <p className="font-bold">Contact:</p>
                        {toUpdate?.Contact1 ? (
                            <input type="text" className="form-input" value={student?.Contact1} onChange={(e) => setStudent({ ...student, Contact1: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.Contact1 && 'text-danger'}`}>{student?.Contact1 ? student?.Contact1 : 'No Parent Name Set'}</p>
                        )}

                        {toUpdate?.Contact1 ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, Contact1: false });
                                    handleUpdateByColumn('Contact1');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, Contact1: true })}>
                                <IconEdit className="w-4 h-4" />{' '}
                            </button>
                        )}

                        <p className="font-bold">Contact:</p>
                        {toUpdate?.Contact2 ? (
                            <input type="text" className="form-input" value={student?.Contact2} onChange={(e) => setStudent({ ...student, Contact2: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.Contact2 && 'text-danger'}`}>{student?.Contact2 ? student?.Contact2 : 'No Parent Name Set'}</p>
                        )}

                        {toUpdate?.Contact2 ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, Contact2: false });
                                    handleUpdateByColumn('Contact2');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, Contact2: true })}>
                                <IconEdit className="w-4 h-4" />{' '}
                            </button>
                        )}

                        <p className="font-bold">Address:</p>
                        {toUpdate?.mailingaddr ? (
                            <input type="text" className="form-input" value={student?.mailingaddr} onChange={(e) => setStudent({ ...student, mailingaddr: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.mailingaddr && 'text-danger'}`}>{student?.mailingaddr ? student?.mailingaddr : 'No Address Set'}</p>
                        )}
                        {toUpdate?.mailingaddr ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, mailingaddr: false });
                                    handleUpdateByColumn('mailingaddr');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, mailingaddr: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                        <p className="font-bold">City:</p>
                        {toUpdate?.city ? (
                            <input type="text" className="form-input" value={student?.city} onChange={(e) => setStudent({ ...student, city: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.city && 'text-danger'}`}>{student?.city ? student?.city : 'No City Set'}</p>
                        )}
                        {toUpdate?.city ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, city: false });
                                    handleUpdateByColumn('city');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, city: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                        <p className="font-bold">State:</p>
                        {toUpdate?.state ? (
                            <input type="text" className="form-input" value={student?.state} onChange={(e) => setStudent({ ...student, state: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.state && 'text-danger'}`}>{student?.state ? student?.state : 'No State Set'}</p>
                        )}
                        {toUpdate?.state ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, state: false });
                                    handleUpdateByColumn('state');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, state: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                        <p className="font-bold ">Zip:</p>
                        {toUpdate?.Zip ? (
                            <input type="text" className="form-input" value={student?.Zip} onChange={(e) => setStudent({ ...student, Zip: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.Zip && 'text-danger'}`}>{student?.Zip ? student?.Zip : 'No Zip Set'}</p>
                        )}
                        {toUpdate?.Zip ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, Zip: false });
                                    handleUpdateByColumn('Zip');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, Zip: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                        <p className="font-bold ">Next Contact Date:</p>
                        {toUpdate?.nextContactDate ? (
                            <input type="date" className="form-input" value={student?.NextContactDate} onChange={(e) => setStudent({ ...student, NextContactDate: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.NextContactDate && 'text-danger'}`}>{student?.NextContactDate ? formatDate(student?.NextContactDate) : 'No Contact Date Set'}</p>
                        )}
                        {toUpdate?.nextContactDate ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, nextContactDate: false });
                                    handleUpdateByColumn('NextContactDate');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    className="ml-auto text-danger hover:text-red-800"
                                    onClick={() => {
                                        setStudent({ ...student, NextContactDate: null });
                                        handleRemoveData('NextContactDate');
                                    }}
                                >
                                    Remove Date
                                </button>
                                <button
                                    className="ml-auto text-info hover:text-blue-900"
                                    onClick={() => {
                                        setToUpdate({ ...toUpdate, nextContactDate: true });
                                        setStudent({ ...student, NextContactDate: null });
                                    }}
                                >
                                    <IconEdit className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <p className="font-bold ">Intro Date:</p>
                        {toUpdate?.IntroDate ? (
                            <input type="date" className="form-input" value={student?.IntroDate} onChange={(e) => setStudent({ ...student, IntroDate: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.IntroDate && 'text-danger'}`}>{student?.IntroDate ? formatDate(student?.IntroDate) : 'No Intro Date Set'}</p>
                        )}
                        {toUpdate?.IntroDate ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, IntroDate: false });
                                    handleUpdateByColumn('IntroDate');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    className="ml-auto text-danger hover:text-red-800"
                                    onClick={() => {
                                        setStudent({ ...student, IntroDate: null });
                                        handleRemoveData('IntroDate');
                                    }}
                                >
                                    Remove Date
                                </button>
                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, IntroDate: true })}>
                                    <IconEdit className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <p className="font-bold ">Birthday:</p>
                        {toUpdate?.Birthdate ? (
                            <input type="date" className="form-input" value={student?.Birthdate} onChange={(e) => setStudent({ ...student, Birthdate: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.Birthdate && 'text-danger'}`}>{student?.Birthdate ? formatDate(student?.Birthdate) : 'No Birthdate Set'}</p>
                        )}
                        {toUpdate?.Birthdate ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, Birthdate: false });
                                    handleUpdateByColumn('Birthdate');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, Birthdate: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                        <p className="font-bold ">Age:</p>
                        <p>{new Date().getFullYear() - new Date(student?.Birthdate).getFullYear()} </p>
                        <p
                            className="transparent
                                            "
                        ></p>

                        <p className="font-bold ">Marketing Source:</p>
                        {toUpdate?.MarketingMethod ? (
                            <select className="form-select" value={student?.MarketingMethod} onChange={(e) => setStudent({ ...student, MarketingMethod: e.target.value })}>
                                {marketingSources?.map((source: any, index: any) => (
                                    <option key={index} value={source?.MethodId}>
                                        {source?.Name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className={`font-normal ${!student?.MarketingMethod && 'text-danger'}`}>{displayedSource ?? 'No Marketing Source Set'}</p>
                        )}
                        {toUpdate?.MarketingMethod ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, MarketingMethod: false });
                                    handleUpdateByColumn('MarketingMethod');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, MarketingMethod: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                        <p className="font-bold ">First Class Date:</p>
                        {toUpdate?.FirstClassDate ? (
                            <input type="date" className="form-input" value={student?.FirstClassDate} onChange={(e) => setStudent({ ...student, FirstClassDate: e.target.value })} />
                        ) : (
                            <p className={`font-normal ${!student?.FirstClassDate && 'text-danger'}`}>{student?.FirstClassDate ? formatDate(student?.FirstClassDate) : 'No First Class Date Set'}</p>
                        )}
                        {toUpdate?.FirstClassDate ? (
                            <button
                                className="ml-auto text-info hover:text-blue-900"
                                onClick={() => {
                                    setToUpdate({ ...toUpdate, FirstClassDate: false });
                                    handleUpdateByColumn('FirstClassDate');
                                }}
                            >
                                {!allEdit && 'Save'}
                            </button>
                        ) : (
                            <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, FirstClassDate: true })}>
                                <IconEdit className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
