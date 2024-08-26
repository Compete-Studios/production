import { useEffect, useState } from 'react';
import { convertPhoneNumber } from '../../../functions/shared';
import IconEdit from '../../../components/Icon/IconEdit';
import { UserAuth } from '../../../context/AuthContext';
import IconSave from '../../../components/Icon/IconSave';
import { showErrorMessage, showMessage } from '../../../functions/shared';
import { updatePaySimpleCustomer, updateStudent } from '../../../functions/api';
import StudentsOnBillingAccount from './StudentsOnBillingAccount';


const updateValuesInitial = {
    FirstName: false,
    LastName: false,
    Phone: false,
    Email: false,
    StreetAddress1: false,
    City: false,
    StateCode: false,
    ZipCode: false,
};

export default function BillingInfoUpdate({ billingInfo, updateBilling, setUpdateBilling, updateStudentsOnBilling, setUpdateStudentsOnBilling }: any) {
    const { suid, students }: any = UserAuth();
    const [billingInfoTOUpdate, setBillingInfoTOUpdate] = useState(billingInfo);
    

    useEffect(() => {
        setBillingInfoTOUpdate({
            studioId: suid,
            customerId: billingInfo?.Id,
            firstName: billingInfo?.FirstName,
            lastName: billingInfo?.LastName,
            email: billingInfo?.Email,
            phone: billingInfo?.Phone,
            streetAddress1: billingInfo?.BillingAddress?.StreetAddress1,
            city: billingInfo?.BillingAddress?.City,
            stateCode: billingInfo?.BillingAddress?.StateCode,
            zipCode: billingInfo?.BillingAddress?.ZipCode,
        });
    }, [billingInfo]);

    

    const handleSave = async () => {
        const res = await updatePaySimpleCustomer(billingInfoTOUpdate);
        console.log(res);
    };

    return (
        <div>
            <div className="mb-5 space-y-4 p-5">
                <div className='flex items-center gap-2'>
                {updateBilling ? (
                    <input
                        type="text"
                        value={billingInfoTOUpdate?.firstName}
                        className="form-input"
                        placeholder="First Name"
                        onChange={(e) => setBillingInfoTOUpdate({ ...billingInfoTOUpdate, firstName: e.target.value })}
                    />
                ) : (
                    <p className="font-bold ">
                        First Name: <span className="font-normal">{billingInfoTOUpdate?.firstName}</span>
                    </p>

                )}
                </div>
                <div className="flex items-center gap-2">
                    {updateBilling ? (
                        <input
                            type="text"
                            value={billingInfoTOUpdate?.lastName}
                            className="form-input"
                            placeholder="Last Name"
                            onChange={(e) => setBillingInfoTOUpdate({ ...billingInfoTOUpdate, lastName: e.target.value })}
                        />
                    ) : (
                        <p className="font-bold ">
                            Last Name: <span className="font-normal">{billingInfoTOUpdate?.lastName}</span>
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {updateBilling ? (
                        <input
                            type="text"
                            value={billingInfoTOUpdate?.phone}
                            className="form-input"
                            placeholder="Phone"
                            onChange={(e) => setBillingInfoTOUpdate({ ...billingInfoTOUpdate, phone: e.target.value })}
                        />
                    ) : (
                        <p className="font-bold ">
                            Phone: <span className="font-normal">{convertPhoneNumber(billingInfoTOUpdate?.phone)}</span>
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {updateBilling ? (
                        <input
                            type="text"
                            value={billingInfoTOUpdate?.email}
                            className="form-input"
                            placeholder="Email"
                            onChange={(e) => setBillingInfoTOUpdate({ ...billingInfoTOUpdate, email: e.target.value })}
                        />
                    ) : (
                        <p className="font-bold ">
                            Email: <span className="font-normal">{billingInfoTOUpdate?.email}</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {updateBilling ? (
                        <input
                            type="text"
                            value={billingInfoTOUpdate?.streetAddress1}
                            className="form-input"
                            placeholder="Street Address"
                            onChange={(e) => setBillingInfoTOUpdate({ ...billingInfoTOUpdate, streetAddress1: e.target.value })}
                        />
                    ) : (
                        <p className="font-bold ">
                            Address: <span className="font-normal">{billingInfoTOUpdate?.streetAddress1}</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {updateBilling ? (
                        <input
                            type="text"
                            value={billingInfoTOUpdate?.city}
                            className="form-input"
                            placeholder="City"
                            onChange={(e) => setBillingInfoTOUpdate({ ...billingInfoTOUpdate, city: e.target.value })}
                        />
                    ) : (
                        <p className="font-bold ">
                            City: <span className="font-normal">{billingInfoTOUpdate?.city}</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {updateBilling ? (
                        <input
                            type="text"
                            value={billingInfoTOUpdate?.stateCode}
                            className="form-input"
                            placeholder="State"
                            onChange={(e) => setBillingInfoTOUpdate({ ...billingInfoTOUpdate, stateCode: e.target.value })}
                        />
                    ) : (
                        <p className="font-bold ">
                            State: <span className="font-normal">{billingInfoTOUpdate?.stateCode}</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {updateBilling ? (
                        <input
                            type="text"
                            value={billingInfoTOUpdate?.zipCode}
                            className="form-input"
                            placeholder="Zip"
                            onChange={(e) => setBillingInfoTOUpdate({ ...billingInfoTOUpdate, zipCode: e.target.value })}
                        />
                    ) : (
                        <p className="font-bold ">
                            Zip: <span className="font-normal">{billingInfoTOUpdate?.zipCode}</span>
                        </p>
                    )}
                </div>
                <div>
                    <StudentsOnBillingAccount paysimpleCustomerId={billingInfo.Id} />
                </div>
                <div className="flex items-center gap-2">
                    {updateBilling && (
                        <button className="btn btn-secondary ml-auto gap-1" onClick={handleSave}>
                            <IconSave />  Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
