import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'swiper/css';
import 'swiper/css/navigation';
import Select from 'react-select';
import 'swiper/css/pagination';
import IconPlus from '../../components/Icon/IconPlus';
import { addClassAndSchedule, addStaffIDSToClass, getTheClassScheduleByClassId, loadStudioRooms } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import IconEdit from '../../components/Icon/IconEdit';
import IconX from '../../components/Icon/IconX';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { showErrorMessage, showMessage } from '../../functions/shared';

export default function AddNewClass({ color }: any) {
    const { suid, setUpdate, update, classes, staff }: any = UserAuth();
    const [rooms, setRooms] = useState([]);
    const [startHour, setStartHour] = useState(0);
    const [startMinute, setStartMinute] = useState(0);
    const [endHour, setEndHour] = useState(0);
    const [endMinute, setEndMinute] = useState(0);
    const [startAMPM, setStartAMPM] = useState('AM');
    const [endAMPM, setEndAMPM] = useState('AM');
    const [modal21, setModal21] = useState(false);
    const setNewDateTo12PM = () => {
        const newDate = new Date();
        newDate.setHours(12, 0, 0, 0);
        return newDate;
    };
    const [staffs, setStaffs] = useState([]);


    const [classToAdd, setClassToAdd] = useState({
        studioId: suid || 1000,
        name: '',
        description: '',
        notes: '',
        enrollmentLimit: '',
        dayOfWeek: '',
        dayIndex: '',
        roomId: '',
        unformatedStart: '',
        unformatedEnd: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

    const getStudioRooms = async () => {
        try {
            const response = loadStudioRooms(suid);
            const data = await response;
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

    function formatDateForSQL(date: any) {
        return new Date(date);
    }

    const handleAddAClass = async () => {
        // Add your code here to add a class
        setIsLoading(true);

        if (classToAdd.name === '') {
            setIsLoading(false);
            showErrorMessage('Please enter a class name');
            return;
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
                const res = await addClassAndSchedule(classToAdd);
                if (res.status === 200) {
                    await addStaffIDSToClass(res.response, staffs);
                    setIsLoading(false);
                    setUpdate(!update);
                    setModal21(false);
                    setClassToAdd({
                        studioId: suid || 1000,
                        name: '',
                        description: '',
                        notes: '',
                        enrollmentLimit: '',
                        dayOfWeek: '',
                        dayIndex: '',
                        roomId: '',
                        unformatedStart: '',
                        unformatedEnd: '',
                    });
                    showMessage('Class has been saved successfully.');
                } else {
                    setIsLoading(false);
                    setUpdate(!update);
                    showErrorMessage('Error adding class');
                }
            } catch (error) {
                setIsLoading(false);
                setUpdate(!update);
                showErrorMessage('Error adding class');
            }
        }
    };

    return (
        <div>
            <button type="button" onClick={() => setModal21(true)} className={`btn ${color ? 'btn-primary' : 'btn-info'} gap-2 ltr:ml-auto rtl:mr-auto w-full`}>
                <IconPlus />
                Add Class
            </button>

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
                                        <h5 className="font-bold text-lg">Add a Class</h5>
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
                                                    value={classToAdd.enrollmentLimit}
                                                    className="form-input"
                                                    id="email"
                                                    autoComplete="off"
                                                     placeholder="Enrollment Limit"
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
                                                    onChange={(e: any) => {
                                                        const staffIds = e.map((st: any) => st.value);
                                                        setStaffs(staffIds);
                                                    }}
                                                    isMulti
                                                />
                                            </div>
                                            <div className="relative mb-4">
                                                <label htmlFor="time" className="text-sm text-gray-500 dark:text-gray-400">
                                                    Day of the Week
                                                </label>
                                                <select
                                                    className="form-select"
                                                    value={classToAdd.dayOfWeek}
                                                    onChange={(e: any) => setClassToAdd({ ...classToAdd, dayIndex: e.target.selectedIndex - 1, dayOfWeek: e.target.value })}
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

                                            <button type="button" className="btn btn-primary w-full" onClick={handleAddAClass} disabled={isLoading}>
                                                Add Class
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
