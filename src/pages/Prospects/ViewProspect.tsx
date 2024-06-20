import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';

import 'tippy.js/dist/tippy.css';
import { UserAuth } from '../../context/AuthContext';
import {
    dropProspectFromClass,
    dropProspectFromProgram,
    dropProspectFromWaitingList,
    getClassesByProspectId,
    getProgramsByProspectId,
    getProspectById,
    getWaitingListByProspectId,
    updateProspectByColumn,
    updateProspectNotes,
} from '../../functions/api';
import { showMessage, showWarningMessage } from '../../functions/shared';
import { formatDate } from '@fullcalendar/core';
import AddStudentToClass from '../Classes/AddStudentToClass';
import AddStudentToProgram from '../Classes/AddStudenToProgram';
import AddStudentToWaitingList from '../Classes/AddStudentToWaitingList';
import SendQuickText from '../Students/buttoncomponents/SendQuickText';
import SendQuickEmail from '../Students/buttoncomponents/SendQuickEmail';
import AddProspectNotesModal from './AddProspectNotesModal';

import IconEdit from '../../components/Icon/IconEdit';
import SendQuickWaiver from '../Students/buttoncomponents/SendQuickWaiver';
import IconInfoTriangle from '../../components/Icon/IconInfoTriangle';
import IconPlus from '../../components/Icon/IconPlus';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import Tippy from '@tippyjs/react';
import AddCardModal from '../Students/AddCardModal';
import AddBankModal from '../Students/AddBankModal';

interface UpdateValues {
    [key: string]: any;
}

const updateValuesInit = {
    fname: false,
    lname: false,
    email: false,
    phone: false,
    address: false,
    city: false,
    state: false,
    zip: false,
    entryDate: false,
    birthdate: false,
    contactMethod: false,
    firstClassDate: false,
    nextContactDate: false,
    parentName: false,
    currentPipelineStatus: false,
};

const ViewProspect = () => {
    const { studioOptions, setUpdate, update, suid, marketingSources, waitingLists, studioInfo, prospectPipelineSteps }: any = UserAuth();
    const [billingLoading, setBillingLoading] = useState<boolean>(true);
    const [updateClasses, setUpdateClasses] = useState<boolean>(false);
    const [toUpdate, setToUpdate] = useState<UpdateValues>(updateValuesInit);
    const [paymentsLoading, setPaymentsLoading] = useState<boolean>(true);
    const [student, setStudent] = useState<any>({});
    const [paySimpleInfo, setPaySimpleInfo] = useState<any>({});
    const [billingInfo, setBillingInfo] = useState<any>({});
    const [updateNotes, setUpdateNotes] = useState(false);
    const [barcode, setBarcode] = useState<any>(null);
    const [classes, setClasses] = useState<any>([]);
    const [programs, setPrograms] = useState<any>([]);
    const [prospectWaitingLists, setProspectWaitingLists] = useState<any>([]);
    const [displayedSource, setDisplayedSource] = useState<any>(null);
    const [rank, setRank] = useState<any>(null);
    const [hasCards, setHasCards] = useState<boolean>(false);
    const [paymentSchedules, setPaymentSchedules] = useState<any>([]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Prospect Profile'));
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
    };

    const handleSaveNotes = () => {
        const noteData = {
            prospectId: unHashTheID(uid),
            notes: student?.Notes,
        };
        console.log(noteData);
        updateProspectNotes(noteData);
        setUpdateNotes(false);
        showMessage('Notes Updated!');
    };

    const handleUpdateByColumn = async (column: string) => {
        const data = {
            prospectId: unHashTheID(uid),
            columnName: column,
            value: student[column],
        };
        try {
            const response = await updateProspectByColumn(data);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
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

    const getWaitingListsForStudent = async (studentID: any) => {
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

    const handleGoToPayments = () => {
        console.log('Go to payments');
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
        const marketingSourceTemp = marketingSources?.find((source: any) => source.MethodId === parseInt(student?.ContactMethod));
        setDisplayedSource(marketingSourceTemp?.Name);
    }, [student?.ContactMethod]);

    useEffect(() => {
        getClassesForStudent(unHashTheID(uid));
        getWaitingListsForStudent(unHashTheID(uid));
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

    useEffect(() => {
        if (!student) return;
        if (!suid) return;
        const hashedStudent = parseInt(student?.Student_id) * 548756 * parseInt(suid);
        setHasedRefID(hashedStudent);
    }, [student]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const prospect = {
        ...student,
        ProspectId: unHashTheID(uid),
    };

    const handleActivate = (e: any) => {
        e.preventDefault();
        navigate(`/prospects/activate/${uid}`);
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/prospects/prospect-pipeline" className="text-primary hover:underline">
                            Prospect Pipeline
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-primary hover:underline">
                        <Link to={`/prospects/view-prospects-in-pipeline/${student?.CurrentPipelineStatus}/${suid}`} className="text-primary hover:underline">
                            Pipeline Step
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>
                            {student?.FName} {student?.LName}
                        </span>
                    </li>
                </ul>
            </div>
            {new Date(student.NextContactDate) <= new Date() && (
                <div className="mt-4 relative flex items-center border p-3.5 rounded before:absolute before:top-1/2 ltr:before:left-0 rtl:before:right-0 rtl:before:rotate-180 before:-mt-2 before:border-l-8 before:border-t-8 before:border-b-8 before:border-t-transparent before:border-b-transparent before:border-l-inherit text-danger bg-danger-light !border-danger ltr:border-l-[64px] rtl:border-r-[64px] dark:bg-danger-dark-light">
                    <span className="absolute ltr:-left-11 rtl:-right-11 inset-y-0 text-white w-6 h-6 m-auto">
                        <IconInfoTriangle />
                    </span>
                    <span className="ltr:pr-2 rtl:pl-2">
                        <strong className="ltr:mr-1 rtl:ml-1">Time to Contact!</strong>This prospect is due for a follow-up.
                    </span>
                </div>
            )}

            <div className="grid md:grid-cols-12 grid-cols-1 gap-4 mt-4">
                {/* CONTACT INFO */}
                <div className="panel p-0 md:col-span-3 divide-y divide-y-zinc-600 ">
                    <div className="flex items-start justify-between mb-5 p-4">
                        <div>
                            <div className="font-semibold  text-2xl">
                                {student?.FName} {student?.LName}
                            </div>
                            <p className="font-normal text-md">{student?.Email}</p>
                            <p className="font-normal text-sm">{convertPhoneNumber(student?.Phone)}</p>
                            <p className="font-normal text-sm">{student?.Phone2}</p>

                            <p className="font-normal text-md mt-4 text-info">Prospect</p>
                            <p className="font-normal text-xs ">Next Contact Date: {formatDate(student?.NextContactDate)}</p>
                            <p className="font-normal text-xs ">Created: {formatDate(student?.EntryDate)}</p>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-zinc-500">Studio</div>
                        <div className="font-bold">{studioInfo?.Studio_Name}</div>
                    </div>
                    <div className="">
                        <button className="uppercase font-lg font-bold w-full hover:bg-yellow-100 p-4 text-left" onClick={(e: any) => handleActivate(e)}>
                            Activate As Student
                        </button>
                        <SendQuickEmail
                            pipeline={prospectPipelineSteps.find((step: any) => step.PipelineStepId === parseInt(student?.CurrentPipelineStatus))}
                            studioOptions={studioOptions}
                            setUpdate={setUpdate}
                            update={update}
                            student={student}
                            isProspect={true}
                            name="Prospect"
                        />
                        <SendQuickText student={student} name="Prospect" />
                        <SendQuickWaiver student={student} prospect={true} />
                        <button className="uppercase font-lg font-bold w-full hover:bg-yellow-100 p-4 text-left">Create a Billing Account</button>
                        <button className="uppercase font-lg font-bold w-full hover:bg-yellow-100 p-4 text-left">Clone Prospect</button>
                    </div>
                </div>
                <div className="md:col-span-9 sm:row-span-2">
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
                                        Prospect Details
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
                                            {!updateNotes && <AddProspectNotesModal student={student} setStudent={setStudent} studentID={unHashTheID(uid)} />}
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
                                            {toUpdate?.fName ? (
                                                <input type="text" className="form-input" value={student?.FName} onChange={(e) => setStudent({ ...student, FName: e.target.value })} />
                                            ) : (
                                                <p className={`font-normal ${!student?.FName && 'text-danger'}`}>{student?.FName ? student?.FName : 'No First Name Set'}</p>
                                            )}
                                            {toUpdate?.fName ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, fName: false });
                                                        handleUpdateByColumn('FName');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, fName: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold">Last Name:</p>
                                            {toUpdate?.lName ? (
                                                <input type="text" className="form-input" value={student?.LName} onChange={(e) => setStudent({ ...student, LName: e.target.value })} />
                                            ) : (
                                                <p className={`font-normal ${!student?.LName && 'text-danger'}`}>{student?.LName ? student?.LName : 'No Last Name Set'}</p>
                                            )}
                                            {toUpdate?.lName ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, lName: false });
                                                        handleUpdateByColumn('LName');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, lName: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold">Email:</p>
                                            {toUpdate?.email ? (
                                                <input type="text" className="form-input" value={student?.Email} onChange={(e) => setStudent({ ...student, Email: e.target.value })} />
                                            ) : (
                                                <p className={`font-normal ${!student?.Email && 'text-danger'}`}>{student?.Email ? student?.Email : 'No Email Set'}</p>
                                            )}
                                            {toUpdate?.email ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, email: false });
                                                        handleUpdateByColumn('Email');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, email: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold">Parent Name:</p>
                                            {toUpdate?.parentName ? (
                                                <input type="text" className="form-input" value={student?.ParentName} onChange={(e) => setStudent({ ...student, ParentName: e.target.value })} />
                                            ) : (
                                                <p className={`font-normal ${!student?.ParentName && 'text-danger'}`}>{student?.ParentName ? student?.ParentName : 'No Parent Name Set'}</p>
                                            )}

                                            {toUpdate?.parentName ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, parentName: false });
                                                        handleUpdateByColumn('ParentName');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, parentName: true })}>
                                                    <IconEdit className="w-4 h-4" />{' '}
                                                </button>
                                            )}

                                            <p className="font-bold">Address:</p>
                                            {toUpdate?.address ? (
                                                <input type="text" className="form-input" value={student?.Address} onChange={(e) => setStudent({ ...student, Address: e.target.value })} />
                                            ) : (
                                                <p className={`font-normal ${!student?.Address && 'text-danger'}`}>{student?.Address ? student?.Address : 'No Address Set'}</p>
                                            )}
                                            {toUpdate?.address ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, address: false });
                                                        handleUpdateByColumn('Address');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, address: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold">City:</p>
                                            {toUpdate?.city ? (
                                                <input type="text" className="form-input" value={student?.City} onChange={(e) => setStudent({ ...student, City: e.target.value })} />
                                            ) : (
                                                <p className={`font-normal ${!student?.City && 'text-danger'}`}>{student?.City ? student?.City : 'No City Set'}</p>
                                            )}
                                            {toUpdate?.city ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, city: false });
                                                        handleUpdateByColumn('City');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, city: true })}>
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
                                            {toUpdate?.introDate ? (
                                                <input type="date" className="form-input" value={student?.IntroDate} onChange={(e) => setStudent({ ...student, IntroDate: e.target.value })} />
                                            ) : (
                                                <p className={`font-normal ${!student?.IntroDate && 'text-danger'}`}>{student?.IntroDate ? formatDate(student?.IntroDate) : 'No Intro Date Set'}</p>
                                            )}
                                            {toUpdate?.introDate ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, introDate: false });
                                                        handleUpdateByColumn('IntroDate');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, introDate: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold ">Birthday:</p>
                                            {toUpdate?.birthdate ? (
                                                <input type="date" className="form-input" value={student?.birthdate} onChange={(e) => setStudent({ ...student, birthdate: e.target.value })} />
                                            ) : (
                                                <p className={`font-normal ${!student?.birthdate && 'text-danger'}`}>{student?.birthdate ? formatDate(student?.birthdate) : 'No Birthdate Set'}</p>
                                            )}
                                            {toUpdate?.birthdate ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, birthdate: false });
                                                        handleUpdateByColumn('birthdate');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, birthdate: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold ">Age:</p>
                                            {toUpdate?.age ? (
                                                <input type="text" className="form-input" value={student?.Age} onChange={(e) => setStudent({ ...student, Age: e.target.value })} />
                                            ) : (
                                                <p className={`font-normal ${!student?.Age && 'text-danger'}`}>{student?.Age ? student?.Age : 'No Age Set'}</p>
                                            )}
                                            {toUpdate?.age ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, age: false });
                                                        handleUpdateByColumn('Age');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, age: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold ">Marketing Source:</p>
                                            {toUpdate?.marketingSource ? (
                                                <select className="form-select" value={student?.ContactMethod} onChange={(e) => setStudent({ ...student, ContactMethod: e.target.value })}>
                                                    {marketingSources?.map((source: any, index: any) => (
                                                        <option key={index} value={source?.MethodId}>
                                                            {source?.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p className={`font-normal ${!student?.ContactMethod && 'text-danger'}`}>{displayedSource ?? 'No Marketing Source Set'}</p>
                                            )}
                                            {toUpdate?.marketingSource ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, marketingSource: false });
                                                        handleUpdateByColumn('ContactMethod');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, marketingSource: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <p className="font-bold ">First Class Date:</p>
                                            {toUpdate?.firstClassDate ? (
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
                                            {toUpdate?.firstClassDate ? (
                                                <button
                                                    className="ml-auto text-info hover:text-blue-900"
                                                    onClick={() => {
                                                        setToUpdate({ ...toUpdate, firstClassDate: false });
                                                        handleUpdateByColumn('FirstClassDate');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button className="ml-auto text-info hover:text-blue-900" onClick={() => setToUpdate({ ...toUpdate, firstClassDate: true })}>
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="active pt-5">
                                    <div className="grid grid-cols-2 panel">
                                        {prospectPipelineSteps.map((step: any) => {
                                            return (
                                                <label htmlFor={step.PipelineStepId} className="flex items-center cursor-pointer hover:bg-gray-100 p-1">
                                                    <input
                                                        type="radio"
                                                        name="pipeline"
                                                        className="form-radio"
                                                        value={student?.CurrentPipelineStatus}
                                                        checked={student?.CurrentPipelineStatus === step.PipelineStepId}
                                                        onChange={() => {
                                                            setStudent({ ...student, CurrentPipelineStatus: step.PipelineStepId });
                                                            setToUpdate({ ...toUpdate, currentPipelineStatus: true });
                                                        }}
                                                    />
                                                    <span>{step.StepName}</span>
                                                </label>
                                            );
                                        })}
                                        <div>
                                            <label htmlFor="completed" className="flex items-center cursor-pointer hover:bg-gray-100 p-1">
                                                <input
                                                    type="radio"
                                                    name="pipeline"
                                                    className="form-radio"
                                                    value={student?.CurrentPipelineStatus}
                                                    checked={student?.CurrentPipelineStatus === 0}
                                                    onChange={() => {
                                                        setStudent({ ...student, CurrentPipelineStatus: 0 });
                                                        setToUpdate({ ...toUpdate, currentPipelineStatus: true });
                                                    }}
                                                />
                                                <span>No Status/Ignore</span>
                                            </label>
                                        </div>
                                    </div>
                                    {toUpdate?.currentPipelineStatus && (
                                        <button
                                            className="mt-4 btn btn-primary "
                                            onClick={() => {
                                                setToUpdate({ ...toUpdate, currentPipelineStatus: false });
                                                handleUpdateByColumn('CurrentPipelineStatus');
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
                                        <div className="mb-5 ">
                                            <div className="flex items-center">
                                                <p className="font-bold ">Classes:</p>
                                                <div className="ml-auto">
                                                    <AddStudentToClass
                                                        student={unHashTheID(uid)}
                                                        alreadyIn={classes}
                                                        updateClasses={updateClasses}
                                                        setUpdateClasses={setUpdateClasses}
                                                        isProspect={true}
                                                    />
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
                                                    <AddStudentToProgram
                                                        student={unHashTheID(uid)}
                                                        alreadyIn={programs}
                                                        updateClasses={updateClasses}
                                                        setUpdateClasses={setUpdateClasses}
                                                        isProspect={true}
                                                    />
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
                                                    <div key={index} className={`hover:bg-zinc-100 py-4 px-2 flex items-center justify-between`}>
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
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </div>
    );
};

export default ViewProspect;
