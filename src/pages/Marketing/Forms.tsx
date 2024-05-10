import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFormsFromFirebase } from '../../firebase/firebaseFunctions';

export default function Forms() {
    const [form, setForm] = useState<any>({});
    const { id } = useParams<{ id: string }>();

    const handleGetFormFromFB = async (formID: any) => {
        const fbform = await getFormsFromFirebase(formID);
        setForm(fbform);
    };

    useEffect(() => {
        handleGetFormFromFB(id);
    }, [id]);

    return (
        <div>
            <div className={`p-5 ${form?.selectedColor?.bg} ${form?.mem?.rounded} shadow shadow-zinc-400 grid max-w-2xl mx-auto grid-cols-1 sm:grid-cols-6 gap-4`}>
                {form?.formInfo?.FriendlyName && (
                    <div className="sm:col-span-full">
                        <div className="text-2xl font-semibold text-center">{form?.formName || ' Form Name'}</div>
                        {form?.formInfo?.FormDescription && <p className="text-gray-500 mb-2 text-xs text-center">{form?.formDescription || 'Form Description'}</p>}
                    </div>
                )}

                {form?.formInfo?.Name && (
                    <div className={`${form?.formInfo?.Name && form?.formInfo?.LastName ? 'sm:col-span-3' : 'sm:col-span-full'}`}>
                        <label htmlFor="first-name">First name</label>
                        <div className="mt-2">
                            <input type="text" name="first-name" id="first-name" autoComplete="given-name" className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`} />
                        </div>
                    </div>
                )}

                {form?.form?.formInfo?.LastName && (
                    <div className={`${form?.formInfo?.Name && form?.formInfo?.LastName ? 'sm:col-span-3' : 'sm:col-span-full'}`}>
                        <label htmlFor="last-name">Last name</label>
                        <div className="mt-2">
                            <input type="text" name="last-name" id="last-name" autoComplete="family-name" className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`} />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Email && (
                    <div className={form?.formInfo?.Phone ? 'sm:col-span-3' : 'sm:col-span-full'}>
                        <label htmlFor="email">Email address</label>
                        <div className="mt-2">
                            <input id="email" name="email" type="email" autoComplete="email" className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`} />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Phone && (
                    <div className={form?.formInfo?.Email ? 'sm:col-span-3' : 'sm:col-span-full'}>
                        <label htmlFor="phone">Phone</label>
                        <div className="mt-2">
                            <input id="phone" name="phone" type="tel" autoComplete="phone" className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`} />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Address && (
                    <div className="sm:col-span-full">
                        <label htmlFor="street-address">Mailing address</label>
                        <div className="mt-2">
                            <input type="text" name="street-address" id="street-address" autoComplete="street-address" className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`} />
                        </div>
                    </div>
                )}

                {form?.formInfo?.City && (
                    <div className={`${form?.formInfo?.State && form?.formInfo?.Zip ? 'sm:col-span-3' : form?.formInfo?.State || form?.formInfo?.Zip ? 'col-span-3' : 'sm:col-span-full'}`}>
                        <label htmlFor="city">City</label>
                        <div className="mt-2">
                            <input type="text" name="city" id="city" autoComplete="address-level2" className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`} />
                        </div>
                    </div>
                )}

                {form?.formInfo?.State && (
                    <div className={`${form?.formInfo?.City && form?.formInfo?.Zip ? 'sm:col-span-1' : 'sm:col-span-3'}`}>
                        <label htmlFor="region">State</label>
                        <div className="mt-2">
                            <input type="text" name="region" id="region" autoComplete="address-level1" className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`} />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Zip && (
                    <div className={`${form?.formInfo?.City && form?.formInfo?.State ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
                        <label htmlFor="postal-code">ZIP / Postal code</label>
                        <div className="mt-2">
                            <input type="text" name="postal-code" id="postal-code" autoComplete="postal-code" className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`} />
                        </div>
                    </div>
                )}

                {form?.formInfo?.ParentName && (
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name">Parent Name</label>
                        <div className="mt-2">
                            <input type="text" name="first-name" id="first-name" autoComplete="given-name" className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`} />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Age && (
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name">Age Of Student</label>
                        <div className="mt-2">
                            <input type="text" name="first-name" id="first-name" autoComplete="given-name" className={`form-input w-full ${form?.mem?.rounded} ${form?.heightOption?.height}`} />
                        </div>
                    </div>
                )}

                {form?.formInfo?.Notes && (
                    <div className="sm:col-span-full">
                        <label htmlFor="email">Notes</label>
                        <div className="mt-2">
                            <textarea rows={4} name="comment" id="comment" className={`form-textarea w-full ${form?.mem?.rounded}`} defaultValue={''} />
                        </div>
                    </div>
                )}

                {form?.formInfo?.AdditionalInfo && (
                    <div className="sm:col-span-full">
                        <label htmlFor="email">Addition Info</label>
                        <div className="mt-2">
                            <textarea rows={4} name="comment" id="comment" className={`form-textarea w-full ${form?.mem?.rounded}`} defaultValue={''} />
                        </div>
                    </div>
                )}

                <button className={`btn ${form?.selectedColor?.btn}  ${form?.heightOption?.height} ${form?.mem?.rounded} sm:col-span-full`}>Submit</button>
            </div>
        </div>
    );
}
