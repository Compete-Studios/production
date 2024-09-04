import React, { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addBillingAccount, getStudentInfo } from '../../functions/api';
import { createNewPaySimpleCustomer } from '../../functions/payments';

const billingInfoInit = {
    studioId: '',
    firstName: '',
    lastName: '',
    email: '',
    altEmail: '',
    phone: '',
    notes: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    stateCode: '',
    zipCode: '',
    country: '',
};

export default function AddABillingAccount() {
    const { suid }: any = UserAuth();
    const [billingInfo, setBillingInfo] = useState<any>(billingInfoInit);
    const [studentInfo, setStudentInfo] = useState<any>({});
    const [studentID, setStudentID] = useState<number>(0);
    const { id } = useParams<string>();  

    useEffect(() => {
        const parsedId: number = parseInt(id ?? '');
        const parsedSuid = parseInt(suid);
        setBillingInfo({ ...billingInfo, studioId: parsedSuid });
        if (!isNaN(parsedId) && !isNaN(parsedSuid)) {
            const newID: number = parsedId / parsedSuid;
            setStudentID(newID);
            getStudentInfo(newID).then((res) => {
                setStudentInfo(res);
            });
        }
    }, [id, suid]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setBillingInfo({ ...billingInfo, [name]: value });
    };

    const navigate = useNavigate();

    const addAccount = (e: any) => {
        e.preventDefault();
        createNewPaySimpleCustomer(billingInfo).then((res) => {
            const billingData = {
                studentId: studentID,
                paysimpleCustomerId: res.Response.Id,
            };
            addBillingAccount(billingData).then((res) => {
                navigate(`/students/${id}/finish-billing-setup-options`)
            });
        });
        console.log(billingInfo);
    };

    const autoFill = (e: any) => {
        e.preventDefault();
        setBillingInfo({
            ...billingInfo,
            firstName: studentInfo?.First_Name,
            lastName: studentInfo?.Last_Name,
            email: studentInfo?.email,
            phone: studentInfo?.Phone,
            streetAddress1: studentInfo?.mailingaddr,
            streetAddress2: studentInfo?.mailingaddr2,
            city: studentInfo?.city,
            stateCode: studentInfo?.state,
            zipCode: studentInfo?.Zip,
        });
    };

    return (
        <div>
            <div className="panel max-w-5xl mx-auto bg-gray-100">
                <form className="p-5">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h5 className="font-semibold text-lg uppercase">Billing Acccount Info</h5>
                            <p>
                                Add a billing account for{' '}
                                <span className="font-bold text-primary">
                                    {studentInfo?.First_Name} {studentInfo?.Last_Name}
                                </span>{' '}
                            </p>
                        </div>
                        <div className="text-right">
                            <Link to={`/payments/${id}/${suid}/billing-accounts`} className="btn btn-info hover:bg-blue-800 ">
                                Use an existing billing account
                            </Link>
                            <button className="block btn btn-secondary mt-2 hover:bg-indigo-600" onClick={autoFill}>
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
                </form>
            </div>
        </div>
    );
}
