import React, { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { updateStudioInDB } from '../../functions/api';
import { showMessage } from '../../functions/shared';
import { Link } from 'react-router-dom';
import StudioProfilePic from './StudioProfilePic';

export default function Profile() {
    const { studioInfo, suid, setStudioInfo, studioOptions }: any = UserAuth();
    const [loading, setLoading] = useState(false);

    const [contact_Name, setContact_Name] = useState('');
    const [studio_Name, setStudio_Name] = useState('');
    const [contact_Number, setContact_Number] = useState('');
    const [contact_Email, setContact_Email] = useState('');
    const [contact_Address, setContact_Address] = useState('');
    const [contact_City, setContact_City] = useState('');
    const [contact_State, setContact_State] = useState('');
    const [contact_Zip, setContact_Zip] = useState('');

    useEffect(() => {
        if (!studioInfo) {
            return;
        } else {
            setStudio_Name(studioInfo?.Studio_Name);
            setContact_Number(studioInfo?.Contact_Number);
            setContact_Email(studioInfo?.Contact_Email);
            setContact_Name(studioInfo?.Contact_Name);
            setContact_Address(studioInfo?.Contact_Address);
            setContact_City(studioInfo?.Contact_City);
            setContact_State(studioInfo?.Contact_State);
            setContact_Zip(studioInfo?.Contact_Zip);
        }
    }, [studioInfo]);

    const userDataforFB = {
        Studio_Name: studio_Name,
        Contact_Name: contact_Name,
        Contact_Number: contact_Number,
        Contact_Email: contact_Email,
        Contact_Address: contact_Address,
        Contact_City: contact_City,
        Contact_State: contact_State,
        Contact_Zip: contact_Zip,
    };

    const handleUpdateStudio = (e: any) => {
        e.preventDefault();
        const userDataforDB = {
            studio_Name,
            contact_Name,
            contact_Number,
            contact_Email,
            contact_Address,
            contact_City,
            contact_State,
            contact_Zip,
            notes: 'test',
        };
        setLoading(true);
        // updateStudio(suid, userDataforFB);
        updateStudioInDB(suid, userDataforDB);
        showMessage('Successfully updated!');
    };

    console.log(studioOptions, 'studioInfo');

    return (
        <>
            <div className="max-w-xl mx-auto panel p-0">
                <div className="sm:flex-auto border-b">
                    <div>
                        <StudioProfilePic />
                    </div>
                </div>
                <div className="pt-6 grid sm:grid-cols-4 grid-cols-1 sm:gap-2 p-4 bg-zinc-100">
                    <div className="sm:col-span-4">
                        <label htmlFor="studio-name" className="block text-xs font-medium text-gray-900">
                            Studio Name
                        </label>
                        <input
                            type="text"
                            name="studio-name"
                            id="studio-name"
                            value={studio_Name}
                            className="form-input"
                            placeholder="Studio Name"
                            onChange={(e) => {
                                setStudio_Name(e.target.value);
                                setStudioInfo({ ...studioInfo, Studio_Name: e.target.value });
                            }}
                        />
                    </div>
                    <div className="mt-2 sm:col-span-4">
                        <label htmlFor="first-name" className="block text-xs font-medium text-gray-900">
                            Contact Name
                        </label>
                        <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            value={contact_Name}
                            className="form-input"
                            placeholder="First Name"
                            onChange={(e) => {
                                setContact_Name(e.target.value);
                                setStudioInfo({ ...studioInfo, Contact_Name: e.target.value });
                            }}
                        />
                    </div>
                    <div className="mt-2 sm:col-span-4">
                        <label htmlFor="phone" className="block text-xs font-medium text-gray-900">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={contact_Number}
                            className="form-input"
                            placeholder="Phone Number"
                            onChange={(e) => {
                                setContact_Number(e.target.value);
                                setStudioInfo({ ...studioInfo, Contact_Number: e.target.value });
                            }}
                        />
                    </div>
                    <div className="mt-2 sm:col-span-4">
                        <label htmlFor="address" className="block text-xs font-medium text-gray-900">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={contact_Address}
                            className="form-input"
                            placeholder="Address"
                            onChange={(e) => {
                                setContact_Address(e.target.value);
                                setStudioInfo({ ...studioInfo, Contact_Address: e.target.value });
                            }}
                        />
                    </div>
                    <div className="mt-2 sm:col-span-2">
                        <label htmlFor="city" className="block text-xs font-medium text-gray-900">
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            id="city"
                            value={contact_City}
                            className="form-input"
                            placeholder="City"
                            onChange={(e) => {
                                setContact_City(e.target.value);
                                setStudioInfo({ ...studioInfo, Contact_City: e.target.value });
                            }}
                        />
                    </div>
                    <div className="mt-2">
                        <label htmlFor="state" className="block text-xs font-medium text-gray-900">
                            State
                        </label>
                        <select
                            className="form-select"
                            value={contact_State}
                            onChange={(value: any) => {
                                setContact_State(value);
                                setStudioInfo({ ...studioInfo, Contact_State: value });
                            }}
                        >
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District Of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                        </select>
                    </div>
                    <div className="mt-2">
                        <label htmlFor="zip" className="block text-xs font-medium text-gray-900">
                            Zip Code
                        </label>
                        <input
                            type="text"
                            name="zip"
                            id="zip"
                            value={contact_Zip}
                            className="form-input"
                            placeholder="Zip Code"
                            onChange={(e) => {
                                setContact_Zip(e.target.value);
                                setStudioInfo({ ...studioInfo, Contact_Zip: e.target.value });
                            }}
                        />
                    </div>

                    <div className="mt-2 sm:col-span-4">
                        <label htmlFor="email" className="block text-xs font-medium text-gray-900">
                            Email
                        </label>
                        <input type="email" name="email" id="email" value={contact_Email} className="form-input" placeholder="you@email.com" onChange={(e) => setContact_Email(e.target.value)} />
                    </div>

                    <div className="mt-2 sm:col-span-4">
                        <button type="submit" className="btn btn-info w-full" onClick={(e) => handleUpdateStudio(e)}>
                            Update Profile
                        </button>
                        <div className="text-danger text-center w-full mt-2">
                            <Link to="/studios/password-reset/32">Reset Password</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
