import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Swal from 'sweetalert2';
import { addNewStudio, updateStudioOptions } from '../../functions/api';
import { Link, useNavigate } from 'react-router-dom';
import { constFormateDateMMDDYYYY, formatDate } from '../../functions/shared';
import { co, s } from '@fullcalendar/core/internal-common';

const studioInfoInit = {
    studio_Name: '',
    contact_Name: '',
    contact_Number: '',  //phone
    contact_Email: '',
    contact_Address: '',
    contact_City: '',
    contact_State: '',
    contact_Zip: '',
    method_of_Contact: '',
    is_Activated: '',
    desired_UserName: '',
    desired_Pswd: '',  
    salt: '',  
    paysimpleCustomerId: '',  
    role: '',  
};


const alertsInit = {
    studio_Name: false,
    contact_Email: false,
    contact_Name: false,
    contact_Number: false,
    desired_UserName: false,
    desored_Pswd: false,
};

export default function AddStudio() {
    //const { waitingLists, pipelineSteps, programs, classes, marketingSources, suid }: any = UserAuth();
    const [alerts, setAlerts] = useState(alertsInit);
    const [studioInfo, setstudioInfo] = useState(studioInfoInit);
    

    // These will probably need to be hard-coded, they are not taken from user input. Things like email/text limit, student enrollment limit, etc.  First set them, then use the route StudioAccess/updateStudioOptions to enter them into our DB.
    const [studioOptions, setStudioOptions] = useState([]); 

    const navigate = useNavigate();

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

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddStudio = async (e: any) => {
        e.preventDefault();
        if (studioInfo?.contact_Name === '') {
            showErrorMessage('A contact full name is required');
            setAlerts({ ...alerts, contact_Name: true });
            scrollTop();
            return;
        } else if (studioInfo?.contact_Email === '') {
            showErrorMessage('Email is required');
            setAlerts({ ...alerts, contact_Email: true });
            scrollTop();
            return;
        } else if (studioInfo?.contact_Number === '') {
            showErrorMessage('Phone is required');
            setAlerts({ ...alerts, contact_Number: true });
            scrollTop();
            return;
        } 
        else {
            addNewStudio(studioInfo).then((res) => {
                console.log(res, 'new studio');
                showMessage('studio has been added successfully');
                const newID = parseInt(res.NewStudioId);
                navigate(`/studios/add-billing-account/${newID}`);
            });
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/admin/studios" className="text-primary hover:underline">
                        Studios
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Add studio</span>
                </li>
            </ul>
            <div className="panel bg-gray-100 max-w-5xl mx-auto mt-4">
                <div className="mb-5">
                    <h5 className="font-semibold text-lg mb-4">Studio Info</h5>
                    <p>Use this option to add a new studio to the system. </p>
                </div>
                <div className="mb-5">
                    <form>
                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-2" onClick={() => setAlerts({ ...alerts, contact_Name: false })}>
                                <label htmlFor="first">Studio Name</label>
                                <input
                                    id="studioName"
                                    type="text"
                                    className={`form-input ${alerts.studio_Name && 'border-danger bg-red-50'} `}
                                    onChange={(e) => setstudioInfo({ ...studioInfo, studio_Name: e.target.value })}
                                />
                                <p className="text-danger text-xs ml-1">{alerts.contact_Name && 'A contact name is required'}</p>
                            </div>
                            <div className="sm:col-span-2" onClick={() => setAlerts({ ...alerts, contact_Name: false })}>
                                <label htmlFor="first">Contact Name</label>
                                <input
                                    id="first"
                                    type="text"
                                    className={`form-input ${alerts.contact_Name && 'border-danger bg-red-50'} `}
                                    onChange={(e) => setstudioInfo({ ...studioInfo, contact_Name: e.target.value })}
                                />
                                <p className="text-danger text-xs ml-1">{alerts.contact_Name && 'A contact name is required'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone">Phone</label>
                                <input id="phone" type="text" className="form-input" onChange={(e) => setstudioInfo({ ...studioInfo, contact_Number: e.target.value })} />
                            </div>
                            <div className="sm:col-span-2" onClick={() => setAlerts({ ...alerts, contact_Email: false })}>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="text"
                                    className={`form-input ${alerts.contact_Email && 'border-danger bg-red-50'} `}
                                    onChange={(e) => setstudioInfo({ ...studioInfo, contact_Email: e.target.value })}
                                />
                                <p className="text-danger text-xs ml-1">{alerts.contact_Email && 'Email is required'}</p>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="address">Address</label>
                                <input id="address" type="text" className="form-input" onChange={(e) => setstudioInfo({ ...studioInfo, contact_Address: e.target.value })} />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="city">City</label>
                                <input id="city" type="text" placeholder="City" className="form-input" onChange={(e) => setstudioInfo({ ...studioInfo, contact_City: e.target.value })} />
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="state">State</label>
                                <input id="state" type="text" placeholder="State" className="form-input" onChange={(e) => setstudioInfo({ ...studioInfo, contact_State: e.target.value })} />
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="zip">Zip</label>
                                <input id="zip" type="text" placeholder="Zip" className="form-input" onChange={(e) => setstudioInfo({ ...studioInfo, contact_Zip: e.target.value })} />
                            </div>
                        </div>
                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-2" onClick={() => setAlerts({ ...alerts, contact_Name: false })}>
                                <label htmlFor="first">Username</label>
                                <input
                                    id="studioName"
                                    type="text"
                                    className={`form-input ${alerts.desired_UserName && 'border-danger bg-red-50'} `}
                                    onChange={(e) => setstudioInfo({ ...studioInfo, desired_UserName: e.target.value })}
                                />
                                <p className="text-danger text-xs ml-1">{alerts.desired_UserName && 'A contact name is required'}</p>
                            </div>
                            <div className="sm:col-span-2" onClick={() => setAlerts({ ...alerts, contact_Name: false })}>
                                <label htmlFor="first">Password</label>
                                <input
                                    id="first"
                                    type="text"
                                    className={`form-input ${alerts.desored_Pswd && 'border-danger bg-red-50'} `}
                                    onChange={(e) => setstudioInfo({ ...studioInfo, desired_Pswd: e.target.value })}
                                />
                                <p className="text-danger text-xs ml-1">{alerts.contact_Name && 'A contact name is required'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone">Retype Password</label>
                                <input id="phone" type="text" className="form-input" onChange={(e) => setstudioInfo({ ...studioInfo, desired_Pswd: e.target.value })} />
                            </div>
                           
                        </div>
                    </form>
                </div>
            </div>
            <div className="panel bg-gray-100 max-w-5xl mx-auto mt-4">
                <div className="mb-5">
                    <h5 className="font-semibold text-lg mb-4">Billing Acccount Info</h5>
                </div>
                <div className="mb-5">
                    {/* <form className="p-5">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="text-right">
                                <Link to={`/payments/${id}/${suid}/billing-accounts`} className="text-info hover:text-blue-800 ">
                                    Use an existing billing account
                                </Link>
                                <button className="block text-secondary" onClick={autoFill}>
                                    Click here if its the same as the student's info
                                </button>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-6 gap-4">
                            <div className="form-group lg:col-span-3">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" className="form-input" name="firstName" value={billingInfo.firstName} onChange={handleInputChange} />
                            </div>
                            <div className="form-group lg:col-span-3">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" className="form-input" name="lastName" value={billingInfo.lastName} onChange={handleInputChange} />
                            </div>
                            <div className="form-group lg:col-span-4">
                                <label htmlFor="address">Address</label>
                                <input type="text" id="address" className="form-input" name="streetAddress1" value={billingInfo.streetAddress1} onChange={handleInputChange} />
                            </div>
                            <div className="form-group lg:col-span-2">
                                <label htmlFor="address2">Address 2</label>
                                <input type="text" id="address2" className="form-input" name="streetAddress2" value={billingInfo.streetAddress2} onChange={handleInputChange} />
                            </div>
                            <div className="form-group lg:col-span-3">
                                <label htmlFor="city">City</label>
                                <input type="text" id="city" className="form-input" name="city" value={billingInfo.city} onChange={handleInputChange} />
                            </div>
                            <div className="form-group lg:col-span-2">
                                <label htmlFor="state">State</label>
                                <input type="text" id="state" className="form-input" name="stateCode" value={billingInfo.stateCode} onChange={handleInputChange} />
                            </div>
                            <div className="form-group lg:col-span-1">
                                <label htmlFor="zip">Zip</label>
                                <input type="text" id="zip" className="form-input" name="zipCode" value={billingInfo.zipCode} onChange={handleInputChange} />
                            </div>
                            <div className="form-group lg:col-span-3">
                                <label htmlFor="phone">Phone</label>
                                <input type="text" id="phone" className="form-input" name="phone" value={billingInfo.phone} onChange={handleInputChange} />
                            </div>
                            <div className="form-group lg:col-span-3">
                                <label htmlFor="email">Email</label>
                                <input type="text" id="email" className="form-input" name="email" value={billingInfo.email} onChange={handleInputChange} />
                            </div>
                            <div className="form-group lg:col-span-full flex">
                                <button type="submit" className="btn btn-primary ml-auto" onClick={addAccount}>
                                    Add Billing Account
                                </button>
                            </div>
                            <div className="lg:col-span-full mt-4">
                                <p className="text-center">Once you've created this billing account you'll be able to attach a payment card or bank account to it.</p>
                            </div>
                        </div>
                    </form> */}
                </div>
            </div>
        </div>
    );
}
