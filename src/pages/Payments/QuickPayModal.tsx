import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import 'flatpickr/dist/flatpickr.css';
import { runPaymentForCustomer, createNewPaySimpleCustomer, addPaymentNotes, addCreditCardToCustomerForQuickPay, runPaymentForQuickPay } from '../../functions/payments';
import { showMessage, showErrorMessage } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import IconLock from '../../components/Icon/IconLock';
import IconCreditCard from '../../components/Icon/IconCreditCard';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';

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

export default function QuickPayModal() {
    const [modal1, setModal1] = useState(false);
    const { suid }: any = UserAuth();
    const [notes, setNotes] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

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

    const navigate = useNavigate();

    const handleCardChange = (event: any) => {
        const { value } = event.target;

        // Remove all non-digit characters
        const digitsOnly = value.replace(/\D/g, '');

        // Limit the number of digits to 16
        const limitedDigits = digitsOnly.slice(0, 16);

        // Remove spaces from the formatted value to store in the state
        const cardNumber = limitedDigits;

        // Add a space after every four digits for display
        const formattedValue = cardNumber.replace(/(.{4})/g, '$1 ');

        setPayDetails({ ...payDetails, cardNumber: cardNumber });

        // Update the input value
        event.target.value = formattedValue.trim();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setPayDetails((prevDetails) => ({
            ...prevDetails,
            [id]: value,
        }));
    };

    const createNewCustomer = async () => {
        const data = {
            studioId: suid,
            firstName: payDetails.firstName,
            lastName: payDetails.lastName,
            email: payDetails.emailForReceipt,
        };
        try {
            const response = await createNewPaySimpleCustomer(data);
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
            setLoading(false);
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
            const response = await addCreditCardToCustomerForQuickPay(data);

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
            setLoading(false);
            throw new Error(`Error adding card to customer: ${errorMessage}`);
        }
    };

    const runPayment = async (accountId: number) => {
        const updatedPayDetails = {
            ...payDetails,
            studioId: suid,
            paymentAccountId: accountId,
        };
        try {
            const res = await runPaymentForQuickPay(updatedPayDetails);

            const response = res.Response;

            // Successful payment
            if (response && response.Status === 'Authorized') {
                console.log('Payment Successful:', response);
                const paymentId = response.Id;
                console.log('Payment ID:', paymentId);
                showMessage('Payment Successful');
                // After successful payment, add payment notes
                addPaymentNotes(paymentId, notes);
                setModal1(false);
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
            setLoading(false);
            throw new Error(`Error running payment: ${errorMessage}`);
        }
    };

    const handleRunPayment = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center">
                <button type="button" className="btn btn-success w-full gap-1" onClick={() => setModal1(true)}>
                   <IconDollarSignCircle /> Quick Pay
                </button>
            </div>
            <Transition appear show={modal1} as={Fragment}>
                <Dialog as="div" open={modal1} onClose={() => setModal1(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-lg text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold">One Time Payment</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                                            <IconX className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="p-5 -mt-3">
                                        <p>
                                            Use this option to run a quick <span className="font-bold">one-time payment </span>that won't be attached to any specific student record.{' '}
                                            <span className="text-danger block">
                                                To run a payment that is attached to a student, visit that student info page and click the "QuickPay" button in the top right corner.
                                            </span>
                                        </p>

                                        <form className="mt-4">
                                            <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="firstName">First Name</label>
                                                    <input id="firstName" type="text" placeholder="First Name" className="form-input" value={payDetails.firstName} onChange={handleChange} />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="lastName">Last Name</label>
                                                    <input id="lastName" type="text" placeholder="Last Name" className="form-input" value={payDetails.lastName} onChange={handleChange} />
                                                </div>
                                                <div className="sm:col-span-full">
                                                    <label htmlFor="email">Email</label>
                                                    <input
                                                        id="emailForReceipt"
                                                        type="text"
                                                        placeholder="email@email.com"
                                                        className="form-input"
                                                        value={payDetails.emailForReceipt}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                                                <div className="sm:col-span-full">
                                                    <label htmlFor="cardNumber">Card Number</label>
                                                    <div className="relative mt-2 rounded-md shadow-sm">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <IconCreditCard fill={true} className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                                                        </div>
                                                        <input
                                                            id="cardNumber"
                                                            type="text"
                                                            placeholder="Card Number"
                                                            className="form-input pl-10"
                                                            value={payDetails.cardNumber.replace(/(.{4})/g, '$1 ').trim()}
                                                            onChange={handleCardChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <label htmlFor="expiryMonth">Ex Month</label>
                                                    <select id="expiryMonth" className="form-select " value={payDetails.expiryMonth} onChange={handleChange}>
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
                                                    <label htmlFor="expiryYear">Ex Year</label>
                                                    <select id="expiryYear" className="form-select " value={payDetails.expiryYear} onChange={handleChange}>
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

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="billingZip">Billing Zip</label>
                                                    <input id="billingZip" type="text" placeholder="Billing Zip" className="form-input" value={payDetails.billingZip} onChange={handleChange} />
                                                </div>
                                                <div className="col-span-full">
                                                    <label htmlFor="amount">Amount</label>
                                                    <div className="flex">
                                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                            $
                                                        </div>
                                                        <input
                                                            id="amount"
                                                            type="text"
                                                            placeholder="0.00"
                                                            className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                                            value={payDetails.amount}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-full">
                                                    <label htmlFor="notes">Notes</label>
                                                    <textarea id="notes" rows={4} className="form-textarea" onChange={(e) => setNotes(e.target.value)}></textarea>
                                                </div>
                                            </div>
                                        </form>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setModal1(false)}>
                                                Discard
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleRunPayment} disabled={loading}>
                                                {loading ? (
                                                    <>
                                                        <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                                        <div>Processing Payment</div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div>Run Payment</div>
                                                    </>
                                                )}
                                            </button>
                                        </div>
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
