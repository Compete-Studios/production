import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { UserAuth } from '../../context/AuthContext';
import { formatDate, showErrorMessage, showMessage } from '../../functions/shared';
import { addStaffMember } from '../../functions/api';


interface AddStaffProps {
    studioId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    birthdate: string;
    notes: string;
    classes: string[];
}

const staffInit = {
    studioId: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    birthdate: '',
    notes: '',
    classes: [],
};

const AddStaff = () => {
    const { classes, suid, update, setUpdate }: any = UserAuth();
    const dispatch = useDispatch();
    const [staff, setstaff] = useState<AddStaffProps>(staffInit);
    const [date1, setDate1] = useState<any>('2000-07-05');
    const [options, setOptions] = useState([{ value: 'class1', label: 'Class 1' }]);
    const [classValues, setClassValues] = useState<any>([]);


    const navigate = useNavigate();


    useEffect(() => {
        const newClassObj = classes.map((st: any) => {
            return { value: st.ClassId, label: st.Name };
        });
        setOptions(newClassObj);
    }, [classes]);

    useEffect(() => {
        dispatch(setPageTitle('Add Staff'));
    });

    const handleAddStaff = () => {
        console.log(staff);
        console.log(formatDate(date1));
        console.log(classValues);
        staff.studioId = suid;
        staff.classes = classValues.map((c: any) => c.value);
        staff.birthdate = formatDate(date1);
        console.log(staff);
        addStaffMember(staff).then((response) => {
            console.log(response);
            if (response.NewStaffId > 0) {
                showMessage('Staff Member Added Successfully');
                setUpdate(!update);
                navigate('/staff/view-staff');
            } else {
                showErrorMessage('Failed to add staff member');
            }
        });
    };

    return (
        <div className="flex xl:flex-row flex-col gap-2.5 max-w-5xl mx-auto">
            <div className="panel px-0 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                <h2 className="text-xl px-5 font-bold">Add Staff</h2>
                <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Staff Information</div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-first-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    First Name
                                </label>
                                <input
                                    id="reciever-first-name"
                                    type="text"
                                    name="reciever-first-name"
                                    className="form-input flex-1"
                                    placeholder="Enter First Name"
                                    onChange={(e) => setstaff({ ...staff, firstName: e.target.value })}
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-last-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Last Name
                                </label>
                                <input
                                    id="reciever-last-name"
                                    type="text"
                                    name="reciever-last-name"
                                    className="form-input flex-1"
                                    placeholder="Enter Last Name"
                                    onChange={(e) => setstaff({ ...staff, lastName: e.target.value })}
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-email" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Email
                                </label>
                                <input
                                    id="reciever-email"
                                    type="email"
                                    name="reciever-email"
                                    className="form-input flex-1"
                                    placeholder="Enter Email"
                                    onChange={(e) => setstaff({ ...staff, email: e.target.value })}
                                />
                            </div>

                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Phone Number
                                </label>
                                <input
                                    id="reciever-number"
                                    type="text"
                                    name="reciever-number"
                                    className="form-input flex-1"
                                    placeholder="Enter Phone number"
                                    onChange={(e) => setstaff({ ...staff, phone: e.target.value })}
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="city" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Birthday
                                </label>
                                <Flatpickr value={date1} options={{ dateFormat: 'm-d-Y', position: 'auto right' }} className="form-input flex-1" onChange={(date) => setDate1(date)} />
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <div className="text-lg">Address Information</div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-address" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Address
                                </label>
                                <input
                                    id="reciever-address"
                                    type="text"
                                    name="reciever-address"
                                    className="form-input flex-1"
                                    placeholder="Enter Address"
                                    onChange={(e) => setstaff({ ...staff, address: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="city" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    City
                                </label>
                                <input id="city" type="text" name="city" className="form-input flex-1" placeholder="City" onChange={(e) => setstaff({ ...staff, city: e.target.value })} />
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="state" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    State
                                </label>
                                <input id="state" type="text" name="state" className="form-input flex-1" placeholder="State" onChange={(e) => setstaff({ ...staff, state: e.target.value })} />
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="zip" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Zip Code
                                </label>
                                <input id="zip" type="text" name="zip" className="form-input flex-1" placeholder="Enter Zip Code" onChange={(e) => setstaff({ ...staff, zip: e.target.value })} />
                            </div>
                            <div className="flex items-center mt-4 relative">
                                <label htmlFor="zip" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Select Classes
                                </label>
                                <Select placeholder="" className="flex-1" options={options} onChange={(e) => setClassValues(e)} isMulti />
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <label htmlFor="notes">Notes</label>
                        <textarea id="notes" name="notes" className="form-textarea min-h-[130px]" placeholder="Notes...." onChange={(e) => setstaff({ ...staff, notes: e.target.value })}></textarea>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="flex justify-between sm:flex-row flex-col mt-6 px-4">
                        <div className="sm:mb-0 mb-6 ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => handleAddStaff()}>
                                Add Staff
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStaff;
