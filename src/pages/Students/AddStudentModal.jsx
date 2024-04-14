import React, { Fragment, useState } from 'react';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Tab } from '@headlessui/react';
import { UserAuth } from '../../context/AuthContext';
import AnimateHeight from 'react-animate-height';
import IconPlus from '../../components/Icon/IconPlus';
import IconMinus from '../../components/Icon/IconMinus';

const studentDataInit = {
    fName: '',
    lName: '',
    contact1: '',
    contact2: '',
    phone: '',
    phone2: '',
    email: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    birthdate: '2022-07-05',
    marketingMethod: '',
    notes: '',
    nextContactDate: new Date().toISOString().split('T')[0],
    currentPipelineStatus: '',
    firstClassDate: new Date().toISOString().split('T')[0],
    originalContactDate: new Date().toISOString().split('T')[0],
    introDate: new Date().toISOString().split('T')[0],
};

export default function AddStudentModal() {
    const { pipelineSteps, classes, programs, waitingLists } = UserAuth();
    const [studentData, setStudentData] = useState(studentDataInit);
    const [addContactModal, setAddContactModal] = useState(false);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [selectedWaitingLists, setSelectedWaitingLists] = useState([]);
    const [active, setActive] = useState(null);
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const handleSelectClass = (e, item) => {
        e.preventDefault();
        if (selectedClasses.includes(item)) {
            setSelectedClasses(selectedClasses.filter((i) => i !== item));
        } else {
            setSelectedClasses([...selectedClasses, item]);
        }
    };

    const handleDeselctClass = (e, item) => {
        e.preventDefault();
        setSelectedClasses(selectedClasses.filter((i) => i !== item));
    };

    const handleSelectProgram = (e, item) => {
        e.preventDefault();
        if (selectedPrograms.includes(item)) {
            setSelectedPrograms(selectedPrograms.filter((i) => i !== item));
        } else {
            setSelectedPrograms([...selectedPrograms, item]);
        }
    };

    const handleDeselctProgram = (e, item) => {
        e.preventDefault();
        setSelectedPrograms(selectedPrograms.filter((i) => i !== item));
    };

    const handleSelectedWaitingLists = (e, item) => {
        e.preventDefault();
        if (selectedWaitingLists.includes(item)) {
            setSelectedWaitingLists(selectedWaitingLists.filter((i) => i !== item));
        } else {
            setSelectedWaitingLists([...selectedWaitingLists, item]);
        }
    };
    const handleDeselectWaitingLists = (e, item) => {
        setSelectedWaitingLists(selectedWaitingLists.filter((i) => i !== item));
    };

    const addUser = () => {
        setAddContactModal(true);
    };

    const saveUser = () => {
        console.log(studentData);
        setAddContactModal(false);
    };

    const changeValue = (e) => {
        setStudentData({ ...studentData, [e.target.id]: e.target.value });
    };

    return (
        <div>
            <div>
                <button type="button" className="btn btn-primary" onClick={() => addUser()}>
                    <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                    Add Student
                </button>
            </div>
            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
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
                                        onClick={() => setAddContactModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {studentData.id ? 'Edit Contact' : 'Add Student'}
                                    </div>
                                    <div className="p-5">
                                        <Tab.Group>
                                            <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a] ">
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                                                        >
                                                            Student Info
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                                                        >
                                                            Student Record
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                                                        >
                                                            Additional Information
                                                        </button>
                                                    )}
                                                </Tab>
                                            </Tab.List>

                                            <Tab.Panels>
                                                <Tab.Panel>
                                                    <div className="pt-8">
                                                        <form>
                                                            <div className="mb-5 flex items-center gap-x-2">
                                                                <div className="w-full">
                                                                    <label htmlFor="fName">First Name</label>
                                                                    <input
                                                                        id="fName"
                                                                        type="text"
                                                                        placeholder="Enter Name"
                                                                        className="form-input"
                                                                        value={studentData.fName}
                                                                        onChange={(e) => changeValue(e)}
                                                                    />
                                                                </div>
                                                                <div className="w-full">
                                                                    <label htmlFor="lName">Last Name</label>
                                                                    <input
                                                                        id="lName"
                                                                        type="text"
                                                                        placeholder="Enter Last Name"
                                                                        className="form-input"
                                                                        value={studentData.lName}
                                                                        onChange={(e) => changeValue(e)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="mb-5">
                                                                <label htmlFor="email">Email</label>
                                                                <input
                                                                    id="email"
                                                                    type="email"
                                                                    placeholder="Enter Email"
                                                                    className="form-input"
                                                                    value={studentData.email}
                                                                    onChange={(e) => changeValue(e)}
                                                                />
                                                            </div>
                                                            <div className="mb-5 flex items-center gap-x-2">
                                                                <div className="w-full">
                                                                    <label htmlFor="contact1">First Contact</label>
                                                                    <input
                                                                        id="contact1"
                                                                        type="text"
                                                                        placeholder="Enter First Contact"
                                                                        className="form-input"
                                                                        value={studentData.contact1}
                                                                        onChange={(e) => changeValue(e)}
                                                                    />
                                                                </div>
                                                                <div className="w-full">
                                                                    <label htmlFor="contact2">Second Contact</label>
                                                                    <input
                                                                        id="contact2"
                                                                        type="text"
                                                                        placeholder="Enter Second Contact"
                                                                        className="form-input"
                                                                        value={studentData.contact2}
                                                                        onChange={(e) => changeValue(e)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="mb-5 flex items-center gap-x-2">
                                                                <div className="w-full">
                                                                    <label htmlFor="number">Home Phone</label>
                                                                    <input
                                                                        id="Phone"
                                                                        type="text"
                                                                        placeholder="Enter Phone Number"
                                                                        className="form-input"
                                                                        value={studentData.phone}
                                                                        onChange={(e) => changeValue(e)}
                                                                    />
                                                                </div>
                                                                <div className="w-full">
                                                                    <label htmlFor="number">Mobile Phone</label>
                                                                    <input
                                                                        id="Phone"
                                                                        type="text"
                                                                        placeholder="Enter Phone Number"
                                                                        className="form-input"
                                                                        value={studentData.phone2}
                                                                        onChange={(e) => changeValue(e)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="mb-5">
                                                                <label htmlFor="address">Address</label>
                                                                <input
                                                                    id="address"
                                                                    type="text"
                                                                    placeholder="Enter Address"
                                                                    className="form-input"
                                                                    value={studentData.address}
                                                                    onChange={(e) => changeValue(e)}
                                                                />
                                                            </div>
                                                            <div className="mb-5 grid grid-cols-8 gap-x-2">
                                                                <div className="col-span-3">
                                                                    <label htmlFor="city">City</label>
                                                                    <input
                                                                        id="city"
                                                                        type="text"
                                                                        placeholder="Enter City"
                                                                        className="form-input"
                                                                        value={studentData.city}
                                                                        onChange={(e) => changeValue(e)}
                                                                    />
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <label htmlFor="state">State</label>
                                                                    <input
                                                                        id="state"
                                                                        type="text"
                                                                        placeholder="Enter State"
                                                                        className="form-input"
                                                                        value={studentData.state}
                                                                        onChange={(e) => changeValue(e)}
                                                                    />
                                                                </div>
                                                                <div className="col-span-3">
                                                                    <label htmlFor="zip">Zip</label>
                                                                    <input
                                                                        id="zip"
                                                                        type="text"
                                                                        placeholder="Enter Zip"
                                                                        className="form-input"
                                                                        value={studentData.zip}
                                                                        onChange={(e) => changeValue(e)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div className="pt-8">
                                                        <form>
                                                            <div className="mb-5 flex items-center gap-x-2">
                                                                <div className="w-full">
                                                                    <label htmlFor="birthdate">Birthdate</label>

                                                                    <Flatpickr
                                                                        value={studentData.birthdate}
                                                                        className="form-input"
                                                                        options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                                        onChange={(date) => setStudentData({ ...studentData, birthdate: date })}
                                                                    />
                                                                </div>
                                                                <div className="w-full">
                                                                    <label htmlFor="address">Marketing Source</label>
                                                                    <select id="marketingMethod" className="form-select" value={studentData.marketingMethod} onChange={(e) => changeValue(e)}>
                                                                        <option value="">Select Marketing Source</option>
                                                                        <option value="1">Google</option>
                                                                        <option value="2">Facebook</option>
                                                                        <option value="3">Instagram</option>
                                                                        <option value="4">Twitter</option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <div className="mb-5 flex items-center gap-x-2">
                                                                <div className="w-full">
                                                                    <label htmlFor="originalContactDate">Entry Date</label>
                                                                    <Flatpickr
                                                                        value={studentData.originalContactDate}
                                                                        className="form-input"
                                                                        options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                                        onChange={(date) => setStudentData({ ...studentData, originalContactDate: date })}
                                                                    />
                                                                </div>
                                                                <div className="w-full">
                                                                    <label htmlFor="introdate">Intro Date</label>
                                                                    <Flatpickr
                                                                        value={studentData.introDate}
                                                                        className="form-input"
                                                                        options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                                        onChange={(date) => setStudentData({ ...studentData, introDate: date })}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="mb-5 flex items-center gap-x-2">
                                                                <div className="w-full">
                                                                    <label htmlFor="firstClassDate">First Class Date</label>
                                                                    <Flatpickr
                                                                        value={studentData.firstClassDate}
                                                                        className="form-input"
                                                                        options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                                        onChange={(date) => setStudentData({ ...studentData, firstClassDate: date })}
                                                                    />
                                                                </div>
                                                                <div className="w-full">
                                                                    <label htmlFor="nextContactDate">Next Contact Date</label>
                                                                    <Flatpickr
                                                                        value={studentData.nextContactDate}
                                                                        className="form-input"
                                                                        options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                                        onChange={(date) => setStudentData({ ...studentData, nextContactDate: date })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="mb-5 grid grid-cols-2">
                                                                {pipelineSteps?.map((step) => (
                                                                    <div>
                                                                        <label key={step.PipelineStepId} className="flex items-center cursor-pointer">
                                                                            <input type="radio" name="custom_radio" value={step.PipelineStepId} className="form-radio" />
                                                                            <span className="text-white-dark">{step.StepName}</span>
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {/* <div className="flex justify-end items-center mt-8">
                                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                                    Cancel
                                                                </button>
                                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" 
                                                                >
                                                                    Next
                                                                </button>
                                                            </div> */}
                                                        </form>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div className="pt-8">
                                                        <div className="mb-5">
                                                            <div className="space-y-2 font-semibold">
                                                                <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                                                                    <button type="button" className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] `} onClick={() => togglePara('1')}>
                                                                        Add Student to Classes
                                                                        {active === '1' ? <IconMinus className='ml-auto' /> : <IconPlus className="ml-auto" />}
                                                                    </button>
                                                                    <div>
                                                                        <AnimateHeight duration={300} height={active === '1' ? 'auto' : 0}>
                                                                            <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                                                <div className="col-span-full  border p-4 bg-primary/20 rounded-md border-com">
                                                                                    <div className="p-4 w-full h-72 overflow-y-auto  grow rounded-md border border-com mt-1 bg-white">
                                                                                        {classes &&
                                                                                            classes?.map((item) => (
                                                                                                <>
                                                                                                    {!selectedClasses?.includes(item) && (
                                                                                                        <>
                                                                                                            <div
                                                                                                                key={item.ClassId}
                                                                                                                className="text-xs cursor-pointer border-b w-full p-2"
                                                                                                                onClick={(e) => handleSelectClass(e, item)}
                                                                                                            >
                                                                                                                <span className="text-zinc-500 hover:text-zinc-900">{item.Name}</span>
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                </>
                                                                                            ))}
                                                                                    </div>
                                                                                    <div className="text-center grow-0 flex items-center justify-center w-full">
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            width="16"
                                                                                            height="16"
                                                                                            fill="currentColor"
                                                                                            class="bi bi-arrow-left-right"
                                                                                            viewBox="0 0 16 16"
                                                                                        >
                                                                                            <path
                                                                                                fill-rule="evenodd"
                                                                                                d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
                                                                                            />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div className="p-4 w-full h-72 overflow-y-auto grow rounded-md border border-com mt-1 bg-white">
                                                                                        {selectedClasses &&
                                                                                            selectedClasses?.map((item) => (
                                                                                                <>
                                                                                                    <div
                                                                                                        key={item.ClassId}
                                                                                                        className="text-xs cursor-pointer text-com hover:text-comhover font-bold border-b w-full p-2"
                                                                                                        onClick={(e) => {
                                                                                                            handleDeselctClass(e, item);
                                                                                                        }}
                                                                                                    >
                                                                                                        <div className="mr-1 inline-block shrink-0">
                                                                                                            <svg
                                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                                width="16"
                                                                                                                height="16"
                                                                                                                fill="currentColor"
                                                                                                                class="bi bi-check-circle"
                                                                                                                viewBox="0 0 16 16"
                                                                                                            >
                                                                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                                                                                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                                                                                            </svg>
                                                                                                        </div>
                                                                                                        {item.Name}
                                                                                                    </div>
                                                                                                </>
                                                                                            ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </AnimateHeight>
                                                                    </div>
                                                                </div>
                                                                <div className="border border-[#d3d3d3] dark:border-[#1b2e4b] rounded">
                                                                    <button type="button" className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] `} onClick={() => togglePara('2')}>
                                                                        Add Student to Programs
                                                                        {active === '2' ? <IconMinus className='ml-auto' /> : <IconPlus className="ml-auto" />}
                                                                    </button>
                                                                    <div>
                                                                        <AnimateHeight duration={300} height={active === '2' ? 'auto' : 0}>
                                                                            <div className="p-4 text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                                                <div className=" border p-4 bg-info/20 rounded-md border-orn">
                                                                                    <div className="p-4 w-full h-72 overflow-y-auto  grow rounded-md border border-orn mt-1 bg-white">
                                                                                        {programs &&
                                                                                            programs?.map((item) => (
                                                                                                <>
                                                                                                    {!selectedPrograms?.includes(item) && (
                                                                                                        <>
                                                                                                            <div
                                                                                                                key={item.ProgramId}
                                                                                                                className="text-xs cursor-pointer border-b w-full p-2"
                                                                                                                onClick={(e) => handleSelectProgram(e, item)}
                                                                                                            >
                                                                                                                <span className="text-zinc-500 hover:text-zinc-900">{item.Name}</span>
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                </>
                                                                                            ))}
                                                                                    </div>
                                                                                    <div className="text-center grow-0 flex items-center justify-center w-full">
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            width="16"
                                                                                            height="16"
                                                                                            fill="currentColor"
                                                                                            class="bi bi-arrow-left-right"
                                                                                            viewBox="0 0 16 16"
                                                                                        >
                                                                                            <path
                                                                                                fill-rule="evenodd"
                                                                                                d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
                                                                                            />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div className="p-4 w-full h-72 overflow-y-auto grow rounded-md border border-orn mt-1 bg-white">
                                                                                        {selectedPrograms &&
                                                                                            selectedPrograms?.map((item) => (
                                                                                                <>
                                                                                                    <div
                                                                                                        key={item.ProgramId}
                                                                                                        className="text-xs cursor-pointer text-orn hover:text-ornhover font-bold border-b w-full p-2"
                                                                                                        onClick={(e) => {
                                                                                                            handleDeselctProgram(e, item);
                                                                                                        }}
                                                                                                    >
                                                                                                        <div className="mr-1 inline-block shrink-0">
                                                                                                            <svg
                                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                                width="16"
                                                                                                                height="16"
                                                                                                                fill="currentColor"
                                                                                                                class="bi bi-check-circle"
                                                                                                                viewBox="0 0 16 16"
                                                                                                            >
                                                                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                                                                                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                                                                                            </svg>
                                                                                                        </div>
                                                                                                        {item.Name}
                                                                                                    </div>
                                                                                                </>
                                                                                            ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </AnimateHeight>
                                                                    </div>
                                                                </div>
                                                                <div className="border border-[#d3d3d3] dark:border-[#1b2e4b] rounded">
                                                                    <button type="button" className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] `} onClick={() => togglePara('3')}>
                                                                        Add Student to Waiting Lists
                                                                        {active === '3' ? <IconMinus className='ml-auto' /> : <IconPlus className="ml-auto" />}
                                                                    </button>
                                                                    <div>
                                                                        <AnimateHeight duration={300} height={active === '3' ? 'auto' : 0}>
                                                                            <div className="p-4 text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                                                <div className=" border p-4 bg-warning/20 rounded-md border-ylw">
                                                                                    <div className="p-4 w-full h-72 overflow-y-auto  grow rounded-md border border-ylw mt-1 bg-white">
                                                                                        {waitingLists &&
                                                                                            waitingLists?.map((item) => (
                                                                                                <>
                                                                                                    {!selectedWaitingLists?.includes(item) && (
                                                                                                        <>
                                                                                                            <div
                                                                                                                key={item.WaitingListId}
                                                                                                                className="text-xs cursor-pointer border-b w-full p-2"
                                                                                                                onClick={(e) => handleSelectedWaitingLists(e, item)}
                                                                                                            >
                                                                                                                <span className="text-zinc-500 hover:text-zinc-900">{item.Title}</span>
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                </>
                                                                                            ))}
                                                                                    </div>
                                                                                    <div className="text-center grow-0 flex items-center justify-center w-full">
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            width="16"
                                                                                            height="16"
                                                                                            fill="currentColor"
                                                                                            class="bi bi-arrow-left-right"
                                                                                            viewBox="0 0 16 16"
                                                                                        >
                                                                                            <path
                                                                                                fill-rule="evenodd"
                                                                                                d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
                                                                                            />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div className="p-4 w-full h-72 overflow-y-auto grow rounded-md border border-ylw mt-1 bg-white">
                                                                                        {selectedWaitingLists &&
                                                                                            selectedWaitingLists?.map((item) => (
                                                                                                <>
                                                                                                    <div
                                                                                                        key={item.WaitingListId}
                                                                                                        className="text-xs cursor-pointer text-ylw hover:text-ylwhover font-bold border-b w-full p-2"
                                                                                                        onClick={(e) => {
                                                                                                            handleDeselectWaitingLists(e, item);
                                                                                                        }}
                                                                                                    >
                                                                                                        <div className="mr-1 inline-block shrink-0">
                                                                                                            <svg
                                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                                width="16"
                                                                                                                height="16"
                                                                                                                fill="currentColor"
                                                                                                                class="bi bi-check-circle"
                                                                                                                viewBox="0 0 16 16"
                                                                                                            >
                                                                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                                                                                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                                                                                            </svg>
                                                                                                        </div>
                                                                                                        {item.Title}
                                                                                                    </div>
                                                                                                </>
                                                                                            ))}
                                                                                    </div>
                                                                                    
                                                                                </div>
                                                                           
                                                                            </div>
                                                                        </AnimateHeight>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end items-center mt-8">
                                                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                                                        Cancel
                                                                                    </button>
                                                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                                                        Save Student
                                                                                    </button>
                                                                                </div>
                                                    </div>
                                                </Tab.Panel>
                                            </Tab.Panels>
                                        </Tab.Group>
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
