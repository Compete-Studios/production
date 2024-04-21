import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Swal from 'sweetalert2';
import { addNewStudent, addStudentToClasses, addStudentToPrograms, addStudentToWaitingLists } from '../../functions/api';
import { Link, useNavigate } from 'react-router-dom';
import { constFormateDateMMDDYYYY, formatDate } from '../../functions/shared';

const studentInfoInit = {
    studioId: '',
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
    birthdate: '01-01-2022',
    marketingMethod: '',
    notes: '',
    nextContactDate: constFormateDateMMDDYYYY(new Date()),
    currentPipelineStatus: '',
    firstClassDate: constFormateDateMMDDYYYY(new Date()),
    originalContactDate: constFormateDateMMDDYYYY(new Date()),
    introDate: constFormateDateMMDDYYYY(new Date()),
};

const alertsInit = {
    email: false,
    firstName: false,
    lastName: false,
    contactDate: false,
    pipelineStep: false,
};

export default function AddStudent() {
    const { waitingLists, pipelineSteps, programs, classes, marketingSources, suid } = UserAuth();
    const [alerts, setAlerts] = useState(alertsInit);
    const [studentInfo, setStudentInfo] = useState(studentInfoInit);
    const [programsForStudent, setProgramsForStudent] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedWaitingLists, setSelectedWaitingLists] = useState([]);
    const [options, setOptions] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const newPrograms = programs?.map((program: any) => {
            return { value: program.ProgramId, label: program.Name };
        });
        setOptions(newPrograms);
    }, [programs]);

    const handleSelectClass = (e: any, item: any) => {
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

    const showErrorMessage = (msg = '') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: 'error',
            title: msg,
            padding: '10px 20px',
        });
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

   

    const handleAddStudent = async (e: any) => {
        e.preventDefault();

        studentInfo.nextContactDate = formatDate(studentInfo.nextContactDate);
        studentInfo.birthdate = formatDate(studentInfo.birthdate);
        studentInfo.firstClassDate = formatDate(studentInfo.firstClassDate);
        studentInfo.originalContactDate = formatDate(studentInfo.originalContactDate);
        studentInfo.introDate = formatDate(studentInfo.introDate);
        studentInfo.studioId = suid;

        const classIDs = selectedClasses.map((item: any) => item.ClassId);
        const programIds = programsForStudent.map((item: any) => item.value);
        const waitingListIds = selectedWaitingLists.map((item: any) => item.WaitingListId);      


        if (studentInfo?.fName === '') {
            showErrorMessage('First Name is required');
            setAlerts({ ...alerts, firstName: true });
            scrollTop();
            return;
        } else if (studentInfo?.lName === '') {
            showErrorMessage('Last Name is required');
            setAlerts({ ...alerts, lastName: true });
            scrollTop();
            return;
        } else if (studentInfo?.email === '') {
            showErrorMessage('Email is required');
            setAlerts({ ...alerts, email: true });
            scrollTop();
            return;
        } else {
            addNewStudent(studentInfo).then((res) => {
                console.log(res, 'new student');
                console.log(programIds, 'programIds');
                console.log(classIDs, 'classIDs');
                console.log(waitingListIds, 'waitingListIds');
                addStudentToPrograms(res.NewStudentId, programIds);
                addStudentToClasses(res.NewStudentId, classIDs);
                addStudentToWaitingLists(res.NewStudentId, waitingListIds);
                showMessage('Student has been added successfully');
                const newID = parseInt(res.NewStudentId) * parseInt(suid)
                navigate(`/students/add-billing-account/${newID}`);
            });
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/students/view-students" className="text-primary hover:underline">
                            Students
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>
                            Add Student
                        </span>
                    </li>
                </ul>
            <div className="panel bg-gray-100 max-w-5xl mx-auto mt-4">
                <div className="mb-5">
                    <h5 className="font-semibold text-lg mb-4">Student Info</h5>
                    <p>Use this option to add a new student to the system. </p>
                </div>
                <div className="mb-5">
                    <form>
                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-2" onClick={() => setAlerts({ ...alerts, firstName: false })}>
                                <label htmlFor="first">First Name</label>
                                <input
                                    id="first"
                                    type="text"
                                    className={`form-input ${alerts.firstName && 'border-danger bg-red-50'} `}
                                    onChange={(e) => setStudentInfo({ ...studentInfo, fName: e.target.value })}
                                />
                                <p className="text-danger text-xs ml-1">{alerts.firstName && 'First name is required'}</p>
                            </div>
                            <div className="sm:col-span-2" onClick={() => setAlerts({ ...alerts, lastName: false })}>
                                <label htmlFor="last">Last Name</label>
                                <input
                                    id="last"
                                    type="text"
                                    className={`form-input ${alerts.lastName && 'border-danger bg-red-50'} `}
                                    onChange={(e) => setStudentInfo({ ...studentInfo, lName: e.target.value })}
                                />
                                <p className="text-danger text-xs ml-1">{alerts.lastName && 'Last name is required'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="contact1">Contact 1</label>
                                <input id="contact1" type="text" className="form-input" onChange={(e) => setStudentInfo({ ...studentInfo, contact1: e.target.value })} />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="contact2">Contact 2</label>
                                <input id="contact2" type="text" className="form-input" onChange={(e) => setStudentInfo({ ...studentInfo, contact2: e.target.value })} />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone">Mobile Phone</label>
                                <input id="phone" type="text" className="form-input" onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })} />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone">Home Phone</label>
                                <input id="phone" type="text" className="form-input" onChange={(e) => setStudentInfo({ ...studentInfo, phone2: e.target.value })} />
                            </div>
                            <div className="sm:col-span-2" onClick={() => setAlerts({ ...alerts, email: false })}>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="text"
                                    className={`form-input ${alerts.email && 'border-danger bg-red-50'} `}
                                    onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                                />
                                <p className="text-danger text-xs ml-1">{alerts.email && 'Email is required'}</p>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="address">Address</label>
                                <input id="address" type="text" className="form-input" onChange={(e) => setStudentInfo({ ...studentInfo, address: e.target.value })} />
                            </div>
                            <div className="">
                                <label htmlFor="address2">Address 2</label>
                                <input id="address2" type="text" className="form-input" onChange={(e) => setStudentInfo({ ...studentInfo, address2: e.target.value })} />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="city">City</label>
                                <input id="city" type="text" placeholder="City" className="form-input" onChange={(e) => setStudentInfo({ ...studentInfo, city: e.target.value })} />
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="state">State</label>
                                <input id="state" type="text" placeholder="State" className="form-input" onChange={(e) => setStudentInfo({ ...studentInfo, state: e.target.value })} />
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="zip">Zip</label>
                                <input id="zip" type="text" placeholder="Zip" className="form-input" onChange={(e) => setStudentInfo({ ...studentInfo, zip: e.target.value })} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="panel bg-gray-100 max-w-5xl mx-auto mt-4">
                <div className="mb-5">
                    <h5 className="font-semibold text-lg mb-4">Additional Info</h5>
                </div>
                <div className="mb-5">
                    <form>
                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="birthdate">Birthdate</label>
                                <Flatpickr
                                    value={studentInfo.birthdate}
                                    className="form-input"
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                    onChange={(date: any) => setStudentInfo({ ...studentInfo, birthdate: date })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="marketingMethod">Marketing Source</label>
                                <select id="marketingMethod" className="form-select text-white-dark">
                                    {marketingSources?.map((source: any) => (
                                        <option key={source.MarketingSourceId} value={source.MarketingSourceId}>
                                            {source.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="entryDate">Entry Date</label>
                                <Flatpickr
                                    value={studentInfo.originalContactDate}
                                    className="form-input"
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                    onChange={(date: any) => setStudentInfo({ ...studentInfo, originalContactDate: date })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="introDate">Intro Date</label>
                                <Flatpickr
                                    value={studentInfo.introDate}
                                    className="form-input"
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                    onChange={(date: any) => setStudentInfo({ ...studentInfo, introDate: date })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="firstClassDate">First Class Date</label>
                                <Flatpickr
                                    value={studentInfo.firstClassDate}
                                    className="form-input"
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                    onChange={(date: any) => setStudentInfo({ ...studentInfo, firstClassDate: date })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="entryDate">Next Contact Date</label>
                                <Flatpickr
                                    value={studentInfo.nextContactDate}
                                    className="form-input"
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                    onChange={(date: any) => setStudentInfo({ ...studentInfo, nextContactDate: date })}
                                />
                            </div>

                            <div className="sm:col-span-full">
                                <label htmlFor="notes">Notes</label>
                                <textarea id="notes" rows={4} placeholder="Notes" className="form-textarea" onChange={(e) => setStudentInfo({ ...studentInfo, notes: e.target.value })} />
                            </div>
                            <div className="sm:col-span-2 sm:row-span-2">
                                <label htmlFor="waitingList">Waiting List</label>
                                {waitingLists?.map((list: any) => (
                                    <label key={list.WaitingListId} className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox bg-white dark:bg-[#1b2e4b]"
                                            onChange={(e: any) => {
                                                if (e.target.checked) {
                                                    setSelectedWaitingLists([...selectedWaitingLists, list]);
                                                } else {
                                                    setSelectedWaitingLists(selectedWaitingLists.filter((item) => item !== list));
                                                }
                                            }}
                                        />
                                        <span className=" text-white-dark">{list.Title}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="pipelineStatus">Pipeline Status</label>
                                <select id="pipelineStatus" className="form-select text-white-dark" onChange={(e) => setStudentInfo({ ...studentInfo, currentPipelineStatus: e.target.value })}>
                                    {pipelineSteps?.map((step: any) => (
                                        <option key={step.PipelineStepId} value={step.PipelineStepId}>
                                            {step.StepName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="pipelineStatus">Programs</label>
                                <Select placeholder="Select an option" options={options} isMulti isSearchable={false} 
                                    onChange={(e: any) => {
                                        setProgramsForStudent(e);
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-full">
                                <label htmlFor="classes">Classes</label>
                                <div className="col-span-full flex items-center border p-4 bg-primary/20 rounded-md border-com">
                                    <div className="p-4 w-full h-72 overflow-y-auto  grow rounded-md border border-com mt-1 bg-white">
                                        {classes &&
                                            classes?.map((item: any) => (
                                                <>
                                                    {!selectedClasses?.includes(item) && (
                                                        <>
                                                            <div key={item.ClassId} className="text-xs cursor-pointer border-b w-full p-2" onClick={(e) => handleSelectClass(e, item)}>
                                                                <span className="text-zinc-500 hover:text-zinc-900">{item.Name}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            ))}
                                    </div>
                                    <div className="text-center grow-0 flex items-center justify-center w-auto px-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                            <path
                                                fill-rule="evenodd"
                                                d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
                                            />
                                        </svg>
                                    </div>
                                    <div className="p-4 w-full h-72 overflow-y-auto grow rounded-md border border-com mt-1 bg-white">
                                        {selectedClasses?.map((item) => (
                                            <>
                                                <div
                                                    key={item.ClassId}
                                                    className="text-xs cursor-pointer text-primary hover:text-primary/80 font-bold border-b w-full p-2"
                                                    onClick={(e) => {
                                                        handleDeselctClass(e, item);
                                                    }}
                                                >
                                                    <div className="mr-1 inline-block shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
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
                        </div>
                        <div className="flex">
                            <button type="button" className="btn btn-primary ml-auto" onClick={(e) => handleAddStudent(e)}>
                                Add Student
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
