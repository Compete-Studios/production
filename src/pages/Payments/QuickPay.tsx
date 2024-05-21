import React, { useState } from 'react';

interface PayDetails {
    studioId: number;
    paymentAccountId: number;
    amount: number;
    emailForReceipt: string;
    cvv: string;
    isResubmission: boolean;
}

export default function QuickPay() {
    
    const [payDetails, setPayDetails] = useState<PayDetails>({
        studioId: 0,
        paymentAccountId: 0,
        amount: 0,
        emailForReceipt: '',
        cvv: '',
        isResubmission: false,
    });


    return (
        <div>
            <div className="panel max-w-5xl mx-auto">
                <div className="mb-5">
                    <h5 className="font-semibold text-lg mb-4">Payment Info</h5>
                    <p>
                        Use this option to run a quick <span className="text-primary">one-time payment </span>that won't be attached to any specific student record.{' '}
                        <span className="text-danger">To run a payment that is attached to a student, visit that student info page and click the "QuickPay" button in the top right corner.</span>
                    </p>
                </div>
                <div className="mb-5">
                    <form>
                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="first">First Name</label>
                                <input id="first" type="text" placeholder="First Name" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="last">Last Name</label>
                                <input id="last" type="text" placeholder="Last Name" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="payNumber">Card Number</label>
                                <input id="payNumber" type="text" placeholder="Card Number" className="form-input" />
                            </div>
                            <div>
                                <label htmlFor="month">Card Expiry Month</label>
                                <select id="month" className="form-select text-white-dark">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="month">Card Expiry Year</label>
                                <select id="month" className="form-select text-white-dark">
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                    <option value="2030">2030</option>
                                    <option value="2031">2031</option>
                                    <option value="2032">2032</option>
                                    <option value="2033">2033</option>
                                    <option value="2034">2034</option>
                                    <option value="2035">2035</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="payCvv">CVV/CVV2</label>
                                <input id="payCvv" type="text" placeholder="CVV" className="form-input" />
                            </div>
                            <div>
                                <label htmlFor="zip">Billing Zip</label>
                                <input id="zip" type="text" placeholder="CVV" className="form-input" />
                            </div>
                            <div>
                                <label htmlFor="ctnTextarea">Notes</label>
                                <textarea id="ctnTextarea" rows={3} className="form-textarea"></textarea>
                            </div>
                            <div>
                                <label htmlFor="zip">Amount</label>
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        $
                                    </div>
                                    <input type="text" placeholder="0.00" className="form-input ltr:rounded-l-none rtl:rounded-r-none" />
                                </div>
                            </div>
                        </div>
                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
                        <button type="button" className="btn btn-primary">
                            Run Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
