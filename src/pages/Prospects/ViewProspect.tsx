import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Suspense, useEffect, useState } from 'react';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconCalendar from '../../components/Icon/IconCalendar';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import { UserAuth } from '../../context/AuthContext';
import {
    dropProspectFromClass,
    dropProspectFromProgram,
    dropProspectFromWaitingList,
    getClassesByProspectId,
    getPaymentScheduleByID,
    getPaymentSchedulesForCustomer,
    getPaysimpleCustomerIdFromStudentId,
    getProgramsByProspectId,
    getProspectById,
    getRankByStudentId,
    getStudentBillingAccounts,
    getStudentCustomBarcodeId,
    getWaitingListByProspectId,
    updateProspectNotes,
    updateStudentNotes,
} from '../../functions/api';
import IconUser from '../../components/Icon/IconUser';
import IconTrash from '../../components/Icon/IconTrash';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconPlus from '../../components/Icon/IconPlus';
import { convertPhone, showMessage, showWarningMessage } from '../../functions/shared';
import { formatDate } from '@fullcalendar/core';
import { getAllCustomerPaymentAccounts } from '../../functions/payments';
import AddStudentToClass from '../Classes/AddStudentToClass';
import AddStudentToProgram from '../Classes/AddStudenToProgram';
import AddStudentToWaitingList from '../Classes/AddStudentToWaitingList';
import StudentsQuickPay from '../Students/StudentsQuickPay';
import UpdateContactPopUp from '../Students/UpdateContactPopUp';
import UpdateAdditionalPopUp from '../Students/UpdateAdditionalPopUp';
import AddCardModal from '../Students/AddCardModal';
import AddBankModal from '../Students/AddBankModal';
import AddNoteModal from '../Students/AddNoteModal';
import SendQuickText from '../Students/buttoncomponents/SendQuickText';
import SendQuickEmail from '../Students/buttoncomponents/SendQuickEmail';
import AddProspectNotesModal from './AddProspectNotesModal';

const ViewProspect = () => {
    const { suid, marketingSources, waitingLists }: any = UserAuth();
    const [billingLoading, setBillingLoading] = useState<boolean>(true);
    const [updateClasses, setUpdateClasses] = useState<boolean>(false);
    const [paymentsLoading, setPaymentsLoading] = useState<boolean>(true);
    const [student, setStudent] = useState<any>({});
    const [paySimpleInfo, setPaySimpleInfo] = useState<any>({});
    const [billingInfo, setBillingInfo] = useState<any>({});
    const [updateNotes, setUpdateNotes] = useState(false);
    const [barcode, setBarcode] = useState<any>(null);
    const [classes, setClasses] = useState<any>([]);
    const [programs, setPrograms] = useState<any>([]);
    const [prospectWaitingLists, setProspectWaitingLists] = useState<any>([]);
    const [rank, setRank] = useState<any>(null);
    const [hasCards, setHasCards] = useState<boolean>(false);
    const [paymentSchedules, setPaymentSchedules] = useState<any>([]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profile'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const { uid, studioid } = useParams<{ uid: string; studioid: any }>();

    const unHashTheID = (id: any) => {
        return parseInt(id) / 123456789;
    };

    const navigate = useNavigate();

    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const handleUpdateNotes = () => {
        setUpdateNotes(true);
        scrollToBottom();
    };

    const handleSaveNotes = () => {
        const noteData = {
            prospectId: unHashTheID(uid),
            notes: student?.notes,
        };
        console.log(noteData);
        updateProspectNotes(noteData);
        setUpdateNotes(false);
        showMessage('Notes Updated!');
    };

    const getStudentBarcode = async (studentID: any) => {
        // try {
        //     const response = await getStudentCustomBarcodeId(studentID, suid);
        //     if (response.recordset.length > 0) {
        //         setBarcode(response?.recordset[0]?.Barcode);
        //     } else {
        //         setBarcode(null);
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
        
    };

    const getRank = async (studentID: any) => {
        // try {
        //     const response = await getRankByStudentId(studentID);
        //     if (response) {
        //         setRank(response);
        //     } else {
        //         setRank(null);
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
    };

    const getClassesForStudent = async (studentID: any) => {
        try {
            const response = await getClassesByProspectId(studentID);
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
            const response = await getWaitingListByProspectId(studentID);

            if (response.recordset.length > 0) {
                setProspectWaitingLists(response.recordset);
            } else {
                setProspectWaitingLists([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getProgramsForStudent = async (studentID: any) => {
        try {
            const response = await getProgramsByProspectId(studentID);
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
            getProspectById(studentID).then((res) => {
                setStudent(res);
            });
        } else {
            // redirect to 404
            navigate('/404');
        }
    }, [uid, studioid, suid]);

    useEffect(() => {
        // getStudentBarcode(unHashTheID(uid));
        // getRank(unHashTheID(uid));
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

    useEffect(() => {
        scrollTop();
    }, []);

    const handleDeleteFromClass = (classID: any) => {
        showWarningMessage('Are you sure you want to remove this student from this class?', 'Remove Student From Class', 'Your student has been removed from the class')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    // User confirmed the action
                    const studentID: any = unHashTheID(uid);
                    dropProspectFromClass(studentID, classID).then((response) => {
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
                    dropProspectFromProgram(studentId, programId).then((response) => {
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
            .then(async (confirmed: boolean) => {
                if (confirmed) {
                    // User confirmed the action
                    const studentId: any = unHashTheID(uid);
                    await dropProspectFromWaitingList(studentId, waitingListId).then((response) => {
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

    const handleTest = () => {
        console.log('testing');
    };

    useEffect(() => {
        if (!student) return;
        if (!suid) return;
        const hashedStudent = parseInt(student?.Student_id) * 548756 * parseInt(suid);
        setHasedRefID(hashedStudent);
    }, [student]);

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/prospects/prospect-pipeline" className="text-primary hover:underline">
                            Prospect Pipeline
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>
                            {student?.FName} {student?.LName}
                        </span>
                    </li>
                </ul>
                <div className="sm:flex sm:items-center space-y-4 mt-4 sm:space-y-0 sm:mt-0 gap-x-2">
                    <button className="btn btn-warning gap-x-1 w-full sm:w-auto" onClick={() => navigate(`/students/add-student`)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-receipt" viewBox="0 0 16 16">
                            <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z" />
                            <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
                        </svg>{' '}
                        Activate As Student
                    </button>
                </div>
            </div>
            <div className="pt-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-6 gap-5 mb-5">
                    {/* CONTACT INFO */}
                    <div className="panel xl:col-span-2 lg:row-start-1 xl:h-[480px] xl:relative">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Contact Info</h5>

                            <Tippy content="Update Contact Info">
                                <UpdateContactPopUp student={student} />
                            </Tippy>
                        </div>
                        <div className="mb-5 space-y-4  ">
                            <div>
                                <IconUser className="w-12 h-12 rounded-full object-cover  mb-5" />
                            </div>
                            <p className="font-bold ">
                                Name:{' '}
                                <span className="font-semibold text-primary">
                                    {student?.FName} {student?.LName}
                                </span>
                            </p>
                            <p className="font-bold ">
                                Address: <span className="font-normal"> {student?.Address}</span>
                            </p>
                            <p className="font-bold">
                                Email: <span className="text-primary truncate">{student?.Email}</span>
                            </p>
                            <p className="font-bold ">
                                Cell Phone:{' '}
                                <span className="whitespace-nowrap text-primary " dir="ltr">
                                    {convertPhoneNumber(student?.Phone)}
                                </span>
                            </p>
                            <p className="font-bold ">
                                Home Phone:{' '}
                                <span className="whitespace-nowrap text-primary" dir="ltr">
                                    {convertPhoneNumber(student?.Phone2) || 'N/A'}
                                </span>
                            </p>
                            <ul className="mt-7 flex items-center justify-center gap-2 xl:absolute xl:bottom-4 xl:left-0 xl:right-0 ">
                                <li>
                                    <SendQuickText student={student} />
                                </li>
                                <li>
                                    <SendQuickEmail student={student} />
                                </li>
                                <li>
                                    <Tippy content="Update Barcode">
                                        <Link to="/students/update-barcode" className="btn btn-warning flex items-center justify-center rounded-full w-10 h-10 p-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upc-scan" viewBox="0 0 16 16">
                                                <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z" />
                                            </svg>
                                        </Link>
                                    </Tippy>
                                </li>
                                <li>
                                    <Tippy content="Send Waiver">
                                        <Link to="/students/email-student" className="btn btn-success flex items-center justify-center rounded-full w-10 h-10 p-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-arrow-up" viewBox="0 0 16 16">
                                                <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z" />
                                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                                            </svg>
                                        </Link>
                                    </Tippy>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* ADDITIONAL INFO */}
                    <div className="panel xl:col-span-2 xl:h-[480px]">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Additional Info</h5>
                            <Tippy content="Update Additional Info">
                                <UpdateAdditionalPopUp student={student} />
                            </Tippy>
                        </div>
                        <div className="mb-5 space-y-4 ">
                            <p className="font-bold ">
                                Next Contact Date: <span className="font-normal">{formatDate(student?.NextContactDate)}</span>
                            </p>
                            <p className="font-bold ">
                                Original Contact Date: <span className="font-normal">{formatDate(student?.NextContactDate)}</span>
                            </p>
                            <p className="font-bold ">
                                Birthday: <span className="font-normal">{formatDate(student?.birthdate)}</span>
                            </p>
                            <p className="font-bold ">
                                Age: <span className="font-normal">{student?.Age}</span>
                            </p>
                            <p className="font-bold ">
                                Marketing Source: <span className="font-normal">{marketingSources?.find((source: any) => source?.MethodId === student?.ContactMethod)?.Name}</span>
                            </p>
                            <p className="font-bold ">
                                Intro Date: <span className="font-normal">{formatDate(student?.IntroDate)}</span>
                            </p>
                            <p className="font-bold ">
                                First Class Date: <span className="font-normal">{formatDate(student?.FirstClassDate)}</span>
                            </p>
                            <p className="font-bold ">
                                Cancelation Date: <span className="font-normal">{formatDate(student?.CancellationDate) || 'N/A'}</span>
                            </p>
                            <p className="font-bold ">
                                Current Barcode ID: <span className="font-normal">{barcode || 'N/A'}</span>
                            </p>
                            <p className="font-bold ">
                                Waiver: <span className="font-normal">None</span>
                            </p>
                            <p className="font-bold ">
                                Rank: <span className="font-normal">{rank || 'None'}</span>
                            </p>
                        </div>
                    </div>

                    {/* SCHEDULE */}
                    <div className="panel lg:col-span-1 xl:col-span-2 ">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Schedule and Classes</h5>
                        </div>
                        <div className="mb-5 space-y-4  ">
                            <div className="flex items-center">
                                <p className="font-bold ">Classes:</p>
                                <div className="ml-auto">
                                    <AddStudentToClass student={unHashTheID(uid)} alreadyIn={classes} updateClasses={updateClasses} setUpdateClasses={setUpdateClasses} isProspect={true} />
                                </div>
                            </div>
                            {classes?.map((classItem: any, index: any) => (
                                <div key={index} className="flex items-center justify-between">
                                    <h6 className="text-[#515365] font-semibold dark:text-white-dark">{classItem?.Name}</h6>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFromClass(classItem?.ClassId)}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {classes?.length === 0 && <div className="text-[#515365] dark:text-white-dark">None</div>}
                            <div className="flex items-center">
                                <p className="font-bold ">Programs:</p>
                                <div className="ml-auto">
                                    <AddStudentToProgram student={unHashTheID(uid)} alreadyIn={programs} updateClasses={updateClasses} setUpdateClasses={setUpdateClasses} isProspect={true} />
                                </div>
                            </div>
                            {programs?.map((programItem: any, index: any) => (
                                <div key={index} className="flex items-center justify-between">
                                    <h6 className="text-[#515365] font-semibold dark:text-white-dark">{programItem?.Name}</h6>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFromProgram(programItem?.ProgramId)}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {programs?.length === 0 && <div className="text-[#515365] dark:text-white-dark">None</div>}
                            <div className="flex items-center">
                                <p className="font-bold ">Waiting Lists:</p>
                                <div className="ml-auto">
                                    <AddStudentToWaitingList
                                        student={unHashTheID(uid)}
                                        alreadyIn={prospectWaitingLists}
                                        updateClasses={updateClasses}
                                        setUpdateClasses={setUpdateClasses}
                                        isProspect={true}
                                    />
                                </div>
                            </div>
                            {prospectWaitingLists?.map((listItem: any, index: any) => (
                                <div key={index} className="">
                                    <div key={index} className="flex items-center justify-between">
                                        <h6 className="text-[#515365] font-semibold dark:text-white-dark">
                                            {waitingLists?.find((list: any) => list?.WaitingListId === listItem?.WaitingListId)?.Title}
                                        </h6>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleRemoveFromList(listItem?.WaitingListId)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {prospectWaitingLists?.length === 0 && <div className="text-[#515365] dark:text-white-dark">None</div>}
                        </div>
                    </div>

                    {/* NOTES */}

                    <div className="col-span-full">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Notes</h5>
                            {updateNotes ? (
                                <button className="btn btn-primary ml-auto" onClick={() => handleSaveNotes()}>
                                    Save Notes
                                </button>
                            ) : (
                                <AddProspectNotesModal student={student} setStudent={setStudent} studenID={unHashTheID(uid)} />
                            )}
                        </div>

                        {updateNotes ? (
                            <div className="border border-[#ebedf2] bg-white rounded dark:bg-[#1b2e4b] dark:border-0 mt-4">
                                <div className="p-4">
                                    <textarea
                                        className="w-full border-0 focus:ring-0 focus:outline-none dark:bg-[#1b2e4b] dark:text-white-dark"
                                        rows={24}
                                        value={student?.Notes}
                                        onChange={(e) => setStudent({ ...student, Notes: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="border border-[#ebedf2] bg-white rounded dark:bg-[#1b2e4b] dark:border-0">
                                <div className="p-4">
                                    {student?.Notes?.split('\n').map((note: any, index: any) =>
                                        // Check if the line starts with '#'
                                        note.trim().startsWith('#') ? (
                                            <div key={index} className="text-[#515365] dark:text-white-dark mt-2 font-bold">
                                                {note}
                                            </div>
                                        ) : null
                                    )}
                                    {student?.Notes?.split('\n').map((note: any, index: any) =>
                                        // Check if the line starts with '#'
                                        note.trim().startsWith('*') ? (
                                            <div key={index} className="text-[#515365] dark:text-white-dark mt-2 font-bold">
                                                {note}
                                            </div>
                                        ) : null
                                    )}
                                    {/* Render other notes excluding the line starting with '#' */}
                                    {student?.Notes?.split('\n').map((note: any, index: any) =>
                                        !note.trim().startsWith('#') && !note.trim().startsWith('*') ? (
                                            <div key={index} className="text-[#515365] dark:text-white-dark mt-2">
                                                {note}
                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="flex">
                            {!updateNotes && (
                                <button className="text-danger ml-auto" onClick={() => handleUpdateNotes()}>
                                    Update All Notes
                                </button>
                            )}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProspect;
