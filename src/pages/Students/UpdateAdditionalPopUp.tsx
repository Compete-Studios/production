import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconX from '../../components/Icon/IconX';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import { getRankIDStudentId, getRanksByStudioId, updateStudent, updateStudentRank } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';

interface StudentInfo {
    studentId: string;
    fName: string;
    lName: string;
    contact1: string;
    contact2: string;
    phone: string;
    phone2: string;
    email: string;
    email2: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    birthdate: string;
    marketingMethod: string;
    notes: string;
    adminNotes: string;
    nextContactDate: string;
    currentPipelineStatus: string;
    firstClassDate: string;
    originalContactDate: string;
    cancellationDate: string;
    introDate: string;
}

export default function UpdateAdditionalPopUp({ student }: any) {
    const { marketingSources, suid } = UserAuth();
    const [showUpdateModal, setUpdateModal] = useState(false);
    const [originalRank, setOriginalRank] = useState<any>('');
    const [allRanks, setAllRanks] = useState<any>([]);
    const [rank, setRank] = useState<any>('');
    const [studentToUpdate, setStudentToUpdate] = useState<StudentInfo>({
        studentId: student.studentId,
        fName: student.First_Name,
        lName: student.Last_Name,
        contact1: student.Contact1,
        contact2: student.Contact2,
        phone: student.Phone,
        phone2: student.Phone2,
        email: student.email,
        email2: student.Email2,
        address: student.mailingaddr,
        address2: student.mailingaddr2,
        city: student.city,
        state: student.state,
        zip: student.Zip,
        birthdate: student.Birthdate,
        marketingMethod: student.MarketingMethod,
        notes: student.notes,
        adminNotes: student.AdminNotes,
        nextContactDate: student.NextContactDate,
        currentPipelineStatus: student.StudentPipelineStatus,
        cancellationDate: student.CancellationDate,
        firstClassDate: student.FirstClassDate,
        originalContactDate: student.OriginalContactDate,
        introDate: student.IntroDate,
    });

    useEffect(() => {
        setStudentToUpdate({
            studentId: student.Student_id,
            fName: student.First_Name,
            lName: student.Last_Name,
            contact1: student.Contact1,
            contact2: student.Contact2,
            phone: student.Phone,
            phone2: student.Phone2,
            email: student.email,
            email2: student.Email2,
            address: student.mailingaddr,
            address2: student.mailingaddr2,
            city: student.city,
            state: student.state,
            zip: student.Zip,
            birthdate: student.Birthdate,
            marketingMethod: student.MarketingMethod,
            notes: student.notes,
            adminNotes: student.AdminNotes,
            nextContactDate: student.NextContactDate,
            currentPipelineStatus: student.StudentPipelineStatus,
            cancellationDate: student.CancellationDate,
            firstClassDate: student.FirstClassDate,
            originalContactDate: student.OriginalContactDate,
            introDate: student.IntroDate,
        });
        handleGetStudentRank(student.Student_id);
        handleGetAllRanks();
    }, [student]);

    const handleGetStudentRank = async (studentId: any) => {
        console.log('Getting Student Rank');
        const studentsRank = await getRankIDStudentId(studentId);
        if (studentsRank.length === 0) {
            setRank('');
            console.log('No Rank Found');
        } else {
            setRank(studentsRank[0]);
            setOriginalRank(studentsRank[0]);
        }
    };

    const handleGetAllRanks = () => {
        getRanksByStudioId(suid).then((res) => {
            setAllRanks(res);
        });
    };

    const handleUpdateStudent = async (e: any) => {
        e.preventDefault();
        const rankData = {
            studentId: student.Student_id,
            rankId: rank,
        };
        console.log(studentToUpdate);
        updateStudent(studentToUpdate);
        if (rank !== originalRank) {
            await updateStudentRank(rankData);
        }
        setUpdateModal(false);
    };

    return (
        <div>
            <div>
                <button type="button" className="ltr:ml-auto rtl:mr-auto text-info hover:text-blue-700 p-2 rounded-full" onClick={() => setUpdateModal(true)}>
                    <IconPencilPaper />
                </button>
            </div>
            <Transition appear show={showUpdateModal} as={Fragment}>
                <Dialog as="div" open={showUpdateModal} onClose={() => setUpdateModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-3xl text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setUpdateModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        Update{' '}
                                        <span className="font-bold text-primary">
                                            {student?.First_Name} {student?.Last_Name}
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="birthdate">Birthdate</label>
                                                    <Flatpickr
                                                        value={studentToUpdate.birthdate}
                                                        className="form-input"
                                                        options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                        onChange={(date: any) => setStudentToUpdate({ ...studentToUpdate, birthdate: date })}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="marketingMethod">Marketing Source</label>
                                                    <select
                                                        id="marketingMethod"
                                                        value={studentToUpdate.marketingMethod}
                                                        className="form-select text-white-dark"
                                                        onChange={(e) => setStudentToUpdate({ ...studentToUpdate, marketingMethod: e.target.value })}
                                                    >
                                                        {marketingSources?.map((source: any) => (
                                                            <option key={source.MethodId} value={source.MethodId}>
                                                                {source.Name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="entryDate">Entry Date</label>
                                                    <Flatpickr
                                                        value={studentToUpdate.originalContactDate}
                                                        className="form-input"
                                                        options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                        onChange={(date: any) => setStudentToUpdate({ ...studentToUpdate, originalContactDate: date })}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="introDate">Intro Date</label>
                                                    <Flatpickr
                                                        value={studentToUpdate.introDate}
                                                        className="form-input"
                                                        options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                        onChange={(date: any) => setStudentToUpdate({ ...studentToUpdate, introDate: date })}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="firstClassDate">First Class Date</label>
                                                    <Flatpickr
                                                        value={studentToUpdate.firstClassDate}
                                                        className="form-input"
                                                        options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                        onChange={(date: any) => setStudentToUpdate({ ...studentToUpdate, firstClassDate: date })}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="entryDate">Next Contact Date</label>
                                                    <Flatpickr
                                                        value={studentToUpdate.nextContactDate}
                                                        className="form-input"
                                                        options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                        onChange={(date: any) => setStudentToUpdate({ ...studentToUpdate, nextContactDate: date })}
                                                    />
                                                </div>

                                                <div className="sm:col-span-full">
                                                    <label htmlFor="notes">Notes</label>
                                                    <textarea
                                                        id="notes"
                                                        rows={4}
                                                        value={studentToUpdate.notes}
                                                        placeholder="Notes"
                                                        className="form-textarea"
                                                        onChange={(e) => setStudentToUpdate({ ...studentToUpdate, notes: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="rank">Rank</label>
                                                    <select value={rank} className="form-select" onChange={(e) => setRank(e.target.value)}>
                                                        {allRanks.map((rank: any) => (
                                                            <option key={rank.RankId} value={rank.RankId}>
                                                                {rank.Name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-span-full flex">
                                                <div className="ml-auto flex items-center gap-4">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setUpdateModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="btn btn-primary" onClick={handleUpdateStudent}>
                                                        Update Student
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
