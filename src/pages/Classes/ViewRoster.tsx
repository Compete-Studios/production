import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import Hashids from 'hashids';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconSearch from '../../components/Icon/IconSearch';
import IconUser from '../../components/Icon/IconUser';
import IconX from '../../components/Icon/IconX';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { dropProspectFromClass, dropStudentFromClass, getProspectsByClassId, getStaffByClassId, getStudentsByClassId, getTheClassScheduleByClassId } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import IconSend from '../../components/Icon/IconSend';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconMessage from '../../components/Icon/IconMessage';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import { convertPhone, hashTheID, showWarningMessage } from '../../functions/shared';
import { formatHoursFromDateTime, handleGetTimeZoneOfUser } from '../../functions/dates';
import Tippy from '@tippyjs/react';
import SendBulkText from '../Marketing/SendBulkText';
import EmailClassModal from '../Marketing/EmailClassModal';
import AddStudentProspectToClass from './AddStudentProspectToClass';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconEye from '../../components/Icon/IconEye';
import { REACT_BASE_URL } from '../../constants';
import BulkPay from '../Payments/BulkPay';
import AddStaffToClass from './AddStaffToClass';

const ViewRoster = () => {
    const { suid, classes, staff }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('View Roster'));
    });
    const hashids = new Hashids();

    const [studentRoster, setStudentRoster] = useState<any>([]);
    const [prospectRoster, setProspectRoster] = useState<any>([]);
    const [classData, setClassData] = useState<any>([]);
    const [classStaff, setClassStaff] = useState<any>([]);
    const [classSchedule, setClassSchedule] = useState<any>([{}]);
    const [value, setValue] = useState<any>('list');
    const [hashedID, setHashedID] = useState<any>('');
    const [bulkRecipientsForText, setBulkRecipientsForText] = useState([]);
    const [updatedClasses, setUpdatedClasses] = useState(false);

    const navigate = useNavigate();

    const [defaultParams] = useState({
        id: null,
        name: '',
        email: '',
        phone: '',
        role: '',
        location: '',
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [search, setSearch] = useState<any>('');

    const { classId, uid } = useParams<any>();


    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    useEffect(() => {
        setClassData(classes.find((d: any) => d.ClassId === parseInt(classId ?? '')));
    }, [classId, classes]);

    useEffect(() => {
        if (classId) {
            console.log(classId);
            setHashedID(hashids.encode(classId));
        }
    }, [classId]);

    const handleGetClassStaff = async () => {
        try {
            const res = await getStaffByClassId(classId);
            if (res) {
                const activeStaff = staff.filter((d: any) => res.map((d: any) => d.StaffId[0]).includes(d.StaffId));
                setClassStaff(activeStaff);
            } else {
                setClassStaff([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetSchedule = async () => {
        try {
            getTheClassScheduleByClassId(classId).then((response) => {
                setClassSchedule(response.recordset);
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetClassStaff();
        handleGetSchedule();
    }, [classId, updatedClasses]);

    useEffect(() => {
        try {
            if (suid.toString() === uid) {
                getStudentsByClassId(classId).then((res) => {
                    setStudentRoster(res);
                });
                getProspectsByClassId(classId).then((res) => {
                    setProspectRoster(res);
                });
            } else {
                setStudentRoster([]);
            }
        } catch (error) {
            console.error(error);
        }
    }, [classId, suid, uid, updatedClasses]);

    const [filteredItems, setFilteredItems] = useState<any>(studentRoster);
    const [filteredProspects, setFilteredProspects] = useState<any>(prospectRoster);

    useEffect(() => {
        setFilteredItems(() => {
            return studentRoster?.filter((item: any) => {
                return item.Name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, studentRoster]);

    useEffect(() => {
        setFilteredProspects(() => {
            return prospectRoster?.filter((item: any) => {
                return item.Name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, prospectRoster]);

    const editUser = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
    };

    const handleHashAndGo = (id: any) => {
        navigate(`/staff/edit-staff-member/${hashids.encode(id, suid)}`);
    };

    const handleDeleteFromClass = (uid: any) => {
        showWarningMessage('Are you sure you want to remove this student from this class?', 'Remove Student From Class', 'Your student has been removed from the class')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    // User confirmed the action
                    dropStudentFromClass(uid, classId).then((response) => {
                        if (response) {
                            setUpdatedClasses(!updatedClasses);
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

    const handleDeleteProspectFromClass = (uid: any) => {
        showWarningMessage('Are you sure you want to remove this student from the class?', 'Remove Student From Class', 'Your student has been removed from the class')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    // User confirmed the action
                    dropProspectFromClass(uid, classId).then((response) => {
                        if (response) {
                            setUpdatedClasses(!updatedClasses);
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

    //set an array of phone numbers to send bulk text each number should be an object of {phoneNumber: '1234567890', name: 'John Doe', type: 'student'}
    const handleSetBulk = (staffNumbers: any, studentNumbers: any, prospectNumbers: any) => {
        let bulkRecipients: any = [];
        staffNumbers.map((d: any) => {
            bulkRecipients.push({ phoneNumber: d.Phone, name: d.Name, type: 'staff', email: d.email });
        });
        studentNumbers.map((d: any) => {
            bulkRecipients.push({ phoneNumber: d.Phone, name: d.Name, type: 'student', email: d.email });
        });
        prospectNumbers.map((d: any) => {
            bulkRecipients.push({ phoneNumber: d.Phone, name: d.Name, type: 'prospect', email: d.email });
        });
        setBulkRecipientsForText(bulkRecipients);
    };

    useEffect(() => {
        handleSetBulk(classStaff, studentRoster, prospectRoster);
    }, [classStaff, studentRoster, prospectRoster]);

    const handlePrintRoster = (students: any, prospects: any) => {
        const htmlData = tableHTML(students, prospects);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(htmlData);
            printWindow.document.close();
            printWindow.focus(); // Ensure the new window is focused
            printWindow.print();
        }
    };

    const tableHTML = (students: any, prospects: any) => {
        const htmlForEmail = `<!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Roster</title>
        </head>
        <body style="margin:0px; background: #f8f8f8; ">
            <div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;">
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Phone</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Email</th>
                            <th style="border: 1px solid #ddd; padding: 8px; width: 300px;">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students
                            .map((d: any) => {
                                return `<tr>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.Name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.Phone}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.email}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 300px;"></td>
                            </tr>`;
                            })
                            .join('')}
                        ${prospects
                            .map((d: any) => {
                                return `<tr>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.Name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.Phone}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.email}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 300px;"></td>
                            </tr>`;
                            })
                            .join('')}
                    </tbody>
                </table>
            </div>
            <div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px">
                <p>
                    Powered by CompeteStudio.pro <br>
                    <a href="${REACT_BASE_URL}" style="color: #b2b2b5; text-decoration: underline;">Visit Us</a>
                </p>
            </div>
        </body>
        </html>`;
        return htmlForEmail;
    };
  
    return (
        <>
            {' '}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/classes/view-classes" className="text-primary hover:underline">
                        View Classes
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{classData?.Name}</span>
                </li>
            </ul>
            <div>
                <div className="flex items-center justify-between flex-wrap gap-4 mt-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold">Roster for {classData?.Name}</h2>
                            <div>
                                <div className="flex sm:flex-row flex-col sm:items-center justify-end sm:gap-3 gap-4 w-full sm:w-auto">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search Roster"
                                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                            <IconSearch className="mx-auto" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500dark:text-gray-400 mb-4 gap-1">
                            <span className="flex items-center gap-2">
                                Instructors: <AddStaffToClass classData={classData} updatedClasses={updatedClasses} setUpdatedClasses={setUpdatedClasses} />
                            </span>
                            <div className="">
                                {classStaff?.length > 0 ? (
                                    classStaff?.map((d: any, index: any) => (
                                        <button className="block" key={index} onClick={(e: any) => handleHashAndGo(d.StaffId)}>
                                            <span className="font-bold text-secondary hover:text-info">
                                                {d.FirstName} {d.LastName}
                                                {classStaff?.length > 1 && ','}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="font-bold text-danger flex items-center gap-1"> No Assigned Instructor</div>
                                )}
                            </div>
                        </div>
                        {classSchedule.map((d: any) => (
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-bold" key={d.ClassScheduleId}>
                                <span>
                                    {' '}
                                    {d.DayOfWeek} {formatHoursFromDateTime(d.StartTime, handleGetTimeZoneOfUser())} - {formatHoursFromDateTime(d.EndTime, handleGetTimeZoneOfUser())}
                                </span>
                            </div>
                        ))}
                        <div className="sm:flex space-y-4 sm:space-y-0 items-center gap-2 mt-4">
                            <AddStudentProspectToClass classID={classId} studentRoster={studentRoster} student={true} updatedClasses={updatedClasses} setUpdatedClasses={setUpdatedClasses} />
                            <AddStudentProspectToClass classID={classId} studentRoster={prospectRoster} student={false} updatedClasses={updatedClasses} setUpdatedClasses={setUpdatedClasses} />
                            <button type="button" className="btn btn-warning gap-2 w-full whitespace-nowrap" onClick={() => handlePrintRoster(studentRoster, prospectRoster)}>
                                <IconPrinter />
                                Print Roster
                            </button>

                            {/* <Link to={`/marketing/create-news-letter/${hashedID}/class`} type="button" className="btn btn-info gap-2 w-full whitespace-nowrap">
                                <IconSend />
                                Email Class
                            </Link> */}
                            <div>
                                <EmailClassModal classuid={classId} recipients={bulkRecipientsForText} type={'classType'} />
                            </div>
                            <div className="w-full">
                                <SendBulkText isButton={true} recipients={bulkRecipientsForText} displayAll={false} />
                            </div>

                            <BulkPay students={studentRoster} prospects={prospectRoster} />
                        </div>
                    </div>

                    {/* <div className="flex sm:flex-row flex-col sm:items-center justify-end sm:gap-3 gap-4 w-full sm:w-auto mt-3">
                       
                    </div> */}
                </div>

                <div className="lg:flex items-start mt-4 gap-4">
                    <div className="grow panel p-0">
                        <div className="panel p-0 border-0 overflow-hidden">
                            <div className="table-responsive">
                                <table className="table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th className="">Name</th>
                                            <th className="hidden lg:table-cell">Phone</th>
                                            <th className="hidden sm:table-cell">Email</th>

                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t border-gray-200">
                                            <th scope="colgroup" colSpan={5} className="bg-dark py-4 pl-4 pr-3 text-left text-xl font-semibold text-white sm:pl-3">
                                                Students
                                            </th>
                                        </tr>
                                        {filteredItems?.map((contact: any) => {
                                            return (
                                                <tr key={contact.Student_ID}>
                                                    <td className="max-w-[200px]">
                                                        <div>{contact.Name}</div>
                                                    </td>
                                                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{convertPhone(contact.Phone)}</td>
                                                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{contact.email}</td>

                                                    <td>
                                                        <div className="flex gap-4 items-center justify-end">
                                                            <Link
                                                                to={`/students/view-student/${hashTheID(contact.Student_ID)}/${hashTheID(suid)}`}
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary gap-1"
                                                                onClick={() => editUser(contact)}
                                                            >
                                                                <IconEye /> View
                                                            </Link>
                                                            <button type="button" className="btn btn-sm btn-outline-danger gap-1" onClick={() => handleDeleteFromClass(contact.Student_ID)}>
                                                                <IconTrashLines /> Remove
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="border-t border-gray-200">
                                            <th scope="colgroup" colSpan={5} className="bg-dark py-4 pl-4 pr-3 text-left text-xl font-semibold text-white sm:pl-3">
                                                Prospects
                                            </th>
                                        </tr>
                                        {filteredProspects?.map((contact: any) => {
                                            return (
                                                <tr key={contact.ProspectId}>
                                                    <td className="max-w-[200px]">
                                                        <div>{contact.Name}</div>
                                                    </td>
                                                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{convertPhone(contact.Phone)}</td>
                                                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{contact.email}</td>
                                                    <td>
                                                        <div className="flex gap-4 items-center justify-end">
                                                            <Link
                                                                to={`/prospects/view-prospect/${hashTheID(contact.ProspectId)}/${hashTheID(suid)}`}
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary gap-1"
                                                                onClick={() => editUser(contact)}
                                                            >
                                                                <IconEye /> View
                                                            </Link>
                                                            <button type="button" className="btn btn-sm btn-outline-danger gap-1" onClick={() => handleDeleteProspectFromClass(contact.ProspectId)}>
                                                                <IconTrashLines /> Remove
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* <div className="panel space-y-3 hidden xl:block xl:sticky xl:top-20 flex-none">
                        <button type="button" className="btn btn-warning gap-2 w-44">
                            <IconPrinter />
                            Print Roster
                        </button>
                        <Link to={`/marketing/create-news-letter/${hashedID}/class`} type="button" className="btn btn-info gap-2 w-44">
                            <IconSend />
                            Email Class
                        </Link>
                        <SendBulkText isButton={true} recipients={bulkRecipientsForText} displayAll={false} />

                        <button className="btn btn-success gap-2 w-44">
                            <IconDollarSignCircle />
                            Bulk Pay
                        </button>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default ViewRoster;
