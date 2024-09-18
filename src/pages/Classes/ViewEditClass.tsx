import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'swiper/css';
import 'swiper/css/navigation';
import Select from 'react-select';
import 'swiper/css/pagination';
import IconPlus from '../../components/Icon/IconPlus';
import { addClassAndSchedule, getStaffByClassId, getTheClassScheduleByClassId, loadStudioRooms, updateClassAndSchedule } from '../../functions/api';
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
    const [classData, setClassData] = useState({});
    const [staffData, setStaffData] = useState([]);
    const [classSchedule, setClassSchedule] = useState([]);
    const [rooms, setRooms] = useState<Room[]>([]);
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

                setStaffData(staffObj);
            } else {
                setStaffData([]);
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
    }, []);

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
            const data =  response;
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

    const handleUpdateClass = () => {
        // Add your code here to add a class
        setIsLoading(true);
        console.log(classToAdd, 'classToAdd');
        updateClassAndSchedule(classToAdd).then((response) => {
            console.log(response, 'response');
            try {
                if (response.status === 200) {
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
        });
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
                                    <p className="text-sm text-gray-500 dark:text-gray-400 px-5">
                                        Classes are the main way to organize students. They can be organized by rank, age, or any other way you see fit. Students can belong to multiple classes, and
                                        classes can be used to filter reports and searches
                                    </p>
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
                                                <label htmlFor="time" className="text-sm text-gray-500 dark:text-gray-400">
                                                    Staff
                                                </label>
                                                <Select
                                                    placeholder="Select staff"
                                                    options={options}
                                                    value={staffData}
                                                    isMulti
                                                    onChange={(e: any) => {
                                                        setStaffData(e);
                                                    }}
                                                />
                                            </div>
                                            <div className="py-5 px-2 border mb-6">
                                                <h3 className="text-lg font-bold border-b mb-4 ">Current Schedule</h3>
                                                {classSchedule.map((d: any) => (
                                                    <div className="text-sm flex items-center gap-4 text-gray-500 dark:text-gray-400 font-bold py-1">
                                                        <span key={d.ClassScheduleId}>
                                                            {' '}
                                                            {d.DayOfWeek} {formatHoursFromDateTime(d.StartTime, handleGetTimeZoneOfUser())} -{' '}
                                                            {formatHoursFromDateTime(d.EndTime, handleGetTimeZoneOfUser())}
                                                        </span>{' '}
                                                        <span className="flex items-center gap-1 text-danger text-xs">
                                                            <IconTrashLines className="" /> Delete Schedule
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
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

                                            <div className="flex items-center">
                                                <div className="relative mb-4">
                                                    <label htmlFor="time" className="text-sm text-gray-500 dark:text-gray-400">
                                                        Start Time
                                                    </label>
                                                    <div className=" flex items-center gap-x-2">
                                                        <select
                                                            className="form-select"
                                                            onChange={(e) => {
                                                                setStartTime({ ...startTime, hours: e.target.value });
                                                            }}
                                                        >
                                                            <option value="">Select Time</option>
                                                            {Array.from({ length: 12 }, (_, i) => i).map((hour) => (
                                                                <option key={hour} value={hour + ':00:00'}>
                                                                    {hour}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            className="form-select"
                                                            onChange={(e) => {
                                                                setStartTime({ ...startTime, minutes: e.target.value });
                                                            }}
                                                        >
                                                            <option value="">Select Time</option>
                                                            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                                                <option key={minute} value={minute + ':00:00'}>
                                                                    {minute}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="relative mb-4">
                                                    <label htmlFor="time" className="text-sm text-gray-500 dark:text-gray-400">
                                                        End Time
                                                    </label>
                                                    <div className=" flex items-center gap-x-2">
                                                        <Flatpickr
                                                            options={{
                                                                noCalendar: true,
                                                                enableTime: true,
                                                                dateFormat: 'H:i',
                                                                position: 'auto right',
                                                            }}
                                                            value={classToAdd.endTime}
                                                            className="form-input"
                                                            onChange={(date4) => {
                                                                setClassToAdd({ ...classToAdd, endTime: new Date(date4[0]).toISOString() });
                                                            }}
                                                        />
                                                    </div>
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
                                                    {rooms.map((room) => (
                                                        <option key={room.RoomId} value={room.RoomId}>
                                                            {room.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="relative mb-4">
                                                <textarea
                                                    id="ctnTextarea"
                                                    rows={6}
                                                    value={classToAdd.description}
                                                    className="form-textarea"
                                                    placeholder="Description of the class..."
                                                    onChange={(e) => setClassToAdd({ ...classToAdd, description: e.target.value })}
                                                ></textarea>
                                            </div>
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
