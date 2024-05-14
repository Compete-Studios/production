import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Fragment, Suspense, useEffect, useState } from 'react';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconCalendar from '../../components/Icon/IconCalendar';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import { UserAuth } from '../../context/AuthContext';
import {
    dropStudentFromClass,
    dropStudentFromProgram,
    dropStudentFromWaitingList,
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
} from '../../functions/api';
import IconUser from '../../components/Icon/IconUser';
import AddNoteModal from './AddNoteModal';
import IconTrash from '../../components/Icon/IconTrash';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconPlus from '../../components/Icon/IconPlus';
import StudentsQuickPay from './StudentsQuickPay';
import { convertPhone, showMessage, showWarningMessage, unHashTheID } from '../../functions/shared';
import { formatDate } from '@fullcalendar/core';
import { getAllCustomerPaymentAccounts } from '../../functions/payments';
import UpdateContactPopUp from './UpdateContactPopUp';
import UpdateAdditionalPopUp from './UpdateAdditionalPopUp';
import AddCardModal from './AddCardModal';
import AddBankModal from './AddBankModal';
import AddStudentToClass from '../Classes/AddStudentToClass';
import AddStudentToProgram from '../Classes/AddStudenToProgram';
import AddStudentToWaitingList from '../Classes/AddStudentToWaitingList';
import SendQuickText from './buttoncomponents/SendQuickText';
import SendQuickEmail from './buttoncomponents/SendQuickEmail';
import ViewStudentActionItem from './ViewStudentActionItem';
import { Tab } from '@headlessui/react';
import SendQuickWaiver from './buttoncomponents/SendQuickWaiver';
import IconEdit from '../../components/Icon/IconEdit';
import IconEye from '../../components/Icon/IconEye';

interface UpdateValues {
    [key: string]: any;
}

const updateValuesInit = {
    First_Name: false,
    Last_Name: false,
    email: false,
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
    const [billingLoading, setBillingLoading] = useState<boolean>(true);
    const [updateClasses, setUpdateClasses] = useState<boolean>(false);
    const [paymentsLoading, setPaymentsLoading] = useState<boolean>(true);
    const [toUpdate, setToUpdate] = useState<UpdateValues>(updateValuesInit);
    const [update, setUpdate] = useState<boolean>(false);
    const [student, setStudent] = useState<any>({});
    const [paySimpleInfo, setPaySimpleInfo] = useState<any>({});
    const [billingInfo, setBillingInfo] = useState<any>({});
    const [updateNotes, setUpdateNotes] = useState(false);
    const [barcode, setBarcode] = useState<any>(null);
    const [displayedSource, setDisplayedSource] = useState<any>(null);
    const [classes, setClasses] = useState<any>([]);
    const [programs, setPrograms] = useState<any>([]);
    const [waitingLists, setWaitingLists] = useState<any>([]);
    const [rank, setRank] = useState<any>(null);
    const [hasCards, setHasCards] = useState<boolean>(false);
    const [paymentSchedules, setPaymentSchedules] = useState<any>([]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profile'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const { uid, studioid } = useParams<{ uid: string; studioid: any }>();

    const navigate = useNavigate();

    const handleGoToPayments = () => {
        const newID = parseInt(student?.Student_id) * parseInt(suid);
        navigate(`/students/${newID}/finish-billing-setup-options`);
    };

    const handleGoToPaymentSchedules = () => {
        const newID = parseInt(student?.Student_id) * parseInt(suid);
        navigate(`/students/${newID}/add-payment-schedules`);
    };

    const getPaySimpleInformation = async (studentID: any) => {
        try {
            const response = await getStudentBillingAccounts(studentID);
            if (response.recordset.length > 0) {
                setPaySimpleInfo(response.recordset[0].PaysimpleCustomerId);
                getAllCustomerPaymentAccounts(response.recordset[0]?.PaysimpleCustomerId, suid).then((response) => {
                    if (response?.Response?.CreditCardAccounts?.length > 0 || response?.Response?.AchAccounts?.length > 0) {
                        setHasCards(true);
                    } else {
                        setHasCards(false);
                    }
                });
            } else {
                setPaySimpleInfo(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const handleUpdateNotes = () => {
        setUpdateNotes(true);
    };

    const handleSaveNotes = () => {
        updateStudentNotes(student?.Student_id, student?.notes);
        setUpdateNotes(false);
        showMessage('Notes Updated!');
    };

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

    const getBillingInfo = async (paySimpleID: any, studioId: any) => {
        try {
            if (paySimpleID && suid) {
                const customerIdResponse = await getPaysimpleCustomerIdFromStudentId(paySimpleInfo, studioId);
                console.timeLog('customerIdResponse', customerIdResponse);
                if (customerIdResponse?.Response) {
                    setBillingInfo(customerIdResponse?.Response);
                    setBillingLoading(false);
                } else {
                    setBillingInfo(null);
                    setBillingLoading(false);
                }
            } else {
                setBillingInfo(null);
                setBillingLoading(false);
            }
        } catch {
            console.log('error');
            setBillingLoading(false);
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

    const getPaymentSchedules = async (paySimpleID: any, studioId: any) => {
        try {
            if (paySimpleID && suid) {
                const customerIdResponse = await getPaymentSchedulesForCustomer(paySimpleInfo, studioId);
                if (customerIdResponse?.Response) {
                    const schedules = customerIdResponse?.Response;
                    for (let i = 0; i < schedules.length; i++) {
                        getPaymentScheduleByID(schedules[i].Id, studioId).then((res) => {
                            setPaymentSchedules((prev: any) => {
                                return [...prev, res.Response];
                            });
                        });
                        if (i === schedules.length - 1) {
                            setPaymentsLoading(false);
                        }
                    }
                } else {
                    setPaymentSchedules([]);
                    setPaymentsLoading(false);
                }
            } else {
                setPaymentSchedules([]);
                setPaymentsLoading(false);
            }
        } catch {
            console.log('error');
            setPaymentsLoading(false);
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
            getPaySimpleInformation(studentID);
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

    useEffect(() => {
        getBillingInfo(paySimpleInfo, suid);
        getPaymentSchedules(paySimpleInfo, suid);
    }, [paySimpleInfo, suid]);

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

    const handleTest = () => {
        console.log('testing');
    };

    useEffect(() => {
        if (!student) return;
        if (!suid) return;
        const hashedStudent = parseInt(student?.Student_id) * 548756 * parseInt(suid);
        setHasedRefID(hashedStudent);
    }, [student]);

    console.log(student);

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/students/view-students" className="text-primary hover:underline">
                            Students
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>
                            {student?.First_Name} {student?.Last_Name}
                        </span>
                    </li>
                </ul>
            </div>
            <div className="grid md:grid-cols-12 grid-cols-1 gap-4 mt-4">
                {/* CONTACT INFO */}
                <div className="panel p-0 md:col-span-3 divide-y divide-y-zinc-600 ">
                    <div className="flex items-start justify-between mb-5 p-4">
                        <div>
                            <div className="font-semibold  text-2xl">
                                {student?.First_Name} {student?.Last_Name}
                            </div>
                            <p className="font-normal text-md">{student?.Email}</p>
                            <p className="font-normal text-sm">{convertPhoneNumber(student?.Phone)}</p>
                            <p className="font-normal text-sm">{student?.Phone2}</p>

                            <p className={`font-normal text-md mt-4 ${student?.activity ? 'text-success' : 'text-danger'}`}>{student?.activity ? 'Active' : 'Inactive'}</p>
                            <p className="font-normal text-xs ">Next Contact Date: {formatDate(student?.NextContactDate)}</p>
                            <p className="font-normal text-xs ">Created: {formatDate(student?.EntryDate)}</p>
                            <p className={`font-normal text-xs ${rank ? 'text-success' : 'text-danger'}`}>Rank: {rank ? rank : 'No rank set'}</p>
                            <p className={`font-normal text-xs ${barcode ? 'text-success' : 'text-danger'}`}>Barcode ID: {barcode ? barcode : 'No barcode set'}</p>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-zinc-500">Studio</div>
                        <div className="font-bold">{studioInfo?.Studio_Name}</div>
                        <div className="text-zinc-500 mt-2">Classes</div>
                        <div className="font-bold">{classes.length > 0 ? classes.map((c: any) => c.Name).join(', ') : 'No classes'}</div>
                    </div>
                    <div className="">
                        <StudentsQuickPay student={student} suid={suid} />
                        <button className="uppercase font-lg font-bold w-full hover:bg-success-light p-4 text-left" onClick={() => navigate(`/students/invoice/${hasedRefID}`)}>
                            Invoice
                        </button>
                        <SendQuickEmail student={student} name="Student" />
                        <SendQuickText student={student} name="Student"  />
                        <SendQuickWaiver student={student} prospect={false} />
                        <button className="uppercase font-lg font-bold w-full hover:bg-yellow-100 p-4 text-left">Create a Billing Account</button>
                        <button className="uppercase font-lg font-bold w-full hover:bg-yellow-100 p-4 text-left">Clone Student</button>
                        <button className="uppercase font-lg font-bold w-full hover:bg-danger-light p-4 text-left">Delete Student</button>
                    </div>
                </div>
                <div className="sm:col-span-9 md:row-span-2">
                    <Tab.Group>
                        <Tab.List className="flex flex-wrap">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? 'text-info !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-5 h-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 16 16">
                                            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
                                            <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5" />
                                        </svg>
                                        Notes
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
                                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                        </svg>
                                        Student Details
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
                                            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
                                        </svg>
                                        Pipeline Status
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
                                            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                        </svg>
                                        Classes
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
                                <div className="pt-5">
                                    {/* NOTES */}

                                    <div className="col-span-full">
                                        <div className="flex items-center justify-end gap-4 mb-5">
                                            <div className="flex">
                                                {!updateNotes && (
                                                    <button className="text-danger ml-auto" onClick={() => handleUpdateNotes()}>
                                                        Update All Notes
                                                    </button>
                                                )}
                                            </div>
                                            {!updateNotes && <AddNoteModal student={student} setStudent={setStudent} />}
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
                                            <div className="border border-[#ebedf2] bg-white rounded dark:bg-[#1b2e4b] dark:border-0 mt-4">
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
                                            <div className="border border-[#ebedf2] bg-white rounded dark:bg-[#1b2e4b] dark:border-0">
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
                                            </div>
                                        )}
                                        {updateNotes && (
                                            <button className=" mt-4 btn btn-primary ml-auto" onClick={() => handleSaveNotes()}>
                                                Save Notes
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="active pt-5">
                                    {/* ADDITIONAL INFO */}
                                    <div className="panel">
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
                                                <input
                                                    type="date"
                                                    className="form-input"
                                                    value={student?.NextContactDate}
                                                    onChange={(e) => setStudent({ ...student, NextContactDate: e.target.value })}
                                                />
                                            ) : (
                                                <p className={`font-normal ${!student?.NextContactDate && 'text-danger'}`}>
                                                    {student?.NextContactDate ? formatDate(student?.NextContactDate) : 'No Contact Date Set'}
                                                </p>
                                            )}
                                            {toUpdate?.nextContactDate ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, nextContactDate: false });
                                                        handleUpdateByColumn('NextContactDate');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, nextContactDate: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
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
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, IntroDate: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
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
                                                    Save
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
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, MarketingMethod: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold ">First Class Date:</p>
                                            {toUpdate?.FirstClassDate ? (
                                                <input
                                                    type="date"
                                                    className="form-input"
                                                    value={student?.FirstClassDate}
                                                    onChange={(e) => setStudent({ ...student, FirstClassDate: e.target.value })}
                                                />
                                            ) : (
                                                <p className={`font-normal ${!student?.FirstClassDate && 'text-danger'}`}>
                                                    {student?.FirstClassDate ? formatDate(student?.FirstClassDate) : 'No First Class Date Set'}
                                                </p>
                                            )}
                                            {toUpdate?.FirstClassDate ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, FirstClassDate: false });
                                                        handleUpdateByColumn('FirstClassDate');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, FirstClassDate: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="active pt-5">
                                    <div className="grid grid-cols-2">
                                        {pipelineSteps.map((step: any) => {
                                            return (
                                                <label htmlFor={step.PipelineStepId} className="flex items-center cursor-pointer hover:bg-gray-100 p-1">
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
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="pt-5">
                                    {/* SCHEDULE */}
                                    <div className="panel lg:col-span-1 xl:col-span-2 ">
                                        <div className="flex items-center justify-between mb-5">
                                            <h5 className="font-semibold text-lg dark:text-white-light">Schedule and Classes</h5>
                                        </div>
                                        <div className="mb-5 space-y-4  ">
                                            <div className="flex items-center">
                                                <p className="font-bold ">Classes:</p>
                                                <div className="ml-auto">
                                                    <AddStudentToClass student={student} alreadyIn={classes} updateClasses={updateClasses} setUpdateClasses={setUpdateClasses} />
                                                </div>
                                            </div>
                                            {classes?.map((classItem: any, index: any) => (
                                                <div key={index} className={`hover:bg-zinc-100 py-4 px-2 flex items-center justify-between `}>
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
                                                    <AddStudentToProgram student={student} alreadyIn={programs} updateClasses={updateClasses} setUpdateClasses={setUpdateClasses} />
                                                </div>
                                            </div>
                                            {programs?.map((programItem: any, index: any) => (
                                                <div key={index} className={`hover:bg-zinc-100 py-4 px-2 flex items-center justify-between `}>
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
                                                    <AddStudentToWaitingList student={student} alreadyIn={waitingLists} updateClasses={updateClasses} setUpdateClasses={setUpdateClasses} />
                                                </div>
                                            </div>
                                            {waitingLists?.map((listItem: any, index: any) => (
                                                <div key={index} className="">
                                                    <div key={index} className={`hover:bg-zinc-100 py-4 px-2 flex items-center justify-between `}>
                                                        <h6 className="text-[#515365] font-semibold dark:text-white-dark">{listItem?.Title}</h6>
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleRemoveFromList(listItem?.WaitingListId)}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {waitingLists?.length === 0 && <div className="text-[#515365] dark:text-white-dark">None</div>}
                                        </div>
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="pt-5 grid grid-cols-3 gap-4">
                                    {/* BILLING INFO */}
                                    <div>
                                        <div className="panel p-0">
                                            <div className="flex items-center justify-between p-5">
                                                <h5 className="font-semibold text-lg dark:text-white-light">Billing Info</h5>
                                                <Tippy content="Update Billing Info">
                                                    <Link to="/students/update-billing" className="ltr:ml-auto rtl:mr-auto text-info hover:text-blue-700 p-2 rounded-full">
                                                        <IconPencilPaper />
                                                    </Link>
                                                </Tippy>
                                            </div>
                                            {billingLoading ? (
                                                <div className="flex items-center justify-center h-56">
                                                    <span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>
                                                </div>
                                            ) : (
                                                <div>
                                                    {!billingInfo || Object?.keys(billingInfo)?.length === 0 ? (
                                                        <div className="flex items-center justify-center h-56">
                                                            <div className="text-center">
                                                                <div className="text-center text-gray-400">No billing information found</div>
                                                                <button type="button" className="btn btn-info mx-auto mt-4" onClick={() => handleGoToPayments()}>
                                                                    <IconPlus /> Add Billing Info
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="mb-5 space-y-4 p-5">
                                                                <p className="font-bold ">
                                                                    Billing Name:{' '}
                                                                    <span className="font-normal">
                                                                        {billingInfo?.FirstName} {billingInfo?.LastName}
                                                                    </span>
                                                                </p>
                                                                <p className="font-bold ">
                                                                    Phone: <span className="font-normal">{convertPhone(billingInfo?.Phone)}</span>
                                                                </p>
                                                                <p className="font-bold ">
                                                                    Email: <span className="font-normal">{billingInfo?.Email}</span>
                                                                </p>
                                                                <p className="font-bold ">
                                                                    Address: <span className="font-normal">{billingInfo?.BillingAddress?.StreetAddress1}</span>
                                                                </p>
                                                                <p className="font-bold ">
                                                                    City: <span className="font-normal">{billingInfo?.BillingAddress?.City}</span>
                                                                </p>
                                                                <p className="font-bold ">
                                                                    State: <span className="font-normal">{billingInfo?.BillingAddress?.StateCode}</span>
                                                                </p>
                                                                <p className="font-bold ">
                                                                    Zip: <span className="font-normal">{billingInfo?.BillingAddress?.ZipCode}</span>
                                                                </p>
                                                            </div>
                                                            <ul className="mt-7 ">
                                                                <li>
                                                                    <AddCardModal inStudent={true} />
                                                                </li>
                                                                <li>
                                                                    <AddBankModal inStudent={true} />
                                                                </li>
                                                            </ul>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* ACTIVE PAYMENT SCHEDULES */}
                                    <div className="col-span-2">
                                        {paymentsLoading ? (
                                            <div className="panel">
                                                <div className="flex items-center justify-center h-56">
                                                    <span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="panel ">
                                                <div className="mb-5">
                                                    <h5 className="font-semibold text-lg dark:text-white-light">Active Payment Schedules</h5>
                                                </div>

                                                {!hasCards ? (
                                                    <div className="flex items-center justify-center h-56">
                                                        <div className="text-center">
                                                            <div className="text-center text-gray-400">No billing information found</div>
                                                            <button type="button" className="btn btn-info mx-auto mt-4" onClick={() => handleGoToPayments()}>
                                                                Add Billing Account First
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="table-responsive mb-5 pb-4">
                                                            <table>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Amount</th>
                                                                        <th>First Payment Date</th>
                                                                        <th>End Date</th>
                                                                        <th>Status</th>
                                                                        <th className="text-center">View/Edit</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {paymentSchedules.map((data: any, index: any) => {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td className="font-bold">${parseInt(data?.PaymentAmount)?.toFixed(2)}</td>
                                                                                <td>
                                                                                    <div className="whitespace-nowrap">{formatDate(data?.CreatedOn)}</div>
                                                                                </td>
                                                                                <td>{formatDate(data?.EndDate)}</td>
                                                                                <td>
                                                                                    <span
                                                                                        className={`badge whitespace-nowrap ${
                                                                                            data.ScheduleStatus === 'Active' ? 'badge-outline-primary' : 'badge-outline-danger'
                                                                                        }`}
                                                                                    >
                                                                                        {data.ScheduleStatus}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="text-center">
                                                                                    <button>
                                                                                        <IconEye />
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                            <div className="flex mt-4 items-center justify-end"></div>
                                                        </div>

                                                        <div className="">
                                                            {paymentSchedules?.length < 1 ? (
                                                                <div className="text-right">
                                                                    <button className="btn btn-primary btn-sm w-full" onClick={handleGoToPaymentSchedules}>
                                                                        <IconPlus /> Add Payment Schedule
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-4">
                                                                    <div className="flex">
                                                                        <button
                                                                            className="ml-auto gap-x-1 text-primary hover:text-emerald-800 justify-end items-center"
                                                                            onClick={() => navigate('/students/view-active-payment-schedules')}
                                                                        >
                                                                            View All Schedules
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <button className="btn btn-info gap-x-1 w-full" onClick={handleGoToPaymentSchedules}>
                                                                            <IconDollarSignCircle /> Create a new Payment Schedule
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <Link to="/students/view-payment-history" className="btn btn-danger btn-sm gap-x-2">
                                                                            <IconCalendar /> View Payment History
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </div>
    );
};

export default ViewStudent;
