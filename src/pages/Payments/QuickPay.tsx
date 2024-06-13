import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { setPageTitle } from '../../store/themeConfigSlice';
import 'flatpickr/dist/flatpickr.css';
import { addCreditCardToCustomer, runPaymentForCustomer, createNewPaySimpleCustomer, addPaymentNotes } from '../../functions/payments';
import { showMessage, showErrorMessage } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';

interface PayDetails {
    studioId: number;
    paymentAccountId: number;
    amount: number;
    emailForReceipt: string;
    isResubmission: boolean;
    firstName: string;
    lastName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    billingZip: string;
}

export default function QuickPay() {
    const { suid }: any = UserAuth();
    const [notes, setNotes] = useState<string>('');
    
    const [payDetails, setPayDetails] = useState<PayDetails>({
        studioId: 0,
        paymentAccountId: 0,
        amount: 0,
        emailForReceipt: '',
        isResubmission: false,
        firstName: '',
        lastName: '',
        cardNumber: '',
        expiryMonth: '01',
        expiryYear: '2024',
        billingZip: '',
    });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Quickpay'));
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setPayDetails((prevDetails) => ({
            ...prevDetails,
            [id]: value,
        }));
    };

    const createNewCustomer = async () => {
        console.log('Creating new customer...');
        const data = {
            studioId: suid,
            firstName: payDetails.firstName,
            lastName: payDetails.lastName,
            email: payDetails.emailForReceipt,
        };
        try {
            const response = await createNewPaySimpleCustomer(data);
            console.log('createNewCustomer response:', response);
            if (response && response.Response) {
                const customerId = response.Response.Id;
                return customerId;
            } else if (response && response.error) {
                throw new Error(`Error creating customer: ${response.error}`);
            } else {
                throw new Error('Error creating customer: Unexpected error occurred');
            }
        } catch (error) {
            let errorMessage = 'Unexpected error occurred';
            if (typeof error === 'object' && error !== null) {
                if ('error' in error) {
                    errorMessage = (error as any).error;
                } else if ('message' in error) {
                    errorMessage = (error as any).message;
                }
            }
            throw new Error(`Error adding card to customer: ${errorMessage}`);
        }
    };

    const addCard = async (customerId: string) => {
        const expirationDate = `${payDetails.expiryMonth}/${payDetails.expiryYear}`;
        const data = {
            studioId: suid,
            customerId: customerId,
            ccNumber: payDetails.cardNumber,
            expDate: expirationDate,
        };

        try {
            const response = await addCreditCardToCustomer(data);

            if (response && response.Response) {
                const accountId = response.Response.Id;
                return accountId;
            } else if (response && response.error) {
                throw new Error(`Error adding card: ${response.error}`);
            } else {
                throw new Error('Error adding card: Unexpected error occurred');
            }
        } catch (error) {
            let errorMessage = 'Unexpected error occurred';
            if (typeof error === 'object' && error !== null) {
                if ('error' in error) {
                    errorMessage = (error as any).error;
                } else if ('message' in error) {
                    errorMessage = (error as any).message;
                }
            }
            throw new Error(`Error adding card to customer: ${errorMessage}`);
        }
    };

    const runPayment = async (accountId: number) => {
        const updatedPayDetails = {
            ...payDetails,
            studioId: suid,
            paymentAccountId: accountId
        };
        try {
            const response = await runPaymentForCustomer(updatedPayDetails);

            // Successful payment
            if (response && response.Status === 'Authorized') {
                console.log('Payment Successful:', response);
                const paymentId = response.Id;
                console.log('Payment ID:', paymentId);
                showMessage('Payment Successful');
                // After successful payment, add payment notes
                addPaymentNotes(paymentId, notes);
            }
            // Failed/declined payment
            else if (response && response.Status === 'Failed' && response.FailureData) {
                throw new Error(`Error running payment: ${response.FailureData.Description} - ${response.FailureData.MerchantActionText}`);
            }
            // API returned error in Meta.Errors
            else if (response && response.Meta && response.Meta.Errors) {
                const errorMessages = response.Meta.Errors.ErrorMessages.map((error: any) => error.Message).join('; ');
                throw new Error(`Error running payment: ${errorMessages}`);
            }
            // Unexpected response structure
            else {
                throw new Error('Unexpected error occurred: Invalid response structure');
            }
        } catch (error) {
            let errorMessage = 'Unexpected error occurred';
            if (typeof error === 'object' && error !== null) {
                if ('message' in error) {
                    errorMessage = (error as any).message;
                } else if ('error' in error) {
                    errorMessage = (error as any).error;
                }
            }
            console.error(`Error running payment: ${errorMessage}`);
            throw new Error(`Error running payment: ${errorMessage}`);
        }
    };


    const handleRunPayment = async () => {
        console.log('Running payment...');
        try {
            const customerId = await createNewCustomer();
            if (customerId && customerId > 0) {
                const paymentAccountId = await addCard(customerId);
                if (paymentAccountId && paymentAccountId > 0) {
                    await runPayment(paymentAccountId);
                } else {
                    showErrorMessage('Error adding card to customer');
                }
            } else {
                showErrorMessage('Error creating customer');
            }
        } catch (error) {
            console.log('Error in handleRunPayment:', error);
            showErrorMessage((error as Error).message);
        }
    };


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
                                <label htmlFor="firstName">First Name</label>
                                <input id="firstName" type="text" placeholder="First Name" className="form-input" value={payDetails.firstName} onChange={handleChange} />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="lastName">Last Name</label>
                                <input id="lastName" type="text" placeholder="Last Name" className="form-input" value={payDetails.lastName} onChange={handleChange} />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email">Email</label>
                                <input id="emailForReceipt" type="text" placeholder="email@email.com" className="form-input" value={payDetails.emailForReceipt} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input id="cardNumber" type="text" placeholder="Card Number" className="form-input" value={payDetails.cardNumber} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="expiryMonth">Card Expiry Month</label>
                                <select id="expiryMonth" className="form-select text-white-dark" value={payDetails.expiryMonth} onChange={handleChange}>
                                    <option value="01">01</option>
                                    <option value="02">02</option>
                                    <option value="03">03</option>
                                    <option value="04">04</option>
                                    <option value="05">05</option>
                                    <option value="06">06</option>
                                    <option value="07">07</option>
                                    <option value="08">08</option>
                                    <option value="09">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="expiryYear">Card Expiry Year</label>
                                <select id="expiryYear" className="form-select text-white-dark" value={payDetails.expiryYear} onChange={handleChange}>
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
                                <label htmlFor="billingZip">Billing Zip</label>
                                <input id="billingZip" type="text" placeholder="Billing Zip" className="form-input" value={payDetails.billingZip} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="amount">Amount</label>
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        $
                                    </div>
                                    <input id="amount" type="text" placeholder="0.00" className="form-input ltr:rounded-l-none rtl:rounded-r-none" value={payDetails.amount} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    className="form-textarea"
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleRunPayment}>
                            Run Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
