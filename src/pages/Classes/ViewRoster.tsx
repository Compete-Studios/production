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
import { Link, useParams } from 'react-router-dom';
import { getProspectsByClassId, getStaffByClassId, getStudentsByClassId, getTheClassScheduleByClassId } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import IconSend from '../../components/Icon/IconSend';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconMessage from '../../components/Icon/IconMessage';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import { hashTheID } from '../../functions/shared';
import { formatHoursFromDateTime, handleGetTimeZoneOfUser } from '../../functions/dates';
import Tippy from '@tippyjs/react';
import SendBulkText from '../Marketing/SendBulkText';
import EmailClassModal from '../Marketing/EmailClassModal';

const ViewRoster = () => {
    const { suid, classes, staff }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('View Roster'));
    });
    const hashids = new Hashids();
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [studentRoster, setStudentRoster] = useState<any>([]);
    const [prospectRoster, setProspectRoster] = useState<any>([]);
    const [classData, setClassData] = useState<any>([]);
    const [classStaff, setClassStaff] = useState<any>([]);
    const [classSchedule, setClassSchedule] = useState<any>([{}]);
    const [value, setValue] = useState<any>('list');
    const [hashedID, setHashedID] = useState<any>('');
    const [bulkRecipientsForText, setBulkRecipientsForText] = useState([]);

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
    }, [classId]);

    useEffect(() => {
        try {
            if (suid === uid) {
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
    }, [classId, suid, uid]);

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

    const saveUser = () => {
        if (!params.Name) {
            showMessage('Name is required.', 'error');
            return true;
        }
        if (!params.email) {
            showMessage('Email is required.', 'error');
            return true;
        }
        if (!params.Phone) {
            showMessage('Phone is required.', 'error');
            return true;
        }

        if (params.Student_ID) {
            //update user
            let user: any = filteredItems.find((d: any) => d.id === params.id);
            user.name = params.Name;
            user.email = params.email;
            user.phone = params.Phone;
        } else {
            //add user
            let maxUserId = filteredItems.length ? filteredItems.reduce((max: any, character: any) => (character.id > max ? character.id : max), filteredItems[0].id) : 0;

            let user = {
                Student_ID: maxUserId + 1,
                Name: params.Name,
                email: params.email,
                Phone: params.Phone,
            };
            filteredItems.splice(0, 0, user);
            //   searchContacts();
        }

        showMessage('User has been saved successfully.');
        setAddContactModal(false);
    };

    const editUser = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const deleteUser = (user: any = null) => {
        setFilteredItems(filteredItems.filter((d: any) => d.id !== user.Student_ID));
        showMessage('User has been deleted successfully.');
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

    console.log('bulkRecipientsForText', bulkRecipientsForText);

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
                        <div className='flex items-center gap-4'>
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
                            Instructors:
                            <div className="flex flex-wrap">
                                {classStaff?.length > 0 ? (
                                    classStaff?.map((d: any, index: any) => (
                                        <div className="block">
                                            <span key={index} className="font-bold text-info">
                                                {d.FirstName} {d.LastName}
                                                {classStaff?.length > 1 && ','}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="font-bold text-danger flex items-center gap-1">
                                        {' '}
                                        No Assigned Instructor
                                        <Tippy content="Assign Instructor">
                                            <button>
                                                <IconUserPlus className="ltr:mr-2 rtl:ml-2 text-info" />
                                            </button>
                                        </Tippy>
                                    </div>
                                )}
                            </div>
                        </div>
                        {classSchedule.map((d: any) => (
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-bold">
                                <span key={d.ClassScheduleId}>
                                    {' '}
                                    {d.DayOfWeek} {formatHoursFromDateTime(d.StartTime, handleGetTimeZoneOfUser())} - {formatHoursFromDateTime(d.EndTime, handleGetTimeZoneOfUser())}
                                </span>
                            </div>
                        ))}
                        <div className="sm:flex space-y-4 sm:space-y-0 items-center gap-2 mt-4">
                            <button type="button" className="btn btn-primary gap-2 w-full whitespace-nowrap" onClick={() => editUser()}>
                                <IconUserPlus />
                                Add Student
                            </button>

                            <button type="button" className="btn btn-dark gap-2 w-full whitespace-nowrap" onClick={() => editUser()}>
                                <IconUserPlus />
                                Add Prospect
                            </button>
                            <button type="button" className="btn btn-warning gap-2 w-full whitespace-nowrap">
                                <IconPrinter />
                                Print Roster
                            </button>
                            {/* <Link to={`/marketing/create-news-letter/${hashedID}/class`} type="button" className="btn btn-info gap-2 w-full whitespace-nowrap">
                                <IconSend />
                                Email Class
                            </Link> */}
                            <div>
                                <EmailClassModal classuid={classId} recipients={bulkRecipientsForText}  type={"classType"} />
                            </div>
                            <div className='w-full'>
                                <SendBulkText isButton={true} recipients={bulkRecipientsForText} displayAll={false} />
                            </div>

                            <button className="btn btn-success gap-2 w-full whitespace-nowrap">
                                <IconDollarSignCircle />
                                Bulk Pay
                            </button>
                        </div>
                    </div>

                    {/* <div className="flex sm:flex-row flex-col sm:items-center justify-end sm:gap-3 gap-4 w-full sm:w-auto mt-3">
                       
                    </div> */}
                </div>

                <div className="lg:flex items-start mt-4 gap-4">
                    <div className="grow">
                        <div className="flex items-center justify-between flex-wrap gap-4 p-5">
                            <h2 className="text-xl">Students Enrolled</h2>
                        </div>
                        <div className="panel p-0 border-0 overflow-hidden">
                            <div className="table-responsive">
                                <table className="table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th className="">Name</th>
                                            <th className="hidden lg:table-cell">Phone</th>
                                            <th className="hidden sm:table-cell">Email</th>

                                            <th className="!text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredItems?.map((contact: any) => {
                                            return (
                                                <tr key={contact.Student_ID}>
                                                    <td className="max-w-[200px]">
                                                        <div>{contact.Name}</div>
                                                    </td>
                                                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{contact.Phone}</td>
                                                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{contact.email}</td>

                                                    <td>
                                                        <div className="flex gap-4 items-center justify-center">
                                                            <Link
                                                                to={`/students/view-student/${hashTheID(contact.Student_ID)}/${hashTheID(suid)}`}
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => editUser(contact)}
                                                            >
                                                                Info
                                                            </Link>
                                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(contact)}>
                                                                Remove
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
                        <div className="mt-12">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <h2 className="text-xl">Prospects Enrolled</h2>
                            </div>
                            {value === 'list' && (
                                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                                    <div className="table-responsive">
                                        <table className="table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Student Name</th>
                                                    <th>Phone</th>
                                                    <th>Email</th>

                                                    <th className="!text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredProspects?.map((contact: any) => {
                                                    return (
                                                        <tr key={contact.ProspectId}>
                                                            <td>
                                                                <div className="flex items-center w-max">
                                                                    <div>{contact.Name}</div>
                                                                </div>
                                                            </td>
                                                            <td className="whitespace-nowrap">{contact.Phone}</td>
                                                            <td className="whitespace-nowrap">{contact.email}</td>
                                                            <td>
                                                                <div className="flex gap-4 items-center justify-center">
                                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(contact)}>
                                                                        Info
                                                                    </button>
                                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(contact)}>
                                                                        Remove
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
                            )}

                            <Transition appear show={addContactModal} as={Fragment}>
                                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
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
                                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                                    <button
                                                        type="button"
                                                        onClick={() => setAddContactModal(false)}
                                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                                    >
                                                        <IconX />
                                                    </button>
                                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                                        {params.id ? 'Edit Contact' : 'Add Contact'}
                                                    </div>
                                                    <div className="p-5">
                                                        <form>
                                                            <div className="mb-5">
                                                                <label htmlFor="name">Name</label>
                                                                <input id="name" type="text" placeholder="Enter Name" className="form-input" value={params.name} onChange={(e) => changeValue(e)} />
                                                            </div>
                                                            <div className="mb-5">
                                                                <label htmlFor="email">Email</label>
                                                                <input id="email" type="email" placeholder="Enter Email" className="form-input" value={params.email} onChange={(e) => changeValue(e)} />
                                                            </div>
                                                            <div className="mb-5">
                                                                <label htmlFor="number">Phone Number</label>
                                                                <input
                                                                    id="phone"
                                                                    type="text"
                                                                    placeholder="Enter Phone Number"
                                                                    className="form-input"
                                                                    value={params.phone}
                                                                    onChange={(e) => changeValue(e)}
                                                                />
                                                            </div>
                                                            <div className="mb-5">
                                                                <label htmlFor="occupation">Occupation</label>
                                                                <input
                                                                    id="role"
                                                                    type="text"
                                                                    placeholder="Enter Occupation"
                                                                    className="form-input"
                                                                    value={params.role}
                                                                    onChange={(e) => changeValue(e)}
                                                                />
                                                            </div>
                                                            <div className="mb-5">
                                                                <label htmlFor="address">Address</label>
                                                                <textarea
                                                                    id="location"
                                                                    rows={3}
                                                                    placeholder="Enter Address"
                                                                    className="form-textarea resize-none min-h-[130px]"
                                                                    value={params.location}
                                                                    onChange={(e) => changeValue(e)}
                                                                ></textarea>
                                                            </div>
                                                            <div className="flex justify-end items-center mt-8">
                                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                                    Cancel
                                                                </button>
                                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveUser}>
                                                                    {params.id ? 'Update' : 'Add'}
                                                                </button>
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
