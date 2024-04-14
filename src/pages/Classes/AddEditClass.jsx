import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'swiper/css';
import 'swiper/css/navigation';
import Select from 'react-select';
import 'swiper/css/pagination';
import IconPlus from '../../components/Icon/IconPlus';
import { addAClass } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import IconEdit from '../../components/Icon/IconEdit';
import IconX from '../../components/Icon/IconX';

const classDataInit = {
    studioId: 1000,
    name: '',
    description: '',
    notes: '',
    enrollmentLimit: '',
};

export default function AddEditClass({ editClass = false, classId = null }) {
    const { suid, setUpdate, update, classes, staff } = UserAuth();
    const [modal21, setModal21] = useState(false);
    const [classToAdd, setClassToAdd] = useState(classDataInit);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([
        { value: 'orange', label: 'Orange' },
        { value: 'white', label: 'White' },
        { value: 'purple', label: 'Purple' },
    ]);
    const [days, setDays] = useState([
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' },
    ]);
    const [hours, setHours] = useState([
        { value: '12', label: '12' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '8', label: '8' },
        { value: '9', label: '9' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
    ]);
    const [minutes, setMinutes] = useState([
        { value: '00', label: '00' },
        { value: '15', label: '15' },
        { value: '30', label: '30' },
        { value: '45', label: '45' },
    ]);
    const [ampm, setAmPm] = useState([
        { value: 'am', label: 'AM' },
        { value: 'pm', label: 'PM' },
    ]);

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
        // getTheClassScheduleByClassId(idValue).then((response) => {
        //   console.log(response);
        // });
    }, [classId, classes, modal21]);

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

        addAClass(classToAdd).then((response) => {
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
                <button className="flex hover:text-info" onClick={() => setModal21(true)}>
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
                                <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-auto max-w-md my-8 text-black dark:text-white-dark">
                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                    <h5 className="font-bold text-lg">Add a Class {classId}</h5>
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
                                                <Select placeholder="Select staff" options={options} isMulti />
                                            </div>
                                            <div className="relative mb-4">
                                                <Select defaultValue={days[0]} options={days} isSearchable={false} />
                                            </div>
                                            <div className="relative mb-4">
                                                <label htmlFor="time" className="text-sm text-gray-500 dark:text-gray-400">
                                                    Start Time
                                                </label>
                                                <div className=" flex items-center gap-x-2">
                                                    <Select className="w-full" defaultValue={hours[1]} options={hours} isSearchable={false} />
                                                    <Select className="w-full" defaultValue={minutes[0]} options={minutes} isSearchable={false} />
                                                    <Select className="w-full" defaultValue={ampm[0]} options={ampm} isSearchable={false} />
                                                </div>
                                            </div>
                                            <div className="relative mb-4">
                                                <label htmlFor="time" className="text-sm text-gray-500 dark:text-gray-400">
                                                    End Time
                                                </label>
                                                <div className=" flex items-center gap-x-2">
                                                    <Select className="w-full" defaultValue={hours[1]} options={hours} isSearchable={false} />
                                                    <Select className="w-full" defaultValue={minutes[0]} options={minutes} isSearchable={false} />
                                                    <Select className="w-full" defaultValue={ampm[0]} options={ampm} isSearchable={false} />
                                                </div>
                                            </div>
                                            <div className="relative mb-4">
                                                <label htmlFor="time" className="text-sm text-gray-500 dark:text-gray-400">
                                                    Room
                                                </label>
                                                <Select defaultValue={days[0]} options={days} isSearchable={false} />
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
