import React, { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import IconPlus from '../../components/Icon/IconPlus';
import IconCode from '../../components/Icon/IconCode';
import IconCashBanknotes from '../../components/Icon/IconCashBanknotes';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconEye from '../../components/Icon/IconEye';
import PrintableRoll from './PrintableRoll';
import { getAttendanceByClassIdDate, getTheClassScheduleByClassId, updateAttendance } from '../../functions/api';
import { formatDate } from '../../functions/shared';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';
import Tippy from '@tippyjs/react';
import IconEdit from '../../components/Icon/IconEdit';

export default function Attendance() {
    const { classes }: any = UserAuth();
    const [months, setMonths] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [classID, setClassID] = useState('');
    const [attendance, setAttendance] = useState([]);
    const [scheduleDates, setScheduleDates] = useState([]);
    const [studentNamesAndDates, setStudentNamesAndDates] = useState([]);
    const [newChecks, setNewChecks] = useState([]);
    const [newUnchecks, setNewUnchecks] = useState([]);

    const getLastSixMonths = () => {
        const months = [];
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const value = date.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
            const displayValue = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            months.push({ value, displayValue });
        }
        return months;
    };

    useEffect(() => {
        const lastSix: any = getLastSixMonths();
        setMonths(lastSix);
    }, []);

    const handleGetAttendance = async () => {
        if (!classID || !searchValue) return alert('Please select a class and a month');
        try {
            const scheduleResponse = await getTheClassScheduleByClassId(classID);
            const daysOftheWeek = scheduleResponse.recordset.map((item: any) => (item.DayIndex === 7 ? 0 : item.DayIndex + 1));

            //for each day of the week, get the dates in that month that match the day of the week

            const dates = daysOftheWeek.map((day: any) => {
                const dates = [];
                const date = new Date(searchValue);
                const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                for (let i = 1; i <= lastDay; i++) {
                    const d = new Date(date.getFullYear(), date.getMonth(), i);
                    if (d.getDay() === day) {
                        dates.push(d.toISOString().split('T')[0]);
                    }
                }
                return dates;
            });
            setScheduleDates(dates.flat());
            const response = await getAttendanceByClassIdDate(classID, searchValue, 1);
            setAttendance(response.recordset);
        } catch (error) {
            console.log(error);
        }
    };

    const sortAttendanceAndCombineLikeStudentsByIdIntoOneObject = (data: any) => {
        const students: any = [];
        data.forEach((item: any) => {
            const index = students.findIndex((student: any) => student.StudentId === item.StudentId);
            if (index === -1) {
                students.push({
                    StudentId: item.StudentId,
                    Name: item.Name,
                    Dates: [formatDate(item.ClassDate)],
                });
            } else {
                students[index].Dates.push(formatDate(item.ClassDate));
            }
        });
        return students;
    };

    useEffect(() => {
        const students: any = sortAttendanceAndCombineLikeStudentsByIdIntoOneObject(attendance);
        setStudentNamesAndDates(students);
    }, [attendance]);


    const handleNewCheck = (studentId: any, date: any) => {
        const index: any = newChecks.findIndex((item: any) => item.StudentId === studentId);
        if (index === -1) {
            const newCheck: any = [...newChecks, { StudentId: studentId, Dates: [date] }];
            setNewChecks(newCheck);
        } else {
            if (newChecks[index].Dates.includes(date)) {
                const newCheck = [...newChecks];
                newCheck[index].Dates = newCheck[index].Dates.filter((item: any) => item !== date);
                setNewChecks(newCheck);
            } else {
                const newCheck = [...newChecks];
                newCheck[index].Dates.push(date);
                setNewChecks(newCheck);
            }
        }
    };

    const handleUncheck = (studentId: any, date: any) => {
        const index: any = newUnchecks.findIndex((item: any) => item.StudentId === studentId);
        if (index === -1) {
            const newUncheck: any = [...newUnchecks, { StudentId: studentId, Dates: [date] }];
            setNewUnchecks(newUncheck);
        } else {
            if (newUnchecks[index].Dates.includes(date)) {
                const newUncheck = [...newUnchecks];
                newUncheck[index].Dates = newUncheck[index].Dates.filter((item: any) => item !== date);
                setNewUnchecks(newUncheck);
            } else {
                const newUncheck = [...newUnchecks];
                newUncheck[index].Dates.push(date);
                setNewUnchecks(newUncheck);
            }
        }
    };

    const handleUpdateAttendance = async () => {
        console.log(newChecks, newUnchecks);
        // try {
        //     const response = await updateAttendance(newChecks);
        //     console.log(response);
        // } catch (error) {
        //     console.log(error);
        // }
    };

    return (
        <>
            <div className="panel px-0 pb-0 border-white-light dark:border-[#1b2e4b]">
                <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                    <div>
                        <h2 className="text-xl">Attendance</h2>
                    </div>
                    <div className="gap-2 ltr:ml-auto rtl:mr-auto flex items-center gap-x-4">
                        <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                            <button type="button" className="btn btn-primary gap-2 ltr:ml-auto rtl:mr-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upc-scan" viewBox="0 0 16 16">
                                    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z" />
                                </svg>
                                Barcode Attendance
                            </button>
                        </div>
                        <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                            <PrintableRoll classes={classes} />
                        </div>
                        <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                            <button type="button" className="btn btn-warning gap-2 ltr:ml-auto rtl:mr-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                </svg>
                                Stealth Attendance
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="p-5 flex items-end gap-x-4 lg:w-1/2">
                        <div className="w-full">
                            <label className="text-sm">Select Class</label>
                            <select
                                className="form-select"
                                onChange={(e) => {
                                    setClassID(e.target.value);
                                }}
                            >
                                <option>Choose a Class</option>
                                {classes.map((item: any) => (
                                    <option key={item.ClassId} value={item.ClassId}>
                                        {item.Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="text-sm">Select Month</label>

                            <select
                                className="form-select"
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                }}
                            >
                                <option>Choose a Month</option>
                                {months?.map((item: any) => (
                                    <option key={item.value} value={item.value}>
                                        {item.displayValue}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={handleGetAttendance}>
                            View
                        </button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                {scheduleDates.map((date: any) => (
                                    <th key={date}>{date}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {studentNamesAndDates?.map((data: any) => {
                                return (
                                    <tr key={data.StudentId}>
                                        {' '}
                                        {/* Added key to the <tr> */}
                                        <td>
                                            <div className="whitespace-nowrap">{data.Name}</div>
                                        </td>
                                        {scheduleDates.map((date: any) => (
                                            <td key={date}>
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    checked={
                                                        (data.Dates.includes(date) && !newUnchecks.find((item: any) => item.StudentId === data.StudentId && item.Dates.includes(date))) ||
                                                        newChecks.find((item: any) => item.StudentId === data.StudentId && item.Dates.includes(date))
                                                    }
                                                    onChange={() => (data.Dates.includes(date) ? handleUncheck(data.StudentId, date) : handleNewCheck(data.StudentId, date))}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex p-5">
                <button className="btn btn-success ml-auto" onClick={handleUpdateAttendance}>
                    Update
                </button>
            </div>
        </>
    );
}
