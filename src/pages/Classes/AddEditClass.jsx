import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'swiper/css';
import 'swiper/css/navigation';
import Select from 'react-select';
import 'swiper/css/pagination';
import IconPlus from '../../components/Icon/IconPlus';
import { addAClass, addClassAndSchedule, getTheClassScheduleByClassId, loadStudioRooms } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import IconEdit from '../../components/Icon/IconEdit';
import IconX from '../../components/Icon/IconX';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

export default function AddEditClass({ editClass = false, classId = null }) {
    const { suid, setUpdate, update, classes, staff } = UserAuth();
    const [modal21, setModal21] = useState(false);
    const setNewDateTo12PM = () => {
        const newDate = new Date();
        newDate.setHours(12, 0, 0, 0);
        return newDate;
    };
    const [classToAdd, setClassToAdd] = useState({
        studioId: suid || 1000,
        name: '',
        description: '',
        notes: '',
        enrollmentLimit: '',
        dayOfWeek: '',
        dayIndex: '',
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

    //edit class
    useEffect(() => {
        const classForEditing = classes.find((c) => c.ClassId === classId);
        if (classForEditing) {
            setClassToAdd({
                description: classForEditing.Description,
                name: classForEditing.Name,
                enrollmentLimit: classForEditing.EnrollmentLimit,
                notes: classForEditing.Notes,
                classId: classForEditing.ClassId,
            });
        }
    }, [classId, classes, modal21]);

    const [rooms, setRooms] = useState([]);

    const getTimeOnlyfromZulueStamp = (date) => {
        const timeString = date.split('T')[1];
        return timeString.slice(0, 5);
    };

    const getTheSchedule = async (cuid) => {
        getTheClassScheduleByClassId(cuid).then((response) => {
            setClassToAdd({
                ...classToAdd,
                dayOfWeek: response.DayOfWeek,
                dayIndex: response.DayIndex,
                startTime: getTimeOnlyfromZulueStamp(response.StartTime),
                endTime: getTimeOnlyfromZulueStamp(response.EndTime),
                roomId: response.RoomId,
            });
            console.log(response);
        });
    };

    const handleAddEditAClass = (cuid) => {
        // Add your code here to add a class
        getTheSchedule(cuid);

        setModal21(true);
    };

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
        const newStaffObj = staff.map((st) => {
            return { value: st.StaffId, label: st.Name };
        });
        setOptions(newStaffObj);
    }, [suid]);

    const handleEnrollmentLimit = (e) => {
        e.preventDefault();
        const enrollInt = parseInt(e.target.value);
        if (enrollInt > 0) {
            setClassToAdd({ ...classToAdd, enrollmentLimit: enrollInt });
        } else {
            setClassToAdd({ ...classToAdd, enrollmentLimit: 0 });
        }
    };

    const handleAddAClass = () => {
        // Add your code here to add a class
        setIsLoading(true);
        addClassAndSchedule(classToAdd).then((response) => {
            try {
                if (response.status === 200) {
                    setIsLoading(false);
                    setUpdate(!update);
                    setModal21(false);
                    showMessage('Class has been saved successfully.');
                } else {
                    console.error('Error adding class');
                    setIsLoading(false);
                    setUpdate(!update);
                    setModal21(false);
                    showErrorMessage('Error adding class');
                }
            } catch (error) {
                console.error('Error adding class');
                setIsLoading(false);
                setUpdate(!update);
                setModal21(false);
                showErrorMessage('Error adding class');
            }
        });
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast = Swal.mixin({
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

    return (
        <div>
            {editClass ? (
                <button className="flex text-primary hover:text-primary-light" onClick={() => handleAddEditAClass(classId)}>
                    <IconEdit className="w-4.5 h-4.5" />
                </button>
            ) : (
                <button type="button" onClick={() => setModal21(true)} className="btn btn-primary gap-2 ltr:ml-auto rtl:mr-auto">
                    <IconPlus />
                    Add Class
                </button>
            )}

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
                                                <Select placeholder="Select staff" options={options} isMulti />
                                            </div>
                                            <div className="relative mb-4">
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
                                                    <Flatpickr
                                                        options={{
                                                            noCalendar: true,
                                                            enableTime: true,
                                                            dateFormat: 'H:i',
                                                            position: 'auto right',
                                                        }}
                                                        value={classToAdd.startTime}
                                                        className="form-input"
                                                        onChange={(date4) => {
                                                            setClassToAdd({ ...classToAdd, startTime: new Date(date4).toISOString() });
                                                        }}
                                                    />
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
                                                            setClassToAdd({ ...classToAdd, endTime: new Date(date4).toISOString() });
                                                        }}
                                                    />
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
                                            {editClass ? (
                                                <button type="button" className="btn btn-primary w-full" onClick={() => setModal21(false)} disabled={isLoading}>
                                                    Update Class
                                                </button>
                                            ) : (
                                                <button type="button" className="btn btn-primary w-full" onClick={handleAddAClass} disabled={isLoading}>
                                                    Add Class
                                                </button>
                                            )}
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
