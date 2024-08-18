import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFormsFromFirebase } from '../../firebase/firebaseFunctions';
import { formatDate, showErrorMessage, showMessage } from '../../functions/shared';
import { addProspect } from '../../functions/api';
import { sendIndividualEmail } from '../../functions/emails';
import { updateFormSubmissionCounnt, updateLoadCount, updateStats } from '../../functions/spaces';
import { UserAuth } from '../../context/AuthContext';

const formInputs = {
    formName: 'Form Name',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    parentName: '',
    age: '',
    notes: '',
    additionalInfo: '',
};

export default function Forms() {
    const { isLoggedIn }: any = UserAuth();
    const [form, setForm] = useState<any>({});
    const { id } = useParams<{ id: string }>();
    const [formInfo, setFormInfo] = useState<any>(formInputs);
    const [submitted, setSubmitted] = useState(false);

    const handleGetFormFromFB = async (formID: any) => {
        const fbform: any = await getFormsFromFirebase(formID);
        setForm(fbform);
        setFormInfo({ ...formInfo, formName: fbform?.formName });
    };

    useEffect(() => {
        handleGetFormFromFB(id);
        if (!isLoggedIn) {
            updateLoadCount(id);
        }
    }, [id]);

    const navigate = useNavigate();

    const handleSubmitForm = async () => {
        const prospectInfoData = {
            studioId: form?.studioID,
            fName: formInfo.firstName,
            lName: formInfo.lastName,
            phone: formInfo.phone,
            email: formInfo.email,
            contactMethod: '',
            address: formInfo.address,
            city: formInfo.city,
            state: formInfo.state,
            zip: formInfo.zip,
            notes: formInfo.notes,
            entryDate: formatDate(new Date()),
            currentPipelineStatus: form?.pipelineStep,
            firstClassDate: '',
            nextContactDate: '',
            age: formInfo.age,
            parentName: formInfo.parentName,
            introDate: '',
            birthdate: '',
        };
        const response = await addProspect(prospectInfoData);
        if (response?.output?.NewProspectId || response?.recordset?.[0]?.NewProspectId) {
            showMessage(formInfo.successMessage ? formInfo.successMessage : 'Form Submitted Successfully');
            const statsData = {
                formID: id,
                studioId: form?.studioID,
                formName: form?.formName,
                prospectID: response?.output?.NewProspectId || response?.recordset?.[0]?.NewProspectId,
                prospectName: `${formInfo.firstName} ${formInfo.lastName}`,
                date: new Date(),
            };
            updateStats(id, statsData);
            updateFormSubmissionCounnt(id);
            setFormInfo(formInputs);
            window.location.href = formInfo.successURL || '/';
        } else {
            showErrorMessage('Error Submitting Form');
        }
        // if (formInfo.email && form?.sendEmail) {
        //     const emailData = {
        //         to: formInfo.email,
        //         from: form?.emailFrom || '',
        //         subject: form?.defaultEmailSubject || 'Thank you for your interest',
        //         html: form?.value || 'Thank you for your interest',
        //     sendIndividualEmail(emailData);
        // }
    };

    return (
        <div className={`${form?.selectedColor?.bg} min-h-screen h-full `}>
            <div className={`p-5 ${form?.selectedColor?.bg} ${form?.mem?.rounded} grid max-w-2xl mx-auto grid-cols-1 sm:grid-cols-6 gap-4`}>
                {form?.formInfo?.FriendlyName && (
                    <div className="sm:col-span-full">
                        <div className="text-2xl font-semibold text-center">{form?.formHeadline || ' Form Name'}</div>
                        {form?.formInfo?.FormDescription && <p className="text-gray-500 mb-2 text-xs text-center">{form?.formDescription || 'Form Description'}</p>}
                    </div>
                )}

                {form?.formInfo?.Name && (
                    <div className={`${form?.formInfo?.Name && form?.formInfo?.LastName ? 'sm:col-span-3' : 'sm:col-span-full'}`}>
                        <label htmlFor="first-name">First name</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                value={formInfo.firstName}
                                className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, firstName: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                {form?.formInfo?.LastName && (
                    <div className={`${form?.formInfo?.Name && form?.formInfo?.LastName ? 'sm:col-span-3' : 'sm:col-span-full'}`}>
                        <label htmlFor="last-name">Last name</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autoComplete="family-name"
                                value={formInfo.lastName}
                                className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, lastName: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Email && (
                    <div className={form?.formInfo?.Phone ? 'sm:col-span-3' : 'sm:col-span-full'}>
                        <label htmlFor="email">Email address</label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formInfo.email}
                                className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, email: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Phone && (
                    <div className={form?.formInfo?.Email ? 'sm:col-span-3' : 'sm:col-span-full'}>
                        <label htmlFor="phone">Phone</label>
                        <div className="mt-2">
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="phone"
                                value={formInfo.phone}
                                className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, phone: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Address && (
                    <div className="sm:col-span-full">
                        <label htmlFor="street-address">Mailing address</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="street-address"
                                id="street-address"
                                autoComplete="street-address"
                                value={formInfo.address}
                                className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, address: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                {form?.formInfo?.City && (
                    <div className={`${form?.formInfo?.State && form?.formInfo?.Zip ? 'sm:col-span-3' : form?.formInfo?.State || form?.formInfo?.Zip ? 'col-span-3' : 'sm:col-span-full'}`}>
                        <label htmlFor="city">City</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="city"
                                id="city"
                                autoComplete="address-level2"
                                value={formInfo.city}
                                className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, city: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                {form?.formInfo?.State && (
                    <div className={`${form?.formInfo?.City && form?.formInfo?.Zip ? 'sm:col-span-1' : 'sm:col-span-3'}`}>
                        <label htmlFor="region">State</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="region"
                                id="region"
                                autoComplete="address-level1"
                                value={formInfo.state}
                                className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, state: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Zip && (
                    <div className={`${form?.formInfo?.City && form?.formInfo?.State ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
                        <label htmlFor="postal-code">ZIP / Postal code</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="postal-code"
                                id="postal-code"
                                autoComplete="postal-code"
                                value={formInfo.zip}
                                className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, zip: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                {form?.formInfo?.ParentName && (
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name">Parent Name</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                value={formInfo.parentName}
                                className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, parentName: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Age && (
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name">Age Of Student</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                value={formInfo.age}
                                className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, age: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Notes && (
                    <div className="sm:col-span-full">
                        <label htmlFor="email">Notes</label>
                        <div className="mt-2">
                            <textarea
                                rows={4}
                                name="comment"
                                id="comment"
                                className={`form-textarea w-full ${form?.mem?.rounded}`}
                                defaultValue={formInfo.notes}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, notes: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                {form?.formInfo?.AdditionalInfo && (
                    <div className="sm:col-span-full">
                        <label htmlFor="email">Addition Info</label>
                        <div className="mt-2">
                            <textarea
                                rows={4}
                                name="comment"
                                id="comment"
                                className={`form-textarea w-full ${form?.mem?.rounded}`}
                                defaultValue={formInfo.additionalInfo}
                                onChange={(e) => {
                                    setFormInfo({ ...formInfo, additionalInfo: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}

                <button className={`btn ${form?.selectedColor?.btn}  ${form?.heightOption?.height} ${form?.mem?.rounded} sm:col-span-full`} onClick={handleSubmitForm}>
                    Submit
                </button>
            </div>
        </div>
    );
}
