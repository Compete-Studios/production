import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Fragment, Suspense, useEffect, useState } from 'react';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconCalendar from '../../components/Icon/IconCalendar';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import { UserAuth } from '../../context/AuthContext';
import {
    dropStudentFromClass,
    dropStudentFromProgram,
    dropStudentFromWaitingList,
    dropStudent,
    getClassesByStudentId,
    getPaymentScheduleByID,
    getPaymentSchedulesForCustomer,
    getPaysimpleCustomerIdFromStudentId,
    getProgramsByStudentId,
    getRankByStudentId,
    getStudentBillingAccounts,
    getStudentCustomBarcodeId,
    getStudentInfo,
    getWaitingListsByStudentId,
    updateStudentByColumn,
    updateStudentNotes,
    addCustomBarcodeId,
} from '../../functions/api';
import AddNoteModal from './AddNoteModal';
import IconPlus from '../../components/Icon/IconPlus';
import StudentsQuickPay from './StudentsQuickPay';
import { convertPhone, formatDateForStudentEdit, hashTheID, showMessage, showWarningMessage, unHashTheID } from '../../functions/shared';

import { getAllCustomerPaymentAccounts } from '../../functions/payments';
import UpdateContactPopUp from './UpdateContactPopUp';
import UpdateAdditionalPopUp from './UpdateAdditionalPopUp';
import AddCardModal from './AddCardModal';
import AddBankModal from './AddBankModal';
import AddStudentToBillingAccountModal from './AddStudentToBillingAccountModal';
import AddStudentToClass from '../Classes/AddStudentToClass';
import AddStudentToProgram from '../Classes/AddStudenToProgram';
import AddStudentToWaitingList from '../Classes/AddStudentToWaitingList';
import SendQuickText from './buttoncomponents/SendQuickText';
import SendQuickEmail from './buttoncomponents/SendQuickEmail';
import DeleteStudent from './buttoncomponents/DeleteStudent';
import ViewStudentActionItem from './ViewStudentActionItem';
import { Tab } from '@headlessui/react';
import SendQuickWaiver from './buttoncomponents/SendQuickWaiver';
import IconEdit from '../../components/Icon/IconEdit';
import IconEye from '../../components/Icon/IconEye';
import ViewPaymentMethods from './ViewPaymentMethods';
import BillingInfoUpdate from './components/BillingInfoUpdate';
import Hashids from 'hashids';
import ViewActivePaymentSchedules from './ViewActivePaymentSchedules';
import IconUser from '../../components/Icon/IconUser';
import StudentProfilePic from './StudentCards/StudentProfilePic';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import IconMail from '../../components/Icon/IconMail';
import StudentBillingDetails from './StudentCards/StudentBillingDetails';

interface UpdateValues {
    [key: string]: any;
}

const updateValuesInit = {
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
};

const ViewStudent = () => {
    const { suid, marketingSources, pipelineSteps, studioOptions, studioInfo }: any = UserAuth();

    const [updateClasses, setUpdateClasses] = useState<boolean>(false);

    const [toUpdate, setToUpdate] = useState<UpdateValues>(updateValuesInit);
    const [update, setUpdate] = useState<boolean>(false);
    const [student, setStudent] = useState<any>({});

    const [updateNotes, setUpdateNotes] = useState(false);
    const [barcode, setBarcode] = useState<any>(null);
    const [displayedSource, setDisplayedSource] = useState<any>(null);
    const [classes, setClasses] = useState<any>([]);
    const [programs, setPrograms] = useState<any>([]);
    const [waitingLists, setWaitingLists] = useState<any>([]);
    const [rank, setRank] = useState<any>(null);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [pipeline, setPipeline] = useState<any>([]);

    const [loadingPic, setLoadingPic] = useState<boolean>(true);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profile'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const { uid, studioid } = useParams<{ uid: string; studioid: any }>();

    const navigate = useNavigate();

    useEffect(() => {
        const pipeliner = pipelineSteps.find((step: any) => step.PipelineStepId === parseInt(student?.StudentPipelineStatus));
        setPipeline(pipeliner);
    }, [student]);

    const handleUpdateNotes = () => {
        setUpdateNotes(true);
    };

    const handleUpdateBarcode = async (e: any) => {
        e.preventDefault();
        const dataForBarcode = {
            studentId: unHashTheID(uid),
            studentBarcodeId: barcode,
            studioId: suid,
        };
        const res = await addCustomBarcodeId(dataForBarcode);
        console.log(res);
        setUpdate(false);
    };

    const handleSaveNotes = () => {
        updateStudentNotes(student?.Student_id, student?.notes);
        setUpdateNotes(false);
        showMessage('Notes Updated!');
    };
    useEffect(() => {
        const marketingSourceTemp = marketingSources?.find((source: any) => source.MethodId === parseInt(student?.MarketingMethod));
        setDisplayedSource(marketingSourceTemp?.Name);
    }, [student?.MarketingMethod]);

    const getStudentBarcode = async (studentID: any) => {
        try {
            const response = await getStudentCustomBarcodeId(studentID, suid);
            if (response.recordset.length > 0) {
                setBarcode(response?.recordset[0]?.Barcode);
            } else {
                setBarcode(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getRank = async (studentID: any) => {
        try {
            const response = await getRankByStudentId(studentID);
            if (response) {
                setRank(response);
            } else {
                setRank(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateByColumn = async (column: string) => {
        const data = {
            studentId: unHashTheID(uid),
            columnName: column,
            value: student[column],
        };
        try {
            console.log(data);
            const response = await updateStudentByColumn(data);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateNextContactDate = async (column: string) => {
        const data = {
            studentId: unHashTheID(uid),
            columnName: column,
            value: student.NextContactDate ? formatDateForStudentEdit(student.NextContactDate) : null,
        };
        try {
            console.log(data);
            const response = await updateStudentByColumn(data);
            setStudent({ ...student, NextContactDate: student.NextContactDate[0] });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpdateFirstClassDate = async (column: string) => {
        const data = {
            studentId: unHashTheID(uid),
            columnName: column,
            value: student.FirstClassDate ? formatDateForStudentEdit(student.FirstClassDate) : null,
        };
        try {
            console.log(data);
            const response = await updateStudentByColumn(data);
            setStudent({ ...student, FirstClassDate: student.FirstClassDate[0] });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateIntroContactDate = async (column: string) => {
        const data = {
            studentId: unHashTheID(uid),
            columnName: column,
            value: student.IntroDate ? formatDateForStudentEdit(student.IntroDate) : null,
        };
        try {
            console.log(data);
            const response = await updateStudentByColumn(data);
            setStudent({ ...student, IntroDate: student.IntroDate[0] });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpdateBirthDate = async (column: string) => {
        const data = {
            studentId: unHashTheID(uid),
            columnName: column,
            value: student.Birthdate ? formatDateForStudentEdit(student.Birthdate) : null,
        };
        try {
            console.log(data);
            const response = await updateStudentByColumn(data);
            setStudent({ ...student, Birthdate: student.Birthdate[0] });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const getClassesForStudent = async (studentID: any) => {
        try {
            const response = await getClassesByStudentId(studentID);
            if (response.recordset.length > 0) {
                setClasses(response.recordset);
            } else {
                setClasses([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getWiatingListsForStudent = async (studentID: any) => {
        try {
            const response = await getWaitingListsByStudentId(studentID);
            console.log(response);
            if (response.recordset.length > 0) {
                setWaitingLists(response.recordset);
            } else {
                setWaitingLists([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getProgramsForStudent = async (studentID: any) => {
        try {
            const response = await getProgramsByStudentId(studentID);
            if (response.recordset.length > 0) {
                setPrograms(response.recordset);
            } else {
                setPrograms([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const studioID: any = unHashTheID(studioid);
        const studentID: any = unHashTheID(uid);
        if (parseInt(suid) === parseInt(studioID)) {
            // fetch student data
            getStudentInfo(studentID).then((res) => {
                setStudent(res);
            });
        } else {
            // redirect to 404
            navigate('/404');
        }
    }, [uid, studioid, suid]);

    useEffect(() => {
        getStudentBarcode(unHashTheID(uid));
        getRank(unHashTheID(uid));
        getClassesForStudent(unHashTheID(uid));
        getWiatingListsForStudent(unHashTheID(uid));
        getProgramsForStudent(unHashTheID(uid));
    }, [uid, suid, updateClasses]);

    const convertPhoneNumber = (phone: any) => {
        return phone?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    };

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrolltoBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    useEffect(() => {
        scrollTop();
    }, []);

    console.log(student);

    const handleDeleteFromClass = (classID: any) => {
        showWarningMessage('Are you sure you want to remove this student from this class?', 'Remove Student From Class', 'Your student has been removed from the class')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    // User confirmed the action
                    const studentID: any = unHashTheID(uid);
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
                    const studentId: any = unHashTheID(uid);
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
                    const studentId: any = unHashTheID(uid);
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

    const [hasedRefID, setHasedRefID] = useState<any>(null);

    useEffect(() => {
        if (!student) return;
        if (!suid) return;
        const hashedStudent = parseInt(student?.Student_id) * 548756 * parseInt(suid);
        setHasedRefID(hashedStudent);
        if (student?.ProfilePicUrl) {
            setLoadingPic(false);
        }
    }, [student]);

    const reactivateStudent = async () => {
        const data = {
            studentId: student?.Student_id,
            activityLevel: 1,
        };
        try {
            const active = await dropStudent(data);
            if (active) {
                showMessage('Student Reactivated');
                setStudent({ ...student, activity: 1 });
            } else {
                showWarningMessage('Student could not be reactivated');
            }
        } catch (error) {
            console.log(error);
            showWarningMessage('There was an error. Student could not be reactivated');
        }
    };

    //This function used when deleting a student
    const handleStudentUpdate = (updatedStudent: any) => {
        setStudent(updatedStudent);
    };

    const handleClone = (e: any) => {
        e.preventDefault();
        console.log('Clone', uid);
        navigate(`/students/add-student/${uid}`);
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/students/view-students" className="text-primary hover:underline">
                            Students
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-primary hover:underline">
                        <Link to={`/students/view-students-in-pipeline/${student?.StudentPipelineStatus}/${suid}`} className="text-primary hover:underline">
                            Pipeline Step
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>
                            {student?.First_Name} {student?.Last_Name}
                        </span>
                    </li>
                </ul>
            </div>
            <div className="lg:flex lg:items-start gap-4 mt-4">
                {/* CONTACT INFO */}

                <div className="lg:w-full lg:mt-0 mt-8">
                    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                        <Tab.List className="flex flex-wrap  border-b border-zinc-300">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? 'text-info !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-5 h-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 16 16">
                                            <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
                                            <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96q.04-.245.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 1 1 12z" />
                                        </svg>
                                        Student Info
                                    </button>
                                )}
                            </Tab>

                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? 'text-info !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-5 h-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 16 16">
                                            <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                                            <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
                                        </svg>
                                        Billing
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>

                        <Tab.Panels>
                            <Tab.Panel>
                                <div className="grid sm:grid-cols-8 grid-cols-1 gap-4 mt-4">
                                    {/* STUDENT CARD */}
                                    <div className="panel p-0 xl:col-span-2 md:col-span-3 h-full flex flex-col justify-between">
                                        {/* ProfilePic */}
                                        <div>
                                            <StudentProfilePic student={student} setStudent={setStudent} />

                                            <div className="flex items-start justify-between p-4">
                                                <div>
                                                    <div className="font-bold text-2xl flex items-center gap-1">
                                                        {student?.First_Name} {student?.Last_Name}{' '}
                                                        <p className={`  ${student?.activity ? 'badge bg-success' : 'badge bg-danger'}`}>{student?.activity ? 'Active' : 'Inactive'}</p>
                                                    </div>
                                                    <p className="font-semibold ">{student?.email}</p>
                                                    <p className="font-semibold ">{convertPhoneNumber(student?.Phone)}</p>
                                                    <p className="font-semibold">{convertPhoneNumber(student?.Phone2)}</p>
                                                    <div className="mt-2">
                                                        {!student?.activity && (
                                                            <button
                                                                className="btn btn-sm btn-danger mb-4"
                                                                onClick={() => {
                                                                    reactivateStudent();
                                                                }}
                                                            >
                                                                Reactivate Student
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <p className="font-bold ">Age:</p>
                                                        <p>{new Date().getFullYear() - new Date(student?.Birthdate).getFullYear()} </p>
                                                    </div>
                                                    {toUpdate?.nextContactDate ? (
                                                        <div className="flex items-center gap-1">
                                                            <Flatpickr
                                                                value={student.NextContactDate}
                                                                className="form-input h-7"
                                                                options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                                onChange={(date: any) => setStudent({ ...student, NextContactDate: date })}
                                                            />
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => {
                                                                    setStudent({ ...student, NextContactDate: null });
                                                                    handleUpdateByColumn('NextContactDate');
                                                                }}
                                                            >
                                                                Clear
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-info"
                                                                onClick={() => {
                                                                    setToUpdate({ ...toUpdate, nextContactDate: false });
                                                                    handleUpdateNextContactDate('NextContactDate');
                                                                }}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className={`font-normal flex items-end gap-1 text-sm `}>
                                                            Next Contact Date:{' '}
                                                            <span className={`${!student?.NextContactDate && 'text-danger'}`}>
                                                                {student?.NextContactDate ? formatWithTimeZone(student?.NextContactDate, handleGetTimeZoneOfUser()) : 'No contact set'}{' '}
                                                            </span>
                                                            <span>
                                                                <button onClick={() => setToUpdate({ ...toUpdate, nextContactDate: true })}>
                                                                    <IconEdit className="w-3 h-3 text-info" fill={true} />
                                                                </button>
                                                            </span>
                                                        </p>
                                                    )}
                                                    <p className={`font-normal text-sm `}>
                                                        Rank: <span className={`${rank ? 'text-success' : 'text-danger'}`}>{rank ? rank : 'No rank set'}</span>
                                                    </p>
                                                    {update ? (
                                                        <div className="flex items-center gap-1">
                                                            <input type="text" className="form-input h-7" value={barcode} placeholder="Enter Barcode" onChange={(e) => setBarcode(e.target.value)} />
                                                            <button
                                                                className="btn btn-sm btn-info"
                                                                onClick={(e: any) => {
                                                                    handleUpdateBarcode(e);
                                                                }}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className={`font-normal flex items-end gap-1 text-sm `}>
                                                            Barcode ID: <span className={`${barcode ? 'text-success' : 'text-danger'}`}>{barcode ? barcode : 'No barcode set'} </span>
                                                            <span>
                                                                <button onClick={() => setUpdate(true)}>
                                                                    <IconEdit className="w-3 h-3 text-info" fill={true} />
                                                                </button>
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 justify-center p-4 py-6 ">
                                            <SendQuickEmail student={student} name="Student" pipeline={pipeline} />
                                            <SendQuickText student={student} name="Student" pipeline={pipeline} />
                                            <StudentsQuickPay student={student} suid={suid} />
                                            <Tippy content="Send Invoice">
                                                <button className="btn btn-dark w-10 h-10 p-0 rounded-full" onClick={() => navigate(`/students/invoice/${hasedRefID}`)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-receipt" viewBox="0 0 16 16">
                                                        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z" />
                                                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
                                                    </svg>
                                                </button>
                                            </Tippy>
                                        </div>
                                    </div>
                                    {/* NOTES */}
                                    <div className="panel p-0 md:col-span-5 xl:col-span-4">
                                        <div className="flex rounded-t-lg items-center justify-between gap-4 p-5 bg-zinc-100">
                                            <h3 className="font-bold">Notes</h3>
                                            <div className="flex items-center gap-4">
                                                <div className="flex">
                                                    {!updateNotes && (
                                                        <button className="text-danger ml-auto" onClick={() => handleUpdateNotes()}>
                                                            Update All Notes
                                                        </button>
                                                    )}
                                                </div>

                                                {!updateNotes && <AddNoteModal student={student} setStudent={setStudent} />}
                                            </div>
                                        </div>
                                        {updateNotes && (
                                            <div className="flex items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
                                                <span className="ltr:pr-2 rtl:pl-2">
                                                    <span className="ltr:mr-1 rtl:ml-1 font-bold">Warning!</span>
                                                    You are about to update all notes for this student. Deleting or modifying notes can not be undone.
                                                </span>
                                                <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80" onClick={() => setUpdateNotes(false)}>
                                                    Close without saving
                                                </button>
                                            </div>
                                        )}

                                        {updateNotes ? (
                                            <div className="border border-[#ebedf2] bg-white rounded dark:bg-[#1b2e4b] dark:border-0 ">
                                                <div className="p-4">
                                                    <textarea
                                                        className="w-full border-0 focus:ring-0 focus:outline-none dark:bg-[#1b2e4b] dark:text-white-dark"
                                                        rows={24}
                                                        value={student?.notes}
                                                        onChange={(e) => setStudent({ ...student, notes: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <PerfectScrollbar className="rounded-b-lg max-h-[470px]">
                                                <div className="p-4">
                                                    {student?.notes?.split('\n').map((note: any, index: any) =>
                                                        // Check if the line starts with '#'
                                                        note.trim().startsWith('#') ? (
                                                            <div key={index} className="text-[#515365] dark:text-white-dark mt-2 font-bold">
                                                                {note}
                                                            </div>
                                                        ) : null
                                                    )}
                                                    {student?.notes?.split('\n').map((note: any, index: any) =>
                                                        // Check if the line starts with '#'
                                                        note.trim().startsWith('*') ? (
                                                            <div key={index} className="text-[#515365] dark:text-white-dark mt-2 font-bold">
                                                                {note}
                                                            </div>
                                                        ) : null
                                                    )}
                                                    {/* Render other notes excluding the line starting with '#' */}
                                                    {student?.notes?.split('\n').map((note: any, index: any) =>
                                                        !note.trim().startsWith('#') && !note.trim().startsWith('*') ? (
                                                            <div key={index} className="text-[#515365] dark:text-white-dark mt-2">
                                                                {note}
                                                            </div>
                                                        ) : null
                                                    )}
                                                </div>
                                            </PerfectScrollbar>
                                        )}
                                        {updateNotes && (
                                            <div className="p-4">
                                                <button className="btn btn-primary ml-auto" onClick={() => handleSaveNotes()}>
                                                    Save Notes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {/* PIPELINE STEPS */}
                                    <div className="panel p-0 xl:col-span-2 xl:row-span-2 md:col-span-4">
                                        <div className="flex items-center justify-between gap-4 p-5 bg-zinc-100 rounded-t-lg">
                                            <h3 className="font-bold">Pipeline Step</h3>
                                            {toUpdate?.StudentPipelineStatus && (
                                                <button
                                                    className="btn btn-primary "
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, StudentPipelineStatus: false });
                                                        handleUpdateByColumn('StudentPipelineStatus');
                                                    }}
                                                >
                                                    Update
                                                </button>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            {pipelineSteps?.map((step: any) => {
                                                return (
                                                    <label key={step.PipelineStepId} htmlFor={step.PipelineStepId} className="flex items-center cursor-pointer hover:bg-gray-100 p-1 sm:basis-1/2">
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
                                    {/* SCHEDULE AND CLASSES */}
                                    <div className="panel p-0  xl:col-span-3 md:col-span-4">
                                        <div className="flex items-center justify-between gap-4 p-5 bg-zinc-100 rounded-t-lg">
                                            <h5 className="font-bold">Schedule and Classes</h5>
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
                                    {/* DETAILS */}
                                    <div className="panel md:col-span-4 xl:col-span-3 p-0 md:row-span-2 md:row-start-2">
                                        <div className="flex items-center justify-between gap-4 p-5 bg-zinc-100 rounded-t-lg">
                                            <h3 className="font-bold">Student Details</h3>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6 p-4">
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
                                                    Save
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
                                                    Save
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
                                                    Save
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
                                                    Save
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
                                                    Save
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
                                                    Save
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
                                                    Save
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
                                                    Save
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
                                                    Save
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
                                                    Save
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
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, Zip: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold ">Next Contact Date:</p>
                                            {toUpdate?.nextContactDate ? (
                                                <Flatpickr
                                                    value={student.NextContactDate}
                                                    className="form-input h-7"
                                                    options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                    onChange={(date: any) => setStudent({ ...student, NextContactDate: date })}
                                                />
                                            ) : (
                                                <p className={`font-normal ${!student?.NextContactDate && 'text-danger'}`}>
                                                    {student?.NextContactDate ? formatWithTimeZone(student?.NextContactDate, handleGetTimeZoneOfUser()) : 'No contact set'}{' '}
                                                </p>
                                            )}
                                            {toUpdate?.nextContactDate ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => {
                                                            setStudent({ ...student, NextContactDate: null });
                                                            handleUpdateByColumn('NextContactDate');
                                                        }}
                                                    >
                                                        Clear
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-info hover:bg-blue-900"
                                                        onClick={() => {
                                                            setToUpdate({ ...toUpdate, nextContactDate: false });
                                                            handleUpdateNextContactDate('NextContactDate');
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, nextContactDate: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold ">Intro Date:</p>
                                            {toUpdate?.IntroDate ? (
                                                <Flatpickr
                                                    value={student.IntroDate}
                                                    className="form-input h-7"
                                                    options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                    onChange={(date: any) => setStudent({ ...student, IntroDate: date })}
                                                />
                                            ) : (
                                                <p className={`font-normal ${!student?.IntroDate && 'text-danger'}`}>
                                                    {student?.IntroDate ? formatWithTimeZone(student?.IntroDate, handleGetTimeZoneOfUser()) : 'No Intro Date set'}
                                                </p>
                                            )}
                                            {toUpdate?.IntroDate ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => {
                                                            setStudent({ ...student, IntroDate: null });
                                                            handleUpdateByColumn('IntroDate');
                                                        }}
                                                    >
                                                        Clear
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-info hover:bg-blue-900"
                                                        onClick={() => {
                                                            setToUpdate({ ...toUpdate, IntroDate: false });
                                                            handleUpdateIntroContactDate('IntroDate');
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, IntroDate: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold ">Birthday:</p>
                                            {toUpdate?.Birthdate ? (
                                                <Flatpickr
                                                    value={student.Birthdate}
                                                    className="form-input h-7"
                                                    options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                    onChange={(date: any) => setStudent({ ...student, Birthdate: date })}
                                                />
                                            ) : (
                                                <p className={`font-normal ${!student?.Birthdate && 'text-danger'}`}>
                                                    {' '}
                                                    {student?.Birthdate ? formatWithTimeZone(student?.Birthdate, handleGetTimeZoneOfUser()) : 'No Intro Date set'}
                                                </p>
                                            )}
                                            {toUpdate?.Birthdate ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => {
                                                            setStudent({ ...student, Birthdate: null });
                                                            handleUpdateByColumn('Birthdate');
                                                        }}
                                                    >
                                                        Clear
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-info hover:bg-blue-900"
                                                        onClick={() => {
                                                            setToUpdate({ ...toUpdate, Birthdate: false });
                                                            handleUpdateBirthDate('Birthdate');
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
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
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, MarketingMethod: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold ">First Class Date:</p>
                                            {toUpdate?.FirstClassDate ? (
                                                <Flatpickr
                                                    value={student.FirstClassDate}
                                                    className="form-input h-7"
                                                    options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                                    onChange={(date: any) => setStudent({ ...student, FirstClassDate: date })}
                                                />
                                            ) : (
                                                <p className={`font-normal ${!student?.FirstClassDate && 'text-danger'}`}>
                                                    {student?.FirstClassDate ? formatWithTimeZone(student?.FirstClassDate, handleGetTimeZoneOfUser()) : 'No First Class Date set'}
                                                </p>
                                            )}
                                            {toUpdate?.FirstClassDate ? (
                                                <div className="flex items-center gap-2 ml-auto">
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => {
                                                            setStudent({ ...student, FirstClassDate: null });
                                                            handleUpdateByColumn('FirstClassDate');
                                                        }}
                                                    >
                                                        Clear
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-info hover:bg-blue-900"
                                                        onClick={() => {
                                                            setToUpdate({ ...toUpdate, FirstClassDate: false });
                                                            handleUpdateFirstClassDate('FirstClassDate');
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, FirstClassDate: true });
                                                    }}
                                                >
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Tab.Panel>

                            <Tab.Panel>
                                <StudentBillingDetails student={student} />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>

            <div className="">
                <SendQuickWaiver student={student} prospect={false} />
                <button className="uppercase font-lg font-bold w-full hover:bg-yellow-100 p-4 text-left" onClick={(e: any) => handleClone(e)}>
                    Clone Student
                </button>
                {/* {student?.activity ? (
                    <DeleteStudent
                        student={student}
                        billingInfo={paySimpleInfo}
                        paymentSchedules={paymentSchedules}
                        classes={classes}
                        programs={programs}
                        waitingLists={waitingLists}
                        onStudentUpdate={handleStudentUpdate}
                    />
                ) : (
                    <button
                        className="uppercase font-lg font-bold w-full hover:bg-danger-light p-4 text-left"
                        onClick={() => {
                            reactivateStudent();
                        }}
                    >
                        Reactivate Student
                    </button>
                )} */}
            </div>
        </div>
    );
};

export default ViewStudent;
