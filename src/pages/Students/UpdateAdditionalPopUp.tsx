import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconX from '../../components/Icon/IconX';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import { updateStudent } from '../../functions/api';

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
    const [showUpdateModal, setUpdateModal] = useState(false);
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
    }, [student]);

    const handleUpdateStudent = () => {
        console.log('Updating Student');
        updateStudent(studentToUpdate);
        setUpdateModal(false);
    };

    console.log(student)

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
                                            <div className="grid grid-cols-6 gap-4">
                                                <div className="col-span-3">
                                                    <label htmlFor="first-name">First name</label>
                                                    <div>
                                                        <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="form-input" value={studentToUpdate.fName} 
                                                        onChange={(e) => setStudentToUpdate({...studentToUpdate, fName: e.target.value})}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-3">
                                                    <label htmlFor="last-name">Last name</label>
                                                    <div>
                                                        <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="form-input" value={studentToUpdate.lName} 
                                                        onChange={(e) => setStudentToUpdate({...studentToUpdate, lName: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-3">
                                                    <label htmlFor="first-name">Contact 1</label>
                                                    <div>
                                                        <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="form-input" value={studentToUpdate.contact1} 
                                                        onChange={(e) => setStudentToUpdate({...studentToUpdate, contact1: e.target.value})}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-3">
                                                    <label htmlFor="contact2">Contact 2</label>
                                                    <div>
                                                        <input type="text" name="contact2" id="contact2" autoComplete="off" className="form-input" value={studentToUpdate.contact2} 
                                                        onChange={(e) => setStudentToUpdate({...studentToUpdate, contact2: e.target.value})}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-5">
                                                    <label htmlFor="street-address">Street address</label>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="street-address"
                                                            id="street-address"
                                                            autoComplete="street-address"
                                                            className="form-input"
                                                            value={studentToUpdate.address}
                                                            onChange={(e) => setStudentToUpdate({...studentToUpdate, address: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-1">
                                                    <label htmlFor="street-address">Ste / Apt</label>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="street-address"
                                                            id="street-address"
                                                            autoComplete="street-address"
                                                            className="form-input"
                                                            value={studentToUpdate.address2}
                                                            onChange={(e) => setStudentToUpdate({...studentToUpdate, address2: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-2 col-start-1">
                                                    <label htmlFor="city">City</label>
                                                    <div>
                                                        <input type="text" name="city" id="city" autoComplete="address-level2" className="form-input" value={studentToUpdate.city} 
                                                        onChange={(e) => setStudentToUpdate({...studentToUpdate, city: e.target.value})}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-2">
                                                    <label htmlFor="region">State / Province</label>
                                                    <div>
                                                        <input type="text" name="region" id="region" autoComplete="address-level1" className="form-input" value={studentToUpdate.state} 
                                                        onChange={(e) => setStudentToUpdate({...studentToUpdate, state: e.target.value})}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-2">
                                                    <label htmlFor="postal-code">ZIP / Postal code</label>
                                                    <div>
                                                        <input type="text" name="postal-code" id="postal-code" autoComplete="postal-code" className="form-input" value={studentToUpdate.zip} 
                                                        onChange={(e) => setStudentToUpdate({...studentToUpdate, zip: e.target.value})}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-3">
                                                    <label htmlFor="phone">Cell Phone</label>
                                                    <div>
                                                        <input id="phone" name="phone" type="tel" autoComplete="phone" className="form-input" value={studentToUpdate.phone} 
                                                        onChange={(e) => setStudentToUpdate({...studentToUpdate, phone: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-3">
                                                    <label htmlFor="phone2">Home Phone</label>
                                                    <div>
                                                        <input id="phone2" name="phone" type="tel" autoComplete="phone2" className="form-input" value={studentToUpdate.phone2} 
                                                        onChange={(e) => setStudentToUpdate({...studentToUpdate, phone2: e.target.value})}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-4">
                                                    <label htmlFor="email">Email address</label>
                                                    <div>
                                                        <input id="email" name="email" type="email" autoComplete="email" className="form-input" value={studentToUpdate.email} 
                                                        onChange={(e) => setStudentToUpdate({...studentToUpdate, email: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-full flex">
                                                    <div className="ml-auto flex items-center gap-4">
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => setUpdateModal(false)}>
                                                            Cancel
                                                        </button>
                                                        <button type="submit" className="btn btn-primary"
                                                        onClick={handleUpdateStudent}
                                                        >
                                                            Update Student
                                                        </button>
                                                    </div>
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
