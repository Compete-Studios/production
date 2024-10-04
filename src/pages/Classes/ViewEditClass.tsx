import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import Select from 'react-select';
import 'swiper/css/pagination';
import { addStaffIDSToClass, dropClassScheduleByScheduleId, getStaffByClassId, getTheClassScheduleByClassId, loadStudioRooms, updateClassAndSchedule, updateStaffIDStoClass } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import IconEdit from '../../components/Icon/IconEdit';
import IconX from '../../components/Icon/IconX';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { showErrorMessage, showMessage } from '../../functions/shared';
import { formatHoursFromDateTime, handleGetTimeZoneOfUser } from '../../functions/dates';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconNotesEdit from '../../components/Icon/IconNotesEdit';
import IconMinus from '../../components/Icon/IconMinus';
import IconPlus from '../../components/Icon/IconPlus';

interface Room {
    RoomId: number;
    Name: string;
}

interface Class {
    ClassId: number;
    Name: string;
    Description: string;
    EnrollmentLimit: number;
    Notes: string;
}

export default function ViewEditClass({ classId, nameOfClass }: any) {
    const { suid, setUpdate, update, classes, staff }: any = UserAuth();
    const [modal21, setModal21] = useState(false);
    const [editSchedule, setEditSchedule] = useState(false);
    const [classData, setClassData] = useState({});
    const [staffData, setStaffData] = useState([]);
    const [startHour, setStartHour] = useState(0);
    const [startMinute, setStartMinute] = useState(0);
    const [startAMPM, setStartAMPM] = useState('AM');
    const [endHour, setEndHour] = useState(0);
    const [endMinute, setEndMinute] = useState(0);
    const [endAMPM, setEndAMPM] = useState('AM');
    const [classSchedule, setClassSchedule] = useState([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [staffs, setStaffs] = useState<any>([]);
    const [startTime, setStartTime] = useState<any>({
        hours: 12,
        minutes: 0,
        amPm: 'AM',
    });
    const [endTime, setEndTime] = useState<any>({
        hours: 12,
        minutes: 0,
        amPm: 'AM',
    });

    const [classToAdd, setClassToAdd] = useState({
        studioId: suid || 1000,
        classId: classId,
        name: '',
        description: '',
        notes: '',
        enrollmentLimit: 100,
        dayOfWeek: '',
        dayIndex: 0,
        startTime: '',
        endTime: '',
        roomId: '',
        unformatedStart: '',
        unformatedEnd: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([
        { value: 'orange', label: 'Orange' },
        { value: 'white', label: 'White' },
        { value: 'purple', label: 'Purple' },
    ]);

    const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        setClassData(classes.find((d: any) => d.ClassId === parseInt(classId ?? '')));
    }, [classId, classes]);

    const handleGetClassStaff = async () => {
        try {
            const res = await getStaffByClassId(classId);
            if (res) {
                const staffObj = res.map((st: any) => {
                    return { value: st.StaffId[0], label: st?.LastName + ', ' + st?.FirstName };
                });
                const staffIds = res.map((st: any) => st.StaffId[0]);
                setStaffs(staffIds);
                setStaffData(staffObj);
            } else {
                setStaffData([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteSchedule = async (id: any, e: any) => {
        e.preventDefault();
        try {
            const res = await dropClassScheduleByScheduleId(id);
            if (res) {
                console.log(res);
                console.log('Schedule deleted');
                handleGetSchedule();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetSchedule = async () => {
        try {
            getTheClassScheduleByClassId(classId).then((response) => {
                setClassSchedule(response.recordset);
                console.log(response.recordset);
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (modal21) {
            handleGetClassStaff();
            handleGetSchedule();
        } else {
            setEditSchedule(false);
        }
    }, [modal21]);

    const handleEditSchedule = (e: any) => {
        e.preventDefault();
        setEditSchedule(!editSchedule);
    };

    //edit class
    useEffect(() => {
        const classForEditing = classes.find((c: any) => c.ClassId === classId);
        if (classForEditing) {
            setClassToAdd({
                ...classToAdd,
                name: classForEditing.Name,
                description: classForEditing.Description,
                enrollmentLimit: classForEditing.EnrollmentLimit,
                notes: classForEditing.Notes,
            });
        }
    }, [classId, classes, modal21]);

    const getTimeOnlyfromZulueStamp = (date: any) => {
        const timeString = date.split('T')[1];
        return timeString.slice(0, 5);
    };

    const getTheSchedule = async (cuid: any) => {
        getTheClassScheduleByClassId(cuid).then((response) => {
            setClassToAdd({
                ...classToAdd,
                dayOfWeek: response.DayOfWeek,
                dayIndex: response.DayIndex,
                startTime: getTimeOnlyfromZulueStamp(response.StartTime),
                endTime: getTimeOnlyfromZulueStamp(response.EndTime),
                roomId: response.RoomId,
            });
        });
    };

    const getStudioRooms = async () => {
        try {
            const response = await loadStudioRooms(suid);
            const data = response;
            setRooms(data.recordset);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStudioRooms();
    }, [suid]);

    useEffect(() => {
        setClassToAdd({ ...classToAdd, studioId: suid });
        const newStaffObj = staff.map((st: any) => {
            return { value: st.StaffId, label: st.Name };
        });
        setOptions(newStaffObj);
    }, [suid]);

    const handleEnrollmentLimit = (e: any) => {
        e.preventDefault();
        const enrollInt: any = parseInt(e.target.value);
        if (enrollInt > 0) {
            setClassToAdd({ ...classToAdd, enrollmentLimit: enrollInt });
        } else {
            setClassToAdd({ ...classToAdd, enrollmentLimit: 0 });
        }
    };

    //conver to 4 digit military time no date
    const handleConvertTime = (hour: number, minute: number, ampm: string): string => {
        let newHour = hour;

        // Convert hour to 24-hour format
        if (ampm === 'PM' && hour !== 12) {
            newHour += 12;
        } else if (ampm === 'AM' && hour === 12) {
            newHour = 0;
        }

        // Format hours and minutes to always have two digits
        const formattedHour = newHour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');

        // Combine into 4-digit military time
        return `${formattedHour}${formattedMinute}`;
    };

    useEffect(() => {
        if (startHour && startMinute && startAMPM) {
            const startTime = handleConvertTime(startHour, startMinute, startAMPM);
            console.log('startTime', startTime);
            setClassToAdd({ ...classToAdd, unformatedStart: startTime });
        }
    }, [startHour, startMinute, startAMPM]);

    useEffect(() => {
        if (endHour && endMinute && endAMPM) {
            const endTime = handleConvertTime(endHour, endMinute, endAMPM);
            setClassToAdd({ ...classToAdd, unformatedEnd: endTime });
        }
    }, [endHour, endMinute, endAMPM]);

    console.log(modal21 ? staffs : '');

    const handleUpdateClass = async () => {
        // Add your code here to add a class
        setIsLoading(true);

        const ammednedClassToAdd = {
            ...classToAdd,
            addedSchedule: editSchedule,
        };
        try {
            if (!editSchedule) {
                const response = await updateClassAndSchedule(ammednedClassToAdd);
                if (response.status === 200) {
                    await updateStaffIDStoClass(classId, staffs);
                    setIsLoading(false);
                    setUpdate(!update);
                    setModal21(false);
                    showMessage('Class has been saved successfully.');
                } else {
                    console.error('Error updating class');
                    setIsLoading(false);
                    setUpdate(!update);
                    setModal21(false);
                    showErrorMessage('Error updating class');
                }
            } else if (classToAdd.unformatedStart === '' && classToAdd.unformatedEnd !== '') {
                setIsLoading(false);
                showErrorMessage('Please enter a start time');
                return;
            } else if (classToAdd.unformatedEnd === '' && classToAdd.unformatedStart !== '') {
                setIsLoading(false);
                showErrorMessage('Please enter an end time');
                return;
            } else if (classToAdd.unformatedEnd === '' && classToAdd.unformatedStart === '') {
                setIsLoading(false);
                showErrorMessage('Please enter a start and end time');
                return;
            } else {
                try {
                    const response = await updateClassAndSchedule(ammednedClassToAdd);
                    if (response.status === 200) {
                        await updateStaffIDStoClass(classId, staffs);
                        setIsLoading(false);
                        setUpdate(!update);
                        setModal21(false);
                        showMessage('Class has been saved successfully.');
                    } else {
                        console.error('Error updating class');
                        setIsLoading(false);
                        setUpdate(!update);
                        setModal21(false);
                        showErrorMessage('Error updating class');
                    }
                } catch (error) {
                    console.error('Error UPDATING class');
                    setIsLoading(false);
                    setUpdate(!update);
                    setModal21(false);
                    showErrorMessage('Error updating class');
                }
            }
        } catch (error) {
            console.error('Error UPDATING class');
            setIsLoading(false);
            setUpdate(!update);
            setModal21(false);
            showErrorMessage('Error updating class');
        }
    };

    return (
        <div>
            <Tippy content="Edit Class">
                <button type="button" className="flex text-primary hover:text-emerald-600 gap-1" onClick={() => setModal21(true)}>
                    <IconEdit /> Edit
                </button>
            </Tippy>

            <Transition appear show={modal21} as={Fragment}>
                <Dialog
                    as="div"
                    open={modal21}
                    onClose={() => {
                        setModal21(false);
                    }}
                >
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="register_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-auto max-w-lg my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">
                                            Edit <span className="text-primary">{nameOfClass}</span>
                                        </h5>
                                        <button onClick={() => setModal21(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 px-5">Add more to your class schedule or edit the current schedule you have now.</p>
                                    <div className="p-5">
                                        <form>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Class Name"
                                                    value={classToAdd.name}
                                                    className="form-input"
                                                    id="name"
                                                    autoComplete="off"
                                                    onChange={(e) => setClassToAdd({ ...classToAdd, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Enrollment Limit"
                                                    value={classToAdd.enrollmentLimit}
                                                    className="form-input"
                                                    id="email"
                                                    autoComplete="off"
                                                    onChange={handleEnrollmentLimit}
                                                />
                                            </div>
                                            <div className="relative mb-4">
                                                <label className="text-sm text-gray-500 dark:text-gray-400">Description</label>
                                                <textarea
                                                    id="ctnTextarea"
                                                    rows={6}
                                                    value={classToAdd.description}
                                                    className="form-textarea"
                                                    placeholder="Description of the class..."
                                                    onChange={(e) => setClassToAdd({ ...classToAdd, description: e.target.value })}
                                                ></textarea>
                                            </div>
                                            <div className="relative mb-4">
                                                <label htmlFor="staff" className="text-sm text-gray-500 dark:text-gray-400">
                                                    Staff
                                                </label>
                                                <Select
                                                    placeholder="Select staff"
                                                    options={options}
                                                    value={staffData}
                                                    isMulti
                                                    onChange={(e: any) => {
                                                        const staffIds = e.map((st: any) => st.value);
                                                        setStaffs(staffIds);
                                                        const netStaffStaffData = e.map((st: any) => {
                                                            return { value: st.value, label: st.label };
                                                        });
                                                        setStaffData(netStaffStaffData);
                                                    }}
                                                />
                                            </div>
                                            <div className="py-5 px-2 border mb-2">
                                                <h3 className="text-lg font-bold border-b mb-4 ">Current Schedule</h3>
                                                {classSchedule?.map((d: any) => (
                                                    <div className="text-sm flex items-center gap-4 text-gray-500 dark:text-gray-400 font-bold py-1">
                                                        <span key={d.ClassScheduleId}>
                                                            {' '}
                                                            {d.DayOfWeek} {formatHoursFromDateTime(d.StartTime, handleGetTimeZoneOfUser())} -{' '}
                                                            {formatHoursFromDateTime(d.EndTime, handleGetTimeZoneOfUser())}
                                                        </span>{' '}
                                                        <button
                                                            className="ml-auto flex items-center gap-1 text-danger text-xs"
                                                            onClick={(e) => {
                                                                handleDeleteSchedule(d.ClassScheduleId, e);
                                                            }}
                                                        >
                                                            <IconTrashLines className="" /> Delete Schedule
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="button" className="mb-6 btn btn-sm btn-outline-info ml-auto" onClick={handleEditSchedule}>
                                                {editSchedule ? <IconMinus /> : <IconPlus />}
                                                {editSchedule ? 'Cancel Add' : 'Add Another Day to Schedule'}
                                            </button>
                                            {editSchedule && (
                                                <>
                                                    <h3 className="text-lg font-bold border-b mb-4 ">Add a Class Time</h3>
                                                    <div className="relative mb-4 mt-6">
                                                        <label htmlFor="time" className="text-sm text-gray-500 dark:text-gray-400">
                                                            Day of the Week
                                                        </label>
                                                        <select
                                                            className="form-select"
                                                            value={classToAdd.dayOfWeek}
                                                            onChange={(e) => setClassToAdd({ ...classToAdd, dayIndex: e.target.selectedIndex - 1, dayOfWeek: e.target.value })}
                                                        >
                                                            <option value="">Select Day</option>
                                                            {daysOfTheWeek.map((day, index) => (
                                                                <option key={index} value={day}>
                                                                    {day}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="relative mb-4">
                                                        <label htmlFor="time" className="text-sm text-gray-500 dark:text-gray-400">
                                                            Start Time
                                                        </label>
                                                        <div className=" flex items-center gap-x-2">
                                                            <select className="form-select" onChange={(e) => setStartHour(parseInt(e.target.value))}>
                                                                <option value="">Hour</option>
                                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
                                                                    <option key={hour} value={hour}>
                                                                        {hour}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <select className="form-select" onChange={(e) => setStartMinute(parseInt(e.target.value))}>
                                                                <option value="">Minute</option>
                                                                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => (
                                                                    <option key={minute} value={minute}>
                                                                        {minute.toString().padStart(2, '0')}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <select className="form-select" onChange={(e) => setStartAMPM(e.target.value)}>
                                                                <option value="AM">AM</option>
                                                                <option value="PM">PM</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="relative mb-4">
                                                        <label htmlFor="time" className="text-sm text-gray-500 dark:text-gray-400">
                                                            End Time
                                                        </label>
                                                        <div className=" flex items-center gap-x-2">
                                                            <select className="form-select" onChange={(e) => setEndHour(parseInt(e.target.value))}>
                                                                <option value="">Hour</option>
                                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
                                                                    <option key={hour} value={hour}>
                                                                        {hour}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <select className="form-select" onChange={(e) => setEndMinute(parseInt(e.target.value))}>
                                                                <option value="">Minute</option>
                                                                <option value="">Minute</option>
                                                                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => (
                                                                    <option key={minute} value={minute}>
                                                                        {minute.toString().padStart(2, '0')}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <select className="form-select" onChange={(e) => setEndAMPM(e.target.value)}>
                                                                <option value="AM">AM</option>
                                                                <option value="PM">PM</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="relative mb-4">
                                                        <label htmlFor="time" className="text-sm text-gray-500 dark:text-gray-400">
                                                            Room
                                                        </label>
                                                        <select
                                                            className="form-select"
                                                            onChange={(e) => {
                                                                setClassToAdd({ ...classToAdd, roomId: e.target.value });
                                                            }}
                                                        >
                                                            <option value="">Select Room</option>
                                                            {rooms?.map((room: any) => (
                                                                <option key={room.RoomId} value={room.RoomId}>
                                                                    {room.Name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </>
                                            )}

                                            <button type="button" className="btn btn-primary w-full" onClick={handleUpdateClass}>
                                                Update Class
                                            </button>
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
